import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Avatar = ({ initials, bg, color, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl"
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold ${className}`}
      style={{ backgroundColor: bg, color: color }}
    >
      {initials}
    </div>
  );
};

export const ScoreBar = ({ label, value, max = 100, color = "#1D9E75" }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs uppercase tracking-widest font-bold text-slate-300">{label}</span>
        <span className="text-xs font-black drop-shadow-md" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2 shadow-inner border border-white/5">
        <div
          className="h-full rounded-full transition-all duration-800 shadow-[0_0_10px_currentColor]"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export const getScoreColor = (score) => {
  if (score > 70) return "#1D9E75";
  if (score > 50) return "#EF9F27";
  return "#E24B4A";
};

export const getScoreTrend = (trend) => {
  if (trend === "UP") return "↑";
  if (trend === "DOWN") return "↓";
  return "→";
};

export const PriorityBadge = ({ type }) => {
  const badgeStyles = {
    CIVIC: { bg: "rgba(129, 140, 248, 0.1)", text: "#a5b4fc", border: "rgba(129, 140, 248, 0.2)", icon: "🏗️" },
    SAFETY: { bg: "rgba(251, 191, 36, 0.1)", text: "#fcd34d", border: "rgba(251, 191, 36, 0.2)", icon: "⚠️" },
    CRIME: { bg: "rgba(248, 113, 113, 0.1)", text: "#fca5a5", border: "rgba(248, 113, 113, 0.2)", icon: "🚨" },
    GEO_ALERT: { bg: "rgba(52, 211, 153, 0.1)", text: "#6ee7b7", border: "rgba(52, 211, 153, 0.2)", icon: "🌍" },
    ENVIRONMENT: { bg: "rgba(163, 230, 53, 0.1)", text: "#bef264", border: "rgba(163, 230, 53, 0.2)", icon: "🌿" },
    NEWS: { bg: "rgba(192, 132, 252, 0.1)", text: "#d8b4fe", border: "rgba(192, 132, 252, 0.2)", icon: "📰" }
  };

  const style = badgeStyles[type] || badgeStyles.CIVIC;

  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-inner border"
      style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }}
    >
      {style.icon} {type.replace("_", " ")}
    </span>
  );
};

export const Toast = ({ message, icon = "✓", onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-[#020617]/90 backdrop-blur-xl rounded-full px-6 py-3 shadow-[0_10px_30px_rgba(139,92,246,0.3)] border border-primary/30 z-[100] flex items-center gap-3"
      >
        <span className="text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] text-lg">{icon}</span>
        <span className="text-sm font-bold text-white tracking-wide whitespace-nowrap">{message}</span>
      </motion.div>
    </AnimatePresence>
  );
};
