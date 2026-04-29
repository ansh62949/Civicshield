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
    CIVIC: { bg: "bg-primary/10", text: "text-primary-light", border: "border-primary/30", icon: "🏗️" },
    SAFETY: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/30", icon: "⚠️" },
    CRIME: { bg: "bg-critical/10", text: "text-critical", border: "border-critical/30", icon: "🚨" },
    GEO_ALERT: { bg: "bg-accent/10", text: "text-accent", border: "border-accent/30", icon: "🌍" },
    ENVIRONMENT: { bg: "bg-success/10", text: "text-success", border: "border-success/30", icon: "🌿" },
    NEWS: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/30", icon: "📰" }
  };

  const style = badgeStyles[type] || badgeStyles.CIVIC;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-xl border shadow-lg ${style.bg} ${style.text} ${style.border}`}
    >
      <span className="text-xs">{style.icon}</span>
      {type.replace("_", " ")}
    </span>
  );
};

export const Toast = ({ message, icon = "⚡", onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-4 bg-bg-deep/80 backdrop-blur-3xl border border-white/20 px-8 py-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_var(--glow-primary)]"
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/20 border border-primary/40 animate-pulse">
           <span className="text-xl text-primary drop-shadow-[0_0_8px_var(--primary)]">{icon}</span>
        </div>
        <div className="flex flex-col">
           <span className="text-xs font-black text-primary-light uppercase tracking-widest mb-0.5">Intelligence Update</span>
           <span className="text-sm font-bold text-white tracking-wide">{message}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
