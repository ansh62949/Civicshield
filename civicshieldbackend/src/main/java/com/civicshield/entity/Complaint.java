package com.civicshield.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "complaints")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {

    @Id
    private String id;

    private String postId;

    private String userId;

    private String issueType;

    private String description;

    private double latitude;

    private double longitude;

    private String area;

    private String state;

    private String imageUrl;

    private String citizenEmail;
    private String citizenName;

    @Builder.Default
    private int upvoteCount = 0;

    private String priority; // CRITICAL, HIGH, MEDIUM, LOW

    @Builder.Default
    private double tensionScore = 0.0;

    private String zoneType;

    @Builder.Default
    private String status = "PENDING";

    private String assignedTo;

    private LocalDateTime resolvedAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}

