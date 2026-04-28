/**
 * AreaStats Component
 * Display detailed area statistics and recent issues
 */

import { PostCard } from '../post/PostCard'

export function AreaStats({ area, recentPosts = [], loading = false }) {
  if (!area) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center">
        <p className="text-gray-500">No area data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Leaderboard */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Top Contributors</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {area.topContributors && area.topContributors.length > 0 ? (
            area.topContributors.map((contributor, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{contributor.name}</p>
                    <p className="text-sm text-gray-500">{contributor.score} points</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No contributors yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Issues */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Issues in {area.name}</h3>
        {recentPosts.length > 0 ? (
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center">
            <p className="text-gray-500">No recent issues reported in this area</p>
          </div>
        )}
      </div>
    </div>
  )
}
