package com.civicshield.controller;

import com.civicshield.entity.Post;
import com.civicshield.repository.PostRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trending")
public class TrendingController {

    private final PostRepository postRepository;

    public TrendingController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getTrends() {
        // Weekly trends
        LocalDateTime lastWeek = LocalDateTime.now().minusDays(7);
        List<Post> recentPosts = postRepository.findByLocationLabelAndCreatedAtAfter("", lastWeek); 
        // Note: passing empty string for location to get all state/global trends if needed
        // Or better, just get all posts created after date
        
        List<Post> allRecent = postRepository.findAll().stream()
                .filter(p -> p.getCreatedAt() != null && p.getCreatedAt().isAfter(lastWeek))
                .collect(Collectors.toList());

        Map<String, Long> countByCategory = allRecent.stream()
                .filter(p -> p.getCategory() != null)
                .collect(Collectors.groupingBy(Post::getCategory, Collectors.counting()));

        // Calculate some mock growth rates for the UI demo
        List<Map<String, Object>> trendList = countByCategory.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> trend = new HashMap<>();
                    trend.put("category", entry.getKey());
                    trend.put("count", entry.getValue());
                    trend.put("growth", 10 + (entry.getValue() * 5)); // Mock growth
                    return trend;
                })
                .sorted((a, b) -> ((Long)b.get("count")).compareTo((Long)a.get("count")))
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("trends", trendList));
    }
}
