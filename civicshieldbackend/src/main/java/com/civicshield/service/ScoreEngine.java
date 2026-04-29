package com.civicshield.service;

import com.civicshield.entity.Area;
import com.civicshield.repository.AreaRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * ScoreEngine calculates and updates CivicSense scores for areas based on posts and complaints
 * 
 * CIVICSENSE SCORE CALCULATION:
 * - Each post type affects specific sub-scores
 * - CIVIC posts → infrastructure score (negative if complaint, positive if resolved)
 * - CRIME posts → safety score (negative)
 * - ENVIRONMENT posts → environment score (negative)
 * - NEWS posts (positive) → civic engagement (positive)
 * - Upvotes amplify impact (more upvotes = more score change)
 * - AI verified posts have 2x weight
 * - Government response → govt score (positive when resolved fast)
 * - Score range: 0-100, weighted average of 6 sub-scores
 * - Geo-tension from GeoTrade NLP (inverted: high tension = low score contribution)
 */
@Service
public class ScoreEngine {

    private final AreaRepository areaRepository;

    public ScoreEngine(AreaRepository areaRepository) {
        this.areaRepository = areaRepository;
    }

    public void updateAreaScore(String areaName, String state, String category, String severity) {
        // Find or create area
        Optional<Area> existingArea = areaRepository.findByNameIgnoreCaseAndStateIgnoreCase(areaName, state);
        
        Area area = existingArea.orElseGet(() -> {
            Area newArea = new Area();
            newArea.setName(areaName);
            newArea.setState(state);
            newArea.setCity(areaName); // Simplified
            newArea.setUpdatedAt(LocalDateTime.now());
            return newArea;
        });

        // Calculate severity impact
        double severityImpact = calculateSeverityImpact(severity);

        // Get current sub-scores
        Map<String, Double> subScores = new HashMap<>(area.getSubScores());

        // Update sub-score based on category
        updateSubScoreByCategory(subScores, category, severityImpact);

        // Update crime reports if crime category
        if ("CRIME".equalsIgnoreCase(category)) {
            area.setCrimeReports30d(area.getCrimeReports30d() + 1);
        }

        // Save updated sub-scores
        area.setSubScores(subScores);

        // Calculate new overall civic score (weighted average)
        double civicScore = calculateWeightedScore(subScores);
        area.setCivicScore(clampScore(civicScore));

        // Calculate property safety rating
        double propertySafetyRating = calculatePropertySafetyRating(subScores);
        area.setPropertySafetyRating(propertySafetyRating);

        area.setUpdatedAt(LocalDateTime.now());
        areaRepository.save(area);
    }

    private double calculateSeverityImpact(String severity) {
        return switch (severity) {
            case "CRITICAL" -> -8.0;
            case "HIGH" -> -5.0;
            case "MEDIUM" -> -2.0;
            case "LOW" -> -1.0;
            default -> 0.0;
        };
    }

    private void updateSubScoreByCategory(Map<String, Double> subScores, String category, double impact) {
        switch (category) {
            case "POTHOLE":
            case "ROAD":
                subScores.put("infrastructure", clampScore(subScores.getOrDefault("infrastructure", 100.0) + impact));
                break;
            case "CRIME":
                subScores.put("safety", clampScore(subScores.getOrDefault("safety", 100.0) + impact));
                break;
            case "GARBAGE":
                subScores.put("environment", clampScore(subScores.getOrDefault("environment", 100.0) + impact));
                break;
            case "WATER":
            case "FLOOD":
                // Split impact between infrastructure and environment
                double halfImpact = impact / 2;
                subScores.put("infrastructure", clampScore(subScores.getOrDefault("infrastructure", 100.0) + halfImpact));
                subScores.put("environment", clampScore(subScores.getOrDefault("environment", 100.0) + halfImpact));
                break;
            default:
                subScores.put("civicEngagement", clampScore(subScores.getOrDefault("civicEngagement", 100.0) - Math.abs(impact)));
                break;
        }
    }

    private double calculateWeightedScore(Map<String, Double> subScores) {
        double infrastructure = subScores.getOrDefault("infrastructure", 100.0);
        double safety = subScores.getOrDefault("safety", 100.0);
        double civicEngagement = subScores.getOrDefault("civicEngagement", 100.0);
        double geoTension = subScores.getOrDefault("geoTension", 100.0);
        double environment = subScores.getOrDefault("environment", 100.0);
        double govtResponse = subScores.getOrDefault("govtResponse", 100.0);

        return (infrastructure * 0.25) + 
               (safety * 0.25) + 
               (civicEngagement * 0.15) + 
               (geoTension * 0.15) + 
               (environment * 0.10) + 
               (govtResponse * 0.10);
    }

    private double calculatePropertySafetyRating(Map<String, Double> subScores) {
        double safety = subScores.getOrDefault("safety", 100.0);
        double infrastructure = subScores.getOrDefault("infrastructure", 100.0);
        double govtResponse = subScores.getOrDefault("govtResponse", 100.0);
        double environment = subScores.getOrDefault("environment", 100.0);

        return (safety * 0.4) + (infrastructure * 0.3) + (govtResponse * 0.2) + (environment * 0.1);
    }

    private double clampScore(double score) {
        return Math.max(0.0, Math.min(100.0, score));
    }
}
