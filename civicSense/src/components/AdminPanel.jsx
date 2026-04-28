import { useState, useMemo, useEffect } from 'react'
import {
  FiFilter,
  FiSearch,
  FiChevronUp,
  FiChevronDown,
  FiMoreVertical,
} from 'react-icons/fi'
import { mockApi } from '../mockApi'

export default function AdminPanel({ complaints, onStatusUpdate }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [stats, setStats] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    loadStats()
  }, [complaints])

  const loadStats = async () => {
    try {
      const data = await mockApi.getStats()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  // Filter and search
  const filtered = useMemo(() => {
    let result = [...complaints]

    // Search
    if (searchTerm) {
      result = result.filter(
        (c) =>
          c.issueType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.citizenName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter((c) => c.priority === priorityFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter)
    }

    // Sort
    if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortBy === 'tension') {
      result.sort((a, b) => b.tensionScore - a.tensionScore)
    } else if (sortBy === 'upvotes') {
      result.sort((a, b) => b.upvoteCount - a.upvoteCount)
    }

    return result
  }, [complaints, searchTerm, priorityFilter, statusFilter, sortBy])

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage and track all civic complaints</p>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatBox
              label="Total Complaints"
              value={stats.totalComplaints}
              color="bg-blue-50 text-blue-600"
            />
            <StatBox
              label="Critical"
              value={stats.priorityDistribution.CRITICAL}
              color="bg-red-50 text-red-600"
            />
            <StatBox
              label="In Progress"
              value={stats.statusDistribution.IN_PROGRESS}
              color="bg-yellow-50 text-yellow-600"
            />
            <StatBox
              label="Resolved"
              value={stats.statusDistribution.RESOLVED}
              color="bg-green-50 text-green-600"
            />
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="tension">Highest Tension</option>
              <option value="upvotes">Most Upvoted</option>
            </select>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filtered.length > 0 ? (
            <div className="space-y-2">
              {filtered.map((complaint) => (
                <ComplaintRow
                  key={complaint.id}
                  complaint={complaint}
                  expanded={expandedId === complaint.id}
                  onToggle={() =>
                    setExpandedId(
                      expandedId === complaint.id ? null : complaint.id
                    )
                  }
                  onStatusUpdate={onStatusUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No complaints found</p>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="mt-6 text-right text-gray-600">
          Showing {filtered.length} of {complaints.length} complaints
        </div>
      </div>
    </div>
  )
}

function ComplaintRow({ complaint, expanded, onToggle, onStatusUpdate }) {
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true)
    try {
      await onStatusUpdate(complaint.id, newStatus)
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getPriorityColor = (priority) => {
    const colors = {
      CRITICAL: 'bg-red-100 text-red-700',
      HIGH: 'bg-orange-100 text-orange-700',
      MEDIUM: 'bg-yellow-100 text-yellow-700',
      LOW: 'bg-green-100 text-green-700',
    }
    return colors[priority] || colors.LOW
  }

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      IN_PROGRESS: 'bg-blue-100 text-blue-700',
      RESOLVED: 'bg-green-100 text-green-700',
    }
    return colors[status] || colors.PENDING
  }

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      {/* Main Row */}
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-lg text-gray-900">
              {complaint.issueType}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                complaint.priority
              )}`}
            >
              {complaint.priority}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                complaint.status
              )}`}
            >
              {complaint.status}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-2">{complaint.description}</p>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <span>By {complaint.citizenName}</span>
            <span>Tension: {complaint.tensionScore.toFixed(1)}/100</span>
            <span>Upvotes: {complaint.upvoteCount}</span>
          </div>
        </div>
        <div className="ml-4">
          {expanded ? <FiChevronUp /> : <FiChevronDown />}
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="bg-gray-50 border-t border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div>
              <p className="text-xs uppercase text-gray-500 font-semibold mb-2">
                Details
              </p>
              {complaint.imageUrl && (
                <img
                  src={complaint.imageUrl}
                  alt={complaint.issueType}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-semibold text-gray-700">Zone</p>
                  <p className="text-gray-600">{complaint.zoneType}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Location</p>
                  <p className="text-gray-600">
                    {complaint.latitude.toFixed(4)}, {complaint.longitude.toFixed(4)}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Contact</p>
                  <p className="text-gray-600">{complaint.citizenEmail}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Status Update */}
            <div>
              <p className="text-xs uppercase text-gray-500 font-semibold mb-4">
                Update Status
              </p>
              <div className="space-y-2">
                {['PENDING', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={updatingStatus}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      complaint.status === status
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-primary hover:text-primary'
                    } disabled:opacity-50`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Metadata */}
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated</span>
                  <span className="font-medium">
                    {new Date(complaint.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confidence</span>
                  <span className="font-medium">
                    {(complaint.confidence * 100 || 0).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatBox({ label, value, color }) {
  return (
    <div className={`${color} rounded-lg p-4`}>
      <p className="text-xs opacity-75 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
