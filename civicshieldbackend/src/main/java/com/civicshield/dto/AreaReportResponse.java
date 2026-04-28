package com.civicshield.dto;

import com.civicshield.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class AreaReportResponse {
    private String areaName;
    private double overallSafetyRating;
    private double civicScore;
    private int crimeReports30d;
    private String floodRisk;
    private double infrastructureScore;
    private double govtResponseScore;
    private List<Post> recentIssues;
    private String verdict;
    private String verdictReason;
    private Map<String, Double> subScores;
}
