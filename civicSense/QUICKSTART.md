# CivicShield Frontend - Quick Start Guide

Get the React frontend running in **5 minutes** with mock data.

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd civicshield-frontend
npm install
```
⏱️ Takes ~2-3 minutes

### Step 2: Start Development Server
```bash
npm run dev
```
Output:
```
VITE v5.0.0  ready in 324 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Step 3: Open Browser
Navigate to: **http://localhost:5173**

### Step 4: Explore!
You'll see 5 screens with mock data:
- 🌍 **Globe View** - Interactive 3D complaint visualization
- 📱 **Social Feed** - Twitter-style complaint feed
- 📸 **Report Issue** - Submit new complaints
- 🏆 **Leaderboard** - Zone rankings
- ⚙️ **Admin Panel** - Complaint management

**That's it!** ✅

---

## 🎮 Interactive Demo

### Try These Features:

#### 1. **Explore the Globe** 🌍
- Move mouse to rotate
- Scroll to zoom in/out
- Click a pin to see complaint details
- Watch auto-rotation (or disable in toggle)

#### 2. **Sort Social Feed** 📱
- Click "Filter by Priority" → select CRITICAL/HIGH
- Click "Sort by" → Recent/Upvotes/Tension
- Click heart icon to upvote complaints

#### 3. **Submit a Complaint** 📸
- Click "Report Issue"
- Upload any image (mock AI will analyze)
- Set location (auto-filled with mock GPS)
- Select zone type
- Click "Submit Complaint"
- See AI analysis results

#### 4. **Check Leaderboard** 🏆
- View zone rankings
- See resolution rates
- Check civic scores

#### 5. **Admin Dashboard** ⚙️
- Search complaints by description
- Filter by status (PENDING/IN_PROGRESS/RESOLVED)
- Click "Update Status" to change complaint state
- Expand rows for full details

---

## 📂 Project Structure

```
civicshield-frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation
│   │   ├── GlobeView.jsx     # 3D Globe
│   │   ├── SocialFeed.jsx    # Feed
│   │   ├── SubmitForm.jsx    # Form
│   │   ├── Leaderboard.jsx   # Rankings
│   │   └── AdminPanel.jsx    # Admin
│   ├── mockApi.js            # Fake API
│   ├── App.jsx               # Main app
│   ├── main.jsx              # Entry
│   └── index.css             # Styles
├── package.json              # Dependencies
├── vite.config.js            # Vite config
└── tailwind.config.js        # Tailwind
```

---

## 📦 What's Included

### 12 Pre-loaded Complaints
Across 4 Noida zones:
- **Sector 62 Noida** (Residential)
- **Sector 18 Noida** (Market)
- **Greater Noida West** (Commercial)
- **Noida City Centre** (School/Hospital)

### Sample Issues
- 🕳️ Potholes
- 🗑️ Garbage
- 💧 Water leaks
- 💡 Broken lights
- 🛣️ Road damage
- 🌊 Flooding

### Priority Levels
- 🔴 **CRITICAL** (Tension 70+)
- 🟠 **HIGH** (Tension 50-69)
- 🟡 **MEDIUM** (Tension 30-49)
- 🟢 **LOW** (Tension <30)

---

## 🔧 Available Commands

```bash
# Development - Hot reload enabled
npm run dev

# Production build - Optimized bundle
npm run build

# Preview build locally
npm run preview

# Open Vite UI
npm run dev --open

# Install new dependency
npm install [package-name]
```

---

## 📱 Responsive Design

### Desktop
- Full sidebar on left
- Main content on right
- All features visible

### Tablet
- Reduced sidebar width
- Responsive grid layouts

### Mobile
- Hamburger menu (☰ icon)
- Stacked layouts
- Touch-friendly buttons

**Test**: Open DevTools (F12) → Toggle device toolbar (Ctrl+Shift+M)

---

## 🎨 Customization

### Change Primary Color
Edit `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    colors: {
      primary: '#FF6B6B'  // Change this hex
    }
  }
}
```

