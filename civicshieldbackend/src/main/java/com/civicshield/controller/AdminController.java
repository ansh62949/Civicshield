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
@RequestMapping("/api/admin/complaints")

@Slf4j
public class AdminController {

    private final ComplaintService complaintService;
    private final ComplaintRepository complaintRepository;

    public AdminController(ComplaintService complaintService, ComplaintRepository complaintRepository) {
        this.complaintService = complaintService;
        this.complaintRepository = complaintRepository;
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, String>> updateStatus(
            @PathVariable String id,
            @RequestParam String status) {

        complaintService.updateStatus(id, status);
        Map<String, String> response = new HashMap<>();
        response.put("id", id);
        response.put("status", status);
        response.put("message", "Status updated successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        List<Complaint> allComplaints = complaintRepository.findAll();

        Map<String, Long> priorityCount = allComplaints.stream()
                .collect(Collectors.groupingBy(Complaint::getPriority, Collectors.counting()));

        Map<String, Long> statusCount = allComplaints.stream()
                .collect(Collectors.groupingBy(Complaint::getStatus, Collectors.counting()));

        Map<String, Object> stats = new HashMap<>();
        stats.put("priorityDistribution", priorityCount);
        stats.put("statusDistribution", statusCount);
        stats.put("totalComplaints", allComplaints.size());

        return ResponseEntity.ok(stats);
    }

}

