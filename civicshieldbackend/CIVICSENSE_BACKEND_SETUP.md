# CivicSense Backend - Spring Boot API Server

## Overview

Complete Spring Boot backend for **CivicSense** — a civic intelligence social platform where citizens post local issues, get AI-powered analysis, and track real-time area safety scores.

## Project Structure

```
civicshieldbackend/
├── pom.xml                          # Maven dependencies
├── src/main/resources/
│   └── application.properties       # Configuration
└── src/main/java/com/civicshield/
    ├── CivicShieldApplication.java  # Main entry point
    ├── config/
    │   ├── SecurityConfig.java      # JWT & Security setup
    │   ├── CorsConfig.java          # CORS configuration
    │   └── WebMvcConfig.java        # Static file serving
    ├── entity/
    │   ├── User.java                # User document
    │   ├── Post.java                # Social post document
    │   ├── Complaint.java           # Civic complaint document
    │   └── Area.java                # Geographic area scores
    ├── repository/
    │   ├── UserRepository.java
    │   ├── PostRepository.java
    │   ├── ComplaintRepository.java
    │   └── AreaRepository.java
    ├── dto/
    │   ├── AuthRequest/Response
    │   ├── PostRequest
    │   ├── ComplaintRequest
    │   ├── AreaReportResponse
    │   └── AiClassifyResult
    ├── service/
    │   ├── AuthService.java         # User registration & login
    │   ├── PostService.java         # Social feed operations
    │   ├── ComplaintService.java    # Civic complaint handling
    │   ├── AreaService.java         # Area scores & reports
    │   ├── ScoreEngine.java         # Civic score calculation
    │   └── AiService.java           # AI service integration
    ├── controller/
    │   ├── AuthController.java
    │   ├── PostController.java
    │   ├── ComplaintController.java
    │   └── AreaController.java
    ├── security/
    │   ├── JwtAuthenticationFilter.java
    │   └── CustomUserDetailsService.java
    └── utils/
        └── JwtUtil.java             # JWT token management
```

## Setup & Installation

### Prerequisites
- Java 17+
- MongoDB (running locally or remote)
- Maven 3.8+

### 1. Configure MongoDB

Ensure MongoDB is running:
```bash
# Start MongoDB locally (if installed)
mongod

# Or use MongoDB Atlas cloud database
```

Update `application.properties`:
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/civicsense
```

### 2. Install Dependencies

```bash
cd civicshieldbackend
mvn clean install
```

### 3. Run the Backend

**Option A: Using Maven**
```bash
mvn spring-boot:run
```

**Option B: Using JAR**
```bash
mvn clean package
java -jar target/civicshield-backend-1.0.0.jar
```

**Option C: Using IDE**
- Open in IntelliJ/Eclipse
- Right-click `CivicShieldApplication.java` → Run

### 4. Verify it's running

```bash
curl http://localhost:8080/actuator/health
# Returns: {"status":"UP"}
```

## API Endpoints

### Authentication `/api/auth`

**Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "password123",
  "area": "Sector 62, Noida",
  "state": "Uttar Pradesh",
  "latitude": 28.5355,
  "longitude": 77.3910
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "rahul@example.com",
  "password": "password123"
}
```

**Get Current User**
```http
GET /api/auth/me
Authorization: Bearer {jwt_token}
```

### Posts (Social Feed) `/api/posts`

**Create Post** (with optional image)
```http
POST /api/posts
Content-Type: multipart/form-data
Authorization: Bearer {jwt_token}

content: "Large pothole outside hospital"
image: <file>
locationLabel: "Sector 62, Noida"
state: "Uttar Pradesh"
latitude: 28.5355
longitude: 77.3910
isAnonymous: false
```

**Get Feed**
```http
GET /api/posts/feed?lat=28.5355&lon=77.3910&radiusKm=10&category=CIVIC&page=0&size=20
Authorization: Bearer {jwt_token}
```

**Get Post Details**
```http
GET /api/posts/{postId}
Authorization: Bearer {jwt_token}
```

**Upvote Post**
```http
POST /api/posts/{postId}/upvote
Authorization: Bearer {jwt_token}
```

**Add Comment**
```http
POST /api/posts/{postId}/comment
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "text": "Great report! Please escalate to municipal authority"
}
```

### Complaints `/api/complaints`

**Submit Complaint**
```http
POST /api/complaints
Content-Type: multipart/form-data
Authorization: Bearer {jwt_token}

image: <file>
latitude: 28.5355
longitude: 77.3910
area: "Sector 62, Noida"
state: "Uttar Pradesh"
zoneType: "Hospital"
description: "Illegal garbage dumping"
```

**Get Complaints**
```http
GET /api/complaints?state=Uttar%20Pradesh&priority=CRITICAL&page=0&size=20
Authorization: Bearer {jwt_token}
```

**Update Complaint Status**
```http
PATCH /api/complaints/{id}/status
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "status": "RESOLVED"
}
```

### Areas (Scoring) `/api/areas`

**Get Areas by State**
```http
GET /api/areas?state=Uttar%20Pradesh
```

**Get Area Details**
```http
GET /api/areas/Sector%2062?state=Uttar%20Pradesh
```

**Get Leaderboard**
```http
GET /api/areas/leaderboard?state=Uttar%20Pradesh&limit=20
```

**Get Property Safety Report**
```http
GET /api/areas/property-report/Sector%2062?state=Uttar%20Pradesh
```

**Get Globe Data** (no auth required)
```http
GET /api/areas/globe-data
```

## Authentication

**JWT Token Flow:**

1. User registers/logs in → Backend returns JWT token
2. Client stores token in localStorage
3. For authenticated requests, send: `Authorization: Bearer {token}`
4. Token expires after 24 hours (configured in `application.properties`)

