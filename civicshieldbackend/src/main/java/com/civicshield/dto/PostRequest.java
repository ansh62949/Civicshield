package com.civicshield.dto;

import lombok.Data;

@Data
public class PostRequest {
    private String content;
    private String locationLabel;
    private String state;
    private double latitude;
    private double longitude;
    private boolean isAnonymous;
}
