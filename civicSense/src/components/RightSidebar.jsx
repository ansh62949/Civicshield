import React from "react";
import { FiChevronUp } from "react-icons/fi";
import { RIGHT_SIDEBAR_DATA, getScoreColor } from "../constants/civicSenseData";

/**
 * RightSidebar Component
 * Desktop-only right sidebar (320px width)
 * Shows: area score widget, alerts, leaderboard, trending issues
 */
export default function RightSidebar() {
  const data = RIGHT_SIDEBAR_DATA;

  return (
    <aside
      className="hidden lg:flex flex-col w-[320px] h-screen bg-white border-l border-[#e5e7eb] p-6 overflow-y-auto space-y-6"
      style={{
        borderLeft: "1px solid #e5e7eb",
        backgroundColor: "#ffffff"
      }}
    >
      {/* AREA SCORE WIDGET */}
      <div
        className="card card-padded space-y-3"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(29,158,117,0.08) 0%, rgba(29,158,117,0.02) 100%)"
        }}
      >
        <div>
          <p className="text-sm font-600 text-[#111827]">{data.areaScoreWidget.area}</p>
          <p className="text-2xl font-bold text-[#1D9E75] mt-1">
            {data.areaScoreWidget.score}/100
          </p>
          <p className="text-xs text-[#9ca3af] mt-1 flex items-center gap-1">
            <span>{data.areaScoreWidget.status}</span>
            <span>{data.areaScoreWidget.trend}</span>
          </p>
        </div>

        {/* MINI SUBSCORES */}
        <div className="space-y-2 pt-3 border-t border-[#e5e7eb]">
          {data.areaScoreWidget.subscores.map((score) => {
            const color = getScoreColor(score.value);
            const percentage = (score.value / 100) * 100;
            return (
              <div key={score.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-[#6b7280]">{score.label}</span>
                  <span className="text-xs font-600 text-[#111827]">
                    {score.value}
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

      {/* LIVE ALERTS */}
      <div className="space-y-2">
        <h4 className="font-600 text-[#111827] text-sm">Active Alerts</h4>
        <div className="space-y-2">
          {data.alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ backgroundColor: "#f8f9fa", border: "1px solid #e5e7eb" }}
            >
              <span className="text-lg flex-shrink-0">{alert.dot}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#111827] font-500">{alert.text}</p>
                <p className="text-xs text-[#9ca3af] mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEADERBOARD */}
      <div className="space-y-3">
        <h4 className="font-600 text-[#111827] text-sm">Top Civic Areas</h4>
        <div className="space-y-2">
          {data.leaderboard.map((area) => (
            <div
              key={area.rank}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: "#f8f9fa", border: "1px solid #e5e7eb" }}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="font-bold text-[#1D9E75] w-6">{area.rank}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-600 text-[#111827]">{area.area}</p>
                  <p className="text-xs text-[#9ca3af]">Score: {area.score}</p>
                </div>
              </div>
              <span
                style={{
                  color: area.trend === "↑" ? "#10b981" : area.trend === "↓" ? "#E24B4A" : "#9ca3af"
                }}
              >
                {area.trend}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TRENDING ISSUES */}
      <div className="space-y-3 pb-4 border-b border-[#e5e7eb]">
        <h4 className="font-600 text-[#111827] text-sm">Trending Issues</h4>
        <div className="flex flex-wrap gap-2">
          {data.trendingIssues.map((issue) => (
            <span
              key={issue.topic}
              className="px-3 py-1 rounded-full text-xs font-500"
              style={{
                backgroundColor: "rgba(29, 158, 117, 0.1)",
                color: "#1D9E75",
                border: "1px solid rgba(29, 158, 117, 0.2)"
              }}
            >
              {issue.topic} ({issue.count})
            </span>
          ))}
        </div>
      </div>

      {/* HELP TEXT */}
      <p className="text-xs text-[#9ca3af] text-center">
        Updated every minute · Live data
      </p>
    </aside>
  );
}
