package com.civicshield.dto;

import lombok.Data;

@Data
public class ComplaintRequest {
    private double latitude;
    private double longitude;
    private String area;
    private String state;
    private String zoneType;
    private String description;
}
