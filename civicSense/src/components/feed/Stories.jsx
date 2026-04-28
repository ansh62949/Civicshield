import React, { useState, useEffect } from "react";
import apiClient from "../../services/api";
import { STORIES } from "../../mockData";
import { Avatar } from "../shared/Shared";

export const StoriesRow = ({ onStoryClick }) => {
  const [stories, setStories] = useState([]);
  const [myStory, setMyStory] = useState(null);

  useEffect(() => {
    apiClient.get("/stories").then(res => {
      setStories(res.data);
    }).catch(console.error);
    
    const savedStory = localStorage.getItem("civicMyStory");
    if (savedStory) {
      setMyStory(JSON.parse(savedStory));
    }
  }, []);

  const handleStoryClick = (story) => {
    onStoryClick(story);
  };

  const handleStoryUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newStory = {
          id: "my-story",
          userName: "Your Story",
          area: "Local Area",
          imageUrl: event.target.result,
          tension: 80,
          isLocal: true
        };
        setMyStory(newStory);
        localStorage.setItem("civicMyStory", JSON.stringify(newStory));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getStoryBorder = (tension) => {
    if (tension > 70) return "from-critical to-orange-500";
    if (tension > 40) return "from-orange-500 to-yellow-500";
    return "from-primary to-secondary";
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 mb-2 px-4 scrollbar-hide">
      {/* Add / View My Story */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0 group">
        <div className="relative w-[68px] h-[68px]">
          {myStory ? (
            <button onClick={() => handleStoryClick(myStory)} className={`absolute inset-0 rounded-full bg-gradient-to-tr ${getStoryBorder(myStory.tension)} p-[2px]`}>
              <div className="w-full h-full rounded-full bg-[#020617] overflow-hidden border-2 border-[#020617]">
                 <img src={myStory.imageUrl} className="w-full h-full object-cover" alt="My Story" />
              </div>
            </button>
          ) : (
            <>
              <div className="absolute inset-0 rounded-full border border-white/20"></div>
              <label className="absolute inset-[2px] rounded-full bg-[#0f172a] border border-white/10 flex items-center justify-center cursor-pointer">
                <span className="text-2xl text-text-secondary group-hover:text-white transition-colors">➕</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleStoryUpload} />
              </label>
            </>
          )}
        </div>
        <span className="text-[11px] font-medium text-text-secondary group-hover:text-white transition-colors">
          Your Story
        </span>
      </div>

      {/* Real stories */}
      {stories.map((story) => (
        <button
          key={story.id}
          onClick={() => handleStoryClick(story)}
          className="flex flex-col items-center gap-2 flex-shrink-0 group hover:scale-95 transition-transform"
        >
          <div className="relative w-[68px] h-[68px]">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${getStoryBorder(story.tension || 50)} animate-spin-slow`}></div>
            <div className="absolute inset-[2px] rounded-full bg-[#020617] border-[2px] border-[#020617] overflow-hidden flex items-center justify-center">
              {story.imageUrl ? (
                 <img src={`${import.meta.env.VITE_API_URL || 'https://civicshield-1-om60.onrender.com'}${story.imageUrl}`} className="w-full h-full object-cover" alt="story" />
              ) : (
                 <span className="text-white font-bold">{story.userName?.substring(0, 2).toUpperCase()}</span>
              )}
            </div>
          </div>
          <span className="text-[11px] font-medium text-text-primary text-center max-w-[68px] truncate">
            {story.userName}
          </span>
        </button>
      ))}

      {/* Mock story circles */}
      {stories.length === 0 && STORIES.map((story, idx) => (
        <button
          key={idx}
          onClick={() => handleStoryClick(story)}
          className="flex flex-col items-center gap-2 flex-shrink-0 group hover:scale-95 transition-transform"
        >
          <div className="relative w-[68px] h-[68px]">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${getStoryBorder(story.tension || 50)}`}></div>
            <div className="absolute inset-[2.5px] rounded-full bg-[#020617] border-2 border-[#020617] overflow-hidden flex items-center justify-center">
              <span className="text-white font-bold text-sm bg-[#1e293b] w-full h-full flex items-center justify-center">{story.area.substring(0, 2).toUpperCase()}</span>
            </div>
          </div>
          <span className="text-[11px] font-medium text-text-primary text-center max-w-[68px] truncate">
            {story.area}
          </span>
        </button>
      ))}
    </div>
  );
};

