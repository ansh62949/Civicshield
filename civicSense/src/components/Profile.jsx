import React, { useState } from "react";
import { FiCheck, FiTrendingUp } from "react-icons/fi";
import { CURRENT_USER } from "../constants/civicSenseData";

/**
 * Profile Component
 * User profile with stats, badges, and instagram-style post grid
 */
export default function Profile() {
  const user = CURRENT_USER;
  const [selectedPost, setSelectedPost] = useState(null);

  const badges = [
    { id: "street-guardian", name: "Street Guardian", icon: "🛡", desc: "10+ civic posts" },
    { id: "safety-watcher", name: "Safety Watcher", icon: "🚨", desc: "5+ verified safety reports" },
    { id: "first-reporter", name: "First Reporter", icon: "🏁", desc: "First to report an issue" },
    { id: "verified-reporter", name: "Verified Reporter", icon: "✓", desc: "90%+ verification rate" }
  ];

  const userBadges = user.badges || [];

  return (
    <div className="flex-1 overflow-y-auto pb-[80px] md:pb-6 bg-white">
      {/* PROFILE HEADER */}
      <div className="p-6 space-y-6">
        {/* AVATAR & NAME */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold"
              style={{
                backgroundColor: user.avatarBg,
                color: user.avatarColor
              }}
            >
              {user.avatar}
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#111827] flex items-center justify-center gap-2">
              {user.name}
              {user.verified && <span style={{ color: "#1D9E75" }}>✓</span>}
            </h1>
            <p className="text-sm text-[#9ca3af] mt-1">{user.area}</p>
            {userBadges.includes("Verified Reporter") && (
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-600 mt-2"
                style={{
                  backgroundColor: "rgba(29, 158, 117, 0.1)",
                  color: "#1D9E75"
                }}
              >
                Verified Reporter
              </span>
            )}
          </div>
        </div>

        {/* STATS TILES */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Posts", value: user.posts },
            { label: "Upvotes", value: user.upvotesReceived },
            { label: "Civic Points", value: user.civicPoints }
          ].map((stat) => (
            <div
              key={stat.label}
              className="card p-4 text-center"
              style={{
                backgroundColor: "#f8f9fa"
              }}
            >
              <p className="text-2xl font-bold text-[#1D9E75] mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-[#9ca3af] font-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CIVIC CONTRIBUTION */}
        <div className="card p-6 space-y-4" style={{ backgroundColor: "rgba(29, 158, 117, 0.05)" }}>
          <h3 className="font-600 text-[#111827] flex items-center gap-2">
            <FiTrendingUp size={20} style={{ color: "#1D9E75" }} />
            Civic Contribution
          </h3>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[#6b7280]">Score Impact</span>
              <span className="font-600 text-[#1D9E75]">+{user.contributionScore} pts</span>
            </div>
            <div className="score-bar">
              <div
                className="score-bar-fill good"
                style={{ width: `${(user.contributionScore / 10) * 100}%` }}
              />
            </div>
            <p className="text-xs text-[#9ca3af] mt-3">
              Your posts have moved {user.area.split(",")[0]}'s civic score by +{user.contributionScore} points {user.contributionPeriod}
            </p>
          </div>
        </div>

        {/* BADGE SHELF */}
        <div className="space-y-3">
          <h3 className="font-600 text-[#111827]">Earned Badges</h3>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => {
              const isEarned = userBadges.includes(badge.name);
              return (
                <div
                  key={badge.id}
                  className="p-4 rounded-lg text-center transition"
                  style={{
                    backgroundColor: isEarned ? "rgba(29, 158, 117, 0.1)" : "#f8f9fa",
                    border: isEarned ? "1px solid rgba(29, 158, 117, 0.3)" : "1px solid #e5e7eb",
                    opacity: isEarned ? 1 : 0.6
                  }}
                >
                  <p className="text-2xl mb-1">{badge.icon}</p>
                  <p className="text-xs font-600 text-[#111827] mb-1">
                    {badge.name}
                  </p>
                  <p className="text-xs text-[#9ca3af]">{badge.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* POST GRID */}
      <div className="px-4 pb-6">
        <h3 className="font-600 text-[#111827] mb-4">Posts</h3>
        <div className="grid grid-cols-3 gap-2">
          {user.userPosts.map((post) => (
            <button
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="aspect-square rounded-lg overflow-hidden transition hover:opacity-80"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-2xl">
                {post.type === "CIVIC" && "🏗"}
                {post.type === "SAFETY" && "⚠"}
                {post.type === "CRIME" && "🚨"}
                {post.type === "ENVIRONMENT" && "🌿"}
                {post.type === "NEWS" && "📰"}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* POST DETAIL MODAL */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 md:hidden"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white rounded-lg max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-4">
              <button
                onClick={() => setSelectedPost(null)}
                className="text-[#9ca3af]"
              >
                ✕
              </button>
              <h3 className="font-600 text-[#111827]">{selectedPost.user}</h3>
              <p className="text-sm text-[#6b7280]">{selectedPost.text}</p>
              <div className="flex gap-2 text-sm font-500 text-[#9ca3af]">
                <span>👍 {selectedPost.upvotes}</span>
                <span>💬 {selectedPost.comments}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
