# CivicShield Backend

A Spring Boot 3.x REST API backend for the CivicShield platform - an AI-powered system for early detection and management of civic infrastructure issues.

## Project Overview

CivicShield is a community-driven platform that allows citizens to report civic issues (potholes, garbage, water leaks, broken lights, etc.) with images and location data. The system uses AI to classify issues, calculate tension scores based on zone type, and enables community engagement through upvoting and leaderboards.

## Tech Stack

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: MongoDB
- **Build Tool**: Maven
- **ORM**: Spring Data MongoDB
- **Validation**: Spring Boot Validation
- **Productivity**: Lombok

## Project Structure

```
civicshield-backend/
├── src/main/java/com/civicshield/
│   ├── CivicShieldApplication.java          # Main application entry point
│   ├── controller/
│   │   ├── ComplaintController.java          # REST endpoints for complaints
│   │   ├── AdminController.java              # Admin management endpoints
│   │   └── SocialController.java             # Social features endpoints
│   ├── entity/
│   │   └── Complaint.java                    # MongoDB Complaint document
│   ├── dto/
│   │   └── AiAnalysisResult.java             # DTO for AI service response
│   ├── repository/
│   │   └── ComplaintRepository.java          # MongoDB repository
│   ├── service/
│   │   ├── AiService.java                    # AI analysis service
│   │   └── ComplaintService.java             # Business logic for complaints
│   ├── seeder/
│   │   └── DataSeeder.java                   # Sample data initialization
│   ├── exception/
│   │   └── GlobalExceptionHandler.java       # Centralized error handling
│   └── config/
│       └── RestTemplateConfig.java           # RestTemplate configuration
├── src/main/resources/
│   └── application.properties                # Application configuration
├── pom.xml                                   # Maven dependencies
└── README.md                                 # This file
```

## Prerequisites

- Java 17 or higher
- Maven 3.8.0 or higher
- MongoDB (local or remote)
- Docker (optional, for MongoDB containerization)

## Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/civicshield-backend.git
cd civicshield-backend
```

### 2. Configure MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running locally on port 27017
mongod
```

**Option B: Docker MongoDB**
```bash
docker run -d -p 27017:27017 --name civicshield-mongo mongo:latest
```

**Option C: MongoDB Atlas (Cloud)**
Update `application.properties`:
```properties
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/civicshield
```

### 3. Install Dependencies
```bash
mvn clean install
```

### 4. Run the Application
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

### Complaint Management (`/api/complaints`)

#### Submit a Complaint
- **POST** `/api/complaints`
- **Parameters**: `image` (MultipartFile), `latitude`, `longitude`, `citizenEmail`, `citizenName`, `zoneType`
- **Returns**: Saved Complaint object

```bash
curl -X POST http://localhost:8080/api/complaints \
  -F "image=@path/to/image.jpg" \
  -F "latitude=28.5244" \
  -F "longitude=77.3958" \
  -F "citizenEmail=user@example.com" \
  -F "citizenName=John Doe" \
  -F "zoneType=Residential"
```

#### Get All Complaints
- **GET** `/api/complaints`
- **Returns**: List of all complaints sorted by creation date (newest first)

#### Get Complaint by ID
- **GET** `/api/complaints/{id}`
- **Returns**: Single complaint object

#### Get Nearby Complaints
- **GET** `/api/complaints/nearby?lat=28.5244&lon=77.3958&radius=5`
- **Returns**: Complaints within specified radius (in km)

### Admin Management (`/api/admin/complaints`)

#### Update Complaint Status
- **PATCH** `/api/admin/complaints/{id}/status?status=IN_PROGRESS`
- **Status Values**: `PENDING`, `IN_PROGRESS`, `RESOLVED`
- **Returns**: Status update confirmation

#### Get Statistics
- **GET** `/api/admin/complaints/stats`
- **Returns**: Grouped statistics by priority and status

### Social Features (`/api/social`)

