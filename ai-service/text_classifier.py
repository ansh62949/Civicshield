import logging
from typing import Tuple

logger = logging.getLogger(__name__)

# Classification labels
CATEGORY_LABELS = [
    "pothole on road",
    "garbage overflow",
    "water leak or flood",
    "crime scene or vandalism",
    "broken streetlight",
    "road damage",
    "sewage overflow",
    "fallen tree",
    "normal street"
]

# Mapping from label to category enum
LABEL_TO_CATEGORY = {
    "pothole on road": "POTHOLE",
    "garbage overflow": "GARBAGE",
    "water leak or flood": "WATER",
    "crime scene or vandalism": "CRIME",
    "broken streetlight": "ROAD",
    "road damage": "ROAD",
    "sewage overflow": "WATER",
    "fallen tree": "OTHER",
    "normal street": "OTHER"
}

# Try to import transformers
try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
    logger.info("Transformers library is available")
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    logger.warning("Transformers not available, will use fallback text classification")


def classify_text(content: str, zsc_pipeline=None) -> Tuple[str, float]:
    """
    Classify text to detect civic issue category using zero-shot classification.
    
    Args:
        content: Text content to classify
        zsc_pipeline: Transformers zero-shot classification pipeline
    
    Returns:
        Tuple of (category, confidence_float)
    """
    try:
        if not TRANSFORMERS_AVAILABLE or zsc_pipeline is None:
            logger.warning("Using fallback text classification")
            return fallback_text_classify(content)
        
        # Run zero-shot classification
        result = zsc_pipeline(content, CATEGORY_LABELS)
        
        # Extract top result
        top_label = result['labels'][0]
        confidence = result['scores'][0]
        
        # Map to category
        category = LABEL_TO_CATEGORY.get(top_label, "OTHER")
        
        logger.info(f"Text classified: {category} (confidence: {confidence:.2f})")
        return category, float(confidence)
        
    except Exception as e:
        logger.error(f"Error in text classification: {e}")
        return "OTHER", 0.5


def fallback_text_classify(content: str) -> Tuple[str, float]:
    """
    Fallback text classification using keyword matching.
    
    Args:
        content: Text content to classify
    
    Returns:
        Tuple of (category, confidence)
    """
    content_lower = content.lower()
    confidence = 0.4  # Lower confidence for fallback
    
    # Keyword-based classification
    keywords = {
        "POTHOLE": ["pothole", "hole", "pit", "crater"],
        "GARBAGE": ["garbage", "trash", "waste", "dump", "litter"],
        "WATER": ["water", "leak", "drain", "flood", "sewage", "pipe", "burst"],
        "CRIME": ["crime", "theft", "robbery", "stolen", "vandalism", "damage"],
        "ROAD": ["road", "street", "pavement", "lane", "crack", "damage"],
        "OTHER": []
    }
    
    # Check for matches
    for category, words in keywords.items():
        if any(word in content_lower for word in words):
            return category, confidence + 0.1  # Slight confidence boost
    
    return "OTHER", confidence
