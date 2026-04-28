# CivicShield - Deployment Guide

Complete guide to deploy CivicShield frontend, backend, and AI service to production.

---

## 🎯 Deployment Overview

Three deployment strategies from simple to enterprise:

| Strategy | Cost | Setup Time | Scalability | Best For |
|----------|------|-----------|-------------|----------|
| **Vercel + Railway** | $0-20/mo | 15 min | Medium | Startups |
| **AWS + Heroku** | $20-100/mo | 30 min | High | Growing apps |
| **Kubernetes + Cloud** | $50-500/mo | 1-2 hours | Very High | Enterprise |

---

## 📋 Prerequisites

- [ ] GitHub repository with all code pushed
- [ ] Backend Spring Boot built successfully
- [ ] Frontend builds without errors
- [ ] AI service tested and working
- [ ] MongoDB database ready (Atlas or self-hosted)
- [ ] All configuration files updated

---

## 🚀 Strategy 1: Vercel + Railway (Recommended for Beginners)

### Phase 1: Prepare Repositories

#### Step 1.1: Create GitHub Repositories
```bash
# Frontend
gh repo create civicshield-frontend --public

# Backend  
gh repo create civicshield-backend --public

# AI Service
gh repo create civicshield-ai --public
```

#### Step 1.2: Push Code to GitHub
```bash
# Frontend
cd civicshield-frontend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/civicshield-frontend.git
git push -u origin main

# Repeat for backend and AI service
```

### Phase 2: Deploy Frontend to Vercel

#### Step 2.1: Sign Up to Vercel
- Visit https://vercel.com
- Click "Sign Up"
- Connect GitHub

#### Step 2.2: Import Frontend Project
1. Click "New Project"
2. Select "civicshield-frontend" repository
3. Framework: React
4. Environment Variables:
   - `VITE_API_URL`: `https://civicshield-api.railway.app`
   - `VITE_AI_SERVICE_URL`: `https://civicshield-ai.railway.app`
5. Click "Deploy"

**Result**: Frontend deployed to `civicshield-frontend.vercel.app`

### Phase 3: Deploy Backend to Railway

#### Step 3.1: Sign Up to Railway
- Visit https://railway.app
- Click "Login"
- Connect GitHub

#### Step 3.2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub"
3. Select "civicshield-backend"
4. Configure:
   - **Runtime**: Java
   - **Build**: Maven (auto-detected)
   - Environment Variables:
     - `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/civicshield`
     - `CORS_ALLOWED_ORIGINS=https://civicshield-frontend.vercel.app`
5. Click "Deploy"

**Result**: Backend deployed to `civicshield-api.railway.app`

#### Step 3.3: Generate Domain
1. On Railway project page
2. Click "Settings"
3. Under "Domains" click "Generate Domain"
4. Note the domain: `civicshield-api.railway.app`

### Phase 4: Deploy AI Service to Railway

#### Step 4.1: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub"
3. Select "civicshield-ai"
4. Configure:
   - **Runtime**: Python
   - **Build**: pip install (auto-detected)
   - Environment Variables:
     - `PORT=5000`
     - `ENVIRONMENT=production`
5. Click "Deploy"

**Result**: AI Service deployed to `civicshield-ai.railway.app`

### Phase 5: Setup MongoDB Atlas

#### Step 5.1: Create Atlas Cluster
1. Visit https://www.mongodb.com/cloud/atlas
2. Create account
3. Click "Build a Cluster"
4. Choose "Free" tier
5. Select region closest to your users
6. Create cluster

#### Step 5.2: Get Connection String
1. Click "Connect"
2. Select "Connect your application"
3. Copy connection string
4. Replace `<username>` and `<password>`

Example:
```
mongodb+srv://admin:password123@civicshield.mongodb.net/civicshield?retryWrites=true&w=majority
```

#### Step 5.3: Add to Backend Environment
On Railway backend project:
```
MONGODB_URI=mongodb+srv://admin:password123@civicshield.mongodb.net/civicshield?retryWrites=true&w=majority
```

### Phase 6: Verify Deployment

```bash
# Test Frontend
curl https://civicshield-frontend.vercel.app

# Test Backend
curl https://civicshield-api.railway.app/api/complaints

# Test AI Service
curl https://civicshield-ai.railway.app/health
```

---

## 🏗️ Strategy 2: AWS + Docker

### Phase 1: Create AWS Infrastructure

#### Step 1.1: Create EC2 Instance
```bash
# AWS Console → EC2 → Instances → Launch Instance
# AMI: Ubuntu 22.04 LTS
# Instance type: t3.medium (suitable for all services)
# Storage: 30GB
# Security Group: Allow ports 80, 443, 5173, 8080, 5000
```

