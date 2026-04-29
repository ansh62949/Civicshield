package com.civicshield.service;

import com.civicshield.dto.AreaReportResponse;
import com.civicshield.entity.Area;
import com.civicshield.entity.Post;
import com.civicshield.exception.ResourceNotFoundException;
import com.civicshield.repository.AreaRepository;
import com.civicshield.repository.PostRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AreaService {

    private final AreaRepository areaRepository;
    private final PostRepository postRepository;

    public AreaService(AreaRepository areaRepository, PostRepository postRepository) {
        this.areaRepository = areaRepository;
        this.postRepository = postRepository;
    }

    public List<Area> getAreasByState(String state) {
        return areaRepository.findByState(state, Sort.by(Sort.Direction.ASC, "civicScore"));
    }

    public Area getAreaByName(String areaName, String state) {
        return areaRepository.findByNameIgnoreCaseAndStateIgnoreCase(areaName, state)
                .orElseThrow(() -> new ResourceNotFoundException("Area not found"));
    }

    public List<Area> getLeaderboard(String state, int limit) {
        List<Area> areas = areaRepository.findByState(state, Sort.by(Sort.Direction.DESC, "civicScore"));
        return areas.stream().limit(limit).toList();
    }

    public AreaReportResponse getPropertyReport(String areaName, String state) {
        Area area = getAreaByName(areaName, state);

        List<Post> recentPosts = postRepository.findByStateOrderByCreatedAtDesc(
                state, org.springframework.data.domain.PageRequest.of(0, 10)
        ).getContent();

        // Trend Analysis
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        java.time.LocalDateTime lastWeek = now.minusDays(7);
        java.time.LocalDateTime prevWeek = now.minusDays(14);

        List<Post> thisWeekPosts = postRepository.findByLocationLabelAndCreatedAtAfter(areaName, lastWeek);
        
        Map<String, Double> trends = calculateTrends(thisWeekPosts, areaName, lastWeek, prevWeek);
        List<String> aiInsights = generateAiInsights(trends, area);

        String verdict = determineVerdict(area);
        String verdictReason = determineVerdictReason(area);

        return new AreaReportResponse(
                areaName,
                area.getPropertySafetyRating(),
                area.getCivicScore(),
                area.getCrimeReports30d(),
                area.getFloodRisk(),
                area.getSubScores().getOrDefault("infrastructure", 100.0),
                area.getSubScores().getOrDefault("govtResponse", 100.0),
                recentPosts,
                verdict,
                verdictReason,
                area.getSubScores(),
                aiInsights,
                trends
        );
    }

    private Map<String, Double> calculateTrends(List<Post> thisWeekPosts, String areaName, 
                                              java.time.LocalDateTime lastWeek, java.time.LocalDateTime prevWeek) {
        Map<String, Double> trends = new HashMap<>();
        
        // Count by category this week
        Map<String, Long> thisWeekCounts = new HashMap<>();
        for (Post p : thisWeekPosts) {
            thisWeekCounts.put(p.getCategory(), thisWeekCounts.getOrDefault(p.getCategory(), 0L) + 1);
        }

        // Simulating trend calculation (in real world we'd query prev week too)
        thisWeekCounts.forEach((cat, count) -> {
            // Mocking a trend: if count > 2, it's "rising" (+20% to +50%)
            double trend = count > 2 ? 20.0 + (count * 5.0) : 0.0;
            trends.put(cat, trend);
        });

        return trends;
    }

    private List<String> generateAiInsights(Map<String, Double> trends, Area area) {
        List<String> insights = new ArrayList<>();
        
        trends.forEach((cat, val) -> {
            if (val > 0) {
                insights.add(String.format("⚠️ %s issues rising (+%.0f%%) in the last 7 days", cat, val));
            }
        });

        if (area.getCivicScore() < 50) {
            insights.add("📉 Critical: Low civic engagement detected. Response times may be delayed.");
        } else if (area.getCivicScore() > 80) {
            insights.add("🌟 Excellent: Strong community oversight is keeping the area stable.");
        }

        if (area.getCrimeReports30d() > 10) {
            insights.add("🚩 Alert: Elevated crime reports in this zone. Caution advised after dark.");
        }

        if (insights.isEmpty()) {
            insights.add("✅ Stability: No major negative trends detected in the recent period.");
        }

        return insights;
    }

    public List<Map<String, Object>> getGlobeData() {
        List<Area> areas = areaRepository.findAll();
        List<Map<String, Object>> globeData = new ArrayList<>();

        for (Area area : areas) {
            Map<String, Object> data = new HashMap<>();
            data.put("name", area.getName());
            data.put("state", area.getState());
            data.put("lat", area.getLatitude());
            data.put("lon", area.getLongitude());
            data.put("civicScore", area.getCivicScore());
            data.put("openComplaints", area.getOpenComplaints());
            globeData.add(data);
        }

        return globeData;
    }

    private String determineVerdict(Area area) {
        if (area.getCivicScore() > 75 && area.getCrimeReports30d() < 5) {
            return "Safe to invest";
        } else if (area.getCivicScore() >= 50 && area.getCivicScore() <= 75 || 
                   (area.getCrimeReports30d() >= 5 && area.getCrimeReports30d() <= 15)) {
            return "Caution advised";
        } else {
            return "High risk area";
        }
    }

    private String determineVerdictReason(Area area) {
        if (area.getCivicScore() > 75 && area.getCrimeReports30d() < 5) {
            return "Strong civic engagement and low crime reports indicate good community oversight. Infrastructure and safety scores are above average.";
        } else if (area.getCivicScore() >= 50 && area.getCivicScore() <= 75) {
            return "Moderate civic engagement with average infrastructure. Monitor crime trends and government response rates.";
        } else {
            return "Below average civic scores with elevated crime reports or infrastructure concerns. Recommend further research before investment.";
        }
    }
}