export const StoryViewer = ({ story, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const mockStoryPosts = [
    { type: "CIVIC", text: "Pothole issue reported", aiTag: "CRITICAL", upvotes: 34 },
    { type: "SAFETY", text: "Street lighting issue in progress", aiTag: "HIGH", upvotes: 23 },
    { type: "CRIME", text: "Local incident reported", aiTag: "MEDIUM", upvotes: 45 }
  ];

  React.useEffect(() => {
    if (progress >= 100) {
      if (currentStepIndex < mockStoryPosts.length - 1) {
        setCurrentStepIndex(idx => idx + 1);
        setProgress(0);
      } else {
        onClose();
      }
    }
  }, [progress, currentStepIndex, mockStoryPosts.length, onClose]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => Math.min(100, p + (100 / 30)));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleTap = (side) => {
    if (side === "left") {
      setCurrentStepIndex(Math.max(0, currentStepIndex - 1));
    } else {
      if (currentStepIndex < mockStoryPosts.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        onClose();
      }
    }
    setProgress(0);
  };

  if (!story) return null;

  const post = mockStoryPosts[currentStepIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/90 backdrop-blur-lg">
      {/* Responsive Container */}
      <div className="w-full h-full md:w-[400px] md:h-[800px] md:max-h-[90vh] md:rounded-3xl bg-white/5 border border-white/10 flex flex-col relative overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.2)]">
        
        {/* Progress bars */}
        <div className="flex gap-1 p-4 absolute top-0 left-0 right-0 z-20">
          {mockStoryPosts.map((_, idx) => (
            <div key={idx} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-md">
              <div
                className="h-full bg-indigo-400 transition-all ease-linear duration-100 shadow-[0_0_10px_#818cf8]"
                style={{
                  width: idx === currentStepIndex ? `${progress}%` : idx < currentStepIndex ? "100%" : "0%"
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 pt-8 text-white absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-[#020617]/80 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-white/20">
              {story.area.substring(0, 2).toUpperCase()}
            </div>
            <span className="font-bold text-sm uppercase tracking-widest drop-shadow-md text-indigo-100">{story.area}</span>
          </div>
          <button onClick={onClose} className="text-2xl font-bold text-slate-400 hover:text-white transition-colors drop-shadow-lg">✕</button>
        </div>

        {/* Story content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-white relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-transparent to-[#0f172a]/80 z-0 pointer-events-none"></div>
          <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] z-0 pointer-events-none"></div>
          
          {story.imageUrl ? (
             <div className="absolute inset-0 z-0">
                <img src={`${import.meta.env.VITE_API_URL || 'https://civicshield-1-om60.onrender.com'}${story.imageUrl}`} className="w-full h-full object-cover" alt="story" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/60 via-transparent to-[#0f172a]/90"></div>
             </div>
          ) : null}

          <div className="text-center animate-pulse-slow relative z-10 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md shadow-inner">
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.4)] rounded-full text-[10px] mb-8 font-black tracking-widest border border-white/20 uppercase">
              {post.type}
            </span>
            <p className="text-xl md:text-2xl font-bold mb-8 max-w-xs leading-snug drop-shadow-md text-gray-100">{post.text}</p>
            <div className="flex justify-center gap-3 text-xs font-bold text-gray-100 uppercase tracking-widest">
              <span className="bg-red-500/20 text-red-300 px-3 py-1.5 rounded-xl border border-red-500/30 flex items-center gap-1 shadow-inner"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> {post.aiTag}</span>
              <span className="bg-white/5 text-indigo-300 px-3 py-1.5 rounded-xl border border-white/10 shadow-inner">↑ {post.upvotes}</span>
            </div>
          </div>
        </div>

        {/* Tap zones */}
        <div className="absolute inset-0 z-10 flex">
          <button onClick={() => handleTap("left")} className="w-1/3 h-full outline-none" aria-label="Previous story" />
          <button onClick={() => handleTap("right")} className="w-2/3 h-full outline-none" aria-label="Next story" />
        </div>
      </div>
    </div>
  );
};

