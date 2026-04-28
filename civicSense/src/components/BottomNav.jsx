import React from "react";
import {
  FiHome,
  FiGlobe,
  FiPlus,
  FiBarChart2,
  FiUser,
  FiBell
} from "react-icons/fi";

/**
 * BottomNav Component
 * Mobile navigation bar (fixed at bottom)
 * 5 tabs: Feed, Globe, Post (+), Area Score, Profile
 */
export default function BottomNav({
  activeTab,
  onTabChange,
  hasNewNotifications = false
}) {
  const tabs = [
    { id: "feed", label: "Feed", icon: FiHome },
    { id: "globe", label: "Globe", icon: FiGlobe },
    { id: "post", label: "Post", icon: FiPlus },
    { id: "score", label: "Score", icon: FiBarChart2 },
    { id: "profile", label: "Profile", icon: FiUser }
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e7eb] flex justify-around items-center h-[64px] md:hidden z-40"
      style={{ borderTop: "1px solid #e5e7eb" }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isPostButton = tab.id === "post";

        if (isPostButton) {
          // Post button is special - red circle in center
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center w-[64px] h-[64px] rounded-full mt-[-20px] transition-all"
              style={{
                background: "#E24B4A",
                color: "white",
                boxShadow: "0 4px 12px rgba(226, 75, 74, 0.3)"
              }}
            >
              <Icon size={28} />
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative"
            style={{
              color: isActive ? "#1D9E75" : "#9ca3af"
            }}
          >
            <div className="relative">
              <Icon size={24} />
              {hasNewNotifications && tab.id === "feed" && (
                <span className="notification-dot absolute -top-1 -right-1" />
              )}
            </div>
            <span
              className="text-xs font-600"
              style={{
                opacity: isActive ? 1 : 0.6
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
