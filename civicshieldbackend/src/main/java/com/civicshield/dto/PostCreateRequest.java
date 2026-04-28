package com.civicshield.dto;

import lombok.Data;

@Data
public class PostCreateRequest {
    private String content;
    private String image;
    private String locationLabel;
    private String state;
    private Double latitude;
    private Double longitude;
    private Boolean isAnonymous;
}
