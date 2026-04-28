import logging
import torch
from typing import Tuple
from PIL import Image

logger = logging.getLogger(__name__)

# Classification labels for image zero-shot classification
CANDIDATE_LABELS = [
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
    from transformers import CLIPProcessor, CLIPModel
    CLIP_AVAILABLE = True
    logger.info("Transformers CLIP model is available")
except ImportError:
    CLIP_AVAILABLE = False
    logger.warning("CLIP model not available, will use fallback image classification")


def classify_image(image: Image.Image, clip_model=None, clip_processor=None) -> Tuple[str, float]:
    """
    Classify an image to detect civic issues using CLIP zero-shot classification.
    
    Args:
        image: PIL Image object
        clip_model: Pre-loaded CLIP model
        clip_processor: Pre-loaded CLIP processor
    
    Returns:
        Tuple of (category, confidence_float)
    """
    try:
        if not CLIP_AVAILABLE or clip_model is None or clip_processor is None:
            logger.warning("Using fallback image classification")
            return "OTHER", 0.5
        
        # Prepare inputs
        inputs = clip_processor(text=CANDIDATE_LABELS, images=image, return_tensors="pt", padding=True)
        
        # Get model outputs
        with torch.no_grad():
            outputs = clip_model(**inputs)
        
        # Get probabilities
        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=1)
        
        # Get top result
        top_idx = probs.argmax().item()
        top_prob = probs[0, top_idx].item()
        top_label = CANDIDATE_LABELS[top_idx]
        
        # Map to category
        category = LABEL_TO_CATEGORY.get(top_label, "OTHER")
        
        logger.info(f"Image classified: {category} (confidence: {top_prob:.2f})")
        return category, float(top_prob)
        
    except Exception as e:
        logger.error(f"Error in image classification: {e}")
        return "OTHER", 0.5


def mock_classify_image(image: 'Image.Image' = None) -> Tuple[str, float]:
    """
    Fallback mock classification when model is unavailable.
    
    Args:
        image: PIL Image object (unused in mock)
    
    Returns:
        Tuple of (random_issue_type, 0.85_confidence)
    """
    random_label = random.choice(CIVIC_ISSUE_LABELS)
    issue_type = LABEL_TO_ISSUE_TYPE[random_label]
    confidence = 0.85
    
    logger.info(f"Using mock classification: {issue_type} with confidence {confidence}")
    
    return issue_type, confidence
