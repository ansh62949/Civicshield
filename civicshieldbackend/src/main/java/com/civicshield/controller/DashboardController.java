package com.civicshield.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @GetMapping("/trends")
    public ResponseEntity<Map<String, Object>> getTrends() {
        Map<String, Object> response = new HashMap<>();
        response.put("resolutionRate", "85%");
        response.put("totalIssuesResolved", 342);
        
        response.put("topCategories", Arrays.asList(
            Map.of("name", "Civic", "count", 120),
            Map.of("name", "Safety", "count", 80),
            Map.of("name", "Environment", "count", 65)
        ));
        
        response.put("trendingAreas", Arrays.asList(
            Map.of("name", "Sector 62, Noida", "score", 85),
            Map.of("name", "Connaught Place, Delhi", "score", 72),
            Map.of("name", "Bandra, Mumbai", "score", 64)
        ));
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stream")
    public ResponseEntity<Map<String, Object>> getStream() {
        Map<String, Object> response = new HashMap<>();
        response.put("streams", Arrays.asList(
            Map.of("id", "S1", "type", "CIVIC", "location", "Sector 62, Noida", "status", "Critical", "time", "Just now"),
            Map.of("id", "S2", "type", "SAFETY", "location", "Connaught Place, Delhi", "status", "High", "time", "5m ago"),
            Map.of("id", "S3", "type", "ENVIRONMENT", "location", "Bandra, Mumbai", "status", "Medium", "time", "12m ago"),
            Map.of("id", "S4", "type", "NEWS", "location", "Koramangala, Bangalore", "status", "Low", "time", "1h ago")
        ));
        response.put("connectionStatus", "ACTIVE");
        response.put("activeNodes", 142);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/operator")
    public ResponseEntity<Map<String, Object>> getOperatorProfile() {
        Map<String, Object> response = new HashMap<>();
        
        Map<String, Object> user = new HashMap<>();
        user.put("username", "Alpha Agent");
        user.put("email", "alpha.ops@civicsense.gov");
        response.put("user", user);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPosts", 1250);
        stats.put("civicPoints", 8500);
        stats.put("verifiedReports", 1100);
        response.put("stats", stats);
        
        return ResponseEntity.ok(response);
    }
}
