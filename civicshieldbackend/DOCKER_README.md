# CivicShield Docker Deployment Guide

Complete guide to running the entire CivicShield stack with Docker Compose.

---

## 📋 Prerequisites

- **Docker**: [Install Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Docker Compose**: Included with Docker Desktop
- **Git**: For cloning the repository

**Minimum Resources:**
- CPU: 2 cores
- RAM: 4GB
- Disk: 10GB

---

## 🚀 Quick Start (3 steps)

### Step 1: Navigate to Project Root
```bash
cd civicshield
```

### Step 2: Build All Services
```bash
docker-compose build
```

### Step 3: Start All Services
```bash
docker-compose up -d
```

**That's it!** All services will start automatically.

---

## 🌐 Access the Application

Once all services are running:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:5173 | Main web application |
| **Backend API** | http://localhost:8080 | REST API endpoints |
| **AI Service** | http://localhost:5000 | Image analysis API |
| **MongoDB** | localhost:27017 | Database (internal only) |

### Test Services

```bash
# Test Frontend
curl http://localhost:5173

# Test Backend
curl http://localhost:8080/health
# Should return: {"status":"ok"}

# Test AI Service
curl http://localhost:5000/health
# Should return: {"status":"ok"}

# Test MongoDB
docker exec civicshield-mongodb mongosh -u admin -p civicshield123 admin --eval "db.adminCommand('ping')"
# Should return: { ok: 1 }
```

---

## 📊 Service Stack

### Container Architecture

```
┌─────────────────────────────────────────┐
│      React Frontend (Node.js)           │
│      Port: 5173 (accessible)            │
└──────────────┬──────────────────────────┘
               │ HTTP requests
               ↓
┌─────────────────────────────────────────┐
│     Spring Boot Backend (Java)          │
│     Port: 8080 (accessible)             │
│     - REST API                          │
│     - Handles complaints                │
│     - Manages upvotes/leaderboard       │
└──────────────┬──────────────────────────┘
         │             │
   API calls     Service calls
         │             │
    ┌────↓───┐   ┌────↓──────────────┐
    │         │   │                   │
    ↓         ↓   ↓                   ↓
┌────────┐ ┌───────────┐ ┌─────────────────────┐
│MongoDB │ │ FastAPI   │ │                     │
│(DB)    │ │ (Python)  │ │ (Services linked)   │
│Port    │ │ Port 5000 │ │                     │
│27017   │ │ (internal)│ │                     │
└────────┘ └───────────┘ └─────────────────────┘
```

### Service Details

#### 1. **MongoDB** (`mongodb`)
- **Image**: mongo:6
- **Port**: 27017 (localhost:27017)
- **Status**: Creates DB on startup with seeded complaints
- **Credentials**: 
  - Username: `admin`
  - Password: `civicshield123`
- **Database**: `civicshield`
- **Health**: Checks ping every 10s

#### 2. **AI Service** (`ai-service`)
- **Framework**: FastAPI (Python)
- **Port**: 5000 (localhost:5000)
- **Purpose**: Image classification, tension scoring, priority calculation
- **Endpoints**:
  - `POST /analyze` - Analyze uploaded image
  - `GET /health` - Health check
- **Health**: Checks `/health` endpoint every 10s
- **Dependencies**: None (starts independently)

#### 3. **Backend** (`backend`)
- **Framework**: Spring Boot 3 (Java)
- **Port**: 8080 (localhost:8080)
- **Purpose**: Main API, complaint management, database
- **Endpoints**:
  - `GET /api/complaints` - List complaints
  - `POST /api/complaints` - Create complaint
  - `GET /health` - Health check
  - Full CRUD operations
- **Health**: Checks `/health` endpoint every 10s
- **Dependencies**: MongoDB (healthy), AI Service (healthy)
- **Environment**:
  - MongoDB URI: `mongodb://admin:civicshield123@mongodb:27017/civicshield`
  - AI Service URL: `http://ai-service:5000`

#### 4. **Frontend** (`frontend`)
- **Framework**: React 18 + Vite
- **Port**: 5173 (localhost:5173)
- **Purpose**: User interface, 3D globe, social feed
- **Build**: Optimized production build using `serve`
- **Dependencies**: Backend (healthy)
- **Environment**:
  - API URL: `http://localhost:8080`
  - AI Service URL: `http://localhost:5000`

---

## 🔧 Common Commands

### View All Running Services
```bash
docker-compose ps
```

### View Live Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f ai-service
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Stop All Services
```bash
docker-compose down
```

### Stop and Remove Volumes (Clean everything)
```bash
docker-compose down -v
```

### Rebuild After Code Changes
```bash
# Rebuild specific service
docker-compose up --build backend

# Rebuild all
docker-compose up --build
```

### Restart a Service
```bash
docker-compose restart backend
```

### Access Container Shell
```bash
# Backend
docker exec -it civicshield-backend bash

# Frontend
docker exec -it civicshield-frontend sh

# MongoDB
docker exec -it civicshield-mongodb mongosh -u admin -p civicshield123
```

---

## 🐛 Troubleshooting

### Issue: Services Won't Start

**Symptom**: Docker returns build errors

**Solution**:
```bash
# Clean and rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Issue: Port Already in Use

**Symptom**: Error like "Address already in use :5173"

**Solution**:
```bash
# Find what's using the port
lsof -i :5173  # macOS/Linux
netstat -ano | findstr :5173  # Windows

# Kill the process or change docker-compose port mapping
# Edit docker-compose.yml and change port mapping:
# ports:
#   - "5174:5173"  # Use 5174 instead
```

### Issue: Frontend Can't Connect to Backend

**Symptom**: Frontend shows "Failed to load complaints"

**Solution**:
```bash
# Check if backend is running
curl http://localhost:8080/health

# Check logs
docker-compose logs backend

# Verify environment variables
docker inspect civicshield-frontend | grep -A 20 "Env"
```

### Issue: MongoDB Connection Failed

**Symptom**: Backend logs show "Connection refused"

**Solution**:
```bash
# Check MongoDB is running and healthy
docker-compose ps mongodb

# Wait for health check to pass
docker-compose logs mongodb

# Test connection from backend container
docker exec civicshield-backend curl http://mongodb:27017
```

### Issue: AI Service Not Responding

**Symptom**: Image upload fails with "AI Service unavailable"

**Solution**:
```bash
# Check if AI service is running
curl http://localhost:5000/health

# Check logs
docker-compose logs ai-service

# Restart service
docker-compose restart ai-service
```

---

## 📊 Performance Optimization

### Increase Memory Limits

Edit `docker-compose.yml`:

```yaml
services:
  backend:
    environment:
      JAVA_OPTS: "-Xmx1024m -Xms512m"  # Increase from 512m

  frontend:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

### Enable Caching

```bash
# Use cache for faster rebuilds
docker-compose build --build-arg BUILDKIT_INLINE_CACHE=1
```

---

## 🔐 Security for Production

### Change Default Credentials

Edit `.env` file (create if doesn't exist):
```env
MONGO_ADMIN_USER=admin
MONGO_ADMIN_PASSWORD=your_secure_password_here
SPRING_DATA_MONGODB_PASSWORD=your_secure_password_here
```

### Enable HTTPS

Use Caddy or Nginx reverse proxy in front of the services.

### Network Isolation

Change `civicshield_network` to internal mode:
```yaml
networks:
  civicshield_network:
    driver: bridge
    driver_opts:
      com.docker.network.driver.mtu: 1450
    ipam:
      config:
        - subnet: 172.25.0.0/16
```

---

## 📈 Scaling Considerations

### Run Multiple Instances

```bash
# Scale backend to 3 instances
docker-compose up --scale backend=3 -d

# Use Docker load balancer (nginx-proxy) to distribute
```

### Persistent Storage

Volumes are already configured and will persist data. Verify:
```bash
docker volume ls
```

---

## 🔄 Development Workflow

### Development Mode (with hot-reload)

For development, avoid using docker-compose and run services locally:

```bash
# Terminal 1: MongoDB
docker run -d -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=civicshield123 \
  mongo:6

# Terminal 2: Backend
cd civicshield-backend
mvn spring-boot:run

# Terminal 3: AI Service
cd ai-service
python -m uvicorn app:app --reload --host 0.0.0.0 --port 5000

# Terminal 4: Frontend
cd civicshield-frontend
npm run dev
```

### Production Mode (docker-compose)

Once stable, use docker-compose for production:
```bash
docker-compose up -d
```

---

## 📋 Pre-flight Checklist

Before deploying:

- [ ] All Dockerfiles exist and are valid
- [ ] `docker-compose.yml` is in project root
- [ ] `.env` file has secure credentials (in production)
- [ ] No hardcoded passwords in code
- [ ] API endpoints are accessible
- [ ] Health checks pass
- [ ] Volumes mount correctly
- [ ] Network connectivity works between containers
- [ ] Logs show no errors
- [ ] Database seeded with 12 sample complaints
- [ ] Frontend loads without CORS errors

---

## 🎯 Testing the Full Stack

### 1. Test Frontend Loads
```bash
curl http://localhost:5173
# Should return HTML of React app
```

### 2. Test Backend API
```bash
curl http://localhost:8080/api/complaints
# Should return JSON array of complaints
```

### 3. Test AI Service
```bash
curl http://localhost:5000/health
# Should return {"status":"ok"}
```

### 4. Test Database
```bash
docker exec civicshield-mongodb mongosh -u admin -p civicshield123 civicshield --eval "db.complaint.countDocuments()"
# Should return: 12 (number of seeded complaints)
```

### 5. Test Integration
1. Open http://localhost:5173 in browser
2. View 3D globe with complaint pins
3. Upload a new complaint
4. See it appear in feed and globe

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Code committed to git
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] HTTPS certificates ready
- [ ] Domain configured

### Deployment
- [ ] Build images: `docker-compose build`
- [ ] Test locally: `docker-compose up`
- [ ] Push to registry: `docker push image:tag`
- [ ] Deploy on server: `docker-compose up -d`
- [ ] Verify all services: `docker-compose ps`
- [ ] Check health endpoints
- [ ] Monitor logs: `docker-compose logs -f`

### Post-deployment
- [ ] Test all features work
- [ ] Database contains seed data
- [ ] Backups automated
- [ ] Monitoring configured
- [ ] Alerts setup

---

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Spring Boot Docker](https://spring.io/guides/gs/spring-boot-docker/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

---

## 🆘 Support

### Debug Information

Collect this for support requests:
```bash
# Save all logs
docker-compose logs > civicshield-logs.txt

# Save system info
docker --version
docker-compose --version
docker system info

# Save currently running services
docker-compose ps > services.txt
```

### Check Specific Service
```bash
# Is MongoDB running?
docker-compose ps mongodb

# Is connection possible?
docker exec civicshield-backend \
  curl http://mongodb:27017

# View real-time logs
docker-compose logs -f [service-name]
```

---

## ✅ Success Criteria

Your deployment is successful when:
- ✅ All 4 containers show "Up" status
- ✅ Frontend accessible at http://localhost:5173
- ✅ Backend health check passes: `/health` returns `{"status":"ok"}`
- ✅ AI service health check passes: `/health` returns `{"status":"ok"}`
- ✅ MongoDB has 12 seeded complaints
- ✅ Frontend loads 3D globe with pins
- ✅ Can submit new complaint
- ✅ Can upvote complaints
- ✅ Admin panel accessible
- ✅ Leaderboard shows zone rankings

---

## 🎉 You're Live!

**CivicShield is now running in Docker!**

Visit: http://localhost:5173

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Status**: Production Ready

For other setup instructions, see:
- [Frontend README](./civicshield-frontend/README.md)
- [Backend README](./civicshield-backend/README.md)
- [AI Service README](./ai-service/README.md)
