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
        return areaRepository.findByNameAndState(areaName, state)
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
                area.getSubScores()
        );
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
