package com.civicshield.service;

import com.civicshield.dto.AiAnalysisResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
public class AiService {

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate;

    public AiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public AiAnalysisResult analyze(MultipartFile image, double lat, double lon, String zoneType) {
        try {
            String analyzeUrl = aiServiceUrl + "/analyze";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image", image.getResource());
            body.add("latitude", lat);
            body.add("longitude", lon);
            body.add("zoneType", zoneType);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            AiAnalysisResult result = restTemplate.postForObject(analyzeUrl, requestEntity, AiAnalysisResult.class);
            
            return result != null ? result : getMockData();
        } catch (RestClientException e) {
            log.warn("AI service unavailable, using mock data: {}", e.getMessage());
            return getMockData();
        }
    }

    private AiAnalysisResult getMockData() {
        return AiAnalysisResult.builder()
                .issueType("Pothole")
                .tensionScore(50.0)
                .priority("MEDIUM")
                .confidence(0.7)
                .build();
    }

}
