package com.civicshield.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Document(collection = "areas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Area {

    @Id
    private String id;

    private String name;  // "Sector 62"

    private String city;

    private String state;

    private double latitude;

    private double longitude;

    @Builder.Default
    private double civicScore = 100.0;

    @Builder.Default
    private Map<String, Double> subScores = new HashMap<String, Double>() {{
        put("infrastructure", 100.0);
        put("safety", 100.0);
        put("civicEngagement", 100.0);
        put("geoTension", 100.0);
        put("environment", 100.0);
        put("govtResponse", 100.0);
    }};

    @Builder.Default
    private int totalPosts = 0;

    @Builder.Default
    private int openComplaints = 0;

    @Builder.Default
    private int resolvedComplaints = 0;

    @Builder.Default
    private int crimeReports30d = 0;

    @Builder.Default
    private String floodRisk = "LOW";

    @Builder.Default
    private double propertySafetyRating = 0.0;

    private LocalDateTime updatedAt;

}
