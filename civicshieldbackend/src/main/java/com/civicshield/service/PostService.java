package com.civicshield.service;

import com.civicshield.dto.AiClassifyResult;
import com.civicshield.entity.Area;
import com.civicshield.entity.Post;
import com.civicshield.entity.User;
import com.civicshield.repository.AreaRepository;
import com.civicshield.repository.PostRepository;
import com.civicshield.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final AreaRepository areaRepository;
    private final ScoreEngine scoreEngine;
    private final AiService aiService;

    public PostService(PostRepository postRepository, UserRepository userRepository, 
                      AreaRepository areaRepository, ScoreEngine scoreEngine, AiService aiService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.areaRepository = areaRepository;
        this.scoreEngine = scoreEngine;
        this.aiService = aiService;
    }

    public Post createPost(String authorId, String content, String imageUrl, File imageFile,
                          String locationLabel, String state, double latitude, 
                          double longitude, boolean isAnonymous) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Call AI Service for classification
        AiClassifyResult aiResult = aiService.classify(content, imageFile);

        Post post = Post.builder()
                .authorId(authorId)
                .authorUsername(isAnonymous ? "Anonymous" : author.getUsername())
                .authorAvatar(isAnonymous ? "?" : generateInitials(author.getUsername()))
                .content(content)
                .imageUrl(imageUrl)
                .locationLabel(locationLabel)
                .state(state)
                .latitude(latitude)
                .longitude(longitude)
                .category(aiResult.getCategory())
                .severity(aiResult.getSeverity())
                .aiVerified(aiResult.getConfidence() > 0.7)
                .aiCategory(aiResult.getCategory())
                .aiSeverity(aiResult.getSeverity())
                .aiConfidence(aiResult.getConfidence())
                .aiTag(formatAiTag(aiResult))
                .civicImpactScore(aiResult.getCivicImpactScore())
                .isAnonymous(isAnonymous)
                .status("OPEN")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        postRepository.save(post);

        scoreEngine.updateAreaScore(locationLabel, state, post.getCategory(), post.getSeverity());
        awardCivicPoints(author, post.getSeverity(), post);

        return post;
    }

    private String formatAiTag(AiClassifyResult result) {
        String icon = switch (result.getSeverity()) {
            case "CRITICAL" -> "🚨";
            case "HIGH" -> "🔴";
            case "MEDIUM" -> "🟠";
            default -> "🟢";
        };
        return String.format("%s %s · %s", icon, result.getSeverity(), result.getCategory());
    }

    public Page<Post> getFeed(double lat, double lon, double radiusKm, 
                             String category, String severity, int page, int size) {
        double latDelta = radiusKm / 111.0;
        double lonDelta = radiusKm / (111.0 * Math.cos(Math.toRadians(lat)));

        List<Post> allPosts = postRepository.findByLocationBoundingBox(
                lat - latDelta, lat + latDelta, lon - lonDelta, lon + lonDelta
        );

        List<Post> filtered = allPosts.stream()
                .filter(p -> category == null || p.getCategory().equals(category))
                .filter(p -> severity == null || p.getSeverity().equals(severity))
                .toList();

        int start = page * size;
        int end = Math.min(start + size, filtered.size());
        List<Post> pageContent = filtered.subList(start, Math.max(start, end));

        return new org.springframework.data.domain.PageImpl<>(
                pageContent,
                PageRequest.of(page, size),
                filtered.size()
        );
    }

    public Post getPost(String postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public Post upvotePost(String postId, String userId) {
        Post post = getPost(postId);
        
        if (!post.getUpvotes().contains(userId)) {
            post.getUpvotes().add(userId);
            postRepository.save(post);

            User author = userRepository.findByUsername(post.getAuthorId()).orElse(null);
            if (author != null) {
                author.setCivicPoints(author.getCivicPoints() + 5);
                userRepository.save(author);
            }
        }

        return post;
    }

    public Post addComment(String postId, String userId, String text) {
        Post post = getPost(postId);
        User user = userRepository.findByUsername(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> comment = new HashMap<>();
        comment.put("userId", userId);
        comment.put("username", user.getUsername());
        comment.put("text", text);
        comment.put("timestamp", LocalDateTime.now());

        post.getComments().add(comment);
        postRepository.save(post);

        return post;
    }

    public void deletePost(String postId, String userId) {
        Post post = getPost(postId);
        if (!post.getAuthorId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this post");
        }
        postRepository.deleteById(postId);
    }

    private void awardCivicPoints(User user, String severity, Post post) {
        int points = switch (severity) {
            case "CRITICAL" -> 50;
            case "HIGH" -> 30;
            case "MEDIUM" -> 15;
            case "LOW" -> 5;
            default -> 0;
        };

        user.setCivicPoints(user.getCivicPoints() + points);
        userRepository.save(user);
    }

    public List<Post> getUserPosts(String authorId) {
        return postRepository.findByAuthorIdOrderByCreatedAtDesc(authorId);
    }

    private String generateInitials(String username) {
        String[] parts = username.split("\\s+");
        StringBuilder initials = new StringBuilder();
        for (String part : parts) {
            if (!part.isEmpty()) {
                initials.append(part.charAt(0));
            }
        }
        return initials.toString().substring(0, Math.min(2, initials.length())).toUpperCase();
    }
}