**JWT Secret** (change in production!):
```properties
jwt.secret=civicsense-super-secret-key-2024
jwt.expiration=86400000  # 24 hours in ms
```

## Civic Score Calculation

The `ScoreEngine` calculates area scores based on:

- **Infrastructure (25%)**: CIVIC/POTHOLE/ROAD posts → negative impact
- **Safety (25%)**: CRIME posts → negative impact
- **Civic Engagement (15%)**: NEWS posts → positive impact
- **Geo-Tension (15%)**: External geopolitical events → affects score
- **Environment (10%)**: GARBAGE/WATER/FLOOD posts → negative impact
- **Government Response (10%)**: Complaint resolution speed → positive impact

**Severity Impact:**
- CRITICAL: -8 points
- HIGH: -5 points
- MEDIUM: -2 points
- LOW: -1 point

**Score Range:** 0-100
- > 70: Good/Safe (teal)
- 50-70: Moderate (orange)
- < 50: Poor/Unsafe (red)

## File Uploads

- **Location**: `uploads/` directory (auto-created at startup)
- **Accessible at**: `http://localhost:8080/uploads/{filename}`
- **Max size**: 10 MB per file

## CORS Configuration

**Allowed Origins:**
- `http://localhost:5173` (Vite frontend)
- `http://localhost:3000` (React dev server)

Add more in `application.properties`:
```properties
cors.allowed-origins=http://localhost:5173,http://localhost:3000,https://yourdomain.com
```

## AI Service Integration

The backend calls an AI service at `http://localhost:8000` for:

- **POST `/classify`** - Classify post content and detect severity
- **POST `/analyze`** - Analyze complaint image and location
- **GET `/tension/{state}`** - Get geopolitical tension score

If AI service is unavailable, mock data is used automatically.

Configure in `application.properties`:
```properties
ai.service.url=http://localhost:8000
```

## Database Models

### User
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  hashedPassword: String,
  area: String,
  state: String,
  latitude: Double,
  longitude: Double,
  civicPoints: Number,
  badges: [String],  // ["Street Guardian", "Safety Watcher"]
  followers: [String],
  following: [String],
  isVerified: Boolean,
  createdAt: Date
}
```

### Post
```javascript
{
  _id: ObjectId,
  authorId: String,
  authorUsername: String,
  content: String,
  imageUrl: String,
  category: String,  // CIVIC, CRIME, ENVIRONMENT, SAFETY, NEWS
  severity: String,  // CRITICAL, HIGH, MEDIUM, LOW
  locationLabel: String,
  state: String,
  latitude: Double,
  longitude: Double,
  aiVerified: Boolean,
  aiConfidence: Double,
  civicImpactScore: Double,
  upvotes: [String],  // User IDs
  comments: [{userId, username, text, timestamp}],
  createdAt: Date
}
```

### Complaint
```javascript
{
  _id: ObjectId,
  userId: String,
  postId: String,
  issueType: String,  // POTHOLE, GARBAGE, CRIME, FLOOD, etc.
  area: String,
  state: String,
  latitude: Double,
  longitude: Double,
  priority: String,  // CRITICAL, HIGH, MEDIUM, LOW
  status: String,    // PENDING, RESOLVED
  tensionScore: Double,
  zoneType: String,  // Hospital, School, Residential, etc.
  createdAt: Date,
  resolvedAt: Date
}
```

### Area
```javascript
{
  _id: ObjectId,
  name: String,      // "Sector 62"
  state: String,     // "Uttar Pradesh"
  civicScore: Double, // 0-100
  subScores: {
    infrastructure: Double,
    safety: Double,
    civicEngagement: Double,
    geoTension: Double,
    environment: Double,
    govtResponse: Double
  },
  crimeReports30d: Number,
  propertySafetyRating: Double,
  updatedAt: Date
}
```

## Troubleshooting

### "MongoDB connection refused"
- Ensure MongoDB is running: `mongod`
- Check connection string in `application.properties`
- Try cloud MongoDB: `mongodb+srv://user:pass@cluster.mongodb.net/civicsense`

### "JWT token expired"
- User needs to login again to get new token
- Increase expiration in `application.properties` if needed

### "No qualifying bean of type found"
- Run `mvn clean install` to rebuild
- Check all `@Component`, `@Service`, `@Repository` annotations are present

### "CORS error from frontend"
- Verify frontend URL is in `cors.allowed-origins`
- Check `CorsConfig.java` is being loaded

### "File upload fails"
- Ensure `uploads/` directory exists and is writable
- Check file size doesn't exceed 10MB limit

## Security Notes

⚠️ **Before Production:**
1. Change `jwt.secret` to a strong random value
2. Enable HTTPS/TLS
3. Use environment variables for sensitive config
4. Set up rate limiting on auth endpoints
5. Implement request validation on all endpoints
6. Add API key validation for AI service calls

## Performance Tips

- **Database Indexing**: Add indexes on frequently queried fields (userId, state, createdAt)
- **Pagination**: Always use page/size for large result sets
- **Caching**: Consider Redis for area scores (rarely change)
- **Async**: Use `@Async` for heavy AI operations
- **Monitoring**: Enable actuator endpoints for health checks

## API Documentation

Generate OpenAPI/Swagger docs (optional):

Add to `pom.xml`:
```xml
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
  <version>2.0.0</version>
</dependency>
```

Access at: `http://localhost:8080/swagger-ui.html`

## Support

For issues or questions, check:
- Application logs: `target/civicsense.log`
- MongoDB: `db.posts.find().limit(5)`
- Health check: `curl http://localhost:8080/actuator/health`

---

**Happy civic sensing! 🌍**
