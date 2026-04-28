# CivicShield - Frontend Backend Integration Guide

Complete step-by-step guide to connect the React frontend from mock API to the real Spring Boot backend.

---

## 📋 Prerequisites

Before integrating, ensure you have:

### Services Running
- ✅ **MongoDB** on port 27017
- ✅ **FastAPI AI Service** on port 5000 (optional)
- ✅ **Spring Boot Backend** on port 8080
- ✅ **React Frontend** on port 5173

### Verification
```bash
# Test Backend
curl http://localhost:8080/api/complaints
# Should return: [...]

# Test MongoDB
mongo
> db.complaint.find()

# Test AI Service (optional)
curl http://localhost:5000/health
# Should return: {"status": "healthy"}
```

---

## 🔄 Integration Phases

### Phase 1: Update API Configuration
### Phase 2: Replace Mock Functions
### Phase 3: Test Individual Endpoints
### Phase 4: Full End-to-End Testing
### Phase 5: Handle Edge Cases

---

## 📝 Phase 1: Update API Configuration

### Step 1.1: Install Axios (if not already installed)
```bash
cd civicshield-frontend
npm install axios
```

### Step 1.2: Create New API Service File
Create `src/services/api.js`:

```javascript
import axios from 'axios'

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const API_ENDPOINT = `${API_BASE_URL}/api`

// Create Axios instance
const api = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      console.error('Unauthorized - redirecting to login')
    }
    return Promise.reject(error)
  }
)

export default api
```

### Step 1.3: Create Environment Variables
Create `.env.local`:
```env
VITE_API_URL=http://localhost:8080
```

And `.env.production`:
```env
VITE_API_URL=https://api.civicshield.com
```

---

## 🔄 Phase 2: Replace Mock Functions

### Step 2.1: Backup Original mockApi.js
```bash
cp src/mockApi.js src/mockApi.js.backup
```

### Step 2.2: Create New Real API Services

#### File: `src/services/complaintApi.js`
```javascript
import api from './api'

// Get all complaints
export async function getComplaints() {
  try {
    const { data } = await api.get('/complaints')
    return data
  } catch (error) {
    console.error('Error fetching complaints:', error)
    throw error
  }
}

// Get single complaint by ID
export async function getComplaintById(id) {
  try {
    const { data } = await api.get(`/complaints/${id}`)
    return data
  } catch (error) {
    console.error('Error fetching complaint:', error)
    throw error
  }
}

// Submit new complaint
export async function submitComplaint(formData) {
  try {
    // If formData has image file, need FormData
    if (formData.imageFile) {
      const multipartData = new FormData()
      multipartData.append('description', formData.description)
      multipartData.append('image', formData.imageFile)
      multipartData.append('location', JSON.stringify(formData.location))
      multipartData.append('zone', formData.zone)
      multipartData.append('issueType', formData.issueType)
      multipartData.append('submittedBy', formData.submittedBy)
      
      const { data } = await api.post('/complaints', multipartData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return data
    } else {
      // If no image, just JSON
      const { data } = await api.post('/complaints', formData)
      return data
    }
  } catch (error) {
    console.error('Error submitting complaint:', error)
    throw error
  }
}

// Get nearby complaints
export async function getNearby(latitude, longitude, radiusKm = 5) {
  try {
    const { data } = await api.get(`/complaints/nearby`, {
      params: { latitude, longitude, radiusKm }
    })
    return data
  } catch (error) {
    console.error('Error fetching nearby complaints:', error)
    throw error
  }
}

// Get complaints by zone
export async function getComplaintsByZone(zone) {
  try {
    const { data } = await api.get('/complaints', {
      params: { zone }
    })
    return data
  } catch (error) {
    console.error('Error fetching complaints by zone:', error)
    throw error
  }
}
```

#### File: `src/services/socialApi.js`
```javascript
import api from './api'

// Upvote complaint
export async function upvoteComplaint(complaintId) {
  try {
    const { data } = await api.post(`/social/complaints/${complaintId}/upvote`)
    return data
  } catch (error) {
    console.error('Error upvoting complaint:', error)
    throw error
  }
}

// Get social feed
export async function getFeed(page = 0, size = 10) {
  try {
    const { data } = await api.get('/social/feed', {
      params: { page, size }
    })
    return data
  } catch (error) {
    console.error('Error fetching feed:', error)
    throw error
  }
}

// Get leaderboard
export async function getLeaderboard() {
  try {
    const { data } = await api.get('/social/leaderboard')
    return data
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    throw error
  }
}
```

