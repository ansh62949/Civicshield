# CivicShield Frontend - Architecture

Complete technical documentation of the React 18 + Vite frontend architecture.

---

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────┐
│          CivicShield Frontend (React + Vite)        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │   Navbar    │  │  GlobeView   │  │ SocialFeed │ │
│  └─────────────┘  └──────────────┘  └────────────┘ │
│                                                     │
│  ┌──────────────┐  ┌────────────┐  ┌────────────┐ │
│  │  SubmitForm  │  │ Leaderboard│  │AdminPanel  │ │
│  └──────────────┘  └────────────┘  └────────────┘ │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │         App.jsx (Router + State)            │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                   mockApi.js                        │
│         (API Layer - Mock/Real switchable)          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────── Optional ───────┐                        │
│  │  Spring Boot Backend    │                        │
│  │  (Port 8080)           │                        │
│  │  - REST APIs           │                        │
│  │  - MongoDB             │                        │
│  └────────────────────────┘                        │
│                                                     │
│  ┌─────── Optional ───────┐                        │
│  │  FastAPI AI Service    │                        │
│  │  (Port 5000)           │                        │
│  │  - Image Analysis      │                        │
│  │  - Scoring             │                        │
│  └────────────────────────┘                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🏛️ Component Hierarchy

```
App.jsx (Root)
├── Navbar.jsx
│   ├── Desktop Sidebar (lg:)
│   │   ├── Logo
│   │   ├── Nav Items (5 screens)
│   │   └── Settings
│   └── Mobile Hamburger (md:hidden)
│
├── Screen Container (based on currentScreen state)
│   ├── GlobeView
│   │   ├── Globe.gl (3D)
│   │   ├── Pin Markers (color by priority)
│   │   ├── Info Panel
│   │   └── Statistics
│   │
│   ├── SocialFeed
│   │   ├── Filter Controls
│   │   │   ├── Priority Filter
│   │   │   └── Status Filter
│   │   ├── Sort Controls
│   │   │   ├── Recent
│   │   │   ├── Upvotes
│   │   │   └── Tension
│   │   └── Complaint Cards (map)
│   │       ├── Title & Description
│   │       ├── Metadata
│   │       ├── Upvote Button
│   │       └── Share Button
│   │
│   ├── SubmitForm
│   │   ├── Image Upload
│   │   │   ├── File Input
│   │   │   └── Preview
│   │   ├── Location Input
│   │   │   ├── Auto GPS
│   │   │   └── Manual Edit
│   │   ├── Zone Selection
│   │   ├── Contact Form
│   │   └── AI Analysis Display
│   │
│   ├── Leaderboard
│   │   ├── Stats Cards (3)
│   │   │   ├── Total Reports
│   │   │   ├── Resolved Reports
│   │   │   └── Active Zones
│   │   └── Zone Rankings Table
│   │       ├── Zone Name
│   │       ├── Civic Score
│   │       ├── Resolution Rate
│   │       └── Total Issues
│   │
│   └── AdminPanel
│       ├── Search & Filter
│       │   ├── Search Input
│       │   ├── Status Filter
│       │   └── Priority Filter
│       ├── Complaints Table
│       │   ├── Expandable Rows
│       │   ├── Status Badges
│       │   └── Action Buttons
│       └── Statistics Panel
│           ├── Total Complaints
│           ├── Pending
│           ├── In Progress
│           └── Resolved
```

---

## 📊 State Management

### Global State (App.jsx)
```javascript
const [complaints, setComplaints] = useState([])
const [currentScreen, setCurrentScreen] = useState('globe')
const [selectedComplaint, setSelectedComplaint] = useState(null)
```

### Screen-Specific State
- **SocialFeed**: `filterPriority`, `sortBy`, `searchTerm`
- **SubmitForm**: `formData`, `preview`, `analyzing`, `analysisResult`
- **AdminPanel**: `searchInput`, `filterStatus`, `expandedRows`
- **GlobeView**: `autoRotate`, `selectedPin`, `zoomLevel`

### Data Flow
```
mockApi.getComplaints() → setComplaints() → render components
              ↓
        (200-2000ms delay)
              ↓
       Component displays data
```

---

## 🎨 Styling Architecture

### Tailwind CSS Structure
```css
/* src/index.css */

/* 1. Global Styles */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 2. Custom Components */
@layer components {
  .card { ... }
  .btn-primary { ... }
  .priority-badge { ... }
}

/* 3. Custom Utilities */
@layer utilities {
  .glass { ... }
  .shimmer { ... }
}

/* 4. Animations */
@keyframes slideIn { ... }
@keyframes fadeIn { ... }
@keyframes pulse-glow { ... }
```

### Color Palette
```javascript
// tailwind.config.js
colors: {
  primary: '#FF6B6B',        // Main action color
  secondary: '#4ECDC4',      // Secondary color
  critical: '#E74C3C',       // CRITICAL priority
  high: '#F39C12',           // HIGH priority
  medium: '#3498DB',         // MEDIUM priority
  low: '#2ECC71',            // LOW priority
  dark: '#1A1A1A',           // Dark background
  light: '#F5F5F5'           // Light background
}
```

