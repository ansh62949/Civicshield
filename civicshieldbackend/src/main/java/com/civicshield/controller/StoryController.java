package com.civicshield.controller;

import com.civicshield.entity.Story;
import com.civicshield.entity.User;
import com.civicshield.repository.StoryRepository;
import com.civicshield.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileOutputStream;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/stories")
@CrossOrigin(origins = "*")
public class StoryController {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public StoryController(StoryRepository storyRepository, UserRepository userRepository) {
        this.storyRepository = storyRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Story>> getStories() {
        LocalDateTime yesterday = LocalDateTime.now().minusHours(24);
        List<Story> stories = storyRepository.findByCreatedAtAfterOrderByCreatedAtDesc(yesterday);
        return ResponseEntity.ok(stories);
    }

    @PostMapping
    public ResponseEntity<Story> createStory(@RequestBody Map<String, Object> request, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String imageBase64 = (String) request.get("image");
        String imageUrl = null;
        if (imageBase64 != null && !imageBase64.isEmpty()) {
            imageUrl = saveBase64Image(imageBase64);
        }

        Story story = new Story();
        story.setUserId(user.getId());
        story.setUserName(user.getUsername());
        story.setImageUrl(imageUrl);
        story = storyRepository.save(story);

        return ResponseEntity.ok(story);
    }

    private String saveBase64Image(String base64Image) {
        try {
            String base64Data = base64Image;
            if (base64Image.contains(",")) {
                base64Data = base64Image.split(",")[1];
            }

            byte[] imageBytes = Base64.getDecoder().decode(base64Data);

            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String filename = "story_" + UUID.randomUUID() + ".png";
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
