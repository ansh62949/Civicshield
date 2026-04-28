package com.civicshield.controller;

import com.civicshield.dto.AreaReportResponse;
import com.civicshield.entity.Area;
import com.civicshield.service.AreaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/areas")

public class AreaController {

    private final AreaService areaService;

    public AreaController(AreaService areaService) {
        this.areaService = areaService;
    }

    @GetMapping
    public ResponseEntity<List<Area>> getAreas(@RequestParam String state) {
        List<Area> areas = areaService.getAreasByState(state);
        return ResponseEntity.ok(areas);
    }

    @GetMapping("/{areaName}")
    public ResponseEntity<Area> getAreaByName(@PathVariable String areaName,
                                             @RequestParam String state) {
        // Normalize area name (e.g. "Sector 62, Noida" -> "Sector 62")
        String cleanArea = areaName.split(",")[0].trim();
        Area area = areaService.getAreaByName(cleanArea, state);
        return ResponseEntity.ok(area);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<Area>> getLeaderboard(@RequestParam String state,
                                                     @RequestParam(defaultValue = "20") int limit) {
        List<Area> leaderboard = areaService.getLeaderboard(state, limit);
        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/property-report/{areaName}")
    public ResponseEntity<AreaReportResponse> getPropertyReport(@PathVariable String areaName,
                                                               @RequestParam String state) {
        String cleanArea = areaName.split(",")[0].trim();
        AreaReportResponse report = areaService.getPropertyReport(cleanArea, state);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/globe-data")
    public ResponseEntity<List<Map<String, Object>>> getGlobeData() {
        List<Map<String, Object>> globeData = areaService.getGlobeData();
        return ResponseEntity.ok(globeData);
    }
}

