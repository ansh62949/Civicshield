import React, { useState } from "react";
import { Avatar, Toast } from "../shared/Shared";
import { MOCK_COMMENTS } from "../../mockData";

export const PostDetail = ({ post, onClose, onEscalade, onShare }) => {
  const [comments, setComments] = useState([
    ...(MOCK_COMMENTS[post.id] || []),
    {
      user: "You",
      text: "I'm monitoring this situation",
      time: "just now",
      isYou: true
    }
  ]);
  const [newComment, setNewComment] = useState("");
  const [showToast, setShowToast] = useState(null);

  const handleAddComment = (e) => {
    if (e.key === "Enter" && newComment.trim()) {
      setComments([
        ...comments.slice(0, -1),
        {
          user: "You",
          text: newComment,
          time: "just now",
          isYou: true
        },
        {
          user: "You",
          text: "I'm monitoring this situation",
          time: "just now",
          isYou: true
        }
      ]);
      setNewComment("");
      setShowToast("Comment added ✓");
    }
  };

  const handleEscalate = () => {
    setShowToast("Post escalated to authorities ✓");
    onEscalade?.(post.id);
  };

  const handleShare = () => {
    setShowToast("Link copied to clipboard!");
    onShare?.(post.id);
  };

  return (
    <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md z-50 flex items-end md:items-center p-0 md:p-4 justify-center">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 w-full md:max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-3xl shadow-[0_0_40px_rgba(99,102,241,0.15)] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <span className="font-bold text-gray-100 uppercase tracking-widest text-xs">Intelligence Detail</span>
          <button
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Post Content */}
        <div className="p-6">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-4 bg-white/5 p-3 rounded-xl border border-white/5">
            <Avatar
              initials={post.userInitials}
              bg="#1e1b4b"
              color="#818cf8"
              size="md"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-100">{post.userName}</span>
                {post.isVerified && <span className="text-xs text-indigo-400">✓</span>}
              </div>
              <span className="text-[10px] uppercase tracking-wider text-indigo-300/80 font-bold">{post.timeAgo} • 📍 {post.area}</span>
            </div>
          </div>

          {/* Text */}
          <p className="text-gray-200 leading-relaxed mb-6 whitespace-pre-wrap text-sm font-medium">
            {post.text}
          </p>

          {/* Stats */}
          <div className="flex gap-4 py-3 border-y border-white/10 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              <strong className="text-indigo-400 text-sm">{post.upvotes}</strong> Signals
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              <strong className="text-indigo-400 text-sm">{post.comments}</strong> Replies
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleEscalate}
              className="flex-1 bg-red-500/10 text-red-400 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors shadow-inner"
            >
              ⚡ Escalate
            </button>
            <button
              onClick={handleShare}
              className="flex-1 bg-white/5 text-slate-300 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest border border-white/10 hover:bg-white/10 hover:text-white transition-colors"
            >
              Share
            </button>
          </div>

          {/* Comments Section */}
          <div className="mb-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-indigo-400 mb-4">Analysis Thread</h3>

            {/* Comment list */}
            <div className="space-y-3 mb-6">
              {comments.map((comment, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-3 shadow-inner">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-gray-200">
                      {comment.user}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{comment.time}</span>
                  </div>
                  <p className="text-xs text-slate-300">{comment.text}</p>
                </div>
              ))}
            </div>

            {/* Add comment */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleAddComment}
                placeholder="Contribute intelligence..."
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500 shadow-inner"
              />
              <button
                onClick={() => {
                  if (newComment.trim()) {
                    handleAddComment({ key: "Enter" });
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-xs shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-105 transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {showToast && (
          <Toast
            message={showToast}
            onClose={() => setShowToast(null)}
          />
        )}
      </div>
    </div>
  );
};