### Add Dark Mode
```bash
npm install next-themes
```

### Change Mock Data
Edit `src/mockApi.js`:
```javascript
export const MOCK_COMPLAINTS = [
  // Add/modify complaints here
  {
    id: 1,
    description: "Your complaint",
    // ...
  }
]
```

---

## 🐛 Troubleshooting

### Issue: Port 5173 already in use
**Solution:**
```bash
npm run dev -- --port 5174
```

### Issue: "Module not found"
**Solution:**
```bash
rm -rf node_modules
npm install
npm run dev
```

### Issue: Styles not loading
**Solution:**
```bash
# Clear Vite cache
rm -rf .vite
npm run dev
```

### Issue: Globe not showing
**Solution:**
- Check if WebGL is enabled in browser
- Try different browser (Chrome/Firefox)
- Check browser console (F12)

### Issue: npm install stuck
**Solution:**
```bash
# Clear npm cache
npm cache clean --force
npm install
```

---

## 🔌 Connect to Real Backend

Currently using mock data. To connect to real API:

### Step 1: Update Base URL
Edit `src/mockApi.js`:
```javascript
// Change this:
// Mock API

// To this:
import axios from 'axios'
const API_URL = 'http://localhost:8080/api'
const api = axios.create({ baseURL: API_URL })
```

### Step 2: Replace Mock Functions
```javascript
// Before:
export async function getComplaints() {
  return MOCK_COMPLAINTS
}

// After:
export async function getComplaints() {
  const { data } = await api.get('/complaints')
  return data
}
```

### Step 3: Start Backend
```bash
cd ../civicshield-backend
mvn spring-boot:run
```

### Step 4: Start AI Service (Optional)
```bash
cd ../ai-service
python -m uvicorn app:app --port 5000
```

### Step 5: Reload Frontend
```bash
npm run dev
```

Frontend will now connect to real endpoints! ✅

---

## 📊 Mock Data Structure

Complaint object:
```javascript
{
  id: 1,
  description: "Pothole on main road",
  imageUrl: "https://...",
  location: { lat: 28.5355, lng: 77.3910 },
  zone: "Sector 62 Noida",
  priority: "CRITICAL",
  status: "PENDING",
  tension: 75,
  upvotes: 23,
  submittedBy: "John Doe",
  submittedAt: "2024-01-15",
  issueType: "Pothole",
  resolutionRate: 0.45,
  lastUpdated: "2024-01-20"
}
```

---

## 🎯 Next Steps

1. ✅ **Frontend Running** - You're here!
2. 🔄 **Connect Backend** - Follow "Connect to Real Backend" above
3. 🔐 **Add Authentication** - Add login/signup screens
4. 🌐 **Deploy** - Push to Vercel/Netlify
5. 📱 **Mobile App** - Build React Native version

---

## 📚 Documentation

- [README.md](./README.md) - Full documentation
- [Backend](../civicshield-backend/README.md) - Spring Boot setup
- [AI Service](../ai-service/README.md) - Python FastAPI setup

---

## 🆘 Need Help?

1. Check console for errors: `F12 → Console`
2. Check network tab: `F12 → Network`
3. Check mock data: `src/mockApi.js`
4. Check component: Search in `src/components/`

---

## ✨ Features at a Glance

| Feature | Status | Details |
|---------|--------|---------|
| Globe View | ✅ | 3D visualization with pins |
| Social Feed | ✅ | Sort, filter, upvote |
| Submit Form | ✅ | Upload, AI analysis, GPS |
| Leaderboard | ✅ | Zone rankings, scores |
| Admin Panel | ✅ | Search, filter, update status |
| Mock Data | ✅ | 12 seed complaints |
| Responsive | ✅ | Mobile, tablet, desktop |
| Real Backend | ⏳ | Switch in mockApi.js |
| Authentication | ⏳ | Login/signup screens |
| Notification | ⏳ | Real-time updates |

---

**Get started now!** 🚀
```bash
npm run dev
```

Then visit: http://localhost:5173

Enjoy exploring CivicShield! 🛡️