#### Step 1.2: Connect to Instance
```bash
# SSH into instance
ssh -i civicshield.pem ubuntu@YOUR_EC2_IP

# Update system
sudo apt update
sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Phase 2: Create Docker Compose

Create `docker-compose.yml` at project root:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secure_password
    volumes:
      - mongodb_data:/data/db
    networks:
      - civicshield_network

  ai-service:
    build:
      context: ./ai-service
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      PORT: 5000
      ENVIRONMENT: production
    networks:
      - civicshield_network
    depends_on:
      - mongodb

  backend:
    build:
      context: ./civicshield-backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      MONGODB_URI: mongodb://admin:secure_password@mongodb:27017/civicshield
      SPRING_DATA_MONGODB_DATABASE: civicshield
      CORS_ALLOWED_ORIGINS: http://localhost:5173,https://civicshield.example.com
    networks:
      - civicshield_network
    depends_on:
      - mongodb
      - ai-service

  frontend:
    build:
      context: ./civicshield-frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: http://backend:8080
        VITE_AI_SERVICE_URL: http://ai-service:5000
    ports:
      - "5173:5173"
    networks:
      - civicshield_network
    depends_on:
      - backend

volumes:
  mongodb_data:

networks:
  civicshield_network:
    driver: bridge
```

### Phase 3: Create Dockerfiles

#### Backend Dockerfile: `civicshield-backend/Dockerfile`
```dockerfile
FROM maven:3.8.1-openjdk-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17-slim
WORKDIR /app
COPY --from=builder /app/target/civicshield-backend-1.0.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

#### Frontend Dockerfile: `civicshield-frontend/Dockerfile`
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_URL
ARG VITE_AI_SERVICE_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AI_SERVICE_URL=$VITE_AI_SERVICE_URL
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### AI Service Dockerfile: `ai-service/Dockerfile`
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
```

### Phase 4: Deploy to EC2

```bash
# SSH into instance
ssh -i civicshield.pem ubuntu@YOUR_EC2_IP

# Clone repository
git clone https://github.com/YOUR_USERNAME/civicshield.git
cd civicshield

# Build and start all services
docker-compose up -d

# Verify services
docker-compose ps

# View logs
docker-compose logs -f backend
```

---

## ☸️ Strategy 3: Kubernetes (Enterprise)

### Phase 1: Setup Kubernetes Cluster

```bash
# Option 1: Google Cloud (GKE)
gcloud container clusters create civicshield \
  --num-nodes=3 \
  --machine-type=n1-standard-2 \
  --region=us-central1

# Option 2: AWS (EKS)
eksctl create cluster --name civicshield --region us-east-1

# Option 3: Azure (AKS)
az aks create --resource-group civicshield --name civicshield
```

### Phase 2: Create Kubernetes Manifests

#### MongoDB Deployment: `k8s/mongodb-deployment.yaml`
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mongodb-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo:latest
        ports:
        - containerPort: 27017
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: username
        - name: MONGO_INITDB_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: password
        volumeMounts:
        - name: mongodb-storage
          mountPath: /data/db
      volumes:
      - name: mongodb-storage
        persistentVolumeClaim:
          claimName: mongodb-pvc

---
apiVersion: v1
kind: Service
metadata:
  name: mongodb-service
spec:
  selector:
    app: mongodb
  ports:
  - port: 27017
    targetPort: 27017
  type: ClusterIP
```

#### Backend Deployment: `k8s/backend-deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: YOUR_DOCKER_REGISTRY/civicshield-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: backend-secret
              key: mongodb_uri
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
  - port: 8080
    targetPort: 8080
  type: LoadBalancer
```

#### Frontend Deployment: `k8s/frontend-deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: YOUR_DOCKER_REGISTRY/civicshield-frontend:latest
        ports:
        - containerPort: 80
        env:
        - name: VITE_API_URL
          value: "https://api.civicshield.com"

---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

### Phase 3: Deploy to Kubernetes

```bash
# Create secrets
kubectl create secret generic mongodb-secret \
  --from-literal=username=admin \
  --from-literal=password=secure_password

kubectl create secret generic backend-secret \
  --from-literal=mongodb_uri=mongodb://admin:secure_password@mongodb-service:27017/civicshield

# Deploy services
kubectl apply -f k8s/

# Verify deployment
kubectl get pods
kubectl get services

# View logs
kubectl logs -f deployment/backend
```

---

## 📦 Production Checklist

### Before Deployment
- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] SSL certificates ready
- [ ] Domain name configured
- [ ] CORS settings updated
- [ ] Security headers added
- [ ] Rate limiting configured
- [ ] Monitoring setup

