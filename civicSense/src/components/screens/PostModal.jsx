import React, { useState, useEffect } from "react";
import { Avatar, Toast } from "../shared/Shared";
import { CURRENT_USER, detectPostType, detectSeverity } from "../../mockData";
import { postsAPI } from "../../services/api";

export const PostModal = ({ onClose, onSubmit, currentLocation }) => {
  const [postType, setPostType] = useState("Civic");
  const [text, setText] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [showAIPreview, setShowAIPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(null);

  const postTypes = ["Civic", "Safety", "Crime", "Environment", "News", "Other"];

  // Show AI preview after 1 second of typing
  useEffect(() => {
    if (text.length > 10) {
      const timer = setTimeout(() => setShowAIPreview(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowAIPreview(false);
    }
  }, [text]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      setShowToast("Please write something first");
      return;
    }

    setLoading(true);

    try {
      const coords = { lat: 28.6139, lon: 77.2090 }; // Use default or map to currentLocation if available
      
      await postsAPI.createPost(
        photoFile,
        text,
        coords.lat,
        coords.lon,
        currentLocation.replace("📍 ", ""),
        "Delhi",
        false
      );
      
      setSubmitted(true);
      setTimeout(() => {
        onSubmit({
          type: postType,
          text,
          hasPhoto: !!photoUrl,
          area: currentLocation.replace("📍 ", "")
        });
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Failed to submit post", error);
      setShowToast("Failed to transmit data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const detected = detectPostType(text);
  const severity = detectSeverity(text);

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center max-w-sm w-full shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <div className="mb-4 animate-bounce">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.5)] text-white rounded-full flex items-center justify-center mx-auto text-4xl border border-white/20">
              ✓
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-100 mb-4 drop-shadow-md">
            Post Published! 🎉
          </h2>

          <p className="text-indigo-200/80 mb-6">AI verified your report</p>

          <div className="space-y-2 text-left mb-6 bg-white/5 border border-white/10 backdrop-blur-sm p-4 rounded-xl shadow-inner">
            <p className="text-sm text-gray-200 animate-fadeIn font-medium">
              <span className="text-indigo-400">✓</span> Category: {detected.type} · {detected.category}
            </p>
            <p className="text-sm text-gray-200 animate-fadeIn font-medium">
              <span className="text-indigo-400">✓</span> Severity: {severity}
            </p>
            <p className="text-sm text-gray-200 animate-fadeIn font-medium">
              <span className="text-indigo-400">✓</span> Area: {currentLocation.replace("📍 ", "")}
            </p>
            <p className="text-sm text-gray-200 animate-fadeIn font-medium">
              <span className="text-indigo-400">✓</span> Civic Impact: -2 pts Infrastructure
            </p>
          </div>

          <p className="text-xs text-indigo-300/60 mb-4 font-semibold">
            Your post is now live in the intelligence network
          </p>

          <button
            onClick={() => {
              onClose();
            }}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-105 text-white py-3 rounded-full font-bold transition-all border border-white/10"
          >
            ↵ Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md z-50 flex items-end md:items-center md:justify-center p-0 md:p-4">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 w-full md:max-w-lg rounded-t-3xl md:rounded-3xl max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(99,102,241,0.15)] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-5 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-100 drop-shadow-md">Transmit Data</h2>
          <button
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Row */}
          <div className="flex items-center gap-3 mb-6 bg-white/5 p-3 rounded-xl border border-white/5">
            <Avatar
              initials={CURRENT_USER.initials}
              bg="#1e1b4b"
              color="#818cf8"
              size="md"
            />
            <div>
              <p className="font-bold text-gray-100">{CURRENT_USER.name}</p>
              <p className="text-xs font-semibold text-indigo-400">{currentLocation}</p>
            </div>
          </div>

          {/* Post type selector */}
          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-3">Classification</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {postTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setPostType(type)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                    postType === type
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-white/20 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                      : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Text area */}
          <div className="mb-6 relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 280))}
              placeholder="What intelligence are you reporting?"
              className="w-full min-h-32 p-4 bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:border-indigo-500 resize-none text-gray-100 placeholder-slate-500 shadow-inner"
            />
            <div
              className={`absolute bottom-4 right-4 text-xs font-bold ${
                text.length > 260 ? "text-red-400 animate-pulse" : "text-slate-500"
              }`}
            >
              {text.length}/280
            </div>
          </div>

          {/* Photo upload */}
          <div className="mb-6">
            {photoUrl ? (
              <div className="relative w-full bg-[#020617] rounded-xl overflow-hidden border border-white/10">
                <img
                  src={photoUrl}
                  alt="preview"
                  className="w-full h-48 object-cover opacity-90"
                />
                <button
                  onClick={() => { setPhotoUrl(null); setPhotoFile(null); }}
                  className="absolute top-2 right-2 bg-red-500/80 backdrop-blur-md text-white rounded-full w-8 h-8 flex items-center justify-center font-bold hover:bg-red-500 transition-colors border border-white/20"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="block border border-dashed border-indigo-500/30 bg-white/5 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/10 transition-all shadow-inner">
                <span className="text-3xl mb-2 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">📷</span>
                <p className="text-xs font-bold text-indigo-300 tracking-wider uppercase mt-2">Attach Media Evidence</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* AI Preview */}
          {showAIPreview && text.length > 10 && (
            <div className="mb-6 p-4 bg-indigo-900/30 border border-indigo-500/30 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.1)]">
              <p className="text-xs font-bold text-indigo-300 mb-2 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> AI Analysis Active
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <p className="text-slate-300 bg-white/5 p-2 rounded border border-white/5">
                  <strong className="text-white">Class:</strong> {detected.type}
                </p>
                <p className="text-slate-300 bg-white/5 p-2 rounded border border-white/5">
                  <strong className="text-white">Sev:</strong> {severity}
                </p>
              </div>
              <p className="text-[10px] text-indigo-400 mt-2 font-bold uppercase">
                Est. Impact: -2 pts Infrastructure
              </p>
            </div>
          )}

          {/* Location */}
          <div className="mb-6 p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
            <span className="text-lg animate-pulse text-indigo-400">📍</span>
            <div>
              <p className="text-xs font-bold text-gray-100">{currentLocation.replace("📍 ", "")}</p>
              <p className="text-[10px] text-indigo-300 uppercase tracking-widest">GPS Verified Coordinate</p>
            </div>
          </div>

          {/* Toggle Anonymous */}
          <div className="mb-8 flex items-center justify-between p-2 bg-white/5 border border-white/10 rounded-xl">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Transmit Anonymously</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 border border-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500 shadow-inner"></div>
            </label>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all border ${
              loading
                ? "bg-white/5 text-slate-500 border-white/10 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-white/20 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:scale-[1.02]"
            }`}
          >
            {loading ? "📡 Uplinking Data..." : "Transmit Intelligence"}
          </button>
        </div>
      </div>

      {showToast && (
        <Toast message={showToast} onClose={() => setShowToast(null)} />
      )}
    </div>
  );
};
