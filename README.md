# 🛡️ CivicSense (CivicShield)

CivicSense is a modern, AI-powered civic issue reporting and monitoring platform. It empowers citizens to report local infrastructure, safety, and environmental issues, while leveraging artificial intelligence to automatically classify, prioritize, and route reports to the appropriate authorities.

## 🌟 Key Features

- **📱 Modern User Interface**: An intuitive, Instagram-inspired feed and profile system built with React and Tailwind CSS.
- **🤖 AI-Powered Triage**: Automatically classifies images and text (e.g., potholes, water leaks, safety hazards) and assigns a civic impact score using a specialized FastAPI microservice.
- **🗺️ Geopolitical Alerts**: Real-time tension scoring and alert routing based on incident location.
- **🔒 Robust Backend**: A scalable Spring Boot backend managing user authentication, posts, comments, upvotes, and area health scoring.
- **🎖️ Gamification**: Users earn "Civic Points" and unlock badges for contributing to community safety and cleanliness.

## 🏗️ Architecture

The project is structured as a microservices architecture:

1. **Frontend (`civicSense/`)**: React.js, Vite, Tailwind CSS, Framer Motion
2. **Backend (`civicshieldbackend/`)**: Java, Spring Boot, Spring Security (JWT), MongoDB
3. **AI Service (`ai-service/`)**: Python, FastAPI, HuggingFace (CLIP & DistilBERT), LightGBM

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java 17+
- Python 3.9+
- MongoDB

### 1. Start the Backend (Spring Boot)
```bash
cd civicshieldbackend
./mvnw spring-boot:run
```

### 2. Start the AI Service (FastAPI)
```bash
cd ai-service
pip install -r requirements.txt
python app.py
```

### 3. Start the Frontend (React)
```bash
cd civicSense
npm install
npm run dev
```

## 🌐 Environment Variables

Make sure to configure your environment variables.
Frontend (`civicSense/.env`):
```env
VITE_API_URL=http://localhost:8080
VITE_AI_SERVICE_URL=http://localhost:8000
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