### Post-Deployment
- [ ] All services respond to health checks
- [ ] Frontend loads without errors
- [ ] Can create new complaints
- [ ] Can upvote complaints
- [ ] Admin panel accessible
- [ ] Leaderboard displays correct data
- [ ] Email notifications working
- [ ] Logs being collected
- [ ] Performance metrics normal
- [ ] Backups automated

---

## 🔒 Security Configuration

### HTTPS / SSL
```bash
# Using Let's Encrypt (free)
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d civicshield.com -d www.civicshield.com

# Add to nginx config
ssl_certificate /etc/letsencrypt/live/civicshield.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/civicshield.com/privkey.pem;
```

### Environment Variables
```bash
# Create secrets in production
export MONGODB_URI="mongodb+srv://..."
export JWT_SECRET="your-secret-key"
export API_KEY="your-api-key"
```

### Database Backups
```bash
# Automated daily backup
0 2 * * * mongodump --uri "mongodb+srv://..." --out "/backups/$(date +%Y%m%d)"
```

---

## 📊 Monitoring & Logging

### Application Monitoring
```yaml
# docker-compose.yml with monitoring
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
```

### Log Aggregation
```bash
# View logs from all containers
docker-compose logs -f

# Save logs to file
docker-compose logs > logs.txt

# Stream specific service
docker-compose logs -f backend
```

---

## 💰 Cost Optimization

### Reduce Costs
1. Use free tier services where appropriate
2. Set up auto-scaling
3. Use CDN for static assets
4. Use database clusters instead of dedicated servers
5. Schedule non-critical processes
6. Use spot instances for non-critical workloads

### Estimated Monthly Costs

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Frontend (Vercel) | $0-20 | $20-100 |
| Backend (Railway) | $5 | $20-50 |
| Database (Atlas) | $0 | $50-200 |
| CDN (Cloudflare) | $20 | $200+ |
| **Total** | **$0-20** | **$100-500** |

---

## 🚨 Troubleshooting

### Deployment Issues

#### Build Failed
```bash
# Check build logs
docker build --no-cache -t civicshield-backend:latest .

# Check for missing dependencies
mvn dependency:tree
```

#### Container Won't Start
```bash
# Check container logs
docker logs container_id

# Inspect container
docker inspect container_id

# Test connection
docker exec container_id curl localhost:8080/health
```

#### Database Connection Failed
```bash
# Test MongoDB connection
mongosh "mongodb+srv://admin:password@cluster.mongodb.net/civicshield"

# Check connection string format
# Should be: mongodb+srv://user:pass@host/database
```

---

## 🔄 Continuous Deployment (CI/CD)

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and deploy frontend
        run: |
          cd civicshield-frontend
          npm install
          npm run build
          # Deploy to Vercel
          
      - name: Build and deploy backend
        run: |
          cd civicshield-backend
          mvn clean package
          # Deploy to Railway
          
      - name: Build and deploy AI
        run: |
          cd ai-service
          docker build -t civicshield-ai:${{ github.sha }} .
          # Push to Docker Hub / ECR
```

---

## 📈 Scaling Strategy

### Phase 1 (Current - < 10k users)
- Single instance per service
- Shared database
- No caching

### Phase 2 (10k-100k users)
- Load balancer
- 2-3 instances per service
- Redis caching
- CDN for static assets

### Phase 3 (100k+ users)
- Auto-scaling groups
- Database replication
- Message queues
- Microservices architecture

---

## 🎓 Training & Handoff

### Deployment Documentation
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Setup monitoring dashboards
- [ ] Create incident response procedures
- [ ] Establish backup/restore procedures

### Team Training
- [ ] Train team on deployment process
- [ ] Preps for scaling
- [ ] Monitoring and logging training
- [ ] Disaster recovery procedures

---

## 📞 Support

### Common Questions

**Q: How do I update the code after deployment?**
A: 
1. Make changes locally
2. Push to GitHub
3. GitHub Actions automatically deploys
4. Or manually trigger deployment

**Q: How do I rollback if something goes wrong?**
A:
- Vercel: Click previous deployment
- Railway: Rollback in dashboard
- Docker: Pull previous image tag

**Q: How do I monitor performance?**
A:
- Vercel Analytics
- Railway Metrics
- Custom monitoring with Prometheus/Grafana

---

**Version**: 1.0.0  
**Status**: Ready for Deployment  
**Last Updated**: January 2024

---

### Quick Links
- [Frontend README](./civicshield-frontend/README.md)
- [Backend README](./civicshield-backend/README.md)
- [AI Service README](./ai-service/README.md)
- [Integration Guide](./civicshield-frontend/INTEGRATION_GUIDE.md)

**Ready to go live!** 🚀