### Responsive Breakpoints
- `sm`: 640px (mobile)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)

---

## 📡 API Integration Layer

### mockApi.js Structure
```javascript
// Export points
export const MOCK_COMPLAINTS          // Data
export async function getComplaints() // GET /api/complaints
export async function submitComplaint() // POST /api/complaints
export async function upvoteComplaint() // POST /api/complaints/{id}/upvote
export async function updateComplaintStatus() // PATCH /api/admin/{id}/status
export async function analyzeImage()  // POST /ai/analyze
export async function getStats()      // GET /api/stats
export async function getLeaderboard() // GET /api/leaderboard
```

### Simulated Latency
```javascript
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function getComplaints() {
  await delay(500)  // Simulate network delay
  return MOCK_COMPLAINTS
}
```

### Converting to Real API

**Option 1: Axios**
```javascript
import axios from 'axios'

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8080/api'
const api = axios.create({ baseURL: API_BASE_URL })

export async function getComplaints() {
  const { data } = await api.get('/complaints')
  return data
}
```

**Option 2: Fetch API**
```javascript
export async function getComplaints() {
  const response = await fetch(`${API_URL}/complaints`)
  return await response.json()
}
```

---

## 🔄 Data Flow Diagrams

### Complaint Loading Flow
```
App Mount
    ↓
useEffect(() => loadComplaints())
    ↓
mockApi.getComplaints()
    ↓
setComplaints(data)
    ↓
Re-render all components
    ↓
Components display complaints
```

### Submit Form Flow
```
User uploads image
    ↓
Preview displayed
    ↓
User clicks "Analyze"
    ↓
mockApi.analyzeImage(file)
    ↓
AI result displayed (mock)
    ↓
User fills form + clicks "Submit"
    ↓
mockApi.submitComplaint(formData)
    ↓
New complaint added to state
    ↓
Redirect to Globe/Feed
```

### Admin Update Flow
```
Admin clicks "Update Status"
    ↓
Modal opens or inline edit
    ↓
Select new status
    ↓
mockApi.updateComplaintStatus(id, status)
    ↓
Update complaint in state
    ↓
Table re-renders with new status
```

---

## 🧮 Component File Sizes

| Component | Lines | Purpose |
|-----------|-------|---------|
| App.jsx | ~150 | Router, state, layout |
| Navbar.jsx | ~200 | Navigation, mobile menu |
| GlobeView.jsx | ~400 | 3D visualization |
| SocialFeed.jsx | ~500 | Feed with filters/sorts |
| SubmitForm.jsx | ~600 | Form with image upload |
| Leaderboard.jsx | ~300 | Rankings, statistics |
| AdminPanel.jsx | ~800 | Table, search, status update |
| mockApi.js | ~600 | Mock data + functions |
| index.css | ~300 | Global styles |
| **Total** | **~3,750** | - |

---

## 🔌 Extension Points

### Add New Screen
1. Create `src/components/NewScreen.jsx`
2. Add case to `App.jsx` screen router
3. Add navigation button to `Navbar.jsx`

```javascript
// App.jsx
case 'newScreen':
  return <NewScreen complaints={complaints} />

// Navbar.jsx
<button onClick={() => setCurrentScreen('newScreen')}>
  New Screen
</button>
```

### Add New Data Field
1. Update `MOCK_COMPLAINTS` in `mockApi.js`
2. Update TypeScript interface (if using TS)
3. Update component to display field

### Add New API Endpoint
1. Create mock function in `mockApi.js`
2. Use in component with `await mockApi.endpoint()`
3. Replace with real API call later

### Add Authentication
```javascript
// mockApi.js
export async function login(email, password) {
  // Mock auth
  return { userId: 1, token: 'mock-token' }
}

// App.jsx
const [user, setUser] = useState(null)
useEffect(() => {
  mockApi.getMe().then(setUser)
}, [])
```

---

## 🚀 Performance Optimization

### Code Splitting
```javascript
// Import components as needed
const AdminPanel = lazy(() => import('./components/AdminPanel'))

// Wrap with Suspense
<Suspense fallback={<Loading />}>
  <AdminPanel />
</Suspense>
```

### Memoization
```javascript
// Prevent re-renders
const ComplaintCard = memo(({ complaint, onUpvote }) => {
  return <div>{complaint.description}</div>
})
```

### useMemo for Expensive Calculations
```javascript
const sortedComplaints = useMemo(() => {
  return [...complaints].sort((a, b) => {
    // Sorting logic
  })
}, [complaints, sortBy])
```

### Image Optimization
- Use WebP format
- Lazy load images
- Set image dimensions

---

## 🔐 Security Considerations

### XSS Prevention
```javascript
// React escapes content by default
<div>{complaint.description}</div> // Safe
```

### CSRF Protection
- When connecting to real backend, include CSRF tokens
- Axios interceptor for token management