#### File: `src/services/adminApi.js`
```javascript
import api from './api'

// Update complaint status
export async function updateComplaintStatus(complaintId, status) {
  try {
    const { data } = await api.patch(`/admin/complaints/${complaintId}/status`, {
      status
    })
    return data
  } catch (error) {
    console.error('Error updating complaint status:', error)
    throw error
  }
}

// Get admin statistics
export async function getAdminStats() {
  try {
    const { data } = await api.get('/admin/stats')
    return data
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    throw error
  }
}

// Get all complaints (admin view)
export async function getAdminComplaints(page = 0, size = 20) {
  try {
    const { data } = await api.get('/admin/complaints', {
      params: { page, size }
    })
    return data
  } catch (error) {
    console.error('Error fetching admin complaints:', error)
    throw error
  }
}
```

#### File: `src/services/aiApi.js`
```javascript
import axios from 'axios'

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:5000'

// Direct call to AI service (bypasses backend)
export async function analyzeImage(imageFile, location = {}, zone = 'Unknown') {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('latitude', location.lat || 0)
    formData.append('longitude', location.lng || 0)
    formData.append('zone', zone)

    const response = await axios.post(
      `${AI_SERVICE_URL}/analyze`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000
      }
    )

    return response.data
  } catch (error) {
    console.error('Error analyzing image:', error)
    // Return mock result as fallback
    return {
      image_type: 'Unknown',
      confidence: 0.5,
      tension: 55,
      priority: 'MEDIUM'
    }
  }
}

// Alternative: Call AI through backend (recommended)
export async function analyzeImageViaBackend(imageFile, location = {}, zone = 'Unknown') {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('location', JSON.stringify(location))
    formData.append('zone', zone)

    const response = await axios.post(
      `http://localhost:8080/api/analyze`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000
      }
    )

    return response.data
  } catch (error) {
    console.error('Error analyzing image via backend:', error)
    return {
      image_type: 'Unknown',
      confidence: 0.5,
      tension: 55,
      priority: 'MEDIUM'
    }
  }
}
```

### Step 2.3: Update Components to Use New API

#### Example: Update `App.jsx`
**Before** (using mockApi):
```javascript
import { mockApi } from './mockApi'

useEffect(() => {
  const loadComplaints = async () => {
    const data = await mockApi.getComplaints()
    setComplaints(data)
  }
  loadComplaints()
}, [])
```

**After** (using real API):
```javascript
import * as complaintApi from './services/complaintApi'

useEffect(() => {
  const loadComplaints = async () => {
    try {
      const data = await complaintApi.getComplaints()
      setComplaints(data)
    } catch (error) {
      console.error('Failed to load complaints:', error)
      // Show error toast or fallback
    }
  }
  loadComplaints()
}, [])
```

---

## ✅ Phase 3: Update Each Component

### SocialFeed.jsx
```javascript
// Before
import { mockApi } from '../mockApi'
const data = await mockApi.getComplaints()

// After
import * as complaintApi from '../services/complaintApi'
const data = await complaintApi.getComplaints()

// For upvoting
// Before
await mockApi.upvoteComplaint(complaintId)

// After
import * as socialApi from '../services/socialApi'
await socialApi.upvoteComplaint(complaintId)
```

### SubmitForm.jsx
```javascript
// Before
import { mockApi } from '../mockApi'
const result = await mockApi.analyzeImage(imageFile)
await mockApi.submitComplaint(formData)

// After
import * as aiApi from '../services/aiApi'
import * as complaintApi from '../services/complaintApi'

const result = await aiApi.analyzeImage(imageFile, location, zone)
await complaintApi.submitComplaint({
  description: formData.description,
  imageFile: formData.imageFile,
  location: formData.location,
  zone: formData.zone,
  issueType: formData.issueType,
  submittedBy: formData.submittedBy
})
```

### Leaderboard.jsx
```javascript
// Before
import { mockApi } from '../mockApi'
const stats = await mockApi.getStats()
const leaderboard = await mockApi.getLeaderboard()

