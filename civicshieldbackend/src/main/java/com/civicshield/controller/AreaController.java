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
@CrossOrigin(origins = "*")
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
        Area area = areaService.getAreaByName(areaName, state);
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
        AreaReportResponse report = areaService.getPropertyReport(areaName, state);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/globe-data")
    public ResponseEntity<List<Map<String, Object>>> getGlobeData() {
        List<Map<String, Object>> globeData = areaService.getGlobeData();
        return ResponseEntity.ok(globeData);
    }
}
