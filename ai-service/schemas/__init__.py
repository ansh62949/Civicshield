from pydantic import BaseModel
from typing import List


class ClassifyResponse(BaseModel):
    """Response schema for /classify endpoint"""
    category: str  # POTHOLE, GARBAGE, WATER, CRIME, FLOOD, ROAD, OTHER
    severity: str  # CRITICAL, HIGH, MEDIUM, LOW
    confidence: float
    civicImpactScore: float
    tags: List[str]


class AnalyzeResponse(BaseModel):
    """Response schema for /analyze endpoint"""
    issueType: str
    priority: str  # CRITICAL, HIGH, MEDIUM, LOW
    tensionScore: float
    confidence: float


class HealthResponse(BaseModel):
    """Response schema for /health endpoint"""
    status: str
    service: str
    models: List[str]
