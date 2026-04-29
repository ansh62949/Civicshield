import React, { useState, useEffect } from "react";
import { postsAPI } from "../../services/api";
import { PostCard, GeoAlertCard } from "../feed/PostCard";
import { POSTS } from "../../mockData";

const calculateTrendScore = (post) => {
  const upvotes = post.upvotes || 0;
  // civicImpact might be string like "+5 pts" or null
  const impactMatch = post.civicImpact ? post.civicImpact.match(/([+-]\d+)/) : null;
  const impact = impactMatch ? parseInt(impactMatch[1], 10) : 0;
  
  // recency logic: newer posts get a boost
  const hoursOld = post.createdAt ? (new Date() - new Date(post.createdAt)) / 3600000 : 24;
  const recencyBoost = Math.max(0, 24 - hoursOld) * 2;
  
  return upvotes * 2 + Math.abs(impact) * 5 + recencyBoost;
};

export const TrendingScreen = ({ currentLocation, cityCoords }) => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [hotLocalPosts, setHotLocalPosts] = useState([]);
  const [trendingTags, setTrendingTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingData = async () => {
      setLoading(true);
      try {
        // Fetch Trends
        const trendResponse = await postsAPI.getTrending();
        const apiTrends = trendResponse.data?.trends || [];
        
        if (apiTrends.length > 0) {
          const emojiMap = { ROAD: "🏗️", GARBAGE: "🗑️", WATER: "💧", CRIME: "🚨", OTHER: "📝", SAFETY: "🛡️" };
          const tags = apiTrends.map(t => ({
            emoji: emojiMap[t.category] || "🔥",
            label: t.category,
            count: t.count,
            trend: `+${t.growth}% this week`
          }));
          setTrendingTags(tags);
        }

        // Fetch Posts
        const coords = cityCoords?.[currentLocation] || { lat: 28.6139, lon: 77.2090 };
        const response = await postsAPI.getFeed(coords.lat, coords.lon, 50, 0, 20);
        const apiPosts = response.data?.content || response.data || [];
        
        const mappedPosts = apiPosts.map(p => ({
          ...p,
          text: p.content || p.text || '',
          userName: p.authorUsername || p.user || "Civic User",
          userInitials: (p.authorUsername || p.user || "CU").substring(0, 2).toUpperCase(),
          area: p.locationLabel || p.area || "Unknown Area",
          timeAgo: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Recently",
          comments: Array.isArray(p.comments) ? p.comments.length : (p.comments || 0),
          hasPhoto: !!(p.imageUrl || p.image),
          imageUrl: p.imageUrl ? (p.imageUrl.startsWith('http') ? p.imageUrl : `${import.meta.env.VITE_API_URL || 'https://civicshield-1-om60.onrender.com'}${p.imageUrl}`) : null,
        }));

        const finalPosts = mappedPosts.length > 0 ? mappedPosts : POSTS;

        // Sort by custom trending formula
        const sortedPosts = [...finalPosts].sort((a, b) => calculateTrendScore(b) - calculateTrendScore(a));
        
        setTrendingPosts(sortedPosts.slice(0, 5));
        
        // Mock filter for hot local posts based on current location
        const localArea = currentLocation ? currentLocation.replace("📍 ", "") : "Noida";
        const localPosts = sortedPosts.filter(p => (p.area||"").includes(localArea) || (p.area||"").includes("Sector 62"));
        setHotLocalPosts(localPosts.length > 0 ? localPosts.slice(0, 3) : sortedPosts.slice(0, 3));

        // Aggregate tags
        const tagCounts = {};
        finalPosts.forEach(p => {
          const type = p.type || 'CIVIC';
          tagCounts[type] = (tagCounts[type] || 0) + 1;
        });

        const emojiMap = { CIVIC: "🏗️", SAFETY: "🛡️", CRIME: "🚨", ENVIRONMENT: "🌿", NEWS: "📰", GEO_ALERT: "📍" };
        const tags = Object.keys(tagCounts).map(type => ({
          emoji: emojiMap[type] || "🔥",
          label: type,
          count: tagCounts[type],
          trend: "+5% this week" // Mocked trend line
        })).sort((a, b) => b.count - a.count).slice(0, 5);

        setTrendingTags(tags);
      } catch (err) {
        console.error("Failed to fetch trending data", err);
        const sortedPosts = [...POSTS].sort((a, b) => calculateTrendScore(b) - calculateTrendScore(a));
        setTrendingPosts(sortedPosts.slice(0, 5));
        setHotLocalPosts(sortedPosts.slice(0, 3));
        setTrendingTags([
          { emoji: "🔥", label: "CIVIC", count: 12, trend: "+5%" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingData();
  }, [currentLocation]);

  return (
    <div className="w-full flex flex-col bg-transparent text-white min-h-screen">
      <div className="bg-white/2 backdrop-blur-2xl px-6 py-8 mb-4 border-b border-white/5 shadow-2xl relative overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-light to-secondary mb-2 uppercase tracking-tighter">
            🤖 AI Intelligence Dashboard
          </h2>
          <p className="text-text-secondary text-sm mb-6">Real-time civic trend analysis and predictive insights</p>
          
          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-16 skeleton rounded-2xl"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingTags.map((tag, index) => (
                <motion.div 
                  key={index} 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg hover:border-primary/40 group cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-primary/20 transition-colors">
                      <span className="text-2xl">{tag.emoji}</span>
                    </div>
                    <div>
                      <p className="font-bold text-white tracking-tight">{tag.label} ANALYSIS</p>
                      <p className="text-[10px] text-text-tertiary uppercase tracking-widest">{tag.count} active detections</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-black px-3 py-1 rounded-lg border shadow-sm ${
                      tag.trend.includes("+") 
                        ? "bg-red-500/10 text-red-400 border-red-500/30" 
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}>
                      {tag.trend}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="md:max-w-xl md:mx-auto pt-4 px-0 md:px-4 pb-20">
        {/* Hot in your Area Section */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-100 mb-4 px-4 md:px-0 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Hot in {currentLocation ? currentLocation.replace("📍 ", "") : "your area"}
          </h3>
          {loading ? (
             <div className="animate-pulse px-4"><div className="h-64 bg-white/5 border border-white/10 rounded-xl"></div></div>
          ) : (
            <div className="space-y-4">
              {hotLocalPosts.map((post) =>
                post.type === "GEO_ALERT" ? (
                  <GeoAlertCard key={post.id} post={post} />
                ) : (
                  <div key={post.id} className="relative">
                     {post.aiTag?.toLowerCase().includes("critical") && (
                       <div className="absolute top-0 right-0 -mt-2 -mr-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
                         CRITICAL SEVERITY
                       </div>
                     )}
                    <PostCard
                      post={post}
                      onUpvote={async (id) => {
                        try { await postsAPI.upvotePost(id); } catch(e){}
                      }}
                    />
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Global Top Posts */}
        <h3 className="font-bold text-gray-100 mb-4 px-4 md:px-0 flex items-center gap-2">
           <span className="text-lg">🌍</span> Top Posts
        </h3>
        {loading ? (
           <div className="animate-pulse px-4"><div className="h-64 bg-white/5 border border-white/10 rounded-xl"></div></div>
        ) : (
          <div className="space-y-4">
            {trendingPosts.map((post) =>
              post.type === "GEO_ALERT" ? (
                <GeoAlertCard
                  key={post.id}
                  post={post}
                />
              ) : (
                <div key={post.id} className="relative">
                   {post.aiTag?.toLowerCase().includes("critical") && (
                     <div className="absolute top-0 right-0 -mt-2 -mr-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
                       CRITICAL SEVERITY
                     </div>
                   )}
                  <PostCard
                    post={post}
                    onUpvote={async (id) => {
                      try { await postsAPI.upvotePost(id); } catch(e){}
                    }}
                  />
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

