"""
Utility module for error handling and response formatting.
"""

import logging
from typing import Dict, Any, Optional
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


class CivicShieldException(Exception):
    """Base exception for CivicShield services."""
    
    def __init__(self, message: str, status_code: int = 500, details: Optional[str] = None):
        self.message = message
        self.status_code = status_code
        self.details = details or message
        super().__init__(self.message)


class ImageProcessingError(CivicShieldException):
    """Raised when image processing fails."""
    
    def __init__(self, message: str = "Image processing failed", details: Optional[str] = None):
        super().__init__(message, 400, details)


class ModelUnavailableError(CivicShieldException):
    """Raised when ML model is unavailable."""
    
    def __init__(self, message: str = "ML model unavailable", details: Optional[str] = None):
        super().__init__(message, 503, details)


class InvalidInputError(CivicShieldException):
    """Raised when input validation fails."""
    
    def __init__(self, message: str = "Invalid input", details: Optional[str] = None):
        super().__init__(message, 400, details)


def create_success_response(data: Dict[str, Any]) -> JSONResponse:
    """Create a successful response."""
    return JSONResponse(
        content={
            "status": "success",
            "data": data,
        },
        status_code=200,
    )


def create_error_response(
    error: str,
    status_code: int = 500,
    details: Optional[str] = None,
) -> JSONResponse:
    """Create an error response."""
    response = {
        "status": "error",
        "error": error,
    }
    
    if details:
        response["details"] = details
    
    return JSONResponse(content=response, status_code=status_code)


def validate_image_file(filename: str) -> bool:
    """Validate that the file is a supported image format."""
    allowed_formats = {'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'}
    return filename.lower().split('.')[-1] in allowed_formats


def validate_coordinates(latitude: float, longitude: float) -> bool:
    """Validate geographic coordinates."""
    return -90 <= latitude <= 90 and -180 <= longitude <= 180


def validate_zone_type(zone_type: str) -> bool:
    """Validate zone type."""
    valid_zones = {'Hospital', 'Emergency', 'School', 'Market', 'Residential', 'Commercial'}
    return zone_type in valid_zones


def format_confidence(confidence: float) -> float:
    """Format confidence to 2 decimal places."""
    return round(max(0.0, min(1.0, confidence)), 2)


def format_tension_score(tension_score: float) -> float:
    """Format tension score to 1 decimal place."""
    return round(max(0.0, min(100.0, tension_score)), 1)
