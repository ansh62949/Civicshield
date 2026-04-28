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
          imageUrl: p.imageUrl ? (p.imageUrl.startsWith('http') ? p.imageUrl : `${import.meta.env.VITE_API_URL || 'https://your-backend-url'}${p.imageUrl}`) : null,
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
      <div className="bg-white/5 backdrop-blur-lg px-4 py-6 mb-2 border-b border-white/10 shadow-[0_5px_15px_rgba(0,0,0,0.2)]">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 mb-4">🔥 Trending Now</h2>
        
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-white/5 border border-white/10 rounded-xl"></div>)}
          </div>
        ) : (
          <div className="space-y-3">
            {trendingTags.map((tag, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-sm hover:shadow-[0_0_15px_rgba(255,165,0,0.2)] transition-all group cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{tag.emoji}</span>
                  <div>
                    <p className="font-bold text-gray-100">{tag.label}</p>
                    <p className="text-xs text-gray-400">{tag.count} active reports</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full border ${tag.trend.includes("+") ? "bg-red-900/40 text-red-400 border-red-500/30" : "bg-green-900/40 text-green-400 border-green-500/30"}`}>
                    {tag.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
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
