# CivicShield Frontend

A modern React + Vite frontend for the CivicShield civic complaint platform. Features a 3D globe view, social feed, complaint reporting, leaderboard, and admin dashboard.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:5173`

## 📋 Features

### 1. **Globe View** 🌍
- Interactive 3D globe with complaint pins
- Color-coded by priority (CRITICAL/HIGH/MEDIUM/LOW)
- Real-time visualization of civic issues
- Heatmap layer showing tension scores
- Auto-rotating with manual controls

### 2. **Social Feed** 📱
- Twitter-style complaint listing
- Filter by priority level
- Sort by recent/upvotes/tension
- Real-time upvoting system
- Share functionality
- Community engagement metrics

### 3. **Report Issue** 📸
- Photo upload with preview
- AI-powered image analysis
- GPS auto-fill with manual adjustment
- Zone type selection
- Citizen contact information
- Real-time AI result display

### 4. **Leaderboard** 🏆
- Zone rankings by resolution rate
- Civic score calculation
- Total reports vs resolved ratio
- Performance metrics
- Community competitions

### 5. **Admin Panel** ⚙️
- Complaint management dashboard
- Search and filter capabilities
- Status tracking (PENDING/IN_PROGRESS/RESOLVED)
- Bulk operations
- Analytics and statistics

## 🏗️ Project Structure

```
civicshield-frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Navigation sidebar
│   │   ├── GlobeView.jsx           # 3D globe visualization
│   │   ├── SocialFeed.jsx          # Social feed component
│   │   ├── SubmitForm.jsx          # Complaint submission form
│   │   ├── Leaderboard.jsx         # Zone rankings
│   │   └── AdminPanel.jsx          # Admin dashboard
│   ├── mockApi.js                  # Mock API service
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Global styles
├── index.html                      # HTML template
├── package.json                    # Dependencies
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind config
├── postcss.config.js               # PostCSS config
└── README.md                       # This file
```

## 🎨 Styling

Built with **Tailwind CSS** for modern, responsive design:
- Mobile-first approach
- Dark mode ready
- Custom color scheme (primary: #FF6B6B)
- Smooth animations and transitions

## 📱 Responsive Design

- **Mobile**: Hamburger menu, stacked layout
- **Tablet**: Hybrid layout with extended sidebar
- **Desktop**: Full sidebar navigation

## 🔗 API Integration

Currently using **mock API data** from `mockApi.js`. To connect to real backend:

### Switch to Real API
Replace mock calls in components with real API endpoints:

```javascript
// Before (mock)
const complaints = await mockApi.getComplaints()

// After (real API)
const response = await fetch('http://localhost:8080/api/complaints')
const complaints = await response.json()
```

### Key API Endpoints to Connect
- `POST /api/complaints` - Submit complaint
- `GET /api/complaints` - Get all complaints
- `POST /api/social/complaints/{id}/upvote` - Upvote
- `GET /api/social/leaderboard` - Leaderboard
- `PATCH /api/admin/complaints/{id}/status` - Update status
- `POST /analyze` - AI image analysis (Python service)

## 🧪 Mock Data

Pre-populated with 12 sample complaints across 4 Noida zones:
- Sector 62 Noida
- Sector 18 Noida
- Greater Noida West
- Noida City Centre

Mix of issue types:
- Potholes
- Garbage
- Water leaks
- Broken lights
- Road damage
- Flooding

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server with HMR

# Production
npm run build        # Build optimized bundle
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

## 📦 Dependencies

### Core
- **react** (18.2.0) - UI library
- **react-dom** (18.2.0) - React rendering
- **vite** (5.0.0) - Build tool

### UI & Visualization
- **react-globe.gl** (2.25.1) - 3D globe
- **three** (r157) - 3D engine
- **react-icons** (4.12.0) - Icon library
- **tailwindcss** (3.3.6) - CSS framework

### API
- **axios** (1.6.0) - HTTP client

## 🎯 Priority Formula

```
score = (tension_score/100 * 0.45) 
      + (zone_weight * 0.35) 
      + (issue_severity * 0.20)

CRITICAL >= 0.72
HIGH     >= 0.52
MEDIUM   >= 0.32
LOW      < 0.32
```

## 🌐 CORS Configuration

Frontend runs on `http://localhost:5173`
Backend should allow this origin:

```properties
# Spring Boot application.properties
cors.allowed-origins=http://localhost:5173
```

## 🚀 Deployment

### Build
```bash
npm run build
```

Outputs optimized files to `dist/` directory.

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Push to GitHub, connect to Netlify
# Auto-deploys on push
```

### Serve Locally
```bash
npm install -g serve
serve -s dist
```

## 🔐 Security

- No sensitive data in frontend code
- API keys stored in environment variables
- CORS enabled for authorized origins only
- Input validation on all forms

## 🐛 Troubleshooting

### Port 5173 already in use
```bash
npm run dev -- --port 5174
```

### Module not found errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tailwind styles not loading
```bash
# Rebuild Tailwind
npm run build
```

### Globe not rendering
- Check browser console for WebGL errors
- Ensure Three.js is properly installed
- Try different browser (Chrome/Firefox recommended)

## 📚 Component Documentation

### GlobeView
Interactive 3D globe showing complaint locations and tension heatmap.
- Auto-rotates
- Click/drag to rotate manually
- Scroll to zoom
- Color-coded pins by priority

### SocialFeed
Twitter-like feed with real-time updates.
- Filter by priority
- Sort by recent/upvotes/tension
- Upvote complaints
- Share functionality

### SubmitForm
Multi-step complaint submission.
- Photo upload with preview
- AI analysis integration
- GPS auto-fill
- Real-time validation

### Leaderboard
Zone rankings and performance metrics.
- Resolution rate tracking
- Civic score calculation
- Community competition

### AdminPanel
Management dashboard for admins.
- Complaint search and filter
- Status management
- Analytics view
- Bulk operations

## 🔄 Real-time Updates

Currently mock data. For real-time updates with backend:

```javascript
// Use Socket.IO or Server-Sent Events (SSE)
import io from 'socket.io-client'

const socket = io('http://localhost:8080')
socket.on('complaint:new', (complaint) => {
  setComplaints(prev => [complaint, ...prev])
})
```

## 🌍 Internationalization (i18n)

Currently English only. To add i18n:

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

## 📊 Analytics Integration

Track user interactions:

```javascript
// Example: Google Analytics
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function Analytics() {
  const location = useLocation()
  useEffect(() => {
    // Track page view
    window.gtag?.pageview({
      page_path: location.pathname,
    })
  }, [location])
}
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

Issues? Check:
1. Console errors (F12 → Console)
2. Network tab (check API calls)
3. Mock data setup in mockApi.js

## 🚀 Next Steps

1. **Connect to Backend**: Replace mock API with real endpoints
2. **Add Authentication**: Implement user login/registration
3. **Real-time Updates**: Add WebSocket for live feed
4. **Progressive Web App**: Add service worker for offline support
5. **Mobile App**: Use React Native for native mobile version

---

**Version**: 1.0.0  
**Status**: ✅ Production Ready with Mock Data  
**Last Updated**: January 2024
