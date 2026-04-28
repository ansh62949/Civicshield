import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { StoriesRow, StoryViewer } from "../feed/Stories";
import { FilterChips } from "../feed/FilterChips";
import { PostCard, GeoAlertCard } from "../feed/PostCard";
import { PostDetail } from "../feed/PostDetail";
import { Toast } from "../shared/Shared";
import { postsAPI } from "../../services/api";
import { POSTS as fallbackMockPosts } from "../../mockData";

const PostSkeleton = () => (
  <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-lg animate-pulse mb-6">
    <div className="flex items-center gap-3 p-4">
      <div className="w-10 h-10 bg-white/10 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded w-1/4"></div>
        <div className="h-3 bg-white/10 rounded w-1/3"></div>
      </div>
    </div>
    <div className="w-full aspect-square bg-white/5"></div>
    <div className="p-4 space-y-3">
      <div className="flex gap-4">
        <div className="w-6 h-6 bg-white/10 rounded-full"></div>
        <div className="w-6 h-6 bg-white/10 rounded-full"></div>
        <div className="w-6 h-6 bg-white/10 rounded-full"></div>
      </div>
      <div className="h-4 bg-white/10 rounded w-3/4"></div>
      <div className="h-4 bg-white/10 rounded w-1/2"></div>
    </div>
  </div>
);

export const FeedScreen = ({ currentLocation, cityCoords, onNotify, refreshTrigger }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const observerTarget = useRef(null);

  const fetchFeed = async (pageNum, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else if (pageNum === 0) setLoading(true);
    else setLoadingMore(true);

    try {
      const coords = cityCoords?.[currentLocation] || { lat: 28.6139, lon: 77.2090 };
      const response = await postsAPI.getFeed(coords.lat, coords.lon, 50, pageNum, 5);
      const apiPosts = response.data?.content || response.data || [];
      
      const mappedPosts = apiPosts.map(p => ({
        ...p,
        id: p.id || Math.random().toString(),
        authorId: p.authorId || p.userId || null,
        text: p.content || p.text || '',
        userName: p.authorUsername || p.user || "Civic User",
        userInitials: (p.authorUsername || p.user || "CU").substring(0, 2).toUpperCase(),
        area: p.locationLabel || p.area || "Unknown Area",
        timeAgo: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Recently",
        comments: Array.isArray(p.comments) ? p.comments.length : (p.comments || 0),
        hasPhoto: !!(p.imageUrl && p.imageUrl !== "null" && p.imageUrl !== "undefined") || !!(p.image && p.image !== "null" && p.image !== "undefined"),
        imageUrl: (() => {
          const raw = p.imageUrl || p.image;
          if (!raw || raw === "null" || raw === "undefined") return null;
          if (raw.startsWith('http') || raw.startsWith('data:')) return raw;
          return `${import.meta.env.VITE_API_URL || 'https://civicshield-1-om60.onrender.com'}${raw.startsWith('/') ? '' : '/'}${raw}`;
        })(),
        isUpvoted: p.isUpvoted || false
      }));
      
      if (mappedPosts.length > 0) {
        setPosts(prev => isRefresh || pageNum === 0 ? mappedPosts : [...prev, ...mappedPosts]);
        setHasMore(mappedPosts.length === 5);
      } else {
        if (pageNum === 0) setPosts(fallbackMockPosts);
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load feed", err);
      if (pageNum === 0) setPosts(fallbackMockPosts);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchFeed(0, true);
  }, [currentLocation, refreshTrigger]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchFeed(nextPage);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [observerTarget, hasMore, loading, loadingMore, page]);

  const handleRefresh = () => {
    setPage(0);
    fetchFeed(0, true);
  };

  const filteredPosts = useMemo(() => {
    if (activeFilter === "all") return posts;
    if (activeFilter === "critical") {
      return posts.filter((p) => p.aiTag?.toLowerCase().includes("critical"));
    }
    return posts.filter((p) => p.type?.toLowerCase() === activeFilter.toLowerCase());
  }, [activeFilter, posts]);

  const handleUpvote = useCallback(async (postId) => {
    try {
      await postsAPI.upvotePost(postId);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, isUpvoted: !p.isUpvoted } : p));
    } catch (err) {
      console.warn("API upvote failed", err);
    }
  }, []);

  return (
    <div className="w-full flex flex-col min-h-screen text-white">
      <div className="bg-transparent sticky top-0 z-30 pt-2 border-b border-white/10 backdrop-blur-md shadow-sm">
        <StoriesRow onStoryClick={setSelectedStory} />
        <FilterChips activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      </div>

      <div className="pt-4 space-y-6 pb-20 md:pb-4">
        {refreshing && (
          <div className="flex justify-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500"></div>
          </div>
        )}
        
        {loading && !refreshing ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No posts found for this filter.</p>
          </div>
        ) : (
          <>
            {filteredPosts.map((post) =>
              post.type === "GEO_ALERT" ? (
                <GeoAlertCard
                  key={post.id || Math.random()}
                  post={post}
                  onComment={() => setSelectedPost(post)}
                  onShare={() => setShowToast("Link copied to clipboard! 📤")}
                  onClick={() => setSelectedPost(post)}
                />
              ) : (
                <PostCard
                  key={post.id || Math.random()}
                  post={post}
                  onUpvote={async (id) => {
                    try { 
                      await postsAPI.upvotePost(id); 
                      if (onNotify) onNotify("Post upvoted! 💖");
                    } catch(e){}
                  }}
                  onComment={() => setSelectedPost(post)}
                  onShare={() => setShowToast("Link copied to clipboard! 📤")}
                  onClick={() => setSelectedPost(post)}
                  onDelete={async (id) => {
                    try {
                      await postsAPI.deletePost(id);
                      setPosts(prev => prev.filter(p => p.id !== id));
                      if (onNotify) onNotify("Post deleted 🗑️");
                    } catch(e) {
                      console.error("Failed to delete", e);
                    }
                  }}
                />
              )
            )}
            {hasMore && (
              <div ref={observerTarget} className="flex justify-center py-4">
                {loadingMore && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500"></div>}
              </div>
            )}
            {!hasMore && posts.length > 0 && (
              <div className="text-center py-4 text-gray-400 text-sm font-semibold">
                You've caught up!
              </div>
            )}
          </>
        )}
      </div>

      {selectedStory && (
        <StoryViewer
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}

      {selectedPost && (
        <PostDetail
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onEscalade={() => setShowToast("Escalated to authorities 🚨")}
          onShare={() => setShowToast("Link copied to clipboard! 📤")}
        />
      )}

      {showToast && (
        <Toast message={showToast} onClose={() => setShowToast(null)} />
      )}
    </div>
  );
};

