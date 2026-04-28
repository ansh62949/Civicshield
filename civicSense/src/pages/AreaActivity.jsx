/**
 * Area Activity Feed
 * Real-time issues and updates in a specific area
 */

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiTrendingUp, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import { Badge } from '../components/ui/Badge'
import { postsAPI } from '../services/api'

export function AreaActivityPage() {
  const { area } = useParams()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalIssues: 0,
    criticalCount: 0,
    resolvedCount: 0,
  })

  useEffect(() => {
    const loadAreaIssues = async () => {
      try {
        setLoading(true)
        const response = await postsAPI.getFeed(28.6139, 77.209, 100, 0, 100)
        const allPosts = Array.isArray(response.data?.content) ? response.data.content : []
        
        // Filter by area
        const areaPosts = allPosts.filter(
          (post) => post.locationLabel?.toLowerCase().includes(area?.toLowerCase() || '')
        )

        setPosts(areaPosts)
        
        // Calculate stats
        setStats({
          totalIssues: areaPosts.length,
          criticalCount: areaPosts.filter((p) => p.severity === 'CRITICAL').length,
          resolvedCount: areaPosts.filter((p) => p.status === 'RESOLVED').length,
        })
      } catch (err) {
        console.error('Error loading area activity:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAreaIssues()
  }, [area])

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-28 md:pb-4">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Area Updates</h1>
            <p className="text-sm text-gray-600">{area}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalIssues}</div>
            <p className="text-xs text-gray-600 mt-1">Total Issues</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.criticalCount}</div>
            <p className="text-xs text-gray-600 mt-1">Critical</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.resolvedCount}</div>
            <p className="text-xs text-gray-600 mt-1">Resolved</p>
          </div>
        </div>

        {/* Activity Timeline */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500">No activity in this area yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post, idx) => (
                <div
                  key={post.id || idx}
                  className="bg-white rounded-lg p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow"
                >
                  {/* Status Bar */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {post.severity === 'CRITICAL' && (
                        <>
                          <FiAlertCircle className="text-red-600" size={18} />
                          <span className="text-sm font-bold text-red-600">CRITICAL</span>
                        </>
                      )}
                      {post.status === 'RESOLVED' && (
                        <>
                          <FiCheckCircle className="text-green-600" size={18} />
                          <span className="text-sm font-bold text-green-600">RESOLVED</span>
                        </>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-sm text-gray-800 mb-2">{post.content}</p>

                  {/* Badges */}
                  <div className="flex gap-2 flex-wrap">
                    {post.category && <Badge category={post.category} variant="category" />}
                    {post.severity && <Badge severity={post.severity} variant="severity" />}
                  </div>

                  {/* User & Stats */}
                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 flex gap-4">
                    <span>👤 {post.authorUsername || 'Anonymous'}</span>
                    <span>👍 {post.upvotes?.length || 0} upvotes</span>
                    <span>💬 {post.comments?.length || 0} comments</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
