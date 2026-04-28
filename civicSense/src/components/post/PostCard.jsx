/**
 * PostCard Component
 * Individual post card with image, content, and interactions
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiMessageCircle, FiShare2, FiImage } from 'react-icons/fi'
import { FiCheckCircle } from 'react-icons/fi'
import { Badge } from '../ui/Badge'
import { ImageGalleryModal } from '../ui/ImageGallery'

export function PostCard({ post, onUpvote, onComment }) {
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)

  const postId = post.id || post._id
  const upvoteCount = Array.isArray(post.upvotes) ? post.upvotes.length : Number(post.upvotes || 0)
  const commentCount = Array.isArray(post.comments) ? post.comments.length : Number(post.comments || 0)
  
  // Handle image URL - support both relative URLs, full URLs, and mock data
  const getImageUrl = (imageUrl, post) => {
    if (!imageUrl) {
      // For mock data, generate placeholder based on post type or ID
      if (post.hasPhoto && post.photoLabel) {
        if (post.photoLabel.includes('Pothole')) {
          return 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Pothole'
        } else if (post.photoLabel.includes('Garbage')) {
          return 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Garbage+Dump'
        } else if (post.photoLabel.includes('Water')) {
          return 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Water+Leak'
        } else if (post.photoLabel.includes('Bridge') || post.photoLabel.includes('Infrastructure')) {
          return 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Safety+Hazard'
        }
        return 'https://via.placeholder.com/400x300/6B7280/FFFFFF?text=Civic+Issue'
      }
      return null
    }
    if (imageUrl.startsWith('http')) return imageUrl
    if (imageUrl.startsWith('/api/')) return `${import.meta.env.VITE_API_URL || 'https://your-backend-url'}${imageUrl}`
    return imageUrl
  }
  
  const imageUrl = getImageUrl(post.imageUrl || post.image, post)
  const images = imageUrl ? [imageUrl] : []

  const handleUpvote = async () => {
    if (onUpvote) {
      setIsLiked(!isLiked)
      await onUpvote(postId)
    }
  }

  const handleComment = async () => {
    if (!commentText.trim() || !onComment) return

    setIsSubmitting(true)
    try {
      await onComment(postId, commentText)
      setCommentText('')
      setIsCommentOpen(false)
    } catch (err) {
      console.error('Comment failed:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <Link to={`/user/${post.authorUsername || 'user'}`} className="flex gap-3 flex-1 hover:opacity-80 transition-opacity">
            {/* Avatar */}
            <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm`}
              style={{ backgroundColor: post.avatarBg || '#3B82F6' }}
            >
              {post.avatar || 'U'}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 truncate">{post.authorUsername || post.user || 'Anonymous'}</h3>
                {post.verified && <FiCheckCircle className="text-blue-600 flex-shrink-0" size={16} />}
              </div>
              <p className="text-sm text-gray-500">
                {post.locationLabel || post.area} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'just now'}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Image */}
      {imageUrl && (
        <div 
          className="w-full bg-gray-100 overflow-hidden cursor-pointer group relative"
          onClick={() => setGalleryOpen(true)}
        >
          <img
            src={imageUrl}
            alt="Post content"
            className="w-full max-h-[500px] object-cover rounded-xl group-hover:brightness-75 transition-all"
            onError={(e) => {
              console.error('Image failed to load:', imageUrl)
              e.target.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/60 rounded-full p-3">
              <FiImage size={24} className="text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Text - Make it clickable to go to post detail */}
        <Link to={`/post/${postId}`} className="block group">
          <p className="text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-3">
            {post.content || post.text || 'No content'}
          </p>
        </Link>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.category && <Badge category={post.category} variant="category" />}
          {post.severity && <Badge severity={post.severity} variant="severity" />}
          {post.aiVerified && (
            <Badge text="AI Verified" variant="default" />
          )}
        </div>

        {/* AI Info */}
        {post.photoLabel && (
          <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded mb-3">
            {post.photoLabel}
          </p>
        )}

        {/* Civic Impact */}
        {post.civicImpact && (
          <p className="text-xs font-semibold text-orange-600 mb-3">
            {post.civicImpact}
          </p>
        )}

        {/* Interactions Bar */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-gray-600">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
              isLiked ? 'text-red-600' : 'hover:text-red-600'
            }`}
          >
            <FiHeart size={18} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{upvoteCount}</span>
          </button>

          <button
            onClick={() => setIsCommentOpen(!isCommentOpen)}
            className="flex items-center gap-2 text-sm font-semibold hover:text-blue-600 transition-colors"
          >
            <FiMessageCircle size={18} />
            <span>{commentCount}</span>
          </button>

          <button className="flex items-center gap-2 text-sm font-semibold hover:text-green-600 transition-colors">
            <FiShare2 size={18} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Comment Section */}
      {isCommentOpen && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="2"
          />
          <div className="flex gap-2 mt-2 justify-end">
            <button
              onClick={() => setIsCommentOpen(false)}
              className="px-3 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleComment}
              disabled={isSubmitting || !commentText.trim()}
              className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      <ImageGalleryModal images={images} isOpen={galleryOpen} onClose={() => setGalleryOpen(false)} />
    </div>
  )
}
