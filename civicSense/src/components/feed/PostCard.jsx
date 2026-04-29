import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../shared/Shared";
import { FiHeart, FiMessageCircle, FiSend, FiBookmark, FiMoreHorizontal } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";

const getPriorityGlow = (severity) => {
  if (!severity) return "";
  const s = severity.toUpperCase();
  if (s === "CRITICAL") return "glow-critical";
  if (s === "HIGH") return "glow-high";
  if (s === "MEDIUM") return "glow-medium";
  return "";
};

const getCategoryColor = (category) => {
  const cats = {
    ROAD: "bg-blue-600/30 text-blue-300 border-blue-500/50",
    GARBAGE: "bg-orange-600/30 text-orange-300 border-orange-500/50",
    WATER: "bg-cyan-600/30 text-cyan-300 border-cyan-500/50",
    CRIME: "bg-red-600/30 text-red-300 border-red-500/50",
    SAFETY: "bg-yellow-600/30 text-yellow-300 border-yellow-500/50",
    ENVIRONMENT: "bg-green-600/30 text-green-300 border-green-500/50"
  };
  return cats[category?.toUpperCase()] || "bg-gray-600/30 text-gray-300 border-gray-500/50";
};

export const PostCard = React.memo(({ post, onUpvote, onComment, onShare, onClick, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpvotedLocal, setIsUpvotedLocal] = useState(
    Array.isArray(post.upvotes) ? post.upvotes.includes(user?.id || user?.username) : false
  );
  const [upvoteCount, setUpvoteCount] = useState(
    Array.isArray(post.upvotes) ? post.upvotes.length : (typeof post.upvotes === 'number' ? post.upvotes : 0)
  );
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleUpvote = (e) => {
    e?.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    setIsUpvotedLocal(!isUpvotedLocal);
    setUpvoteCount(prev => prev + (isUpvotedLocal ? -1 : 1));
    onUpvote?.(post.id);
  };

  const handleDoubleTap = (e) => {
    e.stopPropagation();
    if (!isUpvotedLocal) {
      handleUpvote();
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  const priorityGlow = getPriorityGlow(post.severity);
  const categoryStyle = getCategoryColor(post.category);
  const isCivicImpactNegative = post.civicImpact?.startsWith("-");

  let imageUrl = null;
  const rawImg = post.imageUrl || post.image;
  if (rawImg && rawImg !== "null" && rawImg !== "undefined") {
    imageUrl = (rawImg.startsWith("http") || rawImg.startsWith("data:")) ? rawImg : `${import.meta.env.VITE_API_URL || 'https://civicshield-1-om60.onrender.com'}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;
  } else {
    imageUrl = `https://picsum.photos/seed/${post.id || Math.random()}/800/800`;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card mb-6 overflow-hidden ${priorityGlow}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 relative z-10 bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="cursor-pointer relative" onClick={(e) => { e.stopPropagation(); navigate(`/profile/${post.authorId}`); }}>
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-secondary rounded-full opacity-75 blur-[2px]"></div>
            <div className="relative border-2 border-[#020617] rounded-full overflow-hidden">
              <Avatar
                initials={post.userInitials || post.userName?.substring(0, 2).toUpperCase()}
                bg={post.avatarBg || "#1e293b"}
                color={post.avatarColor || "#fff"}
                size="md"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-white">{post.userName}</span>
              {post.isVerified && <span className="text-[8px] bg-accent/20 text-accent px-1 rounded-sm border border-accent/30">AI VERIFIED</span>}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-text-secondary">
              <span className="text-accent">📍</span>
              {post.area}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] text-text-tertiary">{post.timeAgo}</span>
           <button onClick={() => setShowMenu(!showMenu)} className="text-text-secondary hover:text-white p-1">
             <FiMoreHorizontal className="w-5 h-5" />
           </button>
        </div>
      </div>

           <AnimatePresence>
             {showMenu && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="absolute top-8 right-0 bg-[#0f172a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 w-32"
               >
                 <button 
                   onClick={(e) => { e.stopPropagation(); setShowMenu(false); onShare?.(post.id); }}
                   className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors text-white"
                 >
                   Share
                 </button>
                 {(user?.username === post.authorId || user?.username === post.userName) && (
                   <button 
                     onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete?.(post.id); }}
                     className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors text-critical font-bold border-t border-white/5"
                   >
                     Delete
                   </button>
                 )}
               </motion.div>
             )}
           </AnimatePresence>

      {/* Image Body */}
      {(imageUrl && !imageError) ? (
        <div 
          className="relative w-full cursor-pointer group bg-[#020617]"
          onDoubleClick={handleDoubleTap}
        >
          <img 
            src={imageUrl} 
            alt="Post content" 
            className="w-full aspect-square md:aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              setImageError(true);
              e.target.src = "https://placehold.co/800x800/1e293b/fff?text=Image+Unavailable";
            }}
          />
          
          <AnimatePresence>
            {showHeartAnim && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
              >
                <FaHeart className="text-white text-8xl drop-shadow-2xl opacity-90" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Futuristic Badges on image */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none items-end">
            {post.category && (
              <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border backdrop-blur-xl shadow-lg ${categoryStyle}`}>
                {post.category}
              </span>
            )}
            {post.aiConfidence && (
              <span className="px-2 py-0.5 rounded-md text-[9px] font-medium bg-black/60 text-white/80 border border-white/10 backdrop-blur-sm">
                AI Confidence: {(post.aiConfidence * 100).toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      ) : (
        <div 
          className="px-8 py-16 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] cursor-pointer relative min-h-[300px] flex items-center justify-center"
          onDoubleClick={handleDoubleTap}
        >
          <p className="text-xl md:text-2xl font-semibold text-white/90 text-center leading-relaxed max-w-sm drop-shadow-lg">
            "{post.text || post.content}"
          </p>
          <div className="absolute top-4 right-4">
             {post.category && (
              <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border backdrop-blur-xl ${categoryStyle}`}>
                {post.category}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer / Actions */}
      <div className="p-4 bg-white/2 backdrop-blur-sm border-t border-white/5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-5">
            <motion.button whileTap={{ scale: 0.8 }} onClick={handleUpvote} className="relative">
              {isUpvotedLocal ? (
                <FaHeart className="text-critical text-2xl drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              ) : (
                <FiHeart className="text-white/80 text-2xl hover:text-white transition-colors" />
              )}
            </motion.button>
            <motion.button whileTap={{ scale: 0.8 }} onClick={(e) => { e.stopPropagation(); onComment?.(post.id); }}>
              <FiMessageCircle className="text-white/80 text-2xl hover:text-white transition-colors" />
            </motion.button>
            <motion.button whileTap={{ scale: 0.8 }} onClick={(e) => { e.stopPropagation(); onShare?.(post.id); }}>
              <FiSend className="text-white/80 text-2xl hover:text-white transition-colors" />
            </motion.button>
          </div>
          <motion.button whileTap={{ scale: 0.8 }}>
            <FiBookmark className="text-white/80 text-2xl hover:text-white transition-colors" />
          </motion.button>
        </div>

        <div className="space-y-2">
          <p className="font-bold text-sm text-white">{upvoteCount.toLocaleString()} detections upvoted</p>

          <div className="text-sm leading-relaxed">
            <span className="font-bold text-white mr-2">{post.userName}</span>
            <span className={!isExpanded ? "line-clamp-2 text-white/80" : "text-white/90"}>
              {post.text || post.content}
            </span>
            {!isExpanded && (post.text || post.content)?.length > 100 && (
              <button onClick={() => setIsExpanded(true)} className="text-accent ml-1 hover:underline font-medium">more</button>
            )}
          </div>

          {/* AI Metadata Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {post.severity && (
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-tighter border ${
                post.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                post.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}>
                {post.severity} PRIORITY
              </span>
            )}
            {post.civicImpact && (
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                isCivicImpactNegative ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                IMPACT: {post.civicImpact}
              </span>
            )}
          </div>
        </div>
      </div>

        {/* Comments link */}
        {post.comments > 0 && (
          <button 
            onClick={(e) => { e.stopPropagation(); onComment?.(post.id); }}
            className="text-sm text-text-tertiary mb-1 hover:text-text-secondary transition-colors"
          >
            View all {post.comments} comments
          </button>
        )}
    </motion.div>
  );
});

