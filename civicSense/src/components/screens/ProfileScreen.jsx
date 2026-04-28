import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CURRENT_USER, POSTS } from "../../mockData";
import { Avatar } from "../shared/Shared";
import { useAuth } from "../../hooks/useAuth";
import { postsAPI } from "../../services/api";
import { FiGrid, FiMapPin, FiAward, FiSettings, FiShare2, FiChevronLeft } from "react-icons/fi";
import { motion } from "framer-motion";

export const ProfileScreen = ({ onPostClick, currentLocation, cityCoords }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.username || CURRENT_USER.name);
  const [bio, setBio] = useState("Passionate about keeping our city clean and safe! 🏙️\n📍 Active Reporter");
  const [activeTab, setActiveTab] = useState("posts");
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem("civicProfilePic") || null);

  const isCurrentUser = !id || id === user?.id;
  const targetUserId = isCurrentUser ? user?.id : id;

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoading(true);
      try {
        if (targetUserId) {
          try {
             const response = await postsAPI.getUserPosts(targetUserId);
             const apiPosts = response.data?.content || response.data || [];
             setUserPosts(apiPosts.map(p => ({ ...p, text: p.content || p.text || '' })));
             if (!isCurrentUser && apiPosts.length > 0) {
               setName(apiPosts[0].userName || apiPosts[0].authorUsername || 'User');
             }
          } catch(e) {
             const coords = cityCoords?.[currentLocation] || { lat: 28.6139, lon: 77.2090 };
             const response = await postsAPI.getFeed(coords.lat, coords.lon, 50, 0, 100);
             const apiPosts = response.data?.content || response.data || [];
             const filtered = apiPosts
               .filter(post => post.authorId === targetUserId || post.userId === targetUserId)
               .map(p => ({ ...p, text: p.content || p.text || '' }));
             setUserPosts(filtered);
             if (!isCurrentUser && filtered.length > 0) {
               setName(filtered[0].userName || filtered[0].authorUsername || 'User');
             }
          }
        } else {
           setUserPosts([]);
        }
      } catch (err) {
        console.error("Failed to load profile posts", err);
        setUserPosts([]);
      } finally {
        setLoading(false);
      }
    };
    if (user !== undefined) {
      fetchUserPosts();
    }
  }, [user, currentLocation]);

  const badges = [
    { emoji: "🛡️", name: "Street Guardian", desc: "10+ verified posts", unlocked: true },
    { emoji: "🔍", name: "First Reporter", desc: "First to report 5+ issues", unlocked: true },
    { emoji: "⚠️", name: "Safety Watcher", desc: "5+ verified safety reports", unlocked: true },
  ];

  return (
    <div className="w-full flex flex-col bg-transparent min-h-screen text-white pb-20">
      
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-4 h-14 sticky top-0 bg-[#020617]/80 backdrop-blur-xl z-30 border-b border-white/5">
        <div className="flex items-center gap-4">
          {!isCurrentUser && (
            <button onClick={() => navigate(-1)} className="text-white hover:opacity-70 transition-opacity">
              <FiChevronLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className="font-bold text-lg text-white tracking-tight">{name.toLowerCase().replace(/\s/g, '_')}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-white hover:opacity-70 transition-opacity"><FiShare2 className="w-5 h-5" /></button>
          {isCurrentUser && <button className="text-white hover:opacity-70 transition-opacity"><FiSettings className="w-5 h-5" /></button>}
        </div>
      </div>

      {/* Cover Background */}
      <div className="h-32 md:h-48 w-full bg-gradient-to-r from-primary to-secondary relative">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Profile Header section */}
      <div className="px-4 relative -mt-12 md:-mt-16 mb-4">
        <div className="flex justify-between items-end mb-4">
          {/* Circular Avatar */}
          <div className="relative group">
            <label className={`block w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#020617] overflow-hidden bg-[#0f172a] shadow-xl relative ${isCurrentUser ? 'cursor-pointer' : ''}`}>
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Avatar
                  initials={name.substring(0, 2).toUpperCase()}
                  bg="#1e293b"
                  color="#fff"
                  size="full"
                />
              )}
              {isCurrentUser && (
                <>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold text-center">Change</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setProfilePic(e.target.result);
                          localStorage.setItem("civicProfilePic", e.target.result);
                        };
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }} 
                  />
                </>
              )}
            </label>
            
            {/* Instagram-style Plus Icon for Current User */}
            {isCurrentUser && (
              <div className="absolute bottom-1 right-1 bg-primary text-white text-lg w-7 h-7 flex items-center justify-center rounded-full border-2 border-[#020617] shadow-lg pointer-events-none">
                +
              </div>
            )}
            
            {/* Verified Badge for other users */}
            {!isCurrentUser && CURRENT_USER.isVerified && (
              <div className="absolute bottom-1 right-1 bg-primary text-white text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#020617]">
                ✓
              </div>
            )}
          </div>

          {/* Edit Profile Button */}
          {isCurrentUser && (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-1.5 bg-[#0f172a] border border-white/20 rounded-full text-sm font-bold text-white hover:bg-white/10 transition-colors"
            >
              {isEditing ? "Save" : "Edit profile"}
            </button>
          )}
        </div>

        {/* Bio */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white leading-tight">{name}</h2>
          <p className="text-sm text-text-secondary mb-2">Civic Score: <span className="text-success font-bold">{CURRENT_USER.points}</span></p>
          
          {isEditing ? (
            <textarea 
              className="w-full mt-2 p-3 bg-[#0f172a] border border-white/20 text-white rounded-xl focus:outline-none focus:border-primary text-sm transition-all" 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              rows={3}
            />
          ) : (
            <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed mt-2">{bio}</p>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 py-3 border-y border-white/10">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-white">{userPosts.length}</span>
            <span className="text-[11px] text-text-secondary uppercase tracking-wide">Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-white">428</span>
            <span className="text-[11px] text-text-secondary uppercase tracking-wide">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-success">{CURRENT_USER.points}</span>
            <span className="text-[11px] text-text-secondary uppercase tracking-wide">Civic Score</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button 
          onClick={() => setActiveTab("posts")}
          className={`flex-1 flex justify-center py-3 transition-colors relative ${activeTab === 'posts' ? 'text-white' : 'text-text-secondary hover:text-white'}`}
        >
          <FiGrid className="w-6 h-6" />
          {activeTab === 'posts' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 w-full h-0.5 bg-primary" />}
        </button>
        <button 
          onClick={() => setActiveTab("locations")}
          className={`flex-1 flex justify-center py-3 transition-colors relative ${activeTab === 'locations' ? 'text-white' : 'text-text-secondary hover:text-white'}`}
        >
          <FiMapPin className="w-6 h-6" />
          {activeTab === 'locations' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 w-full h-0.5 bg-primary" />}
        </button>
        <button 
          onClick={() => setActiveTab("badges")}
          className={`flex-1 flex justify-center py-3 transition-colors relative ${activeTab === 'badges' ? 'text-white' : 'text-text-secondary hover:text-white'}`}
        >
          <FiAward className="w-6 h-6" />
          {activeTab === 'badges' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 w-full h-0.5 bg-primary" />}
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : activeTab === "posts" ? (
          <div className="grid grid-cols-3 gap-1 mt-1">
            {userPosts.length === 0 ? (
              <div className="col-span-3 flex flex-col items-center justify-center py-20 text-text-secondary">
                <FiGrid className="w-12 h-12 mb-4 opacity-50" />
                <p className="font-bold text-lg">No Posts Yet</p>
              </div>
            ) : (
              userPosts.map((post) => {
                let imageUrl = null;
                const raw = post.imageUrl || post.image;
                if (raw && raw !== "null" && raw !== "undefined") {
                  imageUrl = (raw.startsWith("http") || raw.startsWith("data:")) ? raw : `${import.meta.env.VITE_API_URL || 'https://your-backend-url'}${raw.startsWith('/') ? '' : '/'}${raw}`;
                } else if (post.hasPhoto) {
                  imageUrl = `https://picsum.photos/seed/${post.id}/800/800`;
                }

                return (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={post.id}
                    onClick={() => onPostClick(post)}
                    className="aspect-square bg-[#0f172a] relative overflow-hidden group cursor-pointer"
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onError={(e) => { e.target.src = 'https://placehold.co/400x400/1e293b/fff?text=Image+Unavailable'; }} />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-gradient-to-br from-[#1e293b] to-[#0f172a]">
                        <span className="text-2xl mb-1">
                          {post.type === "CIVIC" ? "🏗️" : post.type === "CRIME" ? "🚨" : post.type === "ENVIRONMENT" ? "🌿" : "⚠️"}
                        </span>
                        <p className="text-[9px] md:text-xs text-text-secondary text-center line-clamp-3 leading-tight italic px-1">
                          "{post.text || post.content}"
                        </p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex gap-4 font-bold">
                        <span>❤️ {post.upvotes || 0}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        ) : activeTab === "locations" ? (
          <div className="p-4">
            <h3 className="text-sm font-bold text-text-secondary mb-4 uppercase tracking-widest">Active Areas</h3>
            <div className="space-y-3">
              {[...new Set(userPosts.map(p => p.area || p.locationLabel || "Unknown"))].map((loc, i) => (
                <div key={i} className="bg-[#0f172a] p-4 rounded-xl border border-white/5 flex justify-between items-center hover:bg-white/5 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📍</span>
                    <span className="font-bold text-white">{loc}</span>
                  </div>
                  <span className="text-xs text-primary font-bold bg-primary/10 px-3 py-1 rounded-full">
                    {userPosts.filter(p => (p.area || p.locationLabel || "Unknown") === loc).length} Reports
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4">
            <h3 className="text-sm font-bold text-text-secondary mb-4 uppercase tracking-widest">Civic Achievements</h3>
            <div className="grid grid-cols-1 gap-4">
              {badges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-[#0f172a] p-4 rounded-xl border border-white/5">
                  <div className="w-14 h-14 rounded-full bg-[#1e293b] flex items-center justify-center text-3xl shadow-inner border border-white/10">
                    {badge.emoji}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{badge.name}</h4>
                    <p className="text-xs text-text-secondary mt-1">{badge.desc}</p>
                    <div className="mt-2 h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: badge.unlocked ? "100%" : "30%" }}></div>
                    </div>
                  </div>
                  {badge.unlocked && <span className="text-success text-xl">✓</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
