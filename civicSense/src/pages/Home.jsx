/**
 * Home Page
 * Social feed with posts, infinite scroll
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PostList } from '../components/post/PostList'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'

export function HomePage() {
  const { user } = useAuth()
  const { posts, loading, error, hasMore, fetchPosts, upvotePost, commentOnPost } = usePosts()

  // Load initial posts
  useEffect(() => {
    fetchPosts(true)
  }, [])

  const handleLoadMore = () => {
    fetchPosts(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-28 md:pb-4">
      {/* Welcome Section */}
      <div className="max-w-2xl mx-auto px-4 mb-6">
        {user && (
          <div className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-sky-100">CivicSense feed</p>
                <h2 className="text-3xl font-semibold">Welcome back, {user.username}</h2>
                <p className="mt-2 text-slate-100 max-w-xl">
                  Report a civic issue, track local updates, and help your community stay safer.
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Link
                  to="/create"
                  className="inline-flex items-center justify-center rounded-full bg-white text-sky-700 px-5 py-3 font-semibold shadow hover:bg-slate-100 transition"
                >
                  Report issue
                </Link>
                <Link
                  to="/area"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 text-white px-5 py-3 font-semibold hover:bg-white/10 transition"
                >
                  Explore map
                </Link>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 text-sm text-red-900">
            {error}
          </div>
        )}

        <PostList
          posts={posts}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          onUpvote={upvotePost}
          onComment={commentOnPost}
        />
      </div>
    </div>
  )
}
