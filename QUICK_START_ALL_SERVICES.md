# CivicSense Platform - Quick Start (All Services)

## Prerequisites

- Node.js 16+ (for frontend)
- Python 3.8+ (for AI service)
- Java 17+ (for backend)
- MongoDB running locally or Atlas connection string ready

## Option 1: Run Everything Locally (3 Terminals)

### Terminal 1: Frontend (React/Vite)

```bash
cd civicshield-frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser

### Terminal 2: Backend (Spring Boot)

```bash
cd civicshieldbackend
mvn clean spring-boot:run
```

Waits for MongoDB to be ready, then starts on http://localhost:8080

### Terminal 3: AI Service (FastAPI)

```bash
cd ai-service
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

Loads models on first startup (~5-10 minutes), then ready on http://localhost:8000

---

## Option 2: Docker Compose (All Services)

```bash
# From root directory
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- AI Service: http://localhost:8000
- MongoDB: localhost:27017

---

## Option 3: Hybrid (Local Backend + Dockerized Services)

```bash
# Terminal 1: Frontend
cd civicshield-frontend
npm run dev

# Terminal 2: Docker (AI Service + MongoDB)
docker-compose up -d mongodb ai-service

# Terminal 3: Backend (local)
cd civicshieldbackend
mvn spring-boot:run
```

---

## Verify Services Are Running

Run this from any terminal to test all endpoints:

```bash
# Frontend
curl http://localhost:5173

# Backend health
curl http://localhost:8080/actuator/health

# AI Service health
curl http://localhost:8000/health

# Database check
curl http://localhost:8080/api/posts/feed -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Testing Workflow

### 1. Register a User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Response: `{ "id", "username", "token" }`

### 2. Create a Post with Image

```bash
curl -X POST http://localhost:8080/api/posts/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@path/to/image.jpg" \
  -F "content=There is a large pothole on Main Street"
```

Response includes: `{ category, severity, confidence, ... }`

### 3. View Feed

```bash
curl http://localhost:8080/api/posts/feed \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response: Array of posts with AI classifications

### 4. Submit Complaint

```bash
curl -X POST http://localhost:8080/api/complaints/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@path/to/image.jpg" \
  -F "latitude=28.6139" \
  -F "longitude=77.2090" \
  -F "zoneType=Hospital"
```

Response: `{ issueType, priority, tensionScore, ... }`

### 5. AI Service Test

```bash
python ai-service/test_comprehensive.py
```

Runs all endpoint tests automatically

---

## Common Ports Reference

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend (Spring) | 8080 | http://localhost:8080 |
| AI Service (FastAPI) | 8000 | http://localhost:8000 |
| MongoDB | 27017 | localhost:27017 |
| MongoDB UI (optional) | 8081 | http://localhost:8081 |

If any port is in use, update the configuration:
- Frontend: `vite.config.js`
- Backend: `application.properties`
- AI Service: `.env` file

---

## Environment Setup

### Backend (.env or application.properties)

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/civicsense
spring.data.mongodb.database=civicsense
jwt.secret=civicsense-super-secret-key-2024
jwt.expiration=86400000
file.upload.max-size=10485760
civicsense.ai-service-url=http://localhost:8000
```

### Frontend (.env.local)

```
VITE_API_URL=http://localhost:8080
VITE_AI_SERVICE_URL=http://localhost:8000
```

### AI Service (.env)

```
HOST=0.0.0.0
PORT=8000
LOG_LEVEL=info
CORS_ORIGINS=http://localhost:8080,http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/civicsense-ai
```

---

## Troubleshooting Quick Fixes

**Frontend won't start:**
```bash
# Clear node modules and reinstall
cd civicshield-frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Backend won't start:**
```bash
# Clear Spring Boot cache and rebuild
cd civicshieldbackend
mvn clean
mvn spring-boot:run
```

**AI Service models won't load:**
```bash
cd ai-service
# Remove venv and reinstall
rm -rf venv
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate
pip install --upgrade transformers torch
python app.py
```

**MongoDB connection failed:**
```bash
# Verify MongoDB is running
mongosh  # or mongo

# Or use Docker
docker run -d -p 27017:27017 -v mongodb_data:/data/db mongo:latest
```

**Port already in use:**
```bash
# On Windows
netstat -ano | findstr :PORT
taskkill /PID PID_NUMBER /F

# On macOS/Linux
lsof -i :PORT
kill -9 PID
```

---

## Performance Tips

1. **Use GPU for AI Service (faster inference):**
   ```bash
   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
   ```

2. **Database Indexing (Backend):**
   Backend automatically creates indexes on startup

3. **Frontend Optimization:**
   - Built-in lazy loading
   - Optimized bundle size (~250KB)

4. **Production Run (4 workers):**
   ```bash
   uvicorn ai-service/app:app --workers 4 --port 8000
   ```

---

## Next Steps

1. ✅ Start all three services
2. ✅ Create a test account
3. ✅ Upload a complaint image
4. ✅ Verify AI classification works
5. ✅ Check area scores update
6. ✅ View posts in feed

## Logs Location

- **Frontend:** Console in browser DevTools
- **Backend:** `target/logs/` or console output
- **AI Service:** Console output
- **Database:** Docker logs

## Support

- Check service health: `curl http://localhost:SERVICE_PORT/health`
- View logs: `docker-compose logs SERVICE_NAME`
- Run tests: `python test_comprehensive.py` (AI Service)

---

**Happy coding! 🚀**
