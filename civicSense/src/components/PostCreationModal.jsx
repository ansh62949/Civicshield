import React, { useState, useEffect } from "react";
import { FiX, FiImage } from "react-icons/fi";

/**
 * PostCreationModal Component
 * Full-screen on mobile, centered modal on desktop
 * Multi-step: Content → Location → AI Analysis → Submit
 */
export default function PostCreationModal({ isOpen, onClose, onSubmit }) {
  const [content, setContent] = useState("");
  const [selectedType, setSelectedType] = useState("CIVIC");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [showAiAnalysis, setShowAiAnalysis] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const postTypes = [
    { id: "CIVIC", label: "Civic", bg: "#E6F1FB", text: "#185FA5" },
    { id: "SAFETY", label: "Safety", bg: "#FAEEDA", text: "#854F0B" },
    { id: "CRIME", label: "Crime", bg: "#FCEBEB", text: "#A32D2D" },
    { id: "ENVIRONMENT", label: "Environment", bg: "#EAF3DE", text: "#3B6D11" },
    { id: "NEWS", label: "News", bg: "#EEEDFE", text: "#534AB7" },
    { id: "OTHER", label: "Other", bg: "#f8f9fa", text: "#6b7280" }
  ];

  // Debounced AI analysis
  useEffect(() => {
    if (content.length > 0) {
      const timer = setTimeout(() => {
        setShowAiAnalysis(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowAiAnalysis(false);
    }
  }, [content]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus("verifying");

    // Simulate AI verification
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSubmitStatus("success");

    // Reset form after 2 seconds
    setTimeout(() => {
      setContent("");
      setSelectedType("CIVIC");
      setHasPhoto(false);
      setShowAiAnalysis(false);
      setSubmitStatus(null);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  const charLimit = 280;
  const selectedTypeObj = postTypes.find((t) => t.id === selectedType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center md:justify-center">
      <div
        className="bg-white w-full md:w-full md:max-w-2xl md:rounded-2xl md:shadow-xl p-6 space-y-6 max-h-[90vh] overflow-y-auto"
        style={{
          borderRadius: "12px 12px 0 0"
        }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between sticky top-0 bg-white pb-4 border-b border-[#e5e7eb]">
          <h2 className="text-xl font-bold text-[#111827]">Create Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f8f9fa] rounded-full transition"
          >
            <FiX size={24} style={{ color: "#6b7280" }} />
          </button>
        </div>

        {submitStatus && (
          <div
            className="p-4 rounded-lg text-center text-white font-600"
            style={{
              backgroundColor:
                submitStatus === "success" ? "#10b981" : "#3b82f6"
            }}
          >
            {submitStatus === "verifying"
              ? "🔍 AI verifying your post..."
              : "✓ Posted! Your report is now live."}
          </div>
        )}

        {!submitStatus && (
          <>
            {/* STEP 1: CONTENT */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-600 mb-2 text-[#111827]">
                  What's happening in your area?
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value.slice(0, charLimit))}
                  placeholder="Describe the civic issue, safety concern, or news..."
                  className="w-full p-4 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D9E75] resize-none h-32"
                  style={{ fontFamily: "system-ui" }}
                />
                <div
                  className="text-xs mt-2"
                  style={{
                    color:
                      content.length > charLimit - 20
                        ? "#E24B4A"
                        : "#9ca3af"
                  }}
                >
                  {content.length}/{charLimit} characters
                </div>
              </div>

              {/* PHOTO UPLOAD */}
              <div>
                <label className="block text-sm font-600 mb-2 text-[#111827]">
                  Add Photo (Optional)
                </label>
                <button
                  onClick={() => setHasPhoto(!hasPhoto)}
                  className="w-full border-2 border-dashed border-[#e5e7eb] rounded-lg p-8 text-center transition hover:border-[#1D9E75] hover:bg-[#f8f9fa]"
                  style={{
                    backgroundColor: hasPhoto ? "#f0f9f7" : "transparent"
                  }}
                >
                  <FiImage size={32} className="mx-auto mb-2" style={{ color: "#9ca3af" }} />
                  <p className="text-sm font-500 text-[#111827]">
                    {hasPhoto ? "✓ Photo selected" : "Tap to upload photo"}
                  </p>
                  <p className="text-xs text-[#9ca3af] mt-1">16:9 ratio recommended</p>
                </button>
              </div>

              {/* POST TYPE SELECTOR */}
              <div>
                <label className="block text-sm font-600 mb-3 text-[#111827]">
                  Post Type
                </label>
                <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
                  {postTypes.map((type) => {
                    const isSelected = selectedType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className="p-3 rounded-lg font-600 text-sm transition border-2"
                        style={{
                          backgroundColor: isSelected ? type.bg : "white",
                          color: isSelected ? type.text : "#9ca3af",
                          borderColor: isSelected ? type.text : "#e5e7eb"
                        }}
                      >
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* STEP 2: LOCATION */}
            <div
              className="p-4 rounded-lg bg-[#f8f9fa]"
              style={{ border: "1px solid #e5e7eb" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-600 text-[#111827]">
                    📍 Sector 62, Noida
                  </p>
                  <p className="text-xs text-[#9ca3af] mt-1">GPS detected</p>
                </div>
                <button className="text-sm font-500 text-[#1D9E75] hover:underline">
                  Change location
                </button>
              </div>
            </div>

            {/* STEP 3: AI ANALYSIS */}
            {showAiAnalysis && (
              <div
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: "rgba(29, 158, 117, 0.05)",
                  border: "1px solid rgba(29, 158, 117, 0.2)"
                }}
              >
                <p className="text-sm font-600 text-[#1D9E75] mb-3">
                  🤖 AI Preview
                </p>
                <div className="space-y-2 text-sm text-[#111827]">
                  <div className="flex justify-between">
                    <span>Category detected:</span>
                    <span className="font-600">{selectedType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Severity:</span>
                    <span className="font-600">
                      {content.length > 100 ? "HIGH" : "MEDIUM"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Area:</span>
                    <span className="font-600">Sector 62, Noida ✓</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#e5e7eb]">
                    <span>Civic score impact:</span>
                    <span className="font-600" style={{ color: "#E24B4A" }}>
                      -2 pts Infrastructure
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="w-full py-3 rounded-lg font-600 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: content.trim() ? "#1D9E75" : "#9ca3af"
              }}
            >
              Post to CivicSense
            </button>
          </>
        )}
      </div>
    </div>
  );
}
