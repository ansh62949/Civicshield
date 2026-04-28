import React, { useEffect, useState } from "react";
import { dashboardAPI } from "../../../services/api";
import { PostCard } from "../../feed/PostCard";

export const DataStream = () => {
  const [stream, setStream] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStream = () => {
      console.log("Fetching live data stream...");
      dashboardAPI.getStream()
        .then(res => {
          console.log("Data stream loaded:", res.data);
          let posts = [];
          if (res.data?.streams) {
            posts = res.data.streams;
          } else if (Array.isArray(res.data)) {
            posts = res.data;
          } else if (res.data?.content) {
            posts = res.data.content;
          }
          setStream(posts.map(p => ({
            ...p,
            id: p.id || Math.random().toString(),
            authorId: p.authorId || p.userId || null,
            text: p.content || p.text || p.description || '',
            userName: p.authorUsername || p.user || p.name || "Civic User",
            userInitials: (p.authorUsername || p.user || p.name || "CU").substring(0, 2).toUpperCase(),
            area: p.locationLabel || p.location || p.area || "Unknown Area",
            timeAgo: p.timeAgo || p.time || (p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Recently"),
            comments: Array.isArray(p.comments) ? p.comments.length : (p.comments || 0),
            hasPhoto: !!(p.imageUrl && p.imageUrl !== "null" && p.imageUrl !== "undefined") || !!(p.image && p.image !== "null" && p.image !== "undefined"),
            imageUrl: (() => {
              const raw = p.imageUrl || p.image;
              if (!raw || raw === "null" || raw === "undefined") return null;
              if (raw.startsWith('http') || raw.startsWith('data:')) return raw;
              return `${import.meta.env.VITE_API_URL || 'https://your-backend-url'}${raw.startsWith('/') ? '' : '/'}${raw}`;
            })(),
            isUpvoted: p.isUpvoted || false
          })));
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch stream data:", err);
          setError(true);
          setLoading(false);
          // Fallback mock data
          setStream([
            { id: 1, type: "CIVIC", text: "Pothole on Main St", area: "Sector 62", timeAgo: "10m ago", userName: "Alice", userInitials: "AL" },
            { id: 2, type: "SAFETY", text: "Broken streetlight", area: "Connaught Place", timeAgo: "1h ago", userName: "Bob", userInitials: "BO" }
          ]);
        });
    };

    fetchStream();
    const interval = setInterval(fetchStream, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-transparent h-full overflow-y-auto">
      <div className="bg-white/5 p-4 rounded-xl backdrop-blur-md border border-white/10 sticky top-0 z-20 mb-6 flex justify-between items-center shadow-lg">
        <h2 className="text-xl font-bold text-indigo-300">Live Data Stream</h2>
        <div className="flex gap-2 items-center">
          {error && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30 animate-pulse">Offline Mode</span>}
          <span className="text-xs text-slate-400">10s sync</span>
        </div>
      </div>
      <div className="space-y-4">
        {loading && stream.length === 0 ? (
          <div className="text-center text-indigo-300 p-8 animate-pulse font-bold">Syncing data stream...</div>
        ) : stream.length === 0 ? (
          <div className="text-center text-slate-400 p-12 bg-white/5 rounded-2xl border border-white/10 italic">
            No active data reports in this stream.
          </div>
        ) : (
          stream.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};
