import React, { useState, useEffect } from "react";
import { PostModal } from "./components/screens/PostModal";
import { PostCard } from "./components/feed/PostCard";
import { FeedScreen } from "./components/screens/FeedScreen";
import { ProfileScreen } from "./components/screens/ProfileScreen";
import { TrendingScreen } from "./components/screens/TrendingScreen";
import { AreaScoreScreen } from "./components/screens/AreaScoreScreen";
import { BottomNav } from "./components/layout/Navigation";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Toast } from "./components/shared/Shared";
import { useAuth } from "./hooks/useAuth";
import { postsAPI } from "./services/api";
import { FiHome, FiTrendingUp, FiMap, FiUser, FiBell, FiFilter, FiSearch, FiMapPin, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const CITY_COORDS = {
  "📍 Sector 62, Noida": { lat: 28.625, lon: 77.37 },
  "📍 Delhi": { lat: 28.6139, lon: 77.2090 },
  "📍 Mumbai": { lat: 19.0760, lon: 72.8777 }
};

export default function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [appMode, setAppMode] = useState('feed'); // 'feed' | 'dashboard'
  const [activeScreen, setActiveScreen] = useState('feed');
  const [currentLocation, setCurrentLocation] = useState(() => localStorage.getItem("civicCity") || "📍 Sector 62, Noida");
  const [showPostModal, setShowPostModal] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const [posts, setPosts] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [selectedMapPost, setSelectedMapPost] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [showCitySelector, setShowCitySelector] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNotify = (msg) => {
    setToastMessage(msg);
    setShowNotificationToast(true);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/dashboard')) {
      setAppMode('dashboard');
    } else {
      setAppMode('feed');
      if (location.pathname === '/' || location.pathname === '/feed') setActiveScreen('feed');
      else if (location.pathname === '/area') setActiveScreen('area');
      else if (location.pathname === '/trending') setActiveScreen('trending');
      else if (location.pathname.startsWith('/profile')) setActiveScreen('profile');
    }
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("civicCity", currentLocation);

    const fetchDashboardData = async () => {
      const coords = CITY_COORDS[currentLocation] || CITY_COORDS["📍 Delhi"];
      try {
        const response = await postsAPI.getFeed(coords.lat, coords.lon, 50, 0, 30);
        const fetchedPosts = response.data?.content || response.data || [];
        setPosts(fetchedPosts.map(p => ({
          ...p,
          text: p.content || p.text || '',
        })));
        
        const critical = fetchedPosts.filter(p => p.aiTag && (p.aiTag.toLowerCase().includes('critical') || p.aiTag.toLowerCase().includes('high')));
        if (critical.length > 0) {
          setActiveAlerts(critical.map(c => ({
            id: c.id,
            icon: c.aiTag.toLowerCase().includes('critical') ? '🔴' : '🟠',
            text: c.content || c.text || 'Alert reported',
            time: 'Live'
          })));
        } else {
          setActiveAlerts([]);
        }
      } catch (err) {
        // Silently handle errors in dashboard fetch
      }
    };
    
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [currentLocation]);

  const getScreenComponent = () => {
    switch (activeScreen) {
      case "feed":
        return <FeedScreen currentLocation={currentLocation} cityCoords={CITY_COORDS} onNotify={handleNotify} />;
      case "area":
        return <AreaScoreScreen currentLocation={currentLocation} cityCoords={CITY_COORDS} />;
      case "trending":
        return <TrendingScreen currentLocation={currentLocation} cityCoords={CITY_COORDS} />;
      case "profile":
        return <ProfileScreen onPostClick={setSelectedMapPost} currentLocation={currentLocation} cityCoords={CITY_COORDS} />;
      default:
        return <FeedScreen />;
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#020617] to-[#0f172a] text-white overflow-hidden flex flex-col font-sans relative">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* TOP BAR */}
      <header className="h-16 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 lg:px-6 z-40">
        <div className="flex items-center gap-2 lg:gap-3">
          <span className="text-xl lg:text-2xl">🌐</span>
          <h1 className="text-lg lg:text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary hidden sm:block">CIVICSENSE</h1>
        </div>
        
        {/* HYBRID TOGGLE */}
        <div className="flex bg-[#0f172a] border border-white/10 p-1 rounded-full backdrop-blur-md mx-2 shadow-inner">
          <button 
            onClick={() => navigate('/')} 
            className={`px-3 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-bold transition-all ${appMode === 'feed' ? 'bg-gradient-to-r from-primary to-secondary shadow-[0_0_15px_rgba(139,92,246,0.3)] text-white' : 'text-text-secondary hover:text-white'}`}
          >
            Feed
          </button>
          <button 
            onClick={() => navigate('/dashboard/live')} 
            className={`px-3 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-bold transition-all ${appMode === 'dashboard' ? 'bg-gradient-to-r from-primary to-secondary shadow-[0_0_15px_rgba(139,92,246,0.3)] text-white' : 'text-text-secondary hover:text-white'}`}
          >
            Dashboard
          </button>
        </div>

        {/* City Selector Button */}
        <div className="flex-1 flex justify-center">
          <button 
            onClick={() => setShowCitySelector(true)}
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-full hover:bg-white/10 transition-all backdrop-blur-md text-sm font-medium"
          >
            <FiMapPin className="text-primary" />
            <span className="hidden sm:inline">{currentLocation}</span>
            <FiChevronDown className="text-text-secondary" />
          </button>
        </div>

        <div className="flex items-center gap-4 relative">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-text-primary">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-white/5 rounded-full transition-colors">
             <FiBell className="w-5 h-5 text-text-primary hover:text-white transition-colors" />
             {activeAlerts.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-critical rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)] border border-[#020617]"></span>}
          </button>
          
          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-12 right-0 w-80 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h3 className="font-bold text-white">Notifications</h3>
                  <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">{activeAlerts.length} New</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {activeAlerts.length > 0 ? activeAlerts.map((alert, i) => (
                    <div key={i} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-3">
                      <div className="text-2xl mt-1">{alert.icon}</div>
                      <div>
                        <p className="text-sm text-gray-200 leading-tight mb-1">{alert.text}</p>
                        <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider">{alert.time}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-text-secondary">
                      <FiBell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No new notifications</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-9 h-9 rounded-full bg-[#1e293b] flex items-center justify-center font-bold border border-white/10 shadow-sm cursor-pointer hover:border-primary transition-colors" onClick={logout}>
            {user?.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
          </div>
        </div>
      </header>

      {/* MAIN HYBRID CONTENT */}
      {appMode === 'dashboard' ? (
        <main className="flex-1 flex overflow-hidden p-4 gap-4 z-10 relative">
          {/* ... dashboard content unchanged ... */}
          {/* Dashboard Left Panel */}
          <aside className="hidden lg:flex flex-col w-[20%] gap-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg flex-1 overflow-y-auto">
              <h3 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-4">Command Modules</h3>
              <nav className="space-y-2 mb-8">
                {[
                  { id: "map", label: "Live Intelligence", icon: FiMap, path: "/dashboard/live" },
                  { id: "trending", label: "Trend Analysis", icon: FiTrendingUp, path: "/dashboard/trends" },
                  { id: "feed", label: "Data Stream", icon: FiHome, path: "/dashboard/stream" },
                  { id: "profile", label: "Operator Profile", icon: FiUser, path: "/dashboard/profile" }
                ].map(item => (
                  <button key={item.id} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'hover:bg-white/5 text-slate-300 border border-transparent'}`}>
                     <item.icon className="w-5 h-5" />
                     <span className="font-semibold text-sm">{item.label}</span>
                  </button>
                ))}
              </nav>

              <h3 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-4 flex items-center gap-2"><FiFilter /> Filters</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                 {['ALL', 'CRIME', 'SAFETY', 'CIVIC', 'ENV'].map(f => (
                   <button key={f} className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${f === 'ALL' ? 'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}>
                     {f}
                   </button>
                 ))}
              </div>

              <h3 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-4">Recent Alerts</h3>
              <div className="space-y-3">
                 {activeAlerts.slice(0,4).map((alert, i) => (
                   <div key={i} className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                         <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">{alert.time}</span>
                      </div>
                      <p className="text-xs text-red-100 line-clamp-2">{alert.text}</p>
                   </div>
                 ))}
                 {activeAlerts.length === 0 && <p className="text-xs text-slate-500 italic">No recent alerts registered.</p>}
              </div>
            </div>
            
            <button onClick={() => setShowPostModal(true)} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-2xl font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all hover:scale-[1.02] flex justify-center items-center gap-2">
              <span className="text-xl">📡</span> Transmit Data
            </button>
          </aside>

          {/* Dashboard Center Panel */}
          <section className="w-full lg:w-[60%] flex flex-col relative">
            <Routes>
              <Route path="/dashboard/live" element={
                <CityMapVis posts={posts} onPostClick={setSelectedMapPost} />
              } />
              <Route path="/dashboard/trends" element={
                <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                   {React.createElement(React.lazy(() => import('./components/screens/dashboard/TrendAnalysis').then(m => ({default: m.TrendAnalysis}))))}
                </React.Suspense>
              } />
              <Route path="/dashboard/stream" element={
                <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                   {React.createElement(React.lazy(() => import('./components/screens/dashboard/DataStream').then(m => ({default: m.DataStream}))))}
                </React.Suspense>
              } />
              <Route path="/dashboard/profile" element={
                <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                   {React.createElement(React.lazy(() => import('./components/screens/dashboard/OperatorProfile').then(m => ({default: m.OperatorProfile}))))}
                </React.Suspense>
              } />
              <Route path="*" element={<CityMapVis posts={posts} onPostClick={setSelectedMapPost} />} />
            </Routes>
          </section>

          {/* Dashboard Right Panel */}
          <aside className="hidden lg:flex flex-col w-[20%] gap-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg relative overflow-hidden flex flex-col items-center text-center">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 blur-[40px] rounded-full"></div>
              <h3 className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-4 relative z-10">Area Health Score</h3>
              <div className="w-32 h-32 rounded-full bg-slate-900 border-4 border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.2)] relative z-10 mb-2">
                 <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600">84</span>
              </div>
              <p className="text-xs font-semibold text-cyan-300 relative z-10">Optimum Levels • +2% this week</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg flex-1">
              <h3 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-4">Live Analytics</h3>
              
              <div className="mb-6">
                 <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-300">Resolution Rate</span>
                    <span className="text-green-400 font-bold">78%</span>
                 </div>
                 <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-600 h-full rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" style={{ width: '78%' }}></div>
                 </div>
              </div>

              <div className="mb-6">
                 <h4 className="text-[10px] text-slate-400 uppercase mb-3">Issue Distribution</h4>
                 <div className="flex h-3 w-full rounded-full overflow-hidden mb-3 shadow-inner">
                   <div className="bg-blue-500 hover:opacity-80 transition-opacity cursor-pointer" style={{ width: '45%' }} title="Civic: 45%"></div>
                   <div className="bg-red-500 hover:opacity-80 transition-opacity cursor-pointer" style={{ width: '25%' }} title="Crime: 25%"></div>
                   <div className="bg-green-500 hover:opacity-80 transition-opacity cursor-pointer" style={{ width: '20%' }} title="Environment: 20%"></div>
                   <div className="bg-yellow-500 hover:opacity-80 transition-opacity cursor-pointer" style={{ width: '10%' }} title="Safety: 10%"></div>
                 </div>
                 <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-slate-300">Civic (45%)</span></div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="text-slate-300">Crime (25%)</span></div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="text-slate-300">Env (20%)</span></div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span><span className="text-slate-300">Safety (10%)</span></div>
                 </div>
              </div>

              <div>
                 <h4 className="text-[10px] text-slate-400 uppercase mb-3">Trending Categories</h4>
                 <div className="flex flex-wrap gap-2">
                    {['Potholes 🔥', 'Water Leak', 'Streetlights', 'Garbage'].map((cat, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-indigo-200">
                         {cat}
                      </span>
                    ))}
                 </div>
              </div>
            </div>
          </aside>
        </main>
      ) : (
        <div className="flex-1 flex justify-center w-full relative z-10 overflow-y-auto overflow-x-hidden pt-4 pb-24">
          {/* FEED MODE: CENTER PANEL ONLY (Max width 600px like Instagram) */}
          <div className="w-full max-w-[600px] px-4 min-h-full">
            <Routes>
              <Route path="/" element={<FeedScreen currentLocation={currentLocation} cityCoords={CITY_COORDS} onNotify={handleNotify} refreshTrigger={refreshTrigger} />} />
              <Route path="/feed" element={<FeedScreen currentLocation={currentLocation} cityCoords={CITY_COORDS} onNotify={handleNotify} refreshTrigger={refreshTrigger} />} />
              <Route path="/area" element={<AreaScoreScreen currentLocation={currentLocation} cityCoords={CITY_COORDS} />} />
              <Route path="/trending" element={<TrendingScreen currentLocation={currentLocation} cityCoords={CITY_COORDS} />} />
              <Route path="/profile" element={<ProfileScreen onPostClick={setSelectedMapPost} currentLocation={currentLocation} cityCoords={CITY_COORDS} />} />
              <Route path="/profile/:id" element={<ProfileScreen onPostClick={setSelectedMapPost} currentLocation={currentLocation} cityCoords={CITY_COORDS} />} />
            </Routes>
          </div>
        </div>
      )}

      {/* Global Bottom Navigation */}
      <BottomNav 
        activeScreen={activeScreen} 
        setActiveScreen={setActiveScreen} 
        navigate={navigate}
        onPostClick={() => setShowPostModal(true)}
      />

      {/* Post Modal */}
      {showPostModal && (
        <PostModal
          onClose={() => setShowPostModal(false)}
          onSubmit={() => {
            setShowPostModal(false);
            setRefreshTrigger(prev => prev + 1);
            handleNotify("Data transmitted successfully. 📡");
          }}
          currentLocation={currentLocation}
        />
      )}

      {/* Post Detail Viewer Modal */}
      {selectedMapPost && (
        <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-md relative animate-scale-up-fade my-auto">
              <button onClick={() => setSelectedMapPost(null)} className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md text-white border border-white/20 transition-all z-10">
                ✕
              </button>
              <PostCard 
                post={selectedMapPost} 
                onDelete={async (id) => {
                  try {
                    await postsAPI.deletePost(id);
                    setSelectedMapPost(null);
                    setRefreshTrigger(prev => prev + 1);
                    handleNotify("Post deleted 🗑️");
                  } catch(e) {
                    console.error("Failed to delete from map", e);
                  }
                }}
              />
            </div>
        </div>
      )}

      {/* City Selector Modal */}
      <AnimatePresence>
        {showCitySelector && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowCitySelector(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/10">
                <h2 className="text-lg font-bold text-white mb-4">Select City</h2>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input 
                    type="text" 
                    placeholder="Search cities..." 
                    className="w-full bg-[#1e293b] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {Object.keys(CITY_COORDS).filter(c => c.toLowerCase().includes(citySearchQuery.toLowerCase())).map(city => (
                  <button 
                    key={city}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center justify-between ${currentLocation === city ? 'bg-primary/20 text-primary font-bold' : 'text-text-primary hover:bg-white/5'}`}
                    onClick={() => { setCurrentLocation(city); setShowCitySelector(false); }}
                  >
                    <span>{city}</span>
                    {currentLocation === city && <span className="text-primary">✓</span>}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Toast */}
      {showNotificationToast && (
        <Toast
          message={toastMessage || "New intelligence gathered 🔔"}
          onClose={() => setShowNotificationToast(false)}
        />
      )}
    </div>
  );
}

const CityMapVis = ({ posts, onPostClick }) => {
  return (
    <div className="w-full h-full relative bg-[#040914] border border-white/10 rounded-2xl overflow-hidden shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
       {/* High-tech Map Background */}
       <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.2) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
       <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
       
       {/* Radar Scanner Sweep */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-indigo-500/10 rounded-full pointer-events-none"></div>
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-indigo-500/20 rounded-full pointer-events-none"></div>
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-indigo-500/30 rounded-full pointer-events-none"></div>
       <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] border-t-2 border-indigo-500 origin-top-left animate-spin rounded-tl-full pointer-events-none" style={{ animationDuration: '4s', opacity: 0.2 }}></div>

       {/* Render Glowing Points */}
       {posts.map((post) => {
          // Deterministic pseudo-random position
          const idNum = typeof post.id === 'string' ? post.id.charCodeAt(0) : post.id || Math.random() * 100;
          const top = `${10 + ((idNum * 17) % 80)}%`;
          const left = `${10 + ((idNum * 23) % 80)}%`;
          
          let colorClass = "bg-green-500 shadow-[0_0_15px_#22c55e]";
          let ringClass = "border-green-400";
          
          const tag = (post.aiTag || "").toLowerCase();
          if(tag.includes('critical')) {
             colorClass = "bg-red-500 shadow-[0_0_20px_#ef4444] animate-pulse";
             ringClass = "border-red-400";
          } else if(tag.includes('high')) {
             colorClass = "bg-orange-500 shadow-[0_0_15px_#f97316]";
             ringClass = "border-orange-400";
          } else if(tag.includes('medium')) {
             colorClass = "bg-yellow-500 shadow-[0_0_15px_#eab308]";
             ringClass = "border-yellow-400";
          }
          
          return (
             <div key={post.id} className="absolute group cursor-pointer hover:scale-150 transition-transform z-20" style={{ top, left }} onClick={() => onPostClick(post)}>
                 <div className={`absolute -inset-2 border ${ringClass} rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping`}></div>
                 <div className={`w-3 h-3 rounded-full ${colorClass} border border-white/50 relative z-10`}></div>
                 
                 {/* HUD Tooltip */}
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col w-48 bg-[#020617]/90 p-3 rounded-lg backdrop-blur-md border border-white/20 text-white z-50 pointer-events-none shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                    <span className="text-[9px] uppercase tracking-wider text-indigo-400 mb-1 border-b border-white/10 pb-1">ID: {post.id}</span>
                    <span className="text-xs font-bold line-clamp-2 leading-tight">{post.text?.substring(0, 50)}...</span>
                 </div>
             </div>
          )
       })}
       
       {/* Map Legend */}
       <div className="absolute bottom-4 left-4 bg-[#0f172a]/80 p-4 rounded-xl border border-white/10 backdrop-blur-md z-10">
           <h4 className="text-xs font-bold text-indigo-300 mb-3 uppercase tracking-widest">Severity Matrix</h4>
           <div className="flex flex-col gap-2 text-[10px] font-bold text-slate-300">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse"></span> CRITICAL ALERT</span>
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></span> HIGH PRIORITY</span>
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]"></span> MEDIUM IMPACT</span>
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span> STANDARD LOG</span>
           </div>
       </div>
       
       {/* Map Header Overlay */}
       <div className="absolute top-4 left-4 z-10">
          <div className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded border border-indigo-500/30 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm shadow-[0_0_10px_rgba(99,102,241,0.2)]">
             Sector Scan Active
          </div>
       </div>
    </div>
  )
}
