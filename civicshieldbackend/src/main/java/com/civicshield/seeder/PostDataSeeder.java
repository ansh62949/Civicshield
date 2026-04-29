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
        if (postRepository.count() > 5) {
            log.info("Database already has enough posts. Skipping post seeder.");
            return;
        }

        List<Post> posts = new ArrayList<>();

        // Delhi area
        posts.add(Post.builder()
                .authorId("raj_kumar")
                .authorUsername("Raj Kumar")
                .content("Large pothole on the main road near Connaught Place. This has been here for weeks and is causing accidents!")
                .imageUrl("https://picsum.photos/seed/pothole1/800/800")
                .locationLabel("Connaught Place, Delhi")
                .state("Delhi")
                .latitude(28.6314)
                .longitude(77.2167)
                .category("POTHOLE")
                .severity("CRITICAL")
                .aiVerified(true)
                .aiTag("🚨 CRITICAL · POTHOLE")
                .civicImpactScore(85.0)
                .status("OPEN")
                .upvotes(new ArrayList<>(List.of("raj_kumar", "ansh62949")))
                .createdAt(LocalDateTime.now().minusHours(5))
                .build());

        // Sector 62, Noida
        posts.add(Post.builder()
                .authorId("neha_sharma")
                .authorUsername("Neha Sharma")
                .content("Street lights are flickering near Sector 62 Metro Station. It gets quite dark after 8 PM.")
                .imageUrl("https://picsum.photos/seed/light62/800/800")
                .locationLabel("Sector 62, Noida")
                .state("Uttar Pradesh")
                .latitude(28.625)
                .longitude(77.37)
                .category("ROAD")
                .severity("MEDIUM")
                .aiVerified(true)
                .aiTag("🟠 MEDIUM · LIGHTING")
                .civicImpactScore(55.0)
                .status("OPEN")
                .upvotes(new ArrayList<>(List.of("neha_sharma")))
                .createdAt(LocalDateTime.now().minusHours(2))
                .build());

        posts.add(Post.builder()
                .authorId("vikram_singh")
                .authorUsername("Vikram Singh")
                .content("Garbage piling up near the Sector 62 Industrial area. Needs immediate clearance by Noida Authority.")
                .imageUrl("https://picsum.photos/seed/garbage62/800/800")
                .locationLabel("Sector 62, Noida")
                .state("Uttar Pradesh")
                .latitude(28.628)
                .longitude(77.372)
                .category("GARBAGE")
                .severity("HIGH")
                .aiVerified(true)
                .aiTag("🔴 HIGH · WASTE")
                .civicImpactScore(72.0)
                .status("OPEN")
                .upvotes(new ArrayList<>(List.of("vikram_singh", "ansh62949")))
                .createdAt(LocalDateTime.now().minusHours(1))
                .build());

        postRepository.saveAll(posts);
        log.info("Database seeded with {} sample posts", posts.size());
    }

}
