# CivicSense AI Service - Quick Start Guide

Get the AI service up and running in 5 minutes!

## Prerequisites

- Python 3.8+
- pip
- ~4GB free memory (for model loading)

## Installation & Setup

### 1. Create Virtual Environment (Recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

**First run will download models (~1GB total):**
- CLIP model (openai/clip-vit-base-patch32) - ~350MB
- BART zero-shot classification - ~1.6GB
- These are one-time downloads, cached locally

This happens automatically on service startup.

### 3. Configure Environment (Optional)

Create or edit `.env` file:

```env
HOST=0.0.0.0
PORT=8000
LOG_LEVEL=info
CORS_ORIGINS=http://localhost:8080,http://localhost:5173
```

### 4. Run the Service

**Option A: Direct Run**
```bash
python app.py
```

**Option B: Using Startup Script**
```bash
# Windows
start.bat

# macOS/Linux
bash start.sh
```

**Option C: Using Uvicorn (with reload)**
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

**Option D: Production Run (4 workers)**
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

## Verify Service is Running

### Health Check
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "CivicSense AI",
  "models": ["clip", "bart"]
}
```

### View Interactive Docs
```
http://localhost:8080/docs
```

## Main Endpoints

### 1. Classify Post (POST /classify)
Classifies text content with optional image.

```bash
curl -X POST "http://localhost:8000/classify" \
  -F "content=There is a large pothole on Main Street" \
  -F "image=@pothole.jpg"
```

Response:
```json
{
  "category": "POTHOLE",
  "severity": "MEDIUM",
  "confidence": 0.85,
  "civicImpactScore": 36.12,
  "tags": ["Pothole", "Road", "Traffic"]
}
```

### 2. Analyze Complaint (POST /analyze)
Analyzes complaint with location and priority scoring.

```bash
curl -X POST "http://localhost:8000/analyze" \
  -F "image=@complaint.jpg" \
  -F "latitude=28.6139" \
  -F "longitude=77.2090" \
  -F "zoneType=Hospital"
```

Response:
```json
{
  "issueType": "WATER",
  "priority": "HIGH",
  "tensionScore": 72.5,
  "confidence": 0.88
}
```

### 3. Get Tension Score (GET /tension/{state})
Gets geopolitical tension index for a state.

```bash
curl "http://localhost:8000/tension/Uttar%20Pradesh"
```

Response:
```json
{
  "state": "Uttar Pradesh",
  "tensionScore": 75.0
}
```

### 4. Health Check (GET /health)
```bash
curl "http://localhost:8000/health"
```

## Model Loading Details

The service uses:
- **CLIP** (openai/clip-vit-base-patch32) - Image classification via zero-shot learning
- **BART** (facebook/bart-large-mnli) - Text classification via zero-shot learning

On first request, models are:
1. Downloaded from HuggingFace (~1GB)
2. Loaded into GPU/CPU memory
3. Ready for inference

Subsequent requests reuse loaded models (fast).

### GPU Support (Optional)

For faster inference, install CUDA support:

```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

The service automatically detects and uses GPU if available.

## Troubleshooting

### Issue: "Model loading takes too long"
**Solution:** Models are downloaded on first startup. Patience! This is normal (~5-10 minutes).
- Check internet connection
- Verify disk space (need ~2GB)
- Check HuggingFace is not rate-limiting

### Issue: "CLIP/BART failed to load"
**Solution:** Service falls back to rule-based classifiers
- Check logs for specific error messages
- Verify Python 3.8+ and transformers library
- Try: `pip install --upgrade transformers`

### Issue: "Out of memory"
**Solution:** 
- Close other applications
- Ensure 4GB+ free RAM
- Try CPU-only inference (automatic fallback)

### Issue: "Image upload fails"
**Solution:**
- Verify image format (jpg, png supported)
- Check image size < 10MB (configured)
- Ensure Content-Type is multipart/form-data

## Integration with Backend

The Spring Boot backend calls these endpoints:

```
POST http://localhost:8000/classify (when creating posts)
POST http://localhost:8000/analyze (when analyzing complaints)
GET http://localhost:8000/tension/{state} (for area scoring)
```

The backend uses RestTemplate to make HTTP calls.

## Performance Metrics

Typical response times (with GPU):
- Image classification: 50-100ms
- Text classification: 30-50ms
- Priority scoring: 10-20ms

Total end-to-end: 100-200ms per request

