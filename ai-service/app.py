"""
CivicSense AI Service - FastAPI Application

Provides AI-powered classification and analysis for civic issues.
- Image classification with CLIP
- Text zero-shot classification with BART
- Priority scoring with LightGBM
- Geopolitical tension index
"""

import logging
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import io

from schemas import ClassifyResponse, AnalyzeResponse, HealthResponse
from image_classifier import classify_image
from text_classifier import classify_text
from priority_model import score_priority
from geo_pipeline import get_tension_for_state, get_tension_for_location
from config import CORS_ORIGINS, LOG_LEVEL, PORT

# Configure logging
logging.basicConfig(level=LOG_LEVEL.upper())
logger = logging.getLogger(__name__)


# Global model references
class AppState:
    clip_model: Optional[object] = None
    clip_processor: Optional[object] = None
    zsc_pipeline: Optional[object] = None


app_state = AppState()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Async context manager for app lifecycle.
    Loads models on startup, releases on shutdown.
    """
    # STARTUP
    logger.info("=== CivicSense AI Service Starting ===")
    
    try:
        # Load CLIP model
        logger.info("Loading CLIP model (openai/clip-vit-base-patch32)...")
        from transformers import CLIPProcessor, CLIPModel
        app_state.clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        app_state.clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        logger.info("✓ CLIP model loaded successfully")
    except Exception as e:
        logger.warning(f"Failed to load CLIP model: {e}")
        app_state.clip_model = None
        app_state.clip_processor = None
    
    try:
        # Load zero-shot classification pipeline
        logger.info("Loading DistilBERT zero-shot classification pipeline...")
        from transformers import pipeline
        app_state.zsc_pipeline = pipeline("zero-shot-classification", 
                                         model="typeform/distilbert-base-uncased-mnli")
        logger.info("✓ DistilBERT pipeline loaded successfully")
    except Exception as e:
        logger.warning(f"Failed to load BART pipeline: {e}")
        app_state.zsc_pipeline = None
    
    logger.info("✓ Models loaded successfully")
    logger.info("CivicSense AI Service is ready!")
    
    yield
    
    # SHUTDOWN
    logger.info("=== CivicSense AI Service Shutting Down ===")
    app_state.clip_model = None
    app_state.clip_processor = None
    app_state.zsc_pipeline = None
    logger.info("Models unloaded")


# Create FastAPI app with lifespan
app = FastAPI(
    title="CivicSense AI Service",
    description="AI-powered civic issue classification and analysis",
    version="2.0.0",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# ENDPOINTS
# ============================================================================

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint.
    Returns status and list of loaded models.
    """
    models = []
    if app_state.clip_model is not None:
        models.append("clip")
    if app_state.zsc_pipeline is not None:
        models.append("bart")
    
    return HealthResponse(
        status="ok",
        service="CivicSense AI",
        models=models
    )


@app.post("/classify", response_model=ClassifyResponse)
async def classify_post(
    image: Optional[UploadFile] = File(None),
    content: str = Form(...),
):
    """
    Classify a post with image and text content.
    Returns category, severity, confidence, impact score, and tags.
    """
    try:
        image_confidence = 0.0
        image_category = "OTHER"
        
        if image:
            try:
                image_data = await image.read()
                pil_image = Image.open(io.BytesIO(image_data))
                image_category, image_confidence = classify_image(
                    pil_image,
                    clip_model=app_state.clip_model,
                    clip_processor=app_state.clip_processor
                )
                logger.info(f"Image classification: {image_category} ({image_confidence:.2f})")
            except Exception as e:
                logger.error(f"Image classification error: {e}")
                image_confidence = 0.0
        
        try:
            text_category, text_confidence = classify_text(content, zsc_pipeline=app_state.zsc_pipeline)
        except Exception as e:
            logger.error(f"Text classification error: {e}")
            text_category, text_confidence = "OTHER", 0.5
        
        if image and image_confidence > 0.5:
            final_category = image_category
            final_confidence = image_confidence * 0.7 + text_confidence * 0.3
        else:
            final_category = text_category
            final_confidence = text_confidence
        
        severity = determine_severity(content, final_category)
        
        severity_scores = { "CRITICAL": 90, "HIGH": 70, "MEDIUM": 45, "LOW": 20 }
        civic_impact_score = severity_scores.get(severity, 20) * final_confidence
        
        tags = extract_tags(content)
        
        response = ClassifyResponse(
            category=final_category,
            severity=severity,
            confidence=float(final_confidence),
            civicImpactScore=float(civic_impact_score),
            tags=tags
        )
        return response
        
    except Exception as e:
        logger.error(f"Unexpected error in /classify: {e}", exc_info=True)
        # Return fallback response
        return ClassifyResponse(
            category="OTHER",
            severity="MEDIUM",
            confidence=0.5,
            civicImpactScore=22.5,
            tags=[]
        )


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_complaint(
    image: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    zoneType: str = Form(...),
):
    """
    Analyze a complaint with image and geo-location.
    Returns issueType, priority, tensionScore, and confidence.
    """
    try:
        image_data = await image.read()
        pil_image = Image.open(io.BytesIO(image_data))
        
        issue_type, image_confidence = classify_image(
            pil_image, clip_model=app_state.clip_model, clip_processor=app_state.clip_processor
        )
        
        tension_score = get_tension_for_location(latitude, longitude)
        severity = determine_severity_from_category(issue_type)
        
        priority = score_priority(
            confidence=image_confidence,
            zone_type=zoneType,
            tension_score=tension_score,
            severity=severity
        )
        
        response = AnalyzeResponse(
            issueType=issue_type,
            priority=priority,
            tensionScore=float(tension_score),
            confidence=float(image_confidence)
        )
        return response
        
    except Exception as e:
        logger.error(f"Unexpected error in /analyze: {e}", exc_info=True)
        # Return fallback response
        return AnalyzeResponse(
            issueType="OTHER",
            priority="MEDIUM",
            tensionScore=50.0,
            confidence=0.5
        )


