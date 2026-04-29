from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="CivicSense Lightweight AI")

# Models path
MODEL_PATH = "model/model.pkl"
VECTORIZER_PATH = "model/vectorizer.pkl"

# Global model variables
model = None
vectorizer = None

# Attempt to load model if exists
if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        vectorizer = joblib.load(VECTORIZER_PATH)
        logger.info("Successfully loaded ML model and vectorizer")
    except Exception as e:
        logger.error(f"Error loading model: {e}")

class ComplaintRequest(BaseModel):
    text: str

def rule_based_classify(text):
    text = text.lower()
    
    if any(word in text for word in ["pothole", "road", "crack", "damage", "pavement"]):
        return "ROAD", "HIGH", 0.9
    elif any(word in text for word in ["garbage", "waste", "trash", "dump", "litter"]):
        return "GARBAGE", "MEDIUM", 0.85
    elif any(word in text for word in ["water", "leak", "flood", "sewage", "drain"]):
        return "WATER", "HIGH", 0.9
    elif any(word in text for word in ["crime", "theft", "attack", "unsafe", "robbery"]):
        return "CRIME", "CRITICAL", 0.95
    elif any(word in text for word in ["light", "dark", "street light", "bulb"]):
        return "ROAD", "MEDIUM", 0.8
    else:
        return "OTHER", "LOW", 0.6

@app.post("/classify")
async def classify_issue(request: ComplaintRequest):
    if not request.text or len(request.text.strip()) == 0:
        return {
            "category": "OTHER",
            "priority": "LOW",
            "confidence": 0.0,
            "error": "Empty input"
        }

    # If ML model is loaded, use it
    if model and vectorizer:
        try:
            vec = vectorizer.transform([request.text])
            category = model.predict(vec)[0]
            # Use max probability as confidence
            confidence = float(model.predict_proba(vec).max())
            
            # Map category to priority
            priority_map = {
                "ROAD": "HIGH",
                "GARBAGE": "MEDIUM",
                "WATER": "HIGH",
                "CRIME": "CRITICAL",
                "OTHER": "LOW"
            }
            priority = priority_map.get(category, "MEDIUM")
            
            return {
                "category": category,
                "priority": priority,
                "confidence": confidence
            }
        except Exception as e:
            logger.error(f"ML classification failed, falling back to rules: {e}")

    # Fallback to rule-based
    category, priority, confidence = rule_based_classify(request.text)
    return {
        "category": category,
        "priority": priority,
        "confidence": confidence
    }

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "mode": "ML" if model else "Rule-based",
        "memory_friendly": True
    }

@app.get("/")
async def root():
    return {"message": "CivicSense Lightweight AI is running"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
