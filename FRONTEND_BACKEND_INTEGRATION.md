# CivicSense Frontend-Backend Integration Guide

## Quick Start

### 1. Backend Setup

```bash
# Install & run backend on http://localhost:8080
cd civicshieldbackend
mvn spring-boot:run
```

### 2. Frontend Setup

```bash
# Install & run frontend on http://localhost:5173
cd civicshield-frontend
npm install
npm run dev
```

### 3. Verify Connection

Test API call in browser console:
```javascript
fetch('http://localhost:8080/api/areas/globe-data')
  .then(r => r.json())
  .then(data => console.log(data))
```

Should return array of area data without authentication.

---

## Frontend Integration Checklist

### Setup Environment Variables

Create `.env.local` in `civicshield-frontend/`:
```env
VITE_API_URL=http://localhost:8080
VITE_API_TIMEOUT=10000
```

Use in React:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
```

### Auth Flow

**1. User Registration**
```javascript
async function register(userData) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: 'pass123',
      area: 'Sector 62, Noida',
      state: 'Uttar Pradesh',
      latitude: 28.5355,
      longitude: 77.3910
    })
  });
  
  const { token, user } = await response.json();
  localStorage.setItem('jwt_token', token);
  localStorage.setItem('user', JSON.stringify(user));
  return user;
}
```

**2. User Login**
```javascript
async function login(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const { token, user } = await response.json();
  localStorage.setItem('jwt_token', token);
  return user;
}
```

**3. Add JWT to All Requests**
```javascript
function getHeaders(includeAuth = true) {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (includeAuth) {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
}
```

---

## API Integration Examples

### Create Post
```javascript
async function createPost(content, image, locationLabel, state, lat, lon) {
  const formData = new FormData();
  formData.append('content', content);
  if (image) formData.append('image', image);
  formData.append('locationLabel', locationLabel);
  formData.append('state', state);
  formData.append('latitude', lat);
  formData.append('longitude', lon);
  formData.append('isAnonymous', false);

  const response = await fetch(`${API_URL}/api/posts`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` },
    body: formData
  });
  
  return response.json();
}
```

### Get Feed
```javascript
async function getFeed(lat, lon, radiusKm = 10, category = null) {
  const params = new URLSearchParams({
    lat,
    lon,
    radiusKm,
    ...(category && { category })
  });
  
  const response = await fetch(`${API_URL}/api/posts/feed?${params}`, {
    headers: getHeaders(true)
  });
  
  return response.json();
}
```

### Upvote Post
```javascript
async function upvotePost(postId) {
  const response = await fetch(
    `${API_URL}/api/posts/${postId}/upvote`,
    {
      method: 'POST',
      headers: getHeaders(true)
    }
  );
  
  return response.json();
}
```

### Get Area Report
```javascript
async function getAreaReport(areaName, state) {
  const response = await fetch(
    `${API_URL}/api/areas/property-report/${encodeURIComponent(areaName)}?state=${encodeURIComponent(state)}`
  );
  
  return response.json();
}
```

### Get Globe Data (No Auth)
```javascript
async function getGlobeData() {
  const response = await fetch(`${API_URL}/api/areas/globe-data`);
  return response.json();
  // Returns: [{ name, state, lat, lon, civicScore, openComplaints }, ...]
}
```

---

## React Hook for API Calls

Create `useApi.js` custom hook:

```javascript
import { useState } from 'react';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${import.meta.env.VITE_API_URL}${endpoint}`;
      const headers = {
        ...options.headers,
        'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
      };
      
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { call, loading, error };
}
```

Usage in component:
```javascript
function FeedComponent() {
  const { call, loading } = useApi();
  
  useEffect(() => {
    call('/api/posts/feed', {
      method: 'GET'
    }).then(data => setFeed(data));
  }, []);
  
  return loading ? <div>Loading...</div> : <Feed posts={feed} />;
}
```

---

## Mock Data for Development

While backend is starting/AI service unavailable, use mock data:

```javascript
export const MOCK_FEED = [
  {
    id: 1,
    type: 'CIVIC',
    user: 'Rahul Sharma',
    avatar: 'RS',
    verified: true,
    time: '8 min ago',
    area: 'Sector 62, Noida',
    distance: '0.3km',
    text: 'Large pothole outside Apollo Hospital...',
    hasPhoto: true,
    upvotes: 34,
    comments: 12,
    civicImpact: '-3 pts'
  }
  // ... more posts
];

export const MOCK_USER = {
  id: 'user123',
  username: 'Rahul Sharma',
  email: 'rahul@example.com',
  area: 'Sector 62, Noida',
  civicPoints: 1840,
  badges: ['Street Guardian', 'First Reporter']
};
```

---

## Error Handling

Handle common API errors:

```javascript
async function apiCall(endpoint, options) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);

    if (response.status === 401) {
      // Token expired
      localStorage.removeItem('jwt_token');
      window.location.href = '/login';
      return;
    }

    if (response.status === 403) {
      // Forbidden - user not authorized
      throw new Error('Access denied');
    }

    if (response.status === 404) {
      throw new Error('Resource not found');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Server error: ${response.status}`);
    }

    return response.json();
  } catch (err) {
    console.error('API Error:', err);
    // Show toast/snackbar to user
    showError(err.message);
    throw err;
  }
}
```

---

## CORS Troubleshooting

If you get CORS errors:

1. **Verify frontend URL** is in backend's `cors.allowed-origins`:
   ```properties
   cors.allowed-origins=http://localhost:5173,http://localhost:3000
   ```

2. **Check backend is running**:
   ```bash
   curl http://localhost:8080/actuator/health
   ```

3. **Include credentials if needed**:
   ```javascript
   fetch(url, {
     credentials: 'include',  // Include cookies
     headers: { ... }
   })
   ```

---

## Testing the Complete Flow

**Manual Test Steps:**

1. ✅ Backend running on port 8080
2. ✅ Frontend running on port 5173
3. ✅ User registers at `/register` page
4. ✅ Token saved to localStorage
5. ✅ Navigate to `/feed` - shows real posts from API
6. ✅ Create post - appears in feed
7. ✅ Upvote post - count updates
8. ✅ View `/area-score` - shows real area data
9. ✅ Click globe - area details load

---

## Production Deployment

**Before Going Live:**

1. **Environment Variables**
   ```bash
   # Backend
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=<generate-random-string>
   AI_SERVICE_URL=https://your-ai-api.com
   
   # Frontend
   VITE_API_URL=https://api.civicsense.io
   ```

2. **Enable HTTPS**
   - Backend: Spring Security HTTPS
   - Frontend: All API calls to HTTPS endpoint

3. **API Rate Limiting**
   - Implement per-IP rate limits
   - Protect auth endpoints (max 5 attempts/minute)

4. **Database**
   - Use MongoDB Atlas or managed database
   - Enable authentication & encryption at rest
   - Regular backups

5. **Monitoring**
   ```javascript
   // Add error tracking (Sentry)
   import * as Sentry from "@sentry/react";
   
   Sentry.init({
     dsn: "https://your-sentry-key@sentry.io/...",
     environment: "production"
   });
   ```

---

## Useful Links

- Backend API Docs: `http://localhost:8080/swagger-ui.html` (if enabled)
- MongoDB Compass: Inspect local databases
- Postman: Import `civicsense-api.postman_collection.json` (create this JSON file with all endpoints)
- React DevTools: Debug state management
- Network Tab: Monitor API calls & performance