@app.get("/tension/{state}")
async def get_tension(state: str):
    """
    Get geopolitical tension score for a state.
    
    Args:
        state: State name (e.g., "Uttar Pradesh", "Delhi")
    
    Returns:
        JSON with state name and tension score
    """
    try:
        tension_score = get_tension_for_state(state)
        return {
            "state": state,
            "tensionScore": float(tension_score)
        }
    except Exception as e:
        logger.error(f"Error in /tension endpoint: {e}")
        return {
            "state": state,
            "tensionScore": 50.0  # Default
        }


@app.get("/")
async def root():
    """Root endpoint showing service info"""
    return {
        "service": "CivicSense AI",
        "version": "2.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "classify": "POST /classify",
            "analyze": "POST /analyze",
            "tension": "GET /tension/{state}",
            "docs": "/docs"
        }
    }


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def determine_severity(content: str, category: str) -> str:
    """
    Determine severity level based on content keywords and category.
    
    Args:
        content: Post content text
        category: Detected category
    
    Returns:
        Severity level (CRITICAL, HIGH, MEDIUM, LOW)
    """
    severity_keywords = {
        "CRITICAL": ["hospital", "school", "emergency", "flooding", "blocked", "dangerous", "life safety"],
        "HIGH": ["main road", "market", "leaking", "broken", "overflow", "major"],
        "MEDIUM": ["pothole", "garbage", "repair", "crack", "minor water", "damage"],
        "LOW": ["minor", "small", "cosmetic", "slight"],
    }
    
    content_lower = content.lower()
    
    # Check for CRITICAL keywords
    if any(keyword in content_lower for keyword in severity_keywords["CRITICAL"]):
        return "CRITICAL"
    
    # Check for HIGH keywords
    if any(keyword in content_lower for keyword in severity_keywords["HIGH"]):
        return "HIGH"
    
    # Check for MEDIUM keywords
    if any(keyword in content_lower for keyword in severity_keywords["MEDIUM"]):
        return "MEDIUM"
    
    # Default based on category
    if category in ["POTHOLE", "GARBAGE"]:
        return "MEDIUM"
    elif category in ["WATER", "FLOOD"]:
        return "HIGH"
    elif category in ["CRIME"]:
        return "HIGH"
    
    return "LOW"


def determine_severity_from_category(category: str) -> str:
    """
    Determine default severity based on category.
    
    Args:
        category: Issue category
    
    Returns:
        Severity level
    """
    severity_map = {
        "POTHOLE": "MEDIUM",
        "GARBAGE": "MEDIUM",
        "WATER": "HIGH",
        "FLOOD": "HIGH",
        "CRIME": "HIGH",
        "ROAD": "MEDIUM",
        "OTHER": "LOW",
    }
    
    return severity_map.get(category, "MEDIUM")


def extract_tags(content: str) -> list:
    """
    Extract relevant tags from content.
    
    Simple tag extraction based on common civic issue keywords.
    
    Args:
        content: Post content text
    
    Returns:
        List of tags
    """
    tag_keywords = {
        "Traffic": ["traffic", "congestion", "jam"],
        "Pothole": ["pothole", "hole", "pit"],
        "Garbage": ["garbage", "waste", "trash", "dump"],
        "Water": ["water", "leak", "pipe", "drainage"],
        "Crime": ["crime", "theft", "robbery", "violence"],
        "Light": ["light", "streetlight", "dark", "lighting"],
        "Road": ["road", "pavement", "concrete", "asphalt"],
        "Park": ["park", "garden", "public space"],
        "Flood": ["flood", "water", "inundation"],
    }
    
    content_lower = content.lower()
    tags = []
    
    for tag, keywords in tag_keywords.items():
        if any(keyword in content_lower for keyword in keywords):
            tags.append(tag)
    
    # Return top 3 tags
    return tags[:3] if tags else ["Issue"]


if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting CivicSense AI Service on 0.0.0.0:{PORT}")
    uvicorn.run(app, host="0.0.0.0", port=PORT, log_level=LOG_LEVEL.lower())