// After
import * as socialApi from '../services/socialApi'
import * as adminApi from '../services/adminApi'

const stats = await adminApi.getAdminStats()
const leaderboard = await socialApi.getLeaderboard()
```

### AdminPanel.jsx
```javascript
// Before
import { mockApi } from '../mockApi'
await mockApi.updateComplaintStatus(id, status)
const stats = await mockApi.getStats()

// After
import * as adminApi from '../services/adminApi'

await adminApi.updateComplaintStatus(id, status)
const stats = await adminApi.getAdminStats()
```

---

## 🧪 Phase 4: Testing

### Step 4.1: Test Individual API Calls

Create `src/services/__tests__/api.test.js`:
```javascript
import * as complaintApi from '../complaintApi'
import * as socialApi from '../socialApi'
import * as adminApi from '../adminApi'

describe('API Services', () => {
  // Test complaint API
  test('getComplaints returns array', async () => {
    const complaints = await complaintApi.getComplaints()
    expect(Array.isArray(complaints)).toBe(true)
  })

  test('submitComplaint creates new complaint', async () => {
    const result = await complaintApi.submitComplaint({
      description: 'Test pothole',
      zone: 'Sector 62',
      submittedBy: 'Test User',
      location: { lat: 28.5, lng: 77.4 }
    })
    expect(result.id).toBeDefined()
  })

  // Test social API
  test('upvoteComplaint increments upvotes', async () => {
    const result = await socialApi.upvoteComplaint(1)
    expect(result.upvotes).toBeGreaterThan(0)
  })

  // Test admin API
  test('updateComplaintStatus changes status', async () => {
    const result = await adminApi.updateComplaintStatus(1, 'RESOLVED')
    expect(result.status).toBe('RESOLVED')
  })
})
```

### Step 4.2: Test UI Components

Run frontend with backend:
```bash
# Terminal 1: Backend
cd civicshield-backend
mvn spring-boot:run

# Terminal 2: Frontend
cd civicshield-frontend
npm run dev
```

Test each screen:
- [ ] **Globe View**: Loads complaints from backend
- [ ] **Social Feed**: Displays and filters real data
- [ ] **Submit Form**: Uploads image and creates complaint
- [ ] **Leaderboard**: Shows real zone rankings
- [ ] **Admin Panel**: Updates status and displays stats

### Step 4.3: Test Error Handling

Scenarios to test:
```javascript
// Backend down
curl http://localhost:8080  // Should fail
// Frontend should show error message

// Database down
mongod stop
// API should return error
// Frontend should show error message

// Invalid data
POST /api/complaints with empty description
// Should return 400 Bad Request
// Frontend should show validation error

// Large file upload
POST /api/complaints with 10MB image
// Should return 413 Payload Too Large
// Frontend should show error
```

---

## ⚙️ Phase 5: Handle Edge Cases

### Step 5.1: Handle Network Errors
```javascript
// In components
try {
  const data = await complaintApi.getComplaints()
  setComplaints(data)
} catch (error) {
  if (error.response?.status === 500) {
    setError('Server error, please try again later')
  } else if (error.message === 'Network Error') {
    setError('Network connection failed')
  } else {
    setError(error.message || 'Something went wrong')
  }
}
```

### Step 5.2: Handle Loading States
```javascript
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

