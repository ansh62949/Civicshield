package com.civicshield.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "posts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    private String id;

    private String authorId;

    private String authorUsername;

    private String authorAvatar;

    private String content;

    private String imageUrl;

    private String locationLabel;

    private String state;

    private double latitude;

    private double longitude;

    private String category;  // POTHOLE, GARBAGE, WATER, CRIME, FLOOD, ROAD, OTHER

    private String severity;  // CRITICAL, HIGH, MEDIUM, LOW

    @Builder.Default
    private boolean aiVerified = false;

    private String aiCategory;

    private String aiSeverity;

    @Builder.Default
    private double aiConfidence = 0.0;

    @Builder.Default
    private double civicImpactScore = 0.0;

    @Builder.Default
    private List<String> upvotes = new ArrayList<>();

    @Builder.Default
    private List<Map<String, Object>> comments = new ArrayList<>();

    @Builder.Default
    private String status = "OPEN";

    @Builder.Default
    private boolean isAnonymous = false;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