### API Security
```javascript
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-CSRF-Token': csrfToken
  }
})
```

### Environment Variables
```env
VITE_API_URL=http://localhost:8080
VITE_AI_SERVICE_URL=http://localhost:5000
```

---

## 🧪 Testing Strategy

### Unit Tests (Jest + React Testing Library)
```javascript
// components/__tests__/SocialFeed.test.jsx
import { render, screen } from '@testing-library/react'
import SocialFeed from '../SocialFeed'

test('renders complaint list', () => {
  render(<SocialFeed complaints={mockComplaints} />)
  expect(screen.getByText('Pothole')).toBeInTheDocument()
})
```

### Integration Tests
- Test API mocking with MSW (Mock Service Worker)
- Test user workflows end-to-end

### E2E Tests (Cypress/Playwright)
```javascript
describe('Submit Form Flow', () => {
  it('submits complaint with image', () => {
    cy.visit('/')
    cy.contains('Report Issue').click()
    cy.get('input[type="file"]').selectFile('image.jpg')
    cy.contains('Submit').click()
    cy.contains('Success').should('be.visible')
  })
})
```

---

## 📦 Build & Deployment

### Build Process
```bash
npm run build
```

Produces:
- Minified JS/CSS
- Optimized images
- Source maps (dev)
- HTML entry point

### Output Structure
```
dist/
├── index.html          # Entry point
├── assets/
│   ├── index-abc123.js # Main bundle
│   ├── vendor-def456.js # Dependencies
│   └── style-ghi789.css # Styles
└── favicon.ico         # Icon
```

### Deployment Targets

**Vercel (Recommended)**
```bash
vercel
```
- Auto preview on PRs
- Environment variables
- Custom domains

**Netlify**
```bash
npm run build
netlify deploy --prod --dir=dist
```

**Traditional Hosting**
```bash
npm run build
scp -r dist/* user@host:/var/www/html/
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test
      - run: vercel deploy --prod
```

---

## 📈 Monitoring & Analytics

### Error Tracking
```javascript
// Sentry integration
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV
})
```

### Performance Monitoring
```javascript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

### User Analytics
```javascript
// Google Analytics
gtag.event('complaint_submitted', {
  zone: 'Sector 62',
  priority: 'HIGH'
})
```

---

## 🗂️ File Organization

### Recommended Structure for Scaling
```
src/
├── components/
│   ├── common/           # Reusable components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── Badge.jsx
│   ├── screens/          # Screen components
│   │   ├── GlobeView/
│   │   ├── SocialFeed/
│   │   └── AdminPanel/
│   └── __tests__/        # Component tests
├── hooks/                # Custom hooks
│   ├── useComplaints.js
│   └── useMap.js
├── services/             # API services
│   ├── complaintApi.js
│   └── aiApi.js
├── utils/                # Utilities
│   ├── formatters.js
│   └── validators.js
├── styles/               # Global styles
│   └── globals.css
├── context/              # React Context
│   └── ComplaintContext.jsx
├── App.jsx
└── main.jsx
```

---

## 🔗 Integration Checklist

### For Real Backend Integration

- [ ] Update `mockApi.js` to use Axios
- [ ] Set `baseURL` to backend server
- [ ] Update environment variables
- [ ] Test CORS configuration
- [ ] Add error handling for API failures
- [ ] Add loading states
- [ ] Add retry logic
- [ ] Test all CRUD operations
- [ ] Set up authentication flow
- [ ] Configure API timeouts

---

## 📚 Technology Stack in Detail

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | React | 18.2.0 | UI library |
| **Build Tool** | Vite | 5.0.0 | Build & dev |
| **Styling** | Tailwind CSS | 3.3.6 | Utility CSS |
| **3D Visualization** | Three.js | r157 | 3D engine |
| **Globe Library** | react-globe.gl | 2.25.1 | Interactive globe |
| **Icons** | react-icons | 4.12.0 | Icon library |
| **HTTP Client** | Axios | 1.6.0 | API calls |
| **Post-CSS** | PostCSS | 8.4.x | CSS transform |
| **Autoprefixer** | Autoprefixer | 10.4.x | Browser prefix |

---

## 🎯 Performance Metrics

### Target Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Bundle Size Target
- JS: < 200KB (gzipped)
- CSS: < 50KB (gzipped)
- Assets: Lazy load > 100KB

### Load Time Goals
- Initial Load: < 3s
- Interactive: < 5s
- Total: < 7s

---

## 🚀 Future Enhancements

1. **TypeScript Migration** - Add type safety
2. **Redux/Zustand** - Centralized state management
3. **React Query** - Server state caching
4. **PWA Support** - Offline capability
5. **Internationalization** - Multi-language support
6. **Dark Mode** - Theme switching
7. **Accessibility** - WCAG 2.1 AA compliance
8. **Real-time Updates** - WebSocket/SignalR
9. **Mobile App** - React Native version
10. **Analytics Dashboard** - Detailed metrics

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Maintainer**: CivicShield Team
