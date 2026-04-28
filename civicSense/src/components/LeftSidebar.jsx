import React from "react";
import {
  FiHome,
  FiGlobe,
  FiPlus,
  FiBarChart2,
  FiUser,
  FiLogOut
} from "react-icons/fi";

/**
 * LeftSidebar Component
 * Desktop left sidebar (240px width)
 * Shows: logo, nav links, user profile mini card
 */
export default function LeftSidebar({ activeTab, onTabChange, user }) {
  const navItems = [
    { id: "feed", label: "Feed", icon: FiHome },
    { id: "globe", label: "Globe", icon: FiGlobe },
    { id: "score", label: "Area Score", icon: FiBarChart2 },
    { id: "profile", label: "Profile", icon: FiUser }
  ];

  return (
    <aside
      className="hidden md:flex flex-col w-[240px] h-screen bg-white border-r border-[#e5e7eb] p-6 overflow-y-auto"
      style={{
        borderRight: "1px solid #e5e7eb",
        backgroundColor: "#ffffff"
      }}
    >
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1D9E75]">CivicSense</h1>
        <p className="text-xs text-[#9ca3af] mt-1">Know your city</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-all text-sm font-500"
              style={{
                backgroundColor: isActive ? "rgba(29, 158, 117, 0.1)" : "transparent",
                color: isActive ? "#1D9E75" : "#6b7280"
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Special Post Button in sidebar */}
      <button
        onClick={() => onTabChange("post")}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg mb-6 font-600 transition-all"
        style={{
          backgroundColor: "#E24B4A",
          color: "white"
        }}
      >
        <FiPlus size={20} />
        <span>New Post</span>
      </button>

      {/* User Profile Mini Card */}
      {user && (
        <div
          className="rounded-lg p-4 mb-4"
          style={{
            backgroundColor: "#f8f9fa",
            border: "1px solid #e5e7eb"
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
              style={{
                backgroundColor: user.avatarBg,
                color: user.avatarColor
              }}
            >
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-600 text-[#111827] truncate">
                {user.name}
              </p>
              <p className="text-xs text-[#9ca3af] truncate">{user.area}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[#6b7280]">Posts</span>
              <span className="font-600 text-[#111827]">{user.posts}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#6b7280]">Points</span>
              <span className="font-600 text-[#111827]">{user.civicPoints}</span>
            </div>
          </div>
        </div>
      )}

      {/* Version info */}
      <div className="text-xs text-[#9ca3af] pt-4 border-t border-[#e5e7eb]">
        <p>v1.0.0</p>
        <p className="mt-1">© 2026 CivicSense</p>
      </div>
    </aside>
  );
}
