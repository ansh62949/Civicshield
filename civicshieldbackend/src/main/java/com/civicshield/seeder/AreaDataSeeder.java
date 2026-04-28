package com.civicshield.seeder;

import com.civicshield.entity.Area;
import com.civicshield.repository.AreaRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class AreaDataSeeder {

    private final AreaRepository areaRepository;

    public AreaDataSeeder(AreaRepository areaRepository) {
        this.areaRepository = areaRepository;
    }

    @PostConstruct
    public void seedAreas() {
        if (areaRepository.count() > 0) {
            log.info("Area data already seeded. Skipping area seeder.");
            return;
        }

        Map<String, Double> noidaSubScores = new HashMap<>();
        noidaSubScores.put("infrastructure", 72.0);
        noidaSubScores.put("safety", 68.0);
        noidaSubScores.put("civicEngagement", 75.0);
        noidaSubScores.put("geoTension", 82.0);
        noidaSubScores.put("environment", 70.0);
        noidaSubScores.put("govtResponse", 65.0);

        Area noida = Area.builder()
                .name("Noida")
                .city("Noida")
                .state("Delhi")
                .latitude(28.5743)
                .longitude(77.3545)
                .civicScore(72.0)
                .subScores(noidaSubScores)
                .totalPosts(14)
                .openComplaints(12)
                .resolvedComplaints(8)
                .crimeReports30d(6)
                .floodRisk("MEDIUM")
                .propertySafetyRating(68.4)
                .updatedAt(LocalDateTime.now())
                .build();

        areaRepository.save(noida);
        log.info("Seeded initial area data: Noida, Delhi");
    }
}
