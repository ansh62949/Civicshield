import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../shared/Shared";
import { FiHeart, FiMessageCircle, FiSend, FiBookmark, FiMoreHorizontal } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";

const getTypeStyles = (type) => {
  const styles = {
    CIVIC: { bg: "bg-primary/20", text: "text-primary-light", label: "CIVIC" },
    SAFETY: { bg: "bg-yellow-500/20", text: "text-yellow-300", label: "SAFETY" },
    CRIME: { bg: "bg-red-500/20", text: "text-red-300", label: "CRIME" },
    GEO_ALERT: { bg: "bg-slate-800", text: "text-teal-400", label: "GEO ALERT" },
    ENVIRONMENT: { bg: "bg-green-500/20", text: "text-green-300", label: "ENV" },
    NEWS: { bg: "bg-blue-500/20", text: "text-blue-300", label: "NEWS" }
  };
  return styles[type] || styles.CIVIC;
};

const getSeverityColor = (tag) => {
  if (!tag) return "";
  const t = tag.toLowerCase();
  if (t.includes("critical")) return "text-white bg-critical";
  if (t.includes("high")) return "text-white bg-orange-500";
  if (t.includes("medium")) return "text-white bg-yellow-500";
  return "text-white bg-success";
};

export const PostCard = React.memo(({ post, onUpvote, onComment, onShare, onClick, onDelete }) => {
  const navigate = useNavigate();
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
  const { user } = useAuth();

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

  const typeStyle = getTypeStyles(post.type);
  const severityStyle = getSeverityColor(post.aiTag);
  const isCivicImpactNegative = post.civicImpact?.startsWith("-");

  let imageUrl = null;
  const rawImg = post.imageUrl || post.image;
  if (rawImg && rawImg !== "null" && rawImg !== "undefined") {
    imageUrl = (rawImg.startsWith("http") || rawImg.startsWith("data:")) ? rawImg : `${import.meta.env.VITE_API_URL || 'https://civicshield-1-om60.onrender.com'}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;
  } else {
    // Default image if none provided
    imageUrl = `https://picsum.photos/seed/${post.id || Math.random()}/800/800`;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mb-6 overflow-hidden transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="cursor-pointer relative" onClick={(e) => { e.stopPropagation(); navigate(`/profile/${post.authorId}`); }}>
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary to-secondary rounded-full"></div>
            <div className="relative border-2 border-[#0f172a] rounded-full overflow-hidden">
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
              <span 
                className="font-bold text-sm text-text-primary cursor-pointer hover:text-primary transition-colors" 
                onClick={(e) => { e.stopPropagation(); navigate(`/profile/${post.authorId}`); }}
              >
                {post.userName}
              </span>
              {post.isVerified && <span className="text-[10px] bg-primary/20 text-primary px-1 rounded-sm ml-1">✓</span>}
            </div>
            <span className="text-xs text-text-secondary">{post.area}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 relative">
           <span className="text-[10px] text-text-tertiary">{post.timeAgo}</span>
           <button onClick={() => setShowMenu(!showMenu)} className="text-text-secondary hover:text-white p-1">
             <FiMoreHorizontal className="w-5 h-5" />
           </button>

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
        </div>
      </div>

      {/* Image Body */}
      {(imageUrl && !imageError) ? (
        <div 
          className="relative w-full cursor-pointer group bg-[#020617]"
          onDoubleClick={handleDoubleTap}
        >
          <img 
            src={imageUrl} 
            alt="Post content" 
            className="w-full aspect-square md:aspect-[4/5] object-cover"
            loading="lazy"
            onError={(e) => {
              setImageError(true);
              e.target.src = "https://placehold.co/800x800/1e293b/fff?text=Image+Unavailable";
            }}
          />
          {/* Heart Animation on Double Tap */}
          <AnimatePresence>
            {showHeartAnim && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
              >
                <FaHeart className="text-white text-8xl drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] opacity-90" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Badges on image */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none items-end">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${typeStyle.bg} ${typeStyle.text} backdrop-blur-md border border-white/10`}>
              {typeStyle.label}
            </span>
            {post.aiTag && (
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${severityStyle} backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10`}>
                🚨 {post.aiTag.split('·')[1]?.trim() || 'VERIFIED'}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div 
          className="px-6 py-12 bg-gradient-to-br from-[#1e293b] to-[#0f172a] cursor-pointer shadow-inner relative"
          onDoubleClick={handleDoubleTap}
        >
           {/* Badges */}
           <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none items-end">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${typeStyle.bg} ${typeStyle.text} backdrop-blur-md border border-white/10`}>
              {typeStyle.label}
            </span>
          </div>
          <p className="text-xl md:text-2xl font-medium text-white text-center italic drop-shadow-md leading-relaxed px-4">
            "{post.text?.length > 150 ? post.text.substring(0, 150) + '...' : (post.text || post.content)}"
          </p>
        </div>
      )}

      {/* Footer / Actions */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-4">
            <motion.button 
              whileTap={{ scale: 0.8 }}
              onClick={handleUpvote} 
              className="group"
            >
              {isUpvotedLocal ? (
                <FaHeart className="text-critical text-[26px] drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              ) : (
                <FiHeart className="text-text-primary text-[26px] group-hover:text-text-secondary transition-colors" />
              )}
            </motion.button>
            <motion.button whileTap={{ scale: 0.8 }} onClick={(e) => { e.stopPropagation(); onComment?.(post.id); }} className="group">
              <FiMessageCircle className="text-text-primary text-[26px] group-hover:text-text-secondary transition-colors" />
            </motion.button>
            <motion.button whileTap={{ scale: 0.8 }} onClick={(e) => { e.stopPropagation(); onShare?.(post.id); }} className="group">
              <FiSend className="text-text-primary text-[26px] group-hover:text-text-secondary transition-colors" />
            </motion.button>
          </div>
          <motion.button whileTap={{ scale: 0.8 }} className="group">
            <FiBookmark className="text-text-primary text-[26px] group-hover:text-text-secondary transition-colors" />
          </motion.button>
        </div>

        {/* Upvotes */}
        <p className="font-bold text-sm text-text-primary mb-2">{upvoteCount.toLocaleString()} upvotes</p>

        {/* Caption */}
        <div className="text-sm text-text-primary mb-2 leading-relaxed">
          <span className="font-bold mr-2 cursor-pointer hover:underline">{post.userName}</span>
          <span className={!isExpanded ? "line-clamp-2 inline" : "inline text-text-secondary"}>
            {post.text || post.content}
          </span>
          {!isExpanded && (post.text || post.content)?.length > 100 && (
            <button onClick={() => setIsExpanded(true)} className="text-text-tertiary ml-1 hover:text-white font-medium text-xs uppercase tracking-wide">
              more
            </button>
          )}
        </div>

        {/* Civic Impact */}
        {post.civicImpact && (
          <div className="mb-2">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm border ${isCivicImpactNegative ? 'bg-critical/10 text-critical border-critical/30' : 'bg-success/10 text-success border-success/30'}`}>
              Impact: {post.civicImpact}
            </span>
          </div>
        )}

        {/* Comments link */}
        {post.comments > 0 && (
          <button 
            onClick={(e) => { e.stopPropagation(); onComment?.(post.id); }}
            className="text-sm text-text-tertiary mb-1 hover:text-text-secondary transition-colors"
          >
            View all {post.comments} comments
          </button>
        )}
      </div>
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

