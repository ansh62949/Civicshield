/**
 * Profile Page
 * Display user profile, badges, and posts
 */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import { Badge } from '../components/ui/Badge'
import { PostCard } from '../components/post/PostCard'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { postsAPI } from '../services/api'
import { Loader } from '../components/ui/Loader'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(false)

  // Load user posts
  useEffect(() => {
    if (user) {
      setLoading(true)
      const lat = user.latitude || 28.6139
      const lon = user.longitude || 77.209

      postsAPI
        .getFeed(lat, lon, 50, 0)
        .then((res) => {
          const posts = Array.isArray(res.data?.content) ? res.data.content : []
          const filteredPosts = posts.filter((post) =>
            post.authorUsername === user.username ||
            post.authorId === user.username ||
            post.userId === user.id ||
            post.userId === user.username
          )
          setUserPosts(filteredPosts)
        })
        .catch((err) => console.error('Failed to load user posts:', err))
        .finally(() => setLoading(false))
    }
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-24 md:pb-0">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please login to view profile</p>
          <Button onClick={() => navigate('/login')}>Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-28 md:pb-4">
      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {/* Header with gradient */}
          <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600" />

          {/* Profile Info */}
          <div className="px-6 pb-6 relative">
            {/* Avatar */}
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold -mt-12 mb-4 border-4 border-white">
              {user.username?.[0]?.toUpperCase() || 'U'}
            </div>

            {/* Name and Stats */}
            <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{user.civicPoints || 0}</div>
                <p className="text-xs text-gray-600">Civic Points</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userPosts.length}</div>
                <p className="text-xs text-gray-600">Posts</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{user.followers || 0}</div>
                <p className="text-xs text-gray-600">Followers</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-2">
              <Button variant="secondary" className="flex-1">
                Edit Profile
              </Button>
              <Button variant="danger" onClick={handleLogout} className="flex-1">
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        {user.badges && user.badges.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Badges & Achievements</h3>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge, idx) => (
                <Badge key={idx} text={badge} />
              ))}
            </div>
          </div>
        )}

        {/* Recent Posts */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Posts</h3>

          {loading ? (
            <div className="flex justify-center">
              <Loader size="lg" />
            </div>
          ) : userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 text-center">
              <p className="text-gray-500">No posts yet. Start reporting issues!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
