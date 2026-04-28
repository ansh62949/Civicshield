import React, { useState } from "react";
import { FiSearch, FiArrowUp, FiArrowDown, FiArrowRight } from "react-icons/fi";
import { CURRENT_AREA_DATA, getScoreColor } from "../constants/civicSenseData";

/**
 * AreaScore Component
 * Civic intelligence dashboard showing area safety and scores
 */
export default function AreaScore({ selectedArea = null, onStateSelect }) {
  const [compareMode, setCompareMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const areaData = selectedArea || CURRENT_AREA_DATA;

  // Score interpretation
  const getScoreLabel = (score) => {
    if (score > 70) return "Good";
    if (score >= 50) return "Moderate";
    return "Poor";
  };

  const getScoreLabelColor = (label) => {
    if (label === "Good") return "#1D9E75";
    if (label === "Moderate") return "#EF9F27";
    return "#E24B4A";
  };

  return (
    <div className="flex-1 overflow-y-auto pb-[80px] md:pb-6 bg-white">
      {/* SEARCH BAR */}
      <div
        className="sticky top-0 bg-white z-20 p-4 md:p-6"
        style={{
          borderBottom: "1px solid #e5e7eb"
        }}
      >
        <div className="relative">
          <FiSearch
            className="absolute left-4 top-3"
            style={{ color: "#9ca3af" }}
          />
          <input
            type="text"
            placeholder="Search any area, city, or pincode"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
          />
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* CURRENT AREA CARD */}
        <div
          className="card"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(29,158,117,0.08) 0%, rgba(29,158,117,0.02) 100%)"
          }}
        >
          <div className="card-padded space-y-4">
            <div className="text-center">
              <p className="text-sm text-[#9ca3af] mb-2">Current Area</p>
              <h1 className="text-5xl font-bold mb-2" style={{ color: "#1D9E75" }}>
                {areaData.score}
              </h1>
              <p className="text-lg font-600 text-[#111827] flex items-center justify-center gap-2">
                <span
                  style={{
                    color: getScoreLabelColor(getScoreLabel(areaData.score))
                  }}
                >
                  {getScoreLabel(areaData.score)}
                </span>
                <FiArrowUp size={20} style={{ color: "#10b981" }} />
                <span className="text-sm text-[#6b7280]">
                  +{areaData.trend} {areaData.trendPeriod}
                </span>
              </p>
            </div>

            {/* SUB-SCORE BARS */}
            <div className="space-y-4 pt-6 border-t border-[#e5e7eb]">
              {Object.entries(areaData.subscores).map(([key, value]) => {
                const label = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())
                  .trim();
                const color = getScoreColor(value);
                const percentage = (value / 100) * 100;

                return (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-500 text-[#6b7280]">
                        {label}
                      </span>
                      <span className="text-sm font-600 text-[#111827]">
                        {value}
                      </span>
                    </div>
                    <div className="score-bar">
                      <div
                        className={`score-bar-fill ${color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* TREND CHART */}
        <div className="card">
          <div className="card-padded">
            <h3 className="font-600 text-[#111827] mb-4">Score Trend (6 months)</h3>
            <div className="flex items-end justify-between h-32 gap-2 pb-4 border-b border-[#e5e7eb]">
              {areaData.scoreTrend.map((score, idx) => {
                const maxScore = Math.max(...areaData.scoreTrend);
                const heightPercent = (score / maxScore) * 100;
                return (
                  <div
                    key={idx}
                    className="flex-1 rounded-t-lg transition-all hover:opacity-75"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: "#1D9E75",
                      minHeight: "20px"
                    }}
                    title={`${areaData.monthLabels[idx]}: ${score}`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-4 text-xs text-[#9ca3af] font-500">
              {areaData.monthLabels.map((month, idx) => (
                <span key={idx}>{month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* PROPERTY SAFETY REPORT */}
        <div className="card">
          <div className="card-padded space-y-4">
            <div>
              <h3 className="font-600 text-[#111827]">
                Property Safety Intelligence
              </h3>
              <p className="text-sm text-[#9ca3af] mt-1">
                Based on 847 citizen posts · 12 months data · AI verified
              </p>
            </div>

            {/* PROPERTIES GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4">
              {Object.entries(areaData.properties).map(([key, prop]) => {
                const colors = {
                  good: { bg: "rgba(16, 185, 129, 0.1)", fg: "#059669" },
                  moderate: { bg: "rgba(239, 159, 39, 0.1)", fg: "#d97706" },
                  poor: { bg: "rgba(226, 75, 74, 0.1)", fg: "#dc2626" }
                };
                const color = colors[prop.status];

                return (
                  <div
                    key={key}
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: color.bg,
                      border: `1px solid ${color.fg}22`
                    }}
                  >
                    <p className="text-xs text-[#6b7280] font-500">
                      {prop.label}
                    </p>
                    <p
                      className="text-lg font-600 mt-2"
                      style={{ color: color.fg }}
                    >
                      {prop.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* COMPARISON ROW */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t border-[#e5e7eb]">
              {areaData.comparisons.map((comparison, idx) => (
                <p key={idx} className="text-xs text-[#6b7280]">
                  {comparison}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* AI RECOMMENDATION BOX */}
        <div
          className="card p-6"
          style={{
            backgroundColor: "#0f172a",
            color: "#f8fafc"
          }}
        >
          <p
            className="text-xs font-600 mb-3"
            style={{ color: "#1D9E75" }}
          >
            🤖 AI Insight
          </p>
          <p className="text-sm leading-relaxed">
            {areaData.aiInsight}
          </p>
        </div>

        {/* COMPARE AREAS BUTTON */}
        <button
          onClick={() => setCompareMode(!compareMode)}
          className="w-full py-3 rounded-lg font-600 flex items-center justify-center gap-2 transition"
          style={{
            backgroundColor: "#f8f9fa",
            color: "#1D9E75",
            border: "1px solid #e5e7eb"
          }}
        >
          <span>Compare with another area</span>
          <FiArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
