package com.civicshield.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiClassifyResult {

    private String category;

    private String severity;

    private double confidence;

    @JsonProperty("civicImpactScore")
    private double civicImpactScore;

    private List<String> tags;
}
