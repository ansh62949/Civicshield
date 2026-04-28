package com.civicshield.service;

import com.civicshield.dto.AiAnalysisResult;
import com.civicshield.entity.Complaint;
import com.civicshield.entity.User;
import com.civicshield.repository.ComplaintRepository;
import com.civicshield.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final AiService aiService;
    private final ScoreEngine scoreEngine;

    public ComplaintService(ComplaintRepository complaintRepository, UserRepository userRepository,
                           AiService aiService, ScoreEngine scoreEngine) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
        this.aiService = aiService;
        this.scoreEngine = scoreEngine;
    }

    public Complaint submit(MultipartFile image, String userId, double latitude, double longitude,
                           String area, String state, String zoneType, String description) {
        
        // Call AI Service for analysis
        AiAnalysisResult aiResult = aiService.analyze(image, latitude, longitude, zoneType);

        Complaint complaint = Complaint.builder()
                .userId(userId)
                .issueType(aiResult.getIssueType())
                .description(description)
                .latitude(latitude)
                .longitude(longitude)
                .area(area)
                .state(state)
                .imageUrl("image_" + System.currentTimeMillis() + ".jpg")
                .status("PENDING")
                .priority(aiResult.getPriority())
                .tensionScore(aiResult.getTensionScore())
                .zoneType(zoneType)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        complaintRepository.save(complaint);
        
        // Update area score
        scoreEngine.updateAreaScore(area, state, "INFRASTRUCTURE", aiResult.getPriority());

        // Award points to user
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            int points = switch (aiResult.getPriority()) {
                case "CRITICAL" -> 100;
                case "HIGH" -> 50;
                case "MEDIUM" -> 25;
                case "LOW" -> 10;
                default -> 0;
            };
            user.setCivicPoints(user.getCivicPoints() + points);
            userRepository.save(user);
        }

        log.info("Complaint submitted successfully: {}", complaint.getId());
        return complaint;
    }

    public Page<Complaint> getComplaints(String state, String priority, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        
        if (state != null && priority != null) {
            return complaintRepository.findByStateAndPriorityOrderByCreatedAtDesc(state, priority, pageable);
        } else if (state != null && status != null) {
            return complaintRepository.findByStateAndStatusOrderByCreatedAtDesc(state, status, pageable);
        } else if (state != null) {
            List<Complaint> complaints = complaintRepository.findByState(state);
            int start = page * size;
            int end = Math.min(start + size, complaints.size());
            List<Complaint> pageContent = complaints.subList(start, Math.max(start, end));
            return new org.springframework.data.domain.PageImpl<>(pageContent, pageable, complaints.size());
        }
        
        return Page.empty(pageable);
    }

    public Complaint getById(String id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
    }

    public Complaint upvote(String id) {
        Complaint complaint = getById(id);
        complaint.setUpvoteCount(complaint.getUpvoteCount() + 1);
        complaint.setUpdatedAt(LocalDateTime.now());
        return complaintRepository.save(complaint);
    }

    public Complaint updateStatus(String id, String status) {
        Complaint complaint = getById(id);
        complaint.setStatus(status);
        
        if ("RESOLVED".equalsIgnoreCase(status)) {
            complaint.setResolvedAt(LocalDateTime.now());
            
            // Award bonus points to reporter
            User reporter = userRepository.findById(complaint.getUserId()).orElse(null);
            if (reporter != null) {
                reporter.setCivicPoints(reporter.getCivicPoints() + 100);
                userRepository.save(reporter);
            }
            
            // Update area govtResponse score
            scoreEngine.updateAreaScore(complaint.getArea(), complaint.getState(), "GOV_RESPONSE", "POSITIVE");
        }
        
        complaint.setUpdatedAt(LocalDateTime.now());
        return complaintRepository.save(complaint);
    }

    public List<Complaint> getNearby(double latitude, double longitude, double radiusKm) {
        List<Complaint> allComplaints = complaintRepository.findAll();
        
        return allComplaints.stream()
                .filter(complaint -> haversineDistance(latitude, longitude,
                        complaint.getLatitude(), complaint.getLongitude()) <= radiusKm)
                .toList();
    }

    private double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS_KM = 6371;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }
}
