/**
 * Post Detail Page
 * View single post with full details, comments, interactions
 */

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiShare2, FiMoreVertical } from 'react-icons/fi'
import { Button } from '../components/ui/Button'
import { postsAPI } from '../services/api'
import { Loader } from '../components/ui/Loader'
import { useAuth } from '../hooks/useAuth'

export function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [commenting, setCommenting] = useState(false)
  const [upvoted, setUpvoted] = useState(false)

  // Load post details
  useEffect(() => {
    loadPost()
  }, [id])

  const loadPost = async () => {
    try {
      setLoading(true)
      const response = await postsAPI.getPost(id)
      setPost(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  const handleUpvote = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      await postsAPI.upvotePost(id)
      setUpvoted(true)
      setPost((prev) => ({
        ...prev,
        upvotes: (prev.upvotes || 0) + 1,
      }))
    } catch (err) {
      console.error('Failed to upvote:', err)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    try {
      setCommenting(true)
      await postsAPI.commentOnPost(id, newComment)
      setNewComment('')
      await loadPost()
    } catch (err) {
      console.error('Failed to comment:', err)
    } finally {
      setCommenting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-24 md:pb-0">
        <Loader size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/')}>Go Back</Button>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-500 mb-4">Post not found</p>
          <Button onClick={() => navigate('/')}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-28 md:pb-4">
      {/* Content */}
      <div className="max-w-2xl mx-auto px-0 md:px-4 py-4">
        {/* Post Card */}
        <div className="bg-white rounded-lg md:rounded-2xl overflow-hidden shadow-sm">
          {/* Author Info */}
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {post.authorUsername?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {post.isAnonymous ? 'Anonymous' : post.authorUsername || 'Unknown User'}
                </p>
                <p className="text-sm text-gray-600">
                  {post.locationLabel || 'Unknown location'}
                </p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <FiMoreVertical size={20} />
            </button>
          </div>

          {/* Post Image */}
          {post.imageUrl && (
            <div className="w-full max-h-96 bg-gray-200 overflow-hidden">
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Post Content */}
          <div className="p-4">
            <p className="text-gray-900 text-base leading-relaxed mb-3">
              {post.content}
            </p>

            {/* Category & Severity Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                {post.category || 'Unknown'}
              </span>
              <span
                className={`inline-block text-xs px-3 py-1 rounded-full ${
                  post.severity === 'CRITICAL'
                    ? 'bg-red-100 text-red-800'
                    : post.severity === 'HIGH'
                    ? 'bg-orange-100 text-orange-800'
                    : post.severity === 'MEDIUM'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {post.severity || 'Unknown'}
              </span>

              {post.aiVerified && (
                <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                  ✓ AI Verified
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100 mb-4">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">
                  {post.upvotes?.length || 0}
                </p>
                <p className="text-xs text-gray-600">Upvotes</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">
                  {post.comments?.length || 0}
                </p>
                <p className="text-xs text-gray-600">Comments</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">
                  {post.civicImpactScore?.toFixed(1) || 0}
                </p>
                <p className="text-xs text-gray-600">Impact Score</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
              <Button
                onClick={handleUpvote}
                disabled={upvoted}
                variant={upvoted ? 'primary' : 'secondary'}
                className="flex-1"
              >
                {upvoted ? '✓ Upvoted' : 'Upvote'}
              </Button>
              <Button variant="secondary" className="flex-1">
                <FiShare2 className="inline mr-2" /> Share
              </Button>
            </div>

            {/* AI Analysis (if available) */}
            {post.aiVerified && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-900 mb-2">AI Analysis</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>Category: {post.aiCategory || 'N/A'}</p>
                  <p>Severity: {post.aiSeverity || 'N/A'}</p>
                  <p>
                    Confidence:{' '}
                    {post.aiConfidence
                      ? `${(post.aiConfidence * 100).toFixed(0)}%`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6 bg-white rounded-lg md:rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Comments</h3>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleComment} className="mb-6 pb-6 border-b border-gray-100">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500"
                  rows="3"
                />
              </div>
              <div className="text-right">
                <Button
                  type="submit"
                  disabled={!newComment.trim() || commenting}
                  className="px-6"
                >
                  {commenting ? 'Posting...' : 'Comment'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 border-b border-gray-100">
              <p className="text-gray-600 mb-3">Login to comment</p>
              <Button
                onClick={() => navigate('/login')}
                variant="secondary"
                className="px-6"
              >
                Login
              </Button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      {comment.username || 'Anonymous'}
                    </p>
                    <p className="text-gray-700 text-sm mt-1">
                      {comment.text || comment}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {comment.createdAt
                        ? new Date(comment.createdAt).toLocaleDateString()
                        : 'Recently'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-6">No comments yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