useEffect(() => {
  const loadComplaints = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await complaintApi.getComplaints()
      setComplaints(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  loadComplaints()
}, [])

return (
  <>
    {loading && <div>Loading...</div>}
    {error && <div className="error">{error}</div>}
    {complaints && <div>Complaints: {complaints.length}</div>}
  </>
)
```

### Step 5.3: Handle Pagination
```javascript
// For large result sets
const [page, setPage] = useState(0)
const [pageSize] = useState(10)

useEffect(() => {
  const loadComplaints = async () => {
    const data = await complaintApi.getComplaints()
    setComplaints(data)
  }
  loadComplaints()
}, [page])

const paginatedData = complaints.slice(
  page * pageSize,
  (page + 1) * pageSize
)
```

### Step 5.4: Handle Image Upload Errors
```javascript
function handleImageChange(event) {
  const file = event.target.files[0]

  // Validate file size
  if (file.size > 5 * 1024 * 1024) {
    setError('File must be less than 5MB')
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    setError('File must be an image')
    return
  }

  // Create preview
  const reader = new FileReader()
  reader.onload = () => setPreview(reader.result)
  reader.readAsDataURL(file)
}
```

---

## 🔗 Complete Integration Checklist

### Backend Services
- [ ] MongoDB running on port 27017
- [ ] Spring Boot running on port 8080
- [ ] FastAPI running on port 5000 (optional)
- [ ] All endpoints tested with curl/Postman

### Frontend Configuration
- [ ] Axios installed
- [ ] `.env.local` created with `VITE_API_URL`
- [ ] `src/services/` directory created
- [ ] API service files created (api.js, complaintApi.js, etc.)

### Component Updates
- [ ] App.jsx updated to use real API
- [ ] GlobeView.jsx updated
- [ ] SocialFeed.jsx updated
- [ ] SubmitForm.jsx updated
- [ ] Leaderboard.jsx updated
- [ ] AdminPanel.jsx updated
- [ ] Navbar.jsx - no changes needed (only routing)

### Testing
- [ ] Unit tests written for API services
- [ ] Components tested individually
- [ ] Full end-to-end flow tested
- [ ] Error cases tested
- [ ] Loading states tested
- [ ] Network errors handled

### Deployment
- [ ] Production `.env` configured
- [ ] API URLs updated for production
- [ ] CORS enabled on backend for frontend domain
- [ ] Authentication implemented (if needed)
- [ ] Frontend built and deployed
- [ ] Backend deployed
- [ ] Database backup created

---

## 🚀 Common Issues & Solutions

### Issue: CORS Error
```
Access to XMLHttpRequest at 'http://localhost:8080/api/complaints' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution**: Update `application.properties`:
```properties
cors.allowed-origins=http://localhost:5173
cors.allowed-methods=GET,POST,PUT,PATCH,DELETE
cors.allowed-headers=*
cors.allow-credentials=true
```

### Issue: 404 Not Found
```
GET http://localhost:8080/api/complaints
404 Not Found
```

**Solution**: Verify backend is running:
```bash
curl http://localhost:8080/health
# Should return 200 OK
```

### Issue: Image Upload Fails
```
POST /api/complaints
400 Bad Request - "Invalid file"
```

**Solution**: Check backend file upload configuration:
```properties
# Add to application.properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### Issue: timeout
```
Error: timeout of 10000ms exceeded
```

**Solution**: Increase timeout in Axios:
```javascript
const api = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 30000  // Increase to 30 seconds
})
```

### Issue: Blank Response
```
200 OK but no data returned
```

**Solution**: Check response format in backend:
```java
// Ensure correct JSON response
return ResponseEntity.ok(complaints)
```

---

## 📊 Migration Summary

| Component | Before (Mock) | After (Real) | Changes |
|-----------|---------------|--------------|---------|
| App.jsx | mockApi calls | API service calls | Import change + error handling |
| GlobeView.jsx | Mock data | Real data | Same, just sources changed |
| SocialFeed.jsx | Mock feed + upvote | Real API calls | Import change |
| SubmitForm.jsx | Mock submit + analysis | Real submit + AI | Import change + error handling |
| Leaderboard.jsx | Mock stats | Real stats | Import change |
| AdminPanel.jsx | Mock admin functions | Real admin API | Import change |

---

## 🎯 Next Steps

1. **Complete Integration**: Follow all 5 phases above
2. **Test Thoroughly**: Verify each endpoint works
3. **Handle Errors**: Add proper error messages
4. **Add Loading States**: Improve UX during API calls
5. **Deploy**: Push to production

---

## 📞 Support

### Debugging
1. Check browser console for errors (F12)
2. Check network tab (F12 → Network)
3. Check backend logs for errors
4. Test API with curl or Postman
5. Check MongoDB for data

### Tools
- **Postman**: Test API endpoints
- **MongoDB Compass**: View database
- **VS Code**: Debugger extension
- **React DevTools**: Debug components

---

**Version**: 1.0.0  
**Status**: Ready for Integration  
**Last Updated**: January 2024

---

### Quick Links
- [Backend Setup](../civicshield-backend/README.md)
- [Frontend Setup](./README.md)
- [Project Summary](../PROJECT_SUMMARY.md)

**Happy Integrating!** 🚀
