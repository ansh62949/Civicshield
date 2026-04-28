package com.civicshield.controller;

import com.civicshield.entity.Complaint;
import com.civicshield.service.ComplaintService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
@Slf4j
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Complaint> submitComplaint(
            @RequestParam("image") MultipartFile image,
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude,
            @RequestParam("area") String area,
            @RequestParam("state") String state,
            @RequestParam("zoneType") String zoneType,
            @RequestParam("description") String description,
            Authentication authentication) {

        String userId = authentication.getName();
        Complaint complaint = complaintService.submit(image, userId, latitude, longitude, area, state, zoneType, description);
        return ResponseEntity.status(HttpStatus.CREATED).body(complaint);
    }

    @GetMapping
    public ResponseEntity<Page<Complaint>> getComplaints(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Page<Complaint> complaints = complaintService.getComplaints(state, priority, status, page, size);
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable String id) {
        Complaint complaint = complaintService.getById(id);
        return ResponseEntity.ok(complaint);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Complaint> updateComplaintStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {

        String status = request.get("status");
        Complaint complaint = complaintService.updateStatus(id, status);
        return ResponseEntity.ok(complaint);
    }

    @GetMapping("/nearby")
    public ResponseEntity<java.util.List<Complaint>> getNearby(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "5") double radiusKm) {

        java.util.List<Complaint> nearby = complaintService.getNearby(latitude, longitude, radiusKm);
        return ResponseEntity.ok(nearby);
    }
}
