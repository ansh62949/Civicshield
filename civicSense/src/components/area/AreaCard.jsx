/**
 * AreaCard Component
 * Displays area score and statistics
 */

import { FiTrendingDown, FiTrendingUp } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const getVerdictColor = (score) => {
  if (score >= 70) return { bg: 'bg-green-100', text: 'text-green-700', label: 'Safe' }
  if (score >= 50) return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Caution' }
  return { bg: 'bg-red-100', text: 'text-red-700', label: 'High Risk' }
}

export function AreaCard({ area }) {
  const navigate = useNavigate()

  if (!area) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
        <p className="text-gray-500">Area information not available</p>
      </div>
    )
  }

  const verdict = getVerdictColor(area.civicScore || 50)
  const areaName = area.name || area.id || 'unknown'

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/area/${encodeURIComponent(areaName)}/activity`)}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{area.name}</h2>
        <p className="text-gray-600">{area.region || 'Region'} • Click to view activity</p>
      </div>

      {/* Main Score */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 text-center border-b border-gray-100">
        <p className="text-sm text-gray-600 mb-2">Civic Health Score</p>
        <div className="text-5xl font-bold text-blue-600 mb-3">
          {area.civicScore ? area.civicScore.toFixed(1) : '50'}
        </div>
        <div className={`inline-block px-4 py-2 rounded-full font-semibold ${verdict.bg} ${verdict.text}`}>
          {verdict.label}
        </div>
      </div>

      {/* Sub-scores Grid */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4 border-b border-gray-100">
        <ScoreBox label="Infrastructure" score={area.infrastructure} />
        <ScoreBox label="Safety" score={area.safety} />
        <ScoreBox label="Engagement" score={area.engagement} />
        <ScoreBox label="Tension" score={area.tension} />
        <ScoreBox label="Environment" score={area.environment} />
        <ScoreBox label="Govt Response" score={area.govtResponse} />
      </div>

      {/* Stats */}
      <div className="p-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Recent Issues</span>
          <span className="font-semibold text-gray-900">{area.recentIssuesCount || 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Property Safety Rating</span>
          <span className={`font-semibold ${(area.propertySafetyRating || 0) > 60 ? 'text-green-600' : 'text-red-600'}`}>
            {area.propertySafetyRating?.toFixed(1) || 'N/A'}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Active Contributors</span>
          <span className="font-semibold text-gray-900">{area.activeContributors || 0}</span>
        </div>
      </div>
    </div>
  )
}

function ScoreBox({ label, score }) {
  const value = score ? score.toFixed(1) : '0'
  const trend = Math.random() > 0.5 // Mock trend for demo

  return (
    <div className="bg-gray-50 p-3 rounded-lg text-center">
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-900 mb-1">{value}</p>
      {trend ? (
        <FiTrendingUp size={16} className="mx-auto text-green-600" />
      ) : (
        <FiTrendingDown size={16} className="mx-auto text-red-600" />
      )}
    </div>
  )
}
