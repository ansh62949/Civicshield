import { useState, useEffect } from 'react'
import { FiAward, FiTrendingUp, FiCheckCircle } from 'react-icons/fi'
import { mockApi } from '../mockApi'

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      const data = await mockApi.getLeaderboard()
      setLeaderboard(data)
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingState />
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FiAward className="text-primary" size={36} />
            Neighbourhood Leaderboard
          </h1>
          <p className="text-gray-600 text-lg">
            Zones ranked by civic responsiveness and resolution excellence
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<FiTrendingUp />}
            label="Total Reports"
            value={leaderboard.reduce((sum, z) => sum + z.totalReports, 0)}
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            icon={<FiCheckCircle />}
            label="Resolved"
            value={leaderboard.reduce((sum, z) => sum + z.resolvedReports, 0)}
            color="bg-green-50 text-green-600"
          />
          <StatCard
            icon={<FiAward />}
            label="Active Zones"
            value={leaderboard.length}
            color="bg-purple-50 text-purple-600"
          />
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Zone
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Total Reports
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Resolved
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Resolution Rate
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Civic Score
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((zone, index) => (
                <LeaderboardRow
                  key={zone.zone}
                  rank={index + 1}
                  zone={zone}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard
            title="How Scores are Calculated"
            items={[
              'Resolution Rate: % of issues resolved',
              'Civic Score: Reports × Resolution Rate',
              'Ranking: By Civic Score (descending)',
              'Updates: Real-time as reports are filed',
            ]}
          />
          <InfoCard
            title="What Makes a Good Zone?"
            items={[
              'High number of reports (community engaged)',
              'Quick resolution times (administration responsive)',
              'Low recurrence of same issues',
              'Strong upvote participation (community support)',
            ]}
          />
        </div>
      </div>
    </div>
  )
}

function LeaderboardRow({ rank, zone }) {
  const getMedalColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-600'
      case 2:
        return 'bg-gray-100 text-gray-600'
      case 3:
        return 'bg-orange-100 text-orange-600'
      default:
        return 'bg-gray-50 text-gray-600'
    }
  }

  const getMedalEmoji = (rank) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return rank
    }
  }

  const civicScore = (zone.totalReports * (zone.resolutionRate / 100)).toFixed(1)

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className={`px-6 py-4 text-center font-bold text-lg ${getMedalColor(rank)}`}>
        {getMedalEmoji(rank)}
      </td>
      <td className="px-6 py-4">
        <div>
          <p className="font-semibold text-gray-900">{zone.zone}</p>
          <p className="text-sm text-gray-500">Community Zone</p>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <p className="font-bold text-gray-900">{zone.totalReports}</p>
        <p className="text-sm text-gray-500">reports filed</p>
      </td>
      <td className="px-6 py-4 text-center">
        <p className="font-bold text-green-600">{zone.resolvedReports}</p>
        <p className="text-sm text-gray-500">completed</p>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${zone.resolutionRate}%` }}
            ></div>
          </div>
          <p className="font-bold text-gray-900 w-12 text-right">
            {zone.resolutionRate}%
          </p>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <p className="font-bold text-lg text-primary">{civicScore}</p>
        <p className="text-sm text-gray-500">score</p>
      </td>
    </tr>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`${color} rounded-lg p-6 shadow`}>
      <div className="flex items-center gap-4">
        <div className="text-4xl">{icon}</div>
        <div>
          <p className="text-sm opacity-75 mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ title, items }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <p className="text-gray-600">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block animate-spin">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
        <p className="text-gray-600">Loading leaderboard...</p>
      </div>
    </div>
  )
}