export const GeoAlertCard = ({ post, onComment, onShare, onClick }) => {
  const text = post.text || post.content || '';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onClick?.(post)}
      className="card mb-6 overflow-hidden cursor-pointer p-4 relative border-l-4 border-l-teal-500 hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] transition-all group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 rounded-full mix-blend-screen filter blur-[60px] opacity-20 animate-pulse pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest px-2 py-1 bg-teal-500/10 text-teal-400 rounded-sm border border-teal-500/20 uppercase">
            🛡️ GEO-ALERT
          </span>
          <span className="text-xs text-text-tertiary">{post.timeAgo}</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onShare?.(post.id); }} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <FiSend className="text-text-secondary hover:text-white" />
        </button>
      </div>

      <div className="relative z-10 pl-2">
        <h3 className="font-bold text-white mb-2 text-lg group-hover:text-teal-300 transition-colors">{text.split("\n")[0] || text}</h3>
        {text.split("\n").length > 1 && (
          <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">
            {text.split("\n").slice(1).join(" ")}
          </p>
        )}
        
        <div className="flex items-center gap-4 text-xs text-text-tertiary uppercase tracking-wider font-semibold">
          <span>📍 {post.area}</span>
          <span>👁️ {post.views || 0} views</span>
        </div>
      </div>
    </motion.div>
  );
};

