package com.civicshield.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    private String username;

    private String email;

    private String hashedPassword;

    private String avatarUrl;

    private String avatarBg;

    private String avatarColor;

    private String bio;

    private String area;  // "Sector 62, Noida"

    private String state;

    private double latitude;

    private double longitude;

    @Builder.Default
    private int civicPoints = 0;

    @Builder.Default
    private List<String> badges = new ArrayList<>();

    @Builder.Default
    private List<String> followers = new ArrayList<>();

    @Builder.Default
    private List<String> following = new ArrayList<>();

    @Builder.Default
    private boolean isVerified = false;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
