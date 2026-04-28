import React from "react";
import { FiHome, FiTrendingUp, FiPlus, FiMap, FiUser, FiBell, FiSearch } from "react-icons/fi";

const LOCATION_CYCLE = [
  "📍 Sector 62, Noida",
  "📍 Delhi",
  "📍 Mumbai"
];

export const TopBar = ({
  currentLocation,
  setCurrentLocation,
  onNotificationClick
}) => {
  const handleLocationClick = () => {
    const currentIndex = LOCATION_CYCLE.indexOf(currentLocation);
    const nextIndex = (currentIndex + 1) % LOCATION_CYCLE.length;
    setCurrentLocation(LOCATION_CYCLE[nextIndex]);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/5 backdrop-blur-lg border-b border-white/10 h-14 z-40 shadow-sm">
      <div className="flex items-center justify-between h-full px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hidden sm:inline">
            CivicSense
          </span>
          <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 sm:hidden">
            CS
          </span>
        </div>

        {/* Location pill - clickable */}
        <button
          onClick={handleLocationClick}
          className="bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full text-sm font-semibold text-gray-100 transition-colors border border-white/10 backdrop-blur-sm"
        >
          {currentLocation} ⌄
        </button>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={onNotificationClick}
            className="relative text-gray-300 hover:text-white transition-colors"
          >
            <FiBell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
              3
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

import { motion } from "framer-motion";

export const BottomNav = ({ activeScreen, setActiveScreen, navigate, onPostClick }) => {
  const navItems = [
    { id: "feed", icon: FiHome, label: "Feed", path: "/" },
    { id: "trending", icon: FiTrendingUp, label: "Trending", path: "/trending" },
    { id: "post", icon: FiPlus, label: "Create", isAction: true },
    { id: "area", icon: FiMap, label: "Area", path: "/area" },
    { id: "profile", icon: FiUser, label: "Profile", path: "/profile" }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md">
      <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-full h-16 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-around px-2 relative overflow-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id || (item.id === 'dashboard' && activeScreen === 'dashboard');
          
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isAction) {
                  onPostClick();
                } else {
                  setActiveScreen(item.id);
                  if (item.path) navigate(item.path);
                }
              }}
              className="relative flex flex-col items-center justify-center flex-1 h-full w-full outline-none group"
            >
              {isActive && !item.isAction && (
                <motion.div
                  layoutId="bottomNavGlow"
                  className="absolute inset-0 bg-primary/20 rounded-full blur-md"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              {item.isAction ? (
                <div className="relative z-10 w-12 h-12 bg-gradient-to-tr from-primary to-secondary rounded-full shadow-[0_0_20px_rgba(139,92,246,0.6)] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              ) : (
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <Icon 
                    className={`w-6 h-6 transition-colors ${isActive ? 'text-primary' : 'text-text-secondary group-hover:text-white'}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {isActive && <div className="w-1 h-1 bg-primary rounded-full absolute -bottom-2 shadow-[0_0_8px_rgba(139,92,246,1)]" />}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