## Next Steps

1. ✓ Service is running
2. Test endpoints with provided examples
3. Connect Spring Boot backend
4. Connect React frontend
5. Deploy to production

For detailed architecture, see [ARCHITECTURE.md](ARCHITECTURE.md)
```

Service will start on **http://localhost:5000**

### 4. Verify Service is Running

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "CivicShield AI Service"
}
```

## Test the API

### Option 1: Using Python Test Script

```bash
python test_api.py
```

This runs comprehensive tests including:
- Health check
- Image classification
- All zone types
- Priority distribution

### Option 2: Manual API Test

**Using cURL:**
```bash
curl -X POST http://localhost:5000/analyze \
  -F "image=@path/to/image.jpg" \
  -F "latitude=28.5244" \
  -F "longitude=77.3958" \
  -F "zoneType=Residential"
```

**Using Python:**
```python
import requests

files = {'image': open('image.jpg', 'rb')}
data = {
    'latitude': 28.5244,
    'longitude': 77.3958,
    'zoneType': 'Residential'
}

response = requests.post('http://localhost:5000/analyze', files=files, data=data)
print(response.json())
```

**Using Postman:**
1. Create new POST request to `http://localhost:5000/analyze`
2. Go to Body tab → form-data
3. Add fields:
   - `image` (file): Select image file
   - `latitude` (text): 28.5244
   - `longitude` (text): 77.3958
   - `zoneType` (text): Residential
4. Send request

### Example Response

```json
{
  "issueType": "Pothole",
  "confidence": 0.92,
  "tensionScore": 62.5,
  "priority": "HIGH"
}
```

## API Documentation

### Interactive Docs (FastAPI Swagger UI)

Visit: **http://localhost:5000/docs**

This provides:
- All available endpoints
- Parameter descriptions
- Try it out functionality
- Request/response examples

## Supported Zone Types

- Hospital
- Emergency
- School
- Market
- Residential
- Commercial

## Issue Types Recognized

1. Pothole
2. Garbage
3. Water Leak
4. Broken Light
5. Road Damage
6. Flooding

## Docker Setup (Optional)

### Build Image
```bash
docker build -t civicshield-ai .
```

### Run Container
```bash
docker run -p 5000:5000 civicshield-ai
```

### Or use Docker Compose
```bash
docker-compose up
```

This starts MongoDB (27017), AI Service (5000), and Backend (8080) together.

## Integration with CivicShield Backend

The Spring Boot backend calls this service at:
```
POST http://localhost:5000/analyze
```

Make sure:
1. AI Service is running on port 5000
2. Backend config has: `ai.service.url=http://localhost:5000`
3. Both services are on the same network (if using Docker)

## Troubleshooting

### Issue: Port 5000 already in use

```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or use different port
python app.py --port 5001
```

### Issue: Model download fails

```bash
# Pre-download the model manually
python -c "import open_clip; model, _, preprocess = open_clip.create_model_and_transforms('ViT-B-32', pretrained='openai')"
```

### Issue: Out of memory

The ViT-B-32 model uses ~1GB RAM. If you have limited memory:
- Close other applications
- Use a lighter model (requires code changes)
- Deploy on machine with more RAM

### Issue: Slow classification

- First request loads the model (~3-5 seconds)
- Subsequent requests are fast (~0.3-0.8 seconds)
- This is normal behavior

## Next Steps

1. **Integrate with Frontend**: Update CORS origins in `app.py`
2. **Add Authentication**: Implement API keys or JWT tokens
3. **Deploy to Production**: Use Docker + Cloud platform (AWS, GCP, Azure)
4. **Monitor Performance**: Set up logging and APM

## File Structure

```
ai-service/
├── app.py                    # Main FastAPI application
├── image_classifier.py       # Image classification logic
├── geo_pipeline.py          # Tension score calculation
├── priority_model.py        # Priority scoring
├── config.py                # Configuration management
├── utils.py                 # Utility functions
├── requirements.txt         # Python dependencies
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
├── test_api.py            # API test script
├── start.sh               # Linux/macOS startup script
├── start.bat              # Windows startup script
├── .env.example           # Environment variables example
├── README.md              # Full documentation
└── QUICKSTART.md          # This file
```

## Support & Documentation

- Full docs: See `README.md`
- API docs: http://localhost:5000/docs
- Test script: `python test_api.py`

---

**Happy analyzing! 🚀**
