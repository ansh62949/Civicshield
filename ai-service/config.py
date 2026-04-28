import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# FastAPI Configuration
FASTAPI_ENV = os.getenv("FASTAPI_ENV", "development")
LOG_LEVEL = os.getenv("LOG_LEVEL", "info")

# Server Configuration
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))

# File Upload Configuration
MAX_UPLOAD_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", 10 * 1024 * 1024))  # 10MB

# Model Configuration
VISION_MODEL = os.getenv("VISION_MODEL", "ViT-B-32")
PRETRAINED = os.getenv("PRETRAINED", "openai")

# CORS Configuration
CORS_ORIGINS = [origin.strip() for origin in 
               os.getenv("CORS_ORIGINS", "http://localhost:8080,http://localhost:5173").split(",")]

# MongoDB Configuration (if needed for caching)
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/civicsense-ai")

# Cache Configuration
CACHE_ENABLED = os.getenv("CACHE_ENABLED", "true").lower() == "true"
CACHE_TTL = int(os.getenv("CACHE_TTL", 3600))  # 1 hour


# Feature Flags
USE_GPU = os.getenv("USE_GPU", "true").lower() == "true"
USE_MOCK_CLASSIFICATION = os.getenv("USE_MOCK_CLASSIFICATION", "false").lower() == "true"

# Service Configuration
CIVICSHIELD_BACKEND_URL = os.getenv("CIVICSHIELD_BACKEND_URL", "http://localhost:8080")

if __name__ == "__main__":
    print("CivicShield AI Service Configuration:")
    print(f"Environment: {FASTAPI_ENV}")
    print(f"Host: {HOST}:{PORT}")
    print(f"Log Level: {LOG_LEVEL}")
    print(f"Vision Model: {VISION_MODEL}")
    print(f"CORS Origins: {CORS_ORIGINS}")
    print(f"Use GPU: {USE_GPU}")
    print(f"Mock Classification: {USE_MOCK_CLASSIFICATION}")
