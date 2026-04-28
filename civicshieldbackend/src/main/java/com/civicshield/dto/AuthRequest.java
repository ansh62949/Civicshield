package com.civicshield.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String email;
    private String password;
    private String area;
    private String state;
    private double latitude;
    private double longitude;
}