#### Upvote a Complaint
- **POST** `/api/social/complaints/{id}/upvote`
- **Returns**: Updated upvote count and priority

```bash
curl -X POST http://localhost:8080/api/social/complaints/complaint-id/upvote
```

#### Get Social Feed
- **GET** `/api/social/feed?lat=28.5244&lon=77.3958&radius=5`
- **Returns**: Nearby complaints sorted by upvotes (newest first)

#### Get Zone Leaderboard
- **GET** `/api/social/leaderboard`
- **Returns**: Zones ranked by resolution rate and total reports

## Data Model

### Complaint Entity

| Field | Type | Description |
|-------|------|-------------|
| id | String | MongoDB document ID |
| issueType | String | Type of issue (Pothole, Garbage, Water Leak, etc.) |
| description | String | Detailed description |
| latitude | double | Geographic latitude |
| longitude | double | Geographic longitude |
| imageUrl | String | URL to uploaded image |
| status | String | PENDING, IN_PROGRESS, RESOLVED |
| priority | String | CRITICAL, HIGH, MEDIUM, LOW |
| tensionScore | double | 0-100 score based on AI analysis and zone type |
| zoneType | String | Hospital, School, Residential, Commercial, Market |
| citizenEmail | String | Reporter's email |
| citizenName | String | Reporter's name |
| upvoteCount | int | Community upvotes |
| createdAt | LocalDateTime | Creation timestamp |
| updatedAt | LocalDateTime | Last update timestamp |

## Configuration

Edit `src/main/resources/application.properties`:

```properties
# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/civicshield

# Server
server.port=8080

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# AI Service
ai.service.url=http://localhost:5000

# CORS
cors.allowed-origins=http://localhost:5173
```

## Features

### AI Integration
- Integrates with external AI service for image analysis
- Falls back to mock data if AI service is unavailable
- Analyzes issue type, confidence, and assigns tension scores

### Community Engagement
- Citizens can upvote issues
- Automatic priority escalation: 
  - Upvotes > 30: MEDIUM → HIGH
  - Upvotes > 60: Any → CRITICAL

### Location-based Services
- Proximity search using Haversine distance formula
- Get nearby complaints within specified radius

### Admin Dashboard
- View statistics grouped by priority and status
- Update complaint status through API

### Data Seeding
- 12 sample complaints across 4 zones (Noida)
- Mix of priorities and statuses
- Realistic Indian civic issues
- Automatically seeds on first run if database is empty

## Sample Data

The application includes a DataSeeder that initializes 12 sample complaints across:
- **Sector 62 Noida** (Residential - High tension)
- **Sector 18 Noida** (Market)
- **Greater Noida West** (Commercial - Calm)
- **Noida City Centre** (School & Hospital - High tension)

## Error Handling

Global exception handler (`GlobalExceptionHandler`) provides consistent error responses:

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "message": "Error message",
  "path": "/api/complaints"
}
```

## Build & Deployment

### Build JAR
```bash
mvn clean package
```

### Run JAR
```bash
java -jar target/civicshield-backend-1.0.0.jar
```

### Docker Build (Optional)
```dockerfile
FROM openjdk:17-slim
COPY target/civicshield-backend-1.0.0.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```bash
docker build -t civicshield-backend .
docker run -p 8080:8080 civicshield-backend
```

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Image upload to cloud storage (AWS S3)
- [ ] Real-time notifications via WebSockets
- [ ] Advanced geolocation clustering
- [ ] Machine learning pipeline for priority prediction
- [ ] Email notifications for status updates
- [ ] Rate limiting and API key management

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or Docker container is active
- Check `application.properties` has correct connection string

### AI Service Unavailable
- The application gracefully falls back to mock data
- Check AI service logs if real integration is needed

### CORS Issues
- Verify `cors.allowed-origins` matches your frontend URL
- Update in `application.properties` if needed

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please create an issue on the GitHub repository.

---

**Version**: 1.0.0  
**Last Updated**: January 2024
#   C i v i c s h i e l d  
 