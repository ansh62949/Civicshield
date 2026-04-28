import React from 'react'
import { FiX, FiMapPin, FiCalendar, FiTrendingUp, FiThumbsUp } from 'react-icons/fi'

// Helper function to format time ago
const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Recently'
  
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

/**
 * RegionPanel - Shows detailed information about selected complaint
 * Appears as overlay on desktop, modal on mobile
 */
export default function RegionPanel({ complaint, onClose }) {
  if (!complaint) return null

  // Priority color mapping
  const priorityColors = {
    CRITICAL: 'bg-red-50 border-red-200 text-red-900',
    HIGH: 'bg-orange-50 border-orange-200 text-orange-900',
    MEDIUM: 'bg-blue-50 border-blue-200 text-blue-900',
    LOW: 'bg-green-50 border-green-200 text-green-900'
  }

  // Priority badge style
  const priorityBadgeClass = {
    CRITICAL: 'bg-red-100 text-red-800',
    HIGH: 'bg-orange-100 text-orange-800',
    MEDIUM: 'bg-blue-100 text-blue-800',
    LOW: 'bg-green-100 text-green-800'
  }

  // Status color mapping
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    RESOLVED: 'bg-green-100 text-green-800'
  }

  const timeAgo = formatTimeAgo(complaint.submittedAt)

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black bg-opacity-50 p-4">
      {/* Panel Container */}
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-slate-200 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-900">Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <FiX size={24} className="text-slate-600" />
          </button>
        </div>

        {/* Image Section */}
        {complaint.imageUrl && (
          <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
            <img
              src={complaint.imageUrl}
              alt={complaint.description}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 right-2 flex gap-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${priorityBadgeClass[complaint.priority]}`}>
                {complaint.priority}
              </span>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[complaint.status]}`}>
                {complaint.status}
              </span>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-4 space-y-4">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {complaint.description}
            </h3>
            <p className="text-sm text-slate-600">
              {complaint.issueType && `${complaint.issueType} • `}
              Reported {timeAgo}
            </p>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <FiMapPin className="text-slate-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">{complaint.zone}</p>
              {complaint.location && (
                <p className="text-xs text-slate-600">
                  {complaint.location.lat?.toFixed(4)}, {complaint.location.lng?.toFixed(4)}
                </p>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Tension */}
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FiTrendingUp className="text-slate-600" size={16} />
                <span className="text-xs font-medium text-slate-600">Tension</span>
              </div>
              <p className="text-lg font-bold text-slate-900">{complaint.tension || 0}</p>
            </div>

            {/* Upvotes */}
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FiThumbsUp className="text-slate-600" size={16} />
                <span className="text-xs font-medium text-slate-600">Upvotes</span>
              </div>
              <p className="text-lg font-bold text-slate-900">{complaint.upvotes || 0}</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            {complaint.submittedBy && (
              <div>
                <p className="text-xs font-medium text-slate-600">Reported by</p>
                <p className="text-sm text-slate-900">{complaint.submittedBy}</p>
              </div>
            )}

            {complaint.lastUpdated && (
              <div>
                <p className="text-xs font-medium text-slate-600">Last updated</p>
                <p className="text-sm text-slate-900">
                  {formatTimeAgo(complaint.lastUpdated)}
                </p>
              </div>
            )}

            {complaint.resolutionRate !== undefined && (
              <div>
                <p className="text-xs font-medium text-slate-600">Resolution rate</p>
                <p className="text-sm text-slate-900">{(complaint.resolutionRate * 100).toFixed(0)}%</p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
