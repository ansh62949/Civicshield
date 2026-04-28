/**
 * User Profile Page
 * View other users' profiles and their posts
 */

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiMapPin, FiCalendar } from 'react-icons/fi'
import { PostCard } from '../components/post/PostCard'
import { Button } from '../components/ui/Button'
import { postsAPI } from '../services/api'
import { useAuth } from '../hooks/useAuth'

export function UserProfilePage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  
  const [userProfile, setUserProfile] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Load user profile and posts
    const loadUserProfile = async () => {
      try {
        setLoading(true)
        
        // For now, we'll show posts from this username
        // In a real app, you'd have a /api/users/:username endpoint
        const response = await postsAPI.getFeed(28.6139, 77.209, 50, 0, 100)
        const allPosts = Array.isArray(response.data?.content) ? response.data.content : []
        
        const userPostsFiltered = allPosts.filter(
          (post) => post.authorUsername === username || post.userId === username
        )
        
        // Create a mock profile from posts
        if (userPostsFiltered.length > 0) {
          const firstPost = userPostsFiltered[0]
          setUserProfile({
            username,
            posts: userPostsFiltered.length,
            area: firstPost.locationLabel || 'Unknown area',
            joinedDate: firstPost.createdAt,
          })
        } else {
          setUserProfile({
            username,
            posts: 0,
            area: 'Unknown area',
          })
        }
        
        setUserPosts(userPostsFiltered)
      } catch (err) {
        console.error('Error loading user profile:', err)
        setError('Failed to load user profile')
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-24 md:pb-0">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-24 md:pb-0">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-28 md:pb-4">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <FiArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {/* Header with gradient */}
          <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600" />

          {/* Profile Info */}
          <div className="px-6 pb-6 relative">
            {/* Avatar */}
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold -mt-10 mb-4 border-4 border-white">
              {userProfile?.username?.[0]?.toUpperCase() || 'U'}
            </div>

            {/* Name and Stats */}
            <h2 className="text-2xl font-bold text-gray-900">@{userProfile?.username}</h2>
            
            {/* Location and Join Date */}
            <div className="flex flex-col gap-2 mt-3 text-sm text-gray-600">
              {userProfile?.area && (
                <div className="flex items-center gap-2">
                  <FiMapPin size={16} />
                  <span>{userProfile.area}</span>
                </div>
              )}
              {userProfile?.joinedDate && (
                <div className="flex items-center gap-2">
                  <FiCalendar size={16} />
                  <span>Joined {new Date(userProfile.joinedDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userProfile?.posts || 0}</div>
                <p className="text-xs text-gray-600">Posts</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <p className="text-xs text-gray-600">Followers</p>
              </div>
            </div>

            {/* Follow Button - if not own profile */}
            {currentUser?.username !== username && (
              <Button variant="primary" className="w-full mt-6">
                Follow
              </Button>
            )}
          </div>
        </div>

        {/* Posts Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Posts</h3>
          {userPosts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <p className="text-gray-500">No posts yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <PostCard
                  key={post.id || post._id}
                  post={post}
                  onUpvote={() => {}}
                  onComment={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
