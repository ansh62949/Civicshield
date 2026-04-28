package com.civicshield.controller;

import com.civicshield.entity.Complaint;
import com.civicshield.repository.ComplaintRepository;
import com.civicshield.service.ComplaintService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/social")
@CrossOrigin(origins = "*")
@Slf4j
public class SocialController {

    private final ComplaintService complaintService;
    private final ComplaintRepository complaintRepository;

    public SocialController(ComplaintService complaintService, ComplaintRepository complaintRepository) {
        this.complaintService = complaintService;
        this.complaintRepository = complaintRepository;
    }

    @PostMapping("/complaints/{id}/upvote")
    public ResponseEntity<Map<String, Object>> upvoteComplaint(@PathVariable String id) {
        complaintService.upvote(id);
        Complaint complaint = complaintService.getById(id);

        Map<String, Object> response = new HashMap<>();
        response.put("id", id);
        response.put("upvoteCount", complaint.getUpvoteCount());
        response.put("priority", complaint.getPriority());
        response.put("message", "Complaint upvoted successfully");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/feed")
    public ResponseEntity<List<Complaint>> getFeed(
            @RequestParam(value = "lat", required = false) Double latitude,
            @RequestParam(value = "lon", required = false) Double longitude,
            @RequestParam(value = "radius", defaultValue = "5") double radiusKm) {

        List<Complaint> complaints;

        if (latitude != null && longitude != null) {
            complaints = complaintService.getNearby(latitude, longitude, radiusKm);
        } else {
            complaints = complaintRepository.findAll();
        }

        // Sort by upvoteCount DESC and then by createdAt DESC
        complaints.sort((c1, c2) -> {
            int upvoteCompare = Integer.compare(c2.getUpvoteCount(), c1.getUpvoteCount());
            if (upvoteCompare != 0) {
                return upvoteCompare;
            }
            return c2.getCreatedAt().compareTo(c1.getCreatedAt());
        });

        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard() {
        List<Complaint> allComplaints = complaintRepository.findAll();

        // Group by zone and calculate resolution rate and total reports
        Map<String, List<Complaint>> zoneComplaints = allComplaints.stream()
                .collect(Collectors.groupingBy(Complaint::getZoneType));

        List<Map<String, Object>> leaderboard = new ArrayList<>();

        zoneComplaints.forEach((zone, complaints) -> {
            long resolvedCount = complaints.stream()
                    .filter(c -> "RESOLVED".equals(c.getStatus()))
                    .count();

            double resolutionRate = complaints.isEmpty() ? 0 
                    : (double) resolvedCount / complaints.size() * 100;

            Map<String, Object> zoneStats = new HashMap<>();
            zoneStats.put("zone", zone);
            zoneStats.put("totalReports", complaints.size());
            zoneStats.put("resolvedReports", resolvedCount);
            zoneStats.put("resolutionRate", Math.round(resolutionRate * 100.0) / 100.0);

            leaderboard.add(zoneStats);
        });

        // Sort by resolution rate descending
        leaderboard.sort((a, b) -> Double.compare(
                (Double) b.get("resolutionRate"),
                (Double) a.get("resolutionRate")
        ));

        return ResponseEntity.ok(leaderboard);
    }

}
