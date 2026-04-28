/**
 * usePosts Hook
 * Manage posts feed and interactions (upvote, comment)
 */

import { useState, useCallback, useEffect } from 'react'
import { postsAPI } from '../services/api'

export const usePosts = (userLocation = null) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const size = 20

  // Fetch posts feed
  const fetchPosts = useCallback(
    async (reset = false) => {
      try {
        setLoading(true)
        setError(null)

        const lat = userLocation?.lat || 28.6139
        const lon = userLocation?.lon || 77.209
        const requestPage = reset ? 0 : page

        const response = await postsAPI.getFeed(lat, lon, 10, requestPage, size)
        
        // Handle both direct array response and Page object response
        let newPosts = []
        if (Array.isArray(response.data)) {
          newPosts = response.data
        } else if (response.data?.content && Array.isArray(response.data.content)) {
          newPosts = response.data.content
        } else if (response.data) {
          // Fallback for unexpected format
          console.warn('Unexpected API response format:', response.data)
          newPosts = []
        }

        setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]))
        setPage(reset ? 1 : page + 1)
        setHasMore(newPosts.length === size)

        return { success: true, posts: newPosts }
      } catch (err) {
        console.error('Error fetching posts:', err)
        const message = err.response?.data?.message || 'Failed to load posts'
        setError(message)
        return { success: false, message }
      } finally {
        setLoading(false)
      }
    },
    [userLocation, page]
  )

  // Upvote post
  const upvotePost = useCallback(async (postId) => {
    try {
      await postsAPI.upvotePost(postId)

      // Update local state
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, upvotes: post.upvotes ? post.upvotes + 1 : 1, userUpvoted: true }
            : post
        )
      )

      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to upvote'
      return { success: false, message }
    }
  }, [])

  // Comment on post
  const commentOnPost = useCallback(async (postId, comment) => {
    try {
      const response = await postsAPI.commentOnPost(postId, comment)

      // Update local state
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments ? post.comments + 1 : 1,
                latestComments: response.data.comments,
              }
            : post
        )
      )

      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to comment'
      return { success: false, message }
    }
  }, [])

  return {
    posts,
    loading,
    error,
    hasMore,
    fetchPosts,
    upvotePost,
    commentOnPost,
  }
}
