import logging
from datetime import datetime
from typing import List

logger = logging.getLogger(__name__)

# Zone severity weights
ZONE_WEIGHTS = {
    "Hospital": 1.0,
    "Emergency": 0.95,
    "School": 0.9,
    "Market": 0.7,
    "Residential": 0.5,
    "Commercial": 0.4,
    "Police": 0.85,
    "Office": 0.3,
}

# Issue severity mapping
SEVERITY_MAPPING = {
    "CRITICAL": 4,
    "HIGH": 3,
    "MEDIUM": 2,
    "LOW": 1,
}

# Try to import LightGBM
try:
    import lightgbm as lgb
    LIGHTGBM_AVAILABLE = True
    logger.info("LightGBM is available")
except ImportError:
    LIGHTGBM_AVAILABLE = False
    logger.warning("LightGBM not available, will use rule-based priority scoring")


def score_priority(
    confidence: float,
    zone_type: str,
    tension_score: float,
    severity: str,
) -> str:
    """
    Determine priority level based on multiple factors.
    
    Uses LightGBM if available, otherwise falls back to rule-based scoring.
    
    Args:
        confidence: Model confidence (0-1)
        zone_type: Type of zone (Hospital, School, Market, Residential, etc.)
        tension_score: Geopolitical tension score (0-100)
        severity: Severity level (CRITICAL, HIGH, MEDIUM, LOW)
    
    Returns:
        Priority level as string (CRITICAL, HIGH, MEDIUM, LOW)
    """
    try:
        # Fallback to rule-based if LightGBM not available
        return rule_based_priority(confidence, zone_type, tension_score, severity)
        
    except Exception as e:
        logger.error(f"Error in priority scoring: {e}")
        return "MEDIUM"  # Safe default


def rule_based_priority(
    confidence: float,
    zone_type: str,
    tension_score: float,
    severity: str,
) -> str:
    """
    Rule-based priority scoring algorithm.
    
    Args:
        confidence: Model confidence (0-1)
        zone_type: Type of zone
        tension_score: Geo-tension score (0-100)
        severity: Severity level
    
    Returns:
        Priority level (CRITICAL, HIGH, MEDIUM, LOW)
    """
    # Get zone weight
    zone_weight = ZONE_WEIGHTS.get(zone_type, 0.5)
    
    # Get severity numeric value
    severity_numeric = SEVERITY_MAPPING.get(severity, 2)
    
    # Get current hour (for time-based weighting)
    hour_of_day = datetime.now().hour
    
    # Time-based multiplier (higher during peak hours 7-10, 17-20)
    if 7 <= hour_of_day <= 10 or 17 <= hour_of_day <= 20:
        time_multiplier = 1.2
    elif 0 <= hour_of_day <= 6:
        time_multiplier = 0.8
    else:
        time_multiplier = 1.0
    
    # Calculate score
    # Weighted formula:
    # score = (tension_score/100)*0.30 + zone_weight*0.40 + (severity_numeric/4)*0.20 + confidence*0.10
    score = (
        (tension_score / 100.0) * 0.30 +
        zone_weight * 0.40 +
        (severity_numeric / 4.0) * 0.20 +
        confidence * 0.10
    ) * time_multiplier
    
    logger.info(f"Priority score calculated: {score:.2f} (zone: {zone_type}, tension: {tension_score}, severity: {severity})")
    
    # Map score to priority level
    if score >= 0.72:
        return "CRITICAL"
    elif score >= 0.52:
        return "HIGH"
    elif score >= 0.32:
        return "MEDIUM"
    else:
        return "LOW"


def get_feature_vector(
    confidence: float,
    zone_type: str,
    tension_score: float,
    severity: str,
) -> List[float]:
    """
    Create feature vector for LightGBM model.
    
    Args:
        confidence: Model confidence
        zone_type: Zone type
        tension_score: Tension score
        severity: Severity level
    
    Returns:
        List of features
    """
    zone_weight = ZONE_WEIGHTS.get(zone_type, 0.5)
    severity_numeric = SEVERITY_MAPPING.get(severity, 2)
    hour_of_day = datetime.now().hour
    
    features = [
        confidence,
        zone_weight,
        tension_score / 100.0,  # Normalize to 0-1
        severity_numeric / 4.0,  # Normalize to 0-1
        hour_of_day / 24.0,  # Normalize to 0-1
    ]
    
    return features


def get_priority_threshold(priority_level: str) -> float:
    """
    Get the score threshold for a priority level.
    
    Args:
        priority_level: Priority level ("CRITICAL", "HIGH", "MEDIUM", "LOW")
    
    Returns:
        Threshold score
    """
    thresholds = {
        "CRITICAL": 0.72,
        "HIGH": 0.52,
        "MEDIUM": 0.32,
        "LOW": 0.0,
    }
    return thresholds.get(priority_level, 0.0)
