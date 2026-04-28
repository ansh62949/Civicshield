package com.civicshield.controller;

import com.civicshield.entity.Post;
import com.civicshield.service.PostService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.util.ResourceUtils;
import com.civicshield.dto.PostCreateRequest;
import com.civicshield.dto.CommentRequest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    private final PostService postService;
    @Value("${file.upload-dir}")
    private String uploadDir;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<Post> createPost(
            @RequestBody PostCreateRequest request,
            Authentication authentication) {
        
        String username = authentication.getName();
        String imageUrl = null;
        
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            imageUrl = saveBase64Image(request.getImage());
        }

        Boolean isAnon = request.getIsAnonymous() != null ? request.getIsAnonymous() : false;

        Post post = postService.createPost(
                username, 
                request.getContent(), 
                imageUrl, 
                request.getLocationLabel(), 
                request.getState(), 
                request.getLatitude(), 
                request.getLongitude(), 
                isAnon
        );
        return ResponseEntity.ok(post);
    }

    @GetMapping("/feed")
    public ResponseEntity<Page<Post>> getFeed(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "10") double radiusKm,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String severity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<Post> feed = postService.getFeed(lat, lon, radiusKm, category, severity, page, size);
        return ResponseEntity.ok(feed);
    }

    @GetMapping("/nearby")
    public ResponseEntity<?> getNearby(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "5") double radiusKm) {
        return ResponseEntity.ok(Map.of("message", "Not yet implemented"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable String id) {
        Post post = postService.getPost(id);
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id, Authentication authentication) {
        String username = authentication.getName();
        postService.deletePost(id, username);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/upvote")
    public ResponseEntity<Post> upvotePost(@PathVariable String id, Authentication authentication) {
        String username = authentication.getName();
        Post post = postService.upvotePost(id, username);
        return ResponseEntity.ok(post);
    }

    @PostMapping("/{id}/comment")
    public ResponseEntity<Post> addComment(
            @PathVariable String id, 
            @RequestBody CommentRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        Post post = postService.addComment(id, username, request.getText());
        return ResponseEntity.ok(post);
    }

    @GetMapping("/user/{authorId}")
    public ResponseEntity<java.util.List<Post>> getUserPosts(@PathVariable String authorId) {
        java.util.List<Post> posts = postService.getUserPosts(authorId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> getUploadedFile(@PathVariable String filename) {
        try {
            File file = new File(uploadDir, filename);
            
            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }
            
            Resource resource = new FileSystemResource(file);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private String saveBase64Image(String base64Image) {
        try {
            String base64Data = base64Image.contains(",") ? base64Image.split(",")[1] : base64Image;
            byte[] imageBytes = Base64.getDecoder().decode(base64Data);

            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String filename = UUID.randomUUID() + ".png";
            File targetFile = new File(dir, filename);
            
            try (FileOutputStream fos = new FileOutputStream(targetFile)) {
                fos.write(imageBytes);
            }

            return "/api/posts/uploads/" + filename;
        } catch (Exception e) {
            throw new RuntimeException("Failed to save image: " + e.getMessage(), e);
        }
    }
}
