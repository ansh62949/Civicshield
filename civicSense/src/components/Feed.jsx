import React, { useState, useRef, useEffect } from "react";
import {
  FiBell,
  FiSearch,
  FiThumbsUp,
  FiMessageCircle,
  FiShare2,
  FiMoreHorizontal,
  FiMapPin
} from "react-icons/fi";
import { FiZap } from "react-icons/fi";
import {
  FEED_POSTS,
  AREA_STORIES,
  FEED_FILTERS,
  getPostTypeBadge,
  getTensionRingColor
} from "../constants/civicSenseData";

/**
 * Feed Component
 * Instagram-style social feed with stories, filters, and post cards
 */
export default function Feed({
  onLocationChange,
  onPostCreate,
  onStoryView,
  startPostCreation
}) {
  const [filter, setFilter] = useState("all");
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const filterScrollRef = useRef(null);
  const storyScrollRef = useRef(null);

  // Handle story auto-dismiss
  useEffect(() => {
    if (activeStoryIndex !== null) {
      const timer = setTimeout(() => {
        setActiveStoryIndex(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [activeStoryIndex]);

  const toggleLike = (postId) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);
  };

  // Filter posts based on selected filter
  const filteredPosts = FEED_POSTS.filter((post) => {
    if (filter === "all") return true;
    if (filter === "critical") return post.type === "CRIME" || post.type === "GEO_ALERT";
    if (filter === "safety") return post.type === "SAFETY";
    if (filter === "crime") return post.type === "CRIME";
    if (filter === "geo") return post.type === "GEO_ALERT";
    if (filter === "civic") return post.type === "CIVIC";
    if (filter === "environment") return post.type === "ENVIRONMENT";
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto pb-[80px] md:pb-6 bg-white">
      {/* TOP BAR */}
      <div
        className="sticky top-0 bg-white z-30"
        style={{
          borderBottom: "1px solid #e5e7eb",
          padding: "12px 16px"
        }}
      >
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h1 className="text-xl font-bold text-[#1D9E75]">CivicSense</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#f8f9fa] rounded-full transition">
              <FiBell size={24} style={{ color: "#6b7280" }} />
            </button>
            <button className="p-2 hover:bg-[#f8f9fa] rounded-full transition">
              <FiSearch size={24} style={{ color: "#6b7280" }} />
            </button>
          </div>
        </div>

        {/* Location Pill */}
        <button
          onClick={onLocationChange}
          className="flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-full transition mb-4"
          style={{
            backgroundColor: "#f8f9fa",
            border: "1px solid #e5e7eb",
            color: "#111827",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          <FiMapPin size={16} />
          <span>📍 Sector 62, Noida</span>
        </button>
      </div>

      {/* STORIES ROW */}
      <div
        className="overflow-x-auto px-4 py-4"
        ref={storyScrollRef}
        style={{
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          gap: "12px",
          scrollBehavior: "smooth"
        }}
      >
        {AREA_STORIES.map((story, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStoryIndex(idx)}
            className="flex flex-col items-center gap-2 flex-shrink-0 transition-transform hover:scale-105"
          >
            <div
              className="w-[64px] h-[64px] rounded-full flex items-center justify-center text-xl font-bold"
              style={{
                border: `3px solid ${getTensionRingColor(story.tension)}`,
                backgroundColor: "#f8f9fa",
                color: "#111827"
              }}
            >
              🔔
            </div>
            <span
              className="text-xs font-500 text-center truncate w-[64px]"
              style={{ color: "#6b7280" }}
            >
              {story.area}
            </span>
          </button>
        ))}
      </div>

      {/* FILTER CHIPS */}
      <div
        className="overflow-x-auto px-4 py-3"
        ref={filterScrollRef}
        style={{
          display: "flex",
          gap: "8px",
          scrollBehavior: "smooth",
          borderBottom: "1px solid #e5e7eb"
        }}
      >
        {FEED_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="px-4 py-2 rounded-full font-500 text-sm flex-shrink-0 transition-all"
            style={{
              backgroundColor: filter === f.id ? "#1D9E75" : "#f8f9fa",
              color: filter === f.id ? "white" : "#6b7280",
              border: filter === f.id ? "none" : "1px solid #e5e7eb"
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* FEED POSTS */}
      <div className="space-y-4 p-4 md:p-6">
        {filteredPosts.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-12 text-center"
            style={{ color: "#9ca3af" }}
          >
            <p className="text-lg font-500 mb-2">No posts in this filter</p>
            <p className="text-sm">Try a different filter to see more posts</p>
          </div>
        ) : (
          filteredPosts.map((post) => <PostCard
            key={post.id}
            post={post}
            isLiked={likedPosts.has(post.id)}
            onLike={() => toggleLike(post.id)}
          />)
        )}
      </div>

      {/* STORY FULL SCREEN VIEW */}
      {activeStoryIndex !== null && (
        <div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center md:hidden"
          onClick={() => setActiveStoryIndex(null)}
        >
          <div className="max-w-sm w-full mx-4">
            <div
              className="bg-white rounded-lg p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">
                {AREA_STORIES[activeStoryIndex].area}
              </h2>
              <p className="text-sm text-[#6b7280] mb-6">
                Last 3 posts from this area
              </p>
              <p className="text-xs text-[#9ca3af]">
                Auto-dismissing in 4 seconds...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * PostCard Component
 * Individual post card with all interactions
 */
function PostCard({ post, isLiked, onLike }) {
  const isGeoAlert = post.type === "GEO_ALERT";

  return (
    <div
      className="card"
      style={{
        backgroundColor: isGeoAlert ? "#0f172a" : "white",
        color: isGeoAlert ? "white" : "#111827"
      }}
    >
      {/* POST HEADER */}
      <div className="card-padded border-b border-[#e5e7eb]">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                backgroundColor: post.avatarBg,
                color: post.avatarColor
              }}
            >
              {post.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-600 text-sm">{post.user}</span>
                {post.verified && <span className="text-xs">✓</span>}
                <span
                  className="text-xs"
                  style={{
                    color: isGeoAlert ? "#9ca3af" : "#9ca3af"
                  }}
                >
                  {post.time}
                </span>
              </div>
              <div
                className="flex items-center gap-1 text-xs mt-1"
                style={{
                  color: isGeoAlert ? "#9ca3af" : "#6b7280"
                }}
              >
                <FiMapPin size={14} />
                <span>{post.area}</span>
                {post.distance && <span>· {post.distance}</span>}
              </div>
            </div>
          </div>
          <button
            className="p-2 hover:bg-[#f8f9fa] rounded-full transition"
            style={{
              color: isGeoAlert ? "white" : "#6b7280",
              backgroundColor: isGeoAlert ? "rgba(255,255,255,0.1)" : "transparent"
            }}
          >
            <FiMoreHorizontal size={18} />
          </button>
        </div>

        {/* POST TYPE BADGE */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`badge ${getPostTypeBadge(post.type)}`}>
            {post.type.replace("_", " ")}
          </span>
          {isGeoAlert && (
            <span
              className="badge text-xs"
              style={{
                backgroundColor: "rgba(29, 158, 117, 0.15)",
                color: "#1D9E75",
                border: "1px solid rgba(29, 158, 117, 0.3)"
              }}
            >
              GeoTrade AI
            </span>
          )}
        </div>
      </div>

      {/* POST CONTENT */}
      <div className="card-padded border-b border-[#e5e7eb]">
        <p
          className="text-sm leading-relaxed mb-4"
          style={{
            color: isGeoAlert ? "#f8fafc" : "#111827"
          }}
        >
          {post.text}
        </p>

        {/* PHOTO PLACEHOLDER */}
        {post.hasPhoto && (
          <div
            className="w-full aspect-video bg-gradient-to-br rounded-lg mb-3 flex items-center justify-center text-white text-sm flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#f8fafc"
            }}
          >
            📸 {post.photoLabel.split("—")[0].trim()}
          </div>
        )}

        {/* AI TAG */}
        {post.aiTag && (
          <div
            className="text-xs px-3 py-2 rounded-lg inline-block"
            style={{
              backgroundColor: isGeoAlert
                ? "rgba(29, 158, 117, 0.15)"
                : "rgba(29, 158, 117, 0.08)",
              color: isGeoAlert ? "#1D9E75" : "#185FA5",
              border: isGeoAlert ? "1px solid rgba(29, 158, 117, 0.3)" : "none"
            }}
          >
            🔍 {post.aiTag}
          </div>
        )}
      </div>

      {/* CIVIC IMPACT */}
      {post.civicImpact && (
        <div
          className="card-padded border-b border-[#e5e7eb] text-sm font-500"
          style={{
            color: isGeoAlert ? "#9ca3af" : "#6b7280"
          }}
        >
          Civic impact: <span style={{ color: isGeoAlert ? "white" : "#111827" }}>
            {post.civicImpact}
          </span>
        </div>
      )}

      {/* ACTIONS */}
      <div className="card-padded">
        <div className="flex items-center gap-4 justify-between text-sm font-500 mb-3">
          <button
            onClick={onLike}
            className="flex items-center gap-2 transition-colors"
            style={{
              color: isLiked ? "#E24B4A" : isGeoAlert ? "#9ca3af" : "#6b7280"
            }}
          >
            <FiThumbsUp
              size={18}
              fill={isLiked ? "#E24B4A" : "none"}
            />
            <span>{post.upvotes || 0}</span>
          </button>
          <button
            className="flex items-center gap-2 transition-colors"
            style={{
              color: isGeoAlert ? "#9ca3af" : "#6b7280"
            }}
          >
            <FiMessageCircle size={18} />
            <span>{post.comments}</span>
          </button>
          {!isGeoAlert && (
            <button
              className="flex items-center gap-2 transition-colors"
              style={{
                color: isGeoAlert ? "#9ca3af" : "#6b7280"
              }}
            >
              <FiZap size={18} />
              <span>Escalate</span>
            </button>
          )}
        </div>

        <div
          className="flex items-center gap-4 "
          style={{
            paddingTop: "12px",
            borderTop: isGeoAlert ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb"
          }}
        >
          <button
            className="flex items-center gap-2 text-sm transition-colors"
            style={{
              color: isGeoAlert ? "#9ca3af" : "#6b7280"
            }}
          >
            <FiShare2 size={16} />
            <span>Share</span>
          </button>
          <button
            className="text-sm transition-colors ml-auto"
            style={{
              color: isGeoAlert ? "#9ca3af" : "#6b7280"
            }}
          >
            Bookmark
          </button>
        </div>
      </div>
    </div>
  );
}
