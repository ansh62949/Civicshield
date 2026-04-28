import React, { useEffect, useState } from "react";
import { dashboardAPI } from "../../../services/api";
import { Avatar } from "../../shared/Shared";

export const OperatorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log("Fetching operator profile data...");
    dashboardAPI.getOperatorProfile()
      .then(res => {
        console.log("Operator profile data loaded:", res.data);
        setProfile(res.data);
      })
      .catch(err => {
        console.error("Failed to load operator profile:", err);
        setError(true);
        // Fallback mock data
        setProfile({
          user: { username: "Alpha Agent", email: "alpha@civicsense.gov" },
          stats: {
            totalPosts: 1250,
            civicPoints: 8500,
            verifiedReports: 1100
          }
        });
      });
  }, []);

  if (!profile) return <div className="p-8 text-center text-indigo-300 animate-pulse font-bold">Loading operator profile...</div>;

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg h-full overflow-y-auto">
      {error && <div className="mb-4 text-xs bg-red-500/20 text-red-400 px-3 py-2 rounded border border-red-500/30 text-center animate-pulse">Offline Mode (Mock Data)</div>}
      <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-1 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
          <div className="w-full h-full bg-[#0f172a] rounded-full p-1 flex items-center justify-center overflow-hidden">
             <Avatar
               initials={profile.user?.username?.substring(0, 2).toUpperCase() || 'OP'}
               size="full"
               bg="#E6F1FB"
               color="#185FA5"
             />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{profile.user?.username || 'Operator'}</h2>
          <p className="text-indigo-400 font-semibold mb-2">Level 4 Field Agent</p>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">Active Status</span>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">Verified</span>
          </div>
        </div>
      </div>

      <h3 className="text-sm text-indigo-400 font-bold mb-4 uppercase tracking-widest">Operator Statistics</h3>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 p-4 rounded-xl text-center border border-white/10">
          <p className="text-2xl font-black text-white">{profile.stats?.totalPosts || 0}</p>
          <p className="text-[10px] text-slate-400 uppercase">Data Logs</p>
        </div>
        <div className="bg-indigo-500/20 p-4 rounded-xl text-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <p className="text-2xl font-black text-indigo-300">{profile.stats?.civicPoints || 0}</p>
          <p className="text-[10px] text-indigo-400 uppercase">Civic Points</p>
        </div>
        <div className="bg-white/5 p-4 rounded-xl text-center border border-white/10">
          <p className="text-2xl font-black text-white">{profile.stats?.verifiedReports || 0}</p>
          <p className="text-[10px] text-slate-400 uppercase">Verified</p>
        </div>
      </div>

      <h3 className="text-sm text-indigo-400 font-bold mb-4 uppercase tracking-widest">Account Info</h3>
      <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10 text-sm">
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-slate-400">Email</span>
          <span className="text-white">{profile.user?.email || 'N/A'}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-slate-400">Account Created</span>
          <span className="text-white">{new Date().toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">System Clearance</span>
          <span className="text-purple-400 font-bold">Level 4 (Dashboard Access)</span>
        </div>
      </div>
    </div>
  );
};
