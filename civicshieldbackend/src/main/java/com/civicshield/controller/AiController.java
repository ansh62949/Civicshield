package com.civicshield.controller;

import com.civicshield.dto.AiClassifyResult;
import com.civicshield.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/suggest")
    public ResponseEntity<AiClassifyResult> suggestCategory(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        if (text == null || text.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Use AI to suggest category and severity based on draft text
        AiClassifyResult result = aiService.classify(text, null);
        return ResponseEntity.ok(result);
    }
}
