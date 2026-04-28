import React from "react";

export const FilterChips = ({ activeFilter, setActiveFilter }) => {
  const filters = [
    { id: "all", label: "All", emoji: "" },
    { id: "critical", label: "Critical", emoji: "🔴" },
    { id: "safety", label: "Safety", emoji: "⚠️" },
    { id: "crime", label: "Crime", emoji: "🚨" },
    { id: "geo", label: "Geo News", emoji: "🌍" },
    { id: "civic", label: "Civic", emoji: "🏗️" },
    { id: "environment", label: "Environment", emoji: "🌿" }
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-4 mb-4 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-xs transition-all whitespace-nowrap border ${
            activeFilter === filter.id
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-white/20 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
          }`}
        >
          {filter.emoji && <span className="mr-1">{filter.emoji}</span>}
          {filter.label}
        </button>
      ))}
    </div>
  );
};
