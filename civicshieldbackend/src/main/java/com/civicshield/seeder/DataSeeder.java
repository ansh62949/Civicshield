package com.civicshield.seeder;

import com.civicshield.entity.Complaint;
import com.civicshield.repository.ComplaintRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class DataSeeder {

    private final ComplaintRepository complaintRepository;

    public DataSeeder(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    // @PostConstruct ✅ DISABLE TEMPORARILY
    public void seedData() {
        if (complaintRepository.count() == 0) {
            List<Complaint> complaints = new ArrayList<>();

            // Sector 62 Noida - High tension zone
            complaints.add(Complaint.builder()
                    .issueType("Pothole")
                    .description("Large pothole on main road near Sector 62 market")
                    .latitude(28.5244)
                    .longitude(77.3958)
                    .imageUrl("image_1.jpg")
                    .status("PENDING")
                    .priority("CRITICAL")
                    .tensionScore(75.0)
                    .zoneType("Residential")
                    .citizenEmail("user1@example.com")
                    .citizenName("Raj Kumar")
                    .upvoteCount(45)
                    .createdAt(LocalDateTime.now().minusDays(5))
                    .updatedAt(LocalDateTime.now().minusDays(5))
                    .build());

            complaints.add(Complaint.builder()
                    .issueType("Garbage")
                    .description("Overflowing garbage bins in residential area")
                    .latitude(28.5250)
                    .longitude(77.3965)
                    .imageUrl("image_2.jpg")
                    .status("IN_PROGRESS")
                    .priority("HIGH")
                    .tensionScore(65.0)
                    .zoneType("Residential")
                    .citizenEmail("user2@example.com")
                    .citizenName("Priya Singh")
                    .upvoteCount(32)
                    .createdAt(LocalDateTime.now().minusDays(4))
                    .updatedAt(LocalDateTime.now().minusDays(3))
                    .build());

            complaints.add(Complaint.builder()
                    .issueType("Water Leak")
                    .description("Major water leak on street causing waterlogging")
                    .latitude(28.5235)
                    .longitude(77.3945)
                    .imageUrl("image_3.jpg")
                    .status("PENDING")
                    .priority("CRITICAL")
                    .tensionScore(80.0)
                    .zoneType("Residential")
                    .citizenEmail("user3@example.com")
                    .citizenName("Amit Patel")
                    .upvoteCount(67)
                    .createdAt(LocalDateTime.now().minusDays(3))
                    .updatedAt(LocalDateTime.now().minusDays(3))
                    .build());

            // Sector 18 Noida - Market zone
            complaints.add(Complaint.builder()
                    .issueType("Broken Light")
                    .description("Street light not working in market area")
                    .latitude(28.5730)
                    .longitude(77.3645)
                    .imageUrl("image_4.jpg")
                    .status("RESOLVED")
                    .priority("MEDIUM")
                    .tensionScore(45.0)
                    .zoneType("Market")
                    .citizenEmail("user4@example.com")
                    .citizenName("Neha Sharma")
                    .upvoteCount(15)
                    .createdAt(LocalDateTime.now().minusDays(10))
                    .updatedAt(LocalDateTime.now().minusDays(2))
                    .build());

            complaints.add(Complaint.builder()
                    .issueType("Pothole")
                    .description("Road damage near market intersection")
                    .latitude(28.5735)
                    .longitude(77.3650)
                    .imageUrl("image_5.jpg")
                    .status("IN_PROGRESS")
                    .priority("HIGH")
                    .tensionScore(58.0)
                    .zoneType("Market")
                    .citizenEmail("user5@example.com")
                    .citizenName("Vikram Singh")
                    .upvoteCount(28)
                    .createdAt(LocalDateTime.now().minusDays(8))
                    .updatedAt(LocalDateTime.now().minusDays(4))
                    .build());

            complaints.add(Complaint.builder()
                    .issueType("Garbage")
                    .description("Waste accumulation in market area")
                    .latitude(28.5725)
                    .longitude(77.3640)
                    .imageUrl("image_6.jpg")
                    .status("PENDING")
                    .priority("MEDIUM")
                    .tensionScore(50.0)
                    .zoneType("Market")
                    .citizenEmail("user6@example.com")
                    .citizenName("Sanya Gupta")
                    .upvoteCount(10)
                    .createdAt(LocalDateTime.now().minusDays(2))
                    .updatedAt(LocalDateTime.now().minusDays(2))
                    .build());

            // Greater Noida West - Commercial zone - Calm area
            complaints.add(Complaint.builder()
                    .issueType("Water Leak")
                    .description("Small water leakage near commercial complex")
                    .latitude(28.4735)
                    .longitude(77.5390)
                    .imageUrl("image_7.jpg")
                    .status("RESOLVED")
                    .priority("LOW")
                    .tensionScore(35.0)
                    .zoneType("Commercial")
                    .citizenEmail("user7@example.com")
                    .citizenName("Arjun Desai")
                    .upvoteCount(5)
                    .createdAt(LocalDateTime.now().minusDays(12))
                    .updatedAt(LocalDateTime.now().minusDays(1))
                    .build());

            complaints.add(Complaint.builder()
                    .issueType("Pothole")
                    .description("Minor pothole in commercial area parking")
                    .latitude(28.4740)
                    .longitude(77.5395)
                    .imageUrl("image_8.jpg")
                    .status("PENDING")
                    .priority("LOW")
                    .tensionScore(40.0)
                    .zoneType("Commercial")
                    .citizenEmail("user8@example.com")
                    .citizenName("Divya Kapoor")
                    .upvoteCount(3)
                    .createdAt(LocalDateTime.now().minusDays(1))
                    .updatedAt(LocalDateTime.now().minusDays(1))
                    .build());

            // Noida City Centre - School zone
            complaints.add(Complaint.builder()
                    .issueType("Broken Light")
                    .description("Damaged street light near school")
                    .latitude(28.5586)
                    .longitude(77.4062)
                    .imageUrl("image_9.jpg")
                    .status("IN_PROGRESS")
                    .priority("HIGH")
                    .tensionScore(62.0)
                    .zoneType("School")
                    .citizenEmail("user9@example.com")
                    .citizenName("Rohan Verma")
                    .upvoteCount(38)
                    .createdAt(LocalDateTime.now().minusDays(6))
                    .updatedAt(LocalDateTime.now().minusDays(2))
                    .build());

            complaints.add(Complaint.builder()
                    .issueType("Garbage")
                    .description("Trash near school premises affecting children")
                    .latitude(28.5590)
                    .longitude(77.4065)
                    .imageUrl("image_10.jpg")
                    .status("PENDING")
                    .priority("CRITICAL")
                    .tensionScore(72.0)
                    .zoneType("School")
                    .citizenEmail("user10@example.com")
                    .citizenName("Sunita Das")
                    .upvoteCount(52)
                    .createdAt(LocalDateTime.now().minusDays(4))
                    .updatedAt(LocalDateTime.now().minusDays(4))
                    .build());

            // Noida City Centre - Hospital zone
            complaints.add(Complaint.builder()
                    .issueType("Water Leak")
                    .description("Water leakage affecting hospital entrance")
                    .latitude(28.5570)
                    .longitude(77.4045)
                    .imageUrl("image_11.jpg")
                    .status("PENDING")
                    .priority("CRITICAL")
                    .tensionScore(85.0)
                    .zoneType("Hospital")
                    .citizenEmail("user11@example.com")
                    .citizenName("Dr. Anjali Roy")
                    .upvoteCount(78)
                    .createdAt(LocalDateTime.now().minusDays(7))
                    .updatedAt(LocalDateTime.now().minusDays(7))
                    .build());

            complaints.add(Complaint.builder()
                    .issueType("Pothole")
                    .description("Road damage near hospital entrance")
                    .latitude(28.5575)
                    .longitude(77.4050)
                    .imageUrl("image_12.jpg")
                    .status("IN_PROGRESS")
                    .priority("CRITICAL")
                    .tensionScore(78.0)
                    .zoneType("Hospital")
                    .citizenEmail("user12@example.com")
                    .citizenName("Mohit Singh")
                    .upvoteCount(71)
                    .createdAt(LocalDateTime.now().minusDays(5))
                    .updatedAt(LocalDateTime.now().minusDays(1))
                    .build());

            complaintRepository.saveAll(complaints);
            log.info("Database seeded with {} sample complaints", complaints.size());
        } else {
            log.info("Database already contains complaints, skipping seed");
        }
    }

}
