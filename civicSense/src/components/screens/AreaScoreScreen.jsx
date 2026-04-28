import React, { useState, useEffect } from "react";
import { AREA_SCORES } from "../../mockData";
import { getScoreColor } from "../shared/Shared";
import { areasAPI, postsAPI } from "../../services/api";
import { PostCard } from "../feed/PostCard";

export const AreaScoreScreen = ({ currentLocation, cityCoords }) => {
  const currentArea = currentLocation.replace("📍 ", "");
  const [selectedArea, setSelectedArea] = useState(currentArea);
  const [scoreData, setScoreData] = useState(AREA_SCORES[currentArea] || AREA_SCORES["Sector 62, Noida"]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fallbackScore = AREA_SCORES[selectedArea] || AREA_SCORES["Sector 62, Noida"];
        const areaState = fallbackScore.state || 'Delhi';
        const areaResponse = await areasAPI.getArea(selectedArea, areaState);
        if (areaResponse.data) {
          setScoreData(areaResponse.data);
        }
      } catch (err) {
        // fallback to mock
        if (AREA_SCORES[selectedArea]) {
          setScoreData(AREA_SCORES[selectedArea]);
        }
      }

      try {
        const coords = cityCoords?.[currentLocation] || { lat: 28.6139, lon: 77.2090 };
        const feedResponse = await postsAPI.getFeed(coords.lat, coords.lon, 10, 0, 10);
        const mappedPosts = (feedResponse.data?.content || feedResponse.data || []).map(p => ({
          ...p,
          text: p.content || p.text || ''
        }));
        
        const localPosts = mappedPosts.filter(p => (p.locationLabel || p.area || "").includes(selectedArea));
        setRecentIssues(localPosts.length > 0 ? localPosts : mappedPosts.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch area posts", err);
        setRecentIssues([]);
      }

      setLoading(false);
    };
    fetchData();
  }, [selectedArea]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const overallScore = scoreData.total || scoreData.overallScore || 0;
  const isSafeToInvest = overallScore >= 65;

  return (
    <div className="w-full flex flex-col min-h-screen bg-transparent text-white">
      {/* Top Selector */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 p-4 sticky top-0 z-20 shadow-sm flex items-center justify-between">
        <h2 className="font-bold text-lg text-gray-100">📍 {selectedArea}</h2>
        <button className="text-indigo-400 text-sm font-semibold hover:text-indigo-300 transition-colors">Change</button>
      </div>

      <div className="md:max-w-xl md:mx-auto pt-4 px-4 space-y-6 pb-20">
        
        {/* Big Civic Score Circle & Badge */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 shadow-[0_5px_20px_rgba(0,0,0,0.3)] border border-white/10 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
          
          <h3 className="text-gray-400 font-semibold mb-4 uppercase tracking-wider text-xs">Overall Civic Score</h3>
          
          {/* Big Circle */}
          <div className="w-40 h-40 rounded-full flex items-center justify-center mb-6 relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] border border-white/5" style={{ background: `conic-gradient(${getScoreColor(overallScore)} ${overallScore}%, transparent ${overallScore}%)` }}>
            <div className="w-36 h-36 bg-[#0f172a] rounded-full flex flex-col items-center justify-center shadow-lg border border-white/5">
              <span className="text-5xl font-extrabold" style={{ color: getScoreColor(overallScore) }}>
                {overallScore}
              </span>
              <span className="text-xs text-gray-500 mt-1">/ 100</span>
            </div>
          </div>

          {/* Investment Badge */}
          <div className={`px-4 py-2 rounded-full font-bold text-sm shadow-sm border ${isSafeToInvest ? 'bg-green-900/40 text-green-400 border-green-500/30' : 'bg-red-900/40 text-red-400 border-red-500/30'}`}>
            {isSafeToInvest ? '✅ Safe to Invest Area' : '⚠️ High Risk / Needs Improvement'}
          </div>
        </div>

        {/* Sub-score Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Infrastructure", score: scoreData.infra || scoreData.infraScore, icon: "🏗️", color: "text-blue-400", bg: "bg-blue-900/30 border border-blue-500/20" },
            { label: "Safety & Crime", score: scoreData.safety || scoreData.safetyScore, icon: "🛡️", color: "text-green-400", bg: "bg-green-900/30 border border-green-500/20" },
            { label: "Environment", score: scoreData.env || scoreData.envScore, icon: "🌿", color: "text-green-400", bg: "bg-green-900/30 border border-green-500/20" },
            { label: "Civic Activity", score: scoreData.civic || scoreData.civicScore, icon: "👥", color: "text-purple-400", bg: "bg-purple-900/30 border border-purple-500/20" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/10 flex flex-col justify-between hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.bg} text-lg`}>
                  {item.icon}
                </div>
                <span className={`text-xl font-bold ${item.color}`}>{item.score || 0}</span>
              </div>
              <span className="text-xs font-semibold text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Recent Issues List */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 shadow-[0_5px_20px_rgba(0,0,0,0.3)] border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-100">Recent Issues Here</h3>
            <button className="text-indigo-400 text-xs font-bold hover:text-indigo-300 hover:underline">View all</button>
          </div>
          
          <div className="space-y-4">
            {recentIssues.length > 0 ? (
              recentIssues.map(post => (
                <div key={post.id} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-1 bg-red-900/40 text-red-400 rounded-full border border-red-500/20 uppercase">
                      {post.type}
                    </span>
                    <span className="text-xs text-gray-400">
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2">{post.text}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No recent issues found in this area.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
