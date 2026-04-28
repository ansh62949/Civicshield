/**
 * Notifications Page
 * Show alerts and notifications with interactive features
 */

import { useState } from 'react'
import { FiBell, FiAlertCircle, FiCheckCircle, FiSettings, FiTrash2, FiStar, FiMapPin, FiAlertTriangle } from 'react-icons/fi'
import { useNotifications } from '../hooks/useNotifications'

const NOTIFICATION_ICONS = {
  criticalAlerts: FiAlertTriangle,
  nearbyIssues: FiMapPin,
  resolvedComplaints: FiCheckCircle,
  civicPoints: FiStar,
  communityUpdates: FiBell,
}

const NOTIFICATION_COLORS = {
  criticalAlerts: 'text-red-600',
  nearbyIssues: 'text-orange-600',
  resolvedComplaints: 'text-green-600',
  civicPoints: 'text-blue-600',
  communityUpdates: 'text-purple-600',
}

export function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    pushEnabled,
    alertPreferences,
    requestPushPermission,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateAlertPreferences,
    simulateAlert,
  } = useNotifications()

  const [showSettings, setShowSettings] = useState(false)

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    // Could navigate to relevant page based on notification type
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-28 md:pb-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <FiBell size={24} className="text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          </div>
          <div className="flex gap-2">
            {notifications.length > 0 && unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiSettings size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="max-w-2xl mx-auto px-4 mb-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Notification Settings</h3>

            {/* Push Notifications */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                <button
                  onClick={requestPushPermission}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    pushEnabled
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pushEnabled ? 'Enabled' : 'Enable'}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Get instant notifications for important alerts and updates
              </p>
            </div>

            {/* Alert Preferences */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Alert Types</h4>
              {Object.entries(alertPreferences).map(([key, enabled]) => {
                const Icon = NOTIFICATION_ICONS[key]
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())

                return (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={NOTIFICATION_COLORS[key]} />
                      <span className="text-sm text-gray-700">{label}</span>
                    </div>
                    <button
                      onClick={() => updateAlertPreferences({ [key]: !enabled })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        enabled ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Test Alerts */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Test Alerts</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => simulateAlert('critical')}
                  className="px-3 py-2 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Critical Alert
                </button>
                <button
                  onClick={() => simulateAlert('nearby')}
                  className="px-3 py-2 text-xs bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                >
                  Nearby Issue
                </button>
                <button
                  onClick={() => simulateAlert('resolved')}
                  className="px-3 py-2 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Issue Resolved
                </button>
                <button
                  onClick={() => simulateAlert('points')}
                  className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Points Earned
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        {notifications.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100">
            {notifications.map((notification) => {
              const Icon = NOTIFICATION_ICONS[notification.type] || FiBell

              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 ${NOTIFICATION_COLORS[notification.type] || 'text-gray-600'}`}>
                      <Icon size={24} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{formatTimestamp(notification.timestamp)}</p>
                        </div>
                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors ml-2"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center">
            <FiBell size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No notifications yet</p>
            <p className="text-sm text-gray-400 mt-2">
              We'll notify you when issues are resolved or alerts are nearby
            </p>
            <button
              onClick={() => simulateAlert('points')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try a test notification
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <FiAlertCircle size={24} className="mx-auto text-orange-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Emergency Alert</p>
            <p className="text-xs text-gray-500 mt-1">Report critical issues</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <FiMapPin size={24} className="mx-auto text-blue-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Nearby Issues</p>
            <p className="text-xs text-gray-500 mt-1">See problems in your area</p>
          </div>
        </div>
      </div>
    </div>
  )
}
