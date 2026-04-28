import React, { useEffect, useState } from "react";
import { dashboardAPI } from "../../../services/api";

export const TrendAnalysis = () => {
  const [trends, setTrends] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log("Fetching trend analysis data...");
    dashboardAPI.getTrends()
      .then(res => {
        console.log("Trend analysis data loaded:", res.data);
        setTrends(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch trends API:", err);
        setError(true);
        // Fallback mock data if API fails
        setTrends({
          resolutionRate: "78%",
          totalIssuesResolved: 245,
          topCategories: [
            { name: "Infrastructure", count: 142 },
            { name: "Safety", count: 98 },
            { name: "Environment", count: 65 }
          ],
          trendingAreas: [
            { name: "Sector 62, Noida", score: 82 },
            { name: "Connaught Place, Delhi", score: 75 },
            { name: "Bandra, Mumbai", score: 68 }
          ]
        });
      });
  }, []);

  if (!trends) return <div className="p-8 text-center text-indigo-300 animate-pulse font-bold">Loading trends...</div>;

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-2">
        <h2 className="text-xl font-bold text-indigo-300">Trend Analysis</h2>
        {error && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30 animate-pulse">Offline Mode (Mock Data)</span>}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20">
          <p className="text-sm text-indigo-300 uppercase tracking-widest">Resolution Rate</p>
          <p className="text-3xl font-black text-white">{trends.resolutionRate}</p>
        </div>
        <div className="bg-cyan-500/10 p-4 rounded-xl border border-cyan-500/20">
          <p className="text-sm text-cyan-300 uppercase tracking-widest">Issues Resolved</p>
          <p className="text-3xl font-black text-white">{trends.totalIssuesResolved}</p>
        </div>
      </div>

      <h3 className="text-sm text-indigo-400 font-bold mb-4 uppercase tracking-widest">Top Categories</h3>
      <div className="space-y-4 mb-8">
        {trends.topCategories?.map((cat, idx) => (
          <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
            <span className="font-semibold text-gray-200">{cat.name}</span>
            <span className="text-indigo-400 font-bold bg-indigo-500/20 px-3 py-1 rounded-full">{cat.count}</span>
          </div>
        ))}
      </div>

      <h3 className="text-sm text-indigo-400 font-bold mb-4 uppercase tracking-widest">Trending Areas</h3>
      <div className="space-y-4">
        {trends.trendingAreas?.map((area, idx) => (
          <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border-l-4 border-cyan-500">
            <span className="font-semibold text-gray-200">{area.name}</span>
            <span className="text-cyan-400 font-bold">{area.score} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
};
