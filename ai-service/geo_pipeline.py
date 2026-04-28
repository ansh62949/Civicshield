import logging

logger = logging.getLogger(__name__)

# State-level tension scores (geopolitical/social tensions)
TENSION_INDEX = {
    "Delhi": 82,
    "Uttar Pradesh": 75,
    "Maharashtra": 45,
    "Karnataka": 61,
    "West Bengal": 68,
    "Tamil Nadu": 29,
    "Telangana": 48,
    "Rajasthan": 55,
    "Gujarat": 41,
    "Haryana": 58,
    "Punjab": 71,
    "Madhya Pradesh": 39,
    "Bihar": 66,
    "Odisha": 33,
    "Kerala": 27,
    "Jharkhand": 52,
    "Chhattisgarh": 44,
    "Assam": 63,
}

# State bounding boxes for lat/lon to state mapping
STATE_BOUNDS = {
    "Uttar Pradesh": {"lat_min": 23.85, "lat_max": 30.28, "lon_min": 77.0, "lon_max": 84.32},
    "Delhi": {"lat_min": 28.38, "lat_max": 28.88, "lon_min": 76.73, "lon_max": 77.31},
    "Haryana": {"lat_min": 27.39, "lat_max": 30.35, "lon_min": 74.27, "lon_max": 77.72},
    "Maharashtra": {"lat_min": 16.63, "lat_max": 22.04, "lon_min": 72.60, "lon_max": 80.88},
    "Karnataka": {"lat_min": 11.50, "lat_max": 18.47, "lon_min": 74.05, "lon_max": 78.59},
    "Tamil Nadu": {"lat_min": 8.50, "lat_max": 13.35, "lon_min": 79.73, "lon_max": 80.30},
    "West Bengal": {"lat_min": 21.59, "lat_max": 27.42, "lon_min": 87.01, "lon_max": 88.44},
    "Gujarat": {"lat_min": 20.53, "lat_max": 24.49, "lon_min": 68.78, "lon_max": 73.34},
    "Rajasthan": {"lat_min": 23.40, "lat_max": 37.50, "lon_min": 68.78, "lon_max": 75.22},
    "Telangana": {"lat_min": 12.86, "lat_max": 18.35, "lon_min": 77.27, "lon_max": 81.19},
    "Punjab": {"lat_min": 29.40, "lat_max": 32.33, "lon_min": 73.55, "lon_max": 76.38},
    "Madhya Pradesh": {"lat_min": 20.25, "lat_max": 26.28, "lon_min": 73.72, "lon_max": 82.81},
    "Bihar": {"lat_min": 24.20, "lat_max": 27.52, "lon_min": 83.29, "lon_max": 88.27},
    "Odisha": {"lat_min": 17.67, "lat_max": 22.54, "lon_min": 81.27, "lon_max": 87.29},
    "Kerala": {"lat_min": 8.13, "lat_max": 12.22, "lon_min": 74.78, "lon_max": 76.79},
    "Jharkhand": {"lat_min": 22.05, "lat_max": 25.48, "lon_min": 83.30, "lon_max": 87.68},
    "Chhattisgarh": {"lat_min": 17.78, "lat_max": 23.85, "lon_min": 80.27, "lon_max": 84.39},
    "Assam": {"lat_min": 24.07, "lat_max": 28.16, "lon_min": 88.74, "lon_max": 97.38},
}


def get_tension_for_state(state: str) -> float:
    """
    Get tension score for a specific state.
    
    Args:
        state: State name
    
    Returns:
        Tension score (float 0-100)
    """
    score = TENSION_INDEX.get(state, 50.0)
    logger.info(f"Tension score for {state}: {score}")
    return float(score)


def get_tension_for_location(latitude: float, longitude: float) -> float:
    """
    Map latitude/longitude to nearest state and return its tension score.
    
    Args:
        latitude: Geographic latitude
        longitude: Geographic longitude
    
    Returns:
        Tension score (float 0-100)
    """
    # Find state containing the location
    for state, bounds in STATE_BOUNDS.items():
        if (bounds["lat_min"] <= latitude <= bounds["lat_max"] and
            bounds["lon_min"] <= longitude <= bounds["lon_max"]):
            tension = get_tension_for_state(state)
            logger.info(f"Location ({latitude}, {longitude}) mapped to {state}")
            return tension
    
    # Default if not found
    logger.warning(f"Location ({latitude}, {longitude}) not in known state bounds, using default")
    return 50.0


def get_tension_score_from_pipeline(latitude: float, longitude: float, 
                                     social_signals: dict = None) -> float:
    """
    Production-ready function that would integrate with GeoTrade NLP pipeline.
    
    Args:
        latitude: Geographic latitude
        longitude: Geographic longitude
        social_signals: Optional dict with social media signals
    
    Returns:
        Tension score (float 0-100)
    """
    # TODO: Integrate with actual GeoTrade NLP service
    # For now, call the prototype implementation
    return get_tension_for_location(latitude, longitude)
