package com.civicshield.seeder;

import com.civicshield.entity.Area;
import com.civicshield.repository.AreaRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
@Slf4j
public class AreaDataSeeder {

    private final AreaRepository areaRepository;

    public AreaDataSeeder(AreaRepository areaRepository) {
        this.areaRepository = areaRepository;
    }

    @PostConstruct
    public void seedAreas() {
        // Noida, Delhi
        upsertArea("Noida", "Delhi", 28.5743, 77.3545, 72.0);
        
        // Sector 62, Uttar Pradesh
        upsertArea("Sector 62", "Uttar Pradesh", 28.625, 77.37, 85.0);
        
        log.info("Area data seeding completed (Noida and Sector 62 ensured)");
    }

    private void upsertArea(String name, String state, double lat, double lon, double score) {
        Optional<Area> existing = areaRepository.findByNameIgnoreCaseAndStateIgnoreCase(name, state);
        
        Map<String, Double> subScores = new HashMap<>();
        subScores.put("infrastructure", 72.0);
        subScores.put("safety", 68.0);
        subScores.put("civicEngagement", 75.0);
        subScores.put("geoTension", 82.0);
        subScores.put("environment", 70.0);
        subScores.put("govtResponse", 65.0);

        Area area = existing.orElse(new Area());
        area.setName(name);
        area.setCity("Noida");
        area.setState(state);
        area.setLatitude(lat);
        area.setLongitude(lon);
        area.setCivicScore(score);
        area.setSubScores(subScores);
        area.setTotalPosts(25);
        area.setOpenComplaints(5);
        area.setResolvedComplaints(20);
        area.setCrimeReports30d(2);
        area.setFloodRisk("LOW");
        area.setPropertySafetyRating(88.0);
        area.setUpdatedAt(LocalDateTime.now());

        areaRepository.save(area);
    }
}
