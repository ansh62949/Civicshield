import { useState, useMemo } from 'react'
import {
  FiThumbsUp,
  FiShare2,
  FiMapPin,
  FiFilter,
  FiTrendingUp,
} from 'react-icons/fi'

export default function SocialFeed({ complaints, onUpvote, loading }) {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  // Filter and sort complaints
  const filtered = useMemo(() => {
    let result = [...complaints]

    if (filter !== 'all') {
      result = result.filter((c) => c.priority === filter)
    }

    if (sortBy === 'recent') {
      result.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    } else if (sortBy === 'upvotes') {
      result.sort((a, b) => b.upvoteCount - a.upvoteCount)
    } else if (sortBy === 'tension') {
      result.sort((a, b) => b.tensionScore - a.tensionScore)
    }

    return result
  }, [complaints, filter, sortBy])

  if (loading) {
    return <LoadingState />
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Social Feed
          </h1>
          <p className="text-gray-600">
            Real-time civic issues from your community
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-4 mb-8">
          {/* Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <FilterButton
              label="All"
              active={filter === 'all'}
              onClick={() => setFilter('all')}
              icon={<FiFilter />}
            />
            <FilterButton
              label="Critical"
              active={filter === 'CRITICAL'}
              onClick={() => setFilter('CRITICAL')}
              badge="badge-critical"
            />
            <FilterButton
              label="High"
              active={filter === 'HIGH'}
              onClick={() => setFilter('HIGH')}
              badge="badge-high"
            />
            <FilterButton
              label="Medium"
              active={filter === 'MEDIUM'}
              onClick={() => setFilter('MEDIUM')}
              badge="badge-medium"
            />
            <FilterButton
              label="Low"
              active={filter === 'LOW'}
              onClick={() => setFilter('LOW')}
              badge="badge-low"
            />
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <SortButton
              label="Recent"
              active={sortBy === 'recent'}
              onClick={() => setSortBy('recent')}
            />
            <SortButton
              label="Most Upvoted"
              active={sortBy === 'upvotes'}
              onClick={() => setSortBy('upvotes')}
            />
            <SortButton
              label="High Tension"
              active={sortBy === 'tension'}
              onClick={() => setSortBy('tension')}
            />
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onUpvote={onUpvote}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No complaints found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ComplaintCard({ complaint, onUpvote }) {
  const [isUpvoting, setIsUpvoting] = useState(false)

  const handleUpvote = async () => {
    setIsUpvoting(true)
    try {
      await onUpvote(complaint.id)
    } catch (error) {
      console.error('Error upvoting:', error)
    } finally {
      setIsUpvoting(false)
    }
  }

  const timeAgo = (createdAt) => {
    const now = new Date()
    const then = new Date(createdAt)
    const seconds = Math.floor((now - then) / 1000)

    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + 'd'
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + 'mo'
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + 'd'
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + 'h'
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + 'm'
    return Math.floor(seconds) + 's'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      CRITICAL: 'text-red-600 bg-red-50',
      HIGH: 'text-orange-600 bg-orange-50',
      MEDIUM: 'text-yellow-600 bg-yellow-50',
      LOW: 'text-green-600 bg-green-50',
    }
    return colors[priority] || colors.LOW
  }

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      RESOLVED: 'bg-green-100 text-green-800',
    }
    return colors[status] || colors.PENDING
  }

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg text-gray-900">
                {complaint.issueType}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(
                  complaint.priority
                )}`}
              >
                {complaint.priority}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  complaint.status
                )}`}
              >
                {complaint.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              by <span className="font-semibold">{complaint.citizenName}</span>
            </p>
          </div>
          <span className="text-xs text-gray-500">{timeAgo(complaint.createdAt)}</span>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4">{complaint.description}</p>

        {/* Image */}
        {complaint.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={complaint.imageUrl}
              alt={complaint.issueType}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <MetadataItem
            label="Location"
            value={complaint.zoneType}
            icon={<FiMapPin />}
          />
          <MetadataItem
            label="Tension"
            value={`${complaint.tensionScore.toFixed(1)}/100`}
            icon={<FiTrendingUp />}
          />
          <MetadataItem label="Reports" value={complaint.upvoteCount} />
          <MetadataItem
            label="Distance"
            value={Math.random().toFixed(1) + ' km'}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleUpvote}
            disabled={isUpvoting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            <FiThumbsUp size={18} />
            <span className="font-semibold">{complaint.upvoteCount}</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <FiShare2 size={18} />
            <span className="font-semibold">Share</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function FilterButton({ label, active, onClick, badge, icon }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
        active
          ? `${badge || 'bg-primary text-white'}`
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {icon ? (
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
      ) : (
        label
      )}
    </button>
  )
}

function SortButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        active
          ? 'bg-primary text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  )
}

function MetadataItem({ label, value, icon }) {
  return (
    <div className="text-sm">
      <p className="text-gray-500 mb-1">{label}</p>
      <div className="flex items-center gap-1">
        {icon && <span className="text-gray-400">{icon}</span>}
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
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
        <p className="text-gray-600">Loading feed...</p>
      </div>
    </div>
  )
}
