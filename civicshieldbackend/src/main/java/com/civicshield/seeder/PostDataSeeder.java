package com.civicshield.seeder;

import com.civicshield.entity.Post;
import com.civicshield.repository.PostRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class PostDataSeeder {

    private final PostRepository postRepository;

    public PostDataSeeder(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @PostConstruct
    public void seedPosts() {
        // Always seed posts for development - clear existing first
        postRepository.deleteAll();
        log.info("Cleared existing posts for reseeding");

        List<Post> posts = new ArrayList<>();

            // Sample posts for Delhi area (within 10km of 28.6139, 77.209)
            posts.add(Post.builder()
                    .authorId("user1")
                    .authorUsername("Raj Kumar")
                    .authorAvatar("avatar1.jpg")
                    .content("Large pothole on the main road near Connaught Place. This has been here for weeks and is causing accidents!")
                    .imageUrl("pothole_1.jpg")
                    .locationLabel("Connaught Place, Delhi")
                    .state("Delhi")
                    .latitude(28.6314)
                    .longitude(77.2167)
                    .category("POTHOLE")
                    .severity("CRITICAL")
                    .aiVerified(true)
                    .aiCategory("POTHOLE")
                    .aiSeverity("CRITICAL")
                    .aiConfidence(0.95)
                    .civicImpactScore(85.0)
                    .status("OPEN")
                    .isAnonymous(false)
                    .createdAt(LocalDateTime.now().minusHours(5))
                    .updatedAt(LocalDateTime.now().minusHours(5))
                    .build());

            posts.add(Post.builder()
                    .authorId("user2")
                    .authorUsername("Priya Singh")
                    .authorAvatar("avatar2.jpg")
                    .content("Overflowing garbage bins near India Gate. The smell is unbearable and attracting pests.")
                    .imageUrl("garbage_1.jpg")
                    .locationLabel("India Gate, Delhi")
                    .state("Delhi")
                    .latitude(28.6129)
                    .longitude(77.2295)
                    .category("GARBAGE")
                    .severity("HIGH")
                    .aiVerified(true)
                    .aiCategory("GARBAGE")
                    .aiSeverity("HIGH")
                    .aiConfidence(0.88)
                    .civicImpactScore(72.0)
                    .status("OPEN")
                    .isAnonymous(false)
                    .createdAt(LocalDateTime.now().minusHours(4))
                    .updatedAt(LocalDateTime.now().minusHours(4))
                    .build());

            posts.add(Post.builder()
                    .authorId("user3")
                    .authorUsername("Amit Patel")
                    .authorAvatar("avatar3.jpg")
                    .content("Major water leak on Rajpath Road causing waterlogging. This is flooding the entire area!")
                    .imageUrl("water_leak_1.jpg")
                    .locationLabel("Rajpath, Delhi")
                    .state("Delhi")
                    .latitude(28.6135)
                    .longitude(77.1990)
                    .category("WATER")
                    .severity("CRITICAL")
                    .aiVerified(true)
                    .aiCategory("WATER")
                    .aiSeverity("CRITICAL")
                    .aiConfidence(0.92)
                    .civicImpactScore(90.0)
                    .status("OPEN")
                    .isAnonymous(false)
                    .createdAt(LocalDateTime.now().minusHours(3))
                    .updatedAt(LocalDateTime.now().minusHours(3))
                    .build());

            posts.add(Post.builder()
                    .authorId("user4")
                    .authorUsername("Neha Sharma")
                    .authorAvatar("avatar4.jpg")
                    .content("Street light not working in Chandni Chowk market area. It's very dark and unsafe at night.")
                    .imageUrl("broken_light_1.jpg")
                    .locationLabel("Chandni Chowk, Delhi")
                    .state("Delhi")
                    .latitude(28.6587)
                    .longitude(77.2334)
                    .category("ROAD")
                    .severity("MEDIUM")
                    .aiVerified(true)
                    .aiCategory("ROAD")
                    .aiSeverity("MEDIUM")
                    .aiConfidence(0.78)
                    .civicImpactScore(55.0)
                    .status("OPEN")
                    .isAnonymous(false)
                    .createdAt(LocalDateTime.now().minusHours(10))
                    .updatedAt(LocalDateTime.now().minusHours(10))
                    .build());

            posts.add(Post.builder()
                    .authorId("user5")
                    .authorUsername("Vikram Singh")
                    .authorAvatar("avatar5.jpg")
                    .content("Road damage near Red Fort intersection. Cars are having trouble navigating this area.")
                    .imageUrl("pothole_2.jpg")
                    .locationLabel("Red Fort, Delhi")
                    .state("Delhi")
                    .latitude(28.6562)
                    .longitude(77.2410)
                    .category("POTHOLE")
                    .severity("HIGH")
                    .aiVerified(true)
                    .aiCategory("POTHOLE")
                    .aiSeverity("HIGH")
                    .aiConfidence(0.85)
                    .civicImpactScore(68.0)
                    .status("OPEN")
                    .isAnonymous(false)
                    .createdAt(LocalDateTime.now().minusHours(8))
                    .updatedAt(LocalDateTime.now().minusHours(8))
                    .build());

            posts.add(Post.builder()
                    .authorId("user6")
                    .authorUsername("Sanya Gupta")
                    .authorAvatar("avatar6.jpg")
                    .content("Waste accumulation in Karol Bagh market. This is affecting the local businesses and customers.")
                    .imageUrl("garbage_2.jpg")
                    .locationLabel("Karol Bagh, Delhi")
                    .state("Delhi")
                    .latitude(28.6517)
                    .longitude(77.1907)
                    .category("GARBAGE")
                    .severity("MEDIUM")
                    .aiVerified(true)
                    .aiCategory("GARBAGE")
                    .aiSeverity("MEDIUM")
                    .aiConfidence(0.82)
                    .civicImpactScore(60.0)
                    .status("OPEN")
                    .isAnonymous(false)
                    .createdAt(LocalDateTime.now().minusHours(2))
                    .updatedAt(LocalDateTime.now().minusHours(2))
                    .build());

            posts.add(Post.builder()
                    .authorId("user7")
                    .authorUsername("Arjun Desai")
                    .authorAvatar("avatar7.jpg")
                    .content("Small water leakage near Lajpat Nagar market. It's creating a slippery surface.")
                    .imageUrl("water_leak_2.jpg")
                    .locationLabel("Lajpat Nagar, Delhi")
                    .state("Delhi")
                    .latitude(28.5783)
                    .longitude(77.2407)
                    .category("WATER")
                    .severity("LOW")
                    .aiVerified(true)
                    .aiCategory("WATER")
                    .aiSeverity("LOW")
                    .aiConfidence(0.65)
                    .civicImpactScore(35.0)
                    .status("OPEN")
                    .isAnonymous(false)
                    .createdAt(LocalDateTime.now().minusHours(12))
                    .updatedAt(LocalDateTime.now().minusHours(12))
                    .build());

            posts.add(Post.builder()
                    .authorId("user8")
                    .authorUsername("Divya Kapoor")
                    .authorAvatar("avatar8.jpg")
                    .content("Minor pothole in Hauz Khas parking area. It's inconvenient for visitors.")
                    .imageUrl("pothole_3.jpg")
                    .locationLabel("Hauz Khas, Delhi")
                    .state("Delhi")
                    .latitude(28.5494)
                    .longitude(77.2001)
                    .category("POTHOLE")
                    .severity("LOW")
                    .aiVerified(true)
                    .aiCategory("POTHOLE")
                    .aiSeverity("LOW")
                    .aiConfidence(0.70)
                    .civicImpactScore(40.0)
                    .status("OPEN")
                    .isAnonymous(false)
                    .createdAt(LocalDateTime.now().minusHours(1))
                    .updatedAt(LocalDateTime.now().minusHours(1))
                    .build());

            posts.add(Post.builder()
                    .authorId("user9")
                    .authorUsername("Rohan Verma")
                    .authorAvatar("avatar9.jpg")
                    .content("Damaged street light near Delhi University. This is a safety concern for students.")
                    .imageUrl("broken_light_2.jpg")
                    .locationLabel("Delhi University, Delhi")
                    .state("Delhi")
                    .latitude(28.6892)
                    .longitude(77.2148)
                    .category("ROAD")
                    .severity("HIGH")
                    .aiVerified(true)
                    .aiCategory("ROAD")
                    .aiSeverity("HIGH")
                    .aiConfidence(0.89)
                    .civicImpactScore(75.0)
                    .status("OPEN")
                    .isAnonymous(false)
                    .createdAt(LocalDateTime.now().minusHours(6))
                    .updatedAt(LocalDateTime.now().minusHours(6))
                    .build());

            posts.add(Post.builder()
                    .authorId("user10")
                    .authorUsername("Sunita Das")
                    .authorAvatar("avatar10.jpg")
                    .content("Trash accumulation near Jama Masjid affecting visitors. This needs immediate attention!")
                    .imageUrl("garbage_3.jpg")
                    .locationLabel("Jama Masjid, Delhi")
                    .state("Delhi")
                    .latitude(28.6507)
                    .longitude(77.2334)
                    .category("GARBAGE")
                    .severity("CRITICAL")
                    .aiVerified(true)
                    .aiCategory("GARBAGE")
                    .aiSeverity("CRITICAL")
                    .aiConfidence(0.94)
                    .civicImpactScore(88.0)
                    .status("OPEN")
                    .isAnonymous(false)
                    .createdAt(LocalDateTime.now().minusHours(4))
                    .updatedAt(LocalDateTime.now().minusHours(4))
                    .build());

            postRepository.saveAll(posts);
            log.info("Database seeded with {} sample posts", posts.size());
    }

}
