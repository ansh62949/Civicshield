/**
 * PostList Component
 * Displays feed of posts with infinite scroll
 */

import { useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PostCard } from './PostCard'
import { SkeletonCard } from '../ui/Loader'

export function PostList({ posts, loading, hasMore, onLoadMore, onUpvote, onComment }) {
  const observerTarget = useRef(null)

  // Infinite scroll intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && onLoadMore) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading, onLoadMore])

  if (!posts?.length && loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!posts?.length) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
        <p className="text-gray-500 mb-4">No posts found. Be the first to report!</p>
        <a
          href="/create"
          className="inline-flex items-center justify-center rounded-full bg-sky-600 text-white px-5 py-2 font-semibold hover:bg-sky-700 transition"
        >
          Create a report
        </a>
      </div>
    )
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post.id || post._id}
          post={post}
          onUpvote={onUpvote}
          onComment={onComment}
        />
      ))}

      {/* Loading indicator */}
      {loading && (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={observerTarget} className="h-10 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading more posts...</div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No more posts to load</p>
        </div>
      )}
    </div>
  )
}
