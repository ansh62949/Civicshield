/**
 * useNotifications Hook
 * Manages notifications, alerts, and push notifications
 */

import { useState, useEffect, useCallback } from 'react'

export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [pushEnabled, setPushEnabled] = useState(false)
  const [alertPreferences, setAlertPreferences] = useState({
    criticalAlerts: true,
    nearbyIssues: true,
    resolvedComplaints: true,
    civicPoints: true,
    communityUpdates: false,
  })

  // Initialize push notifications
  useEffect(() => {
    if ('Notification' in window) {
      setPushEnabled(Notification.permission === 'granted')
    }
  }, [])

  // Load notifications from localStorage or API
  useEffect(() => {
    const saved = localStorage.getItem('civicsense_notifications')
    if (saved) {
      const parsed = JSON.parse(saved)
      setNotifications(parsed.notifications || [])
      setUnreadCount(parsed.unreadCount || 0)
    }

    // Load alert preferences
    const prefs = localStorage.getItem('civicsense_alert_preferences')
    if (prefs) {
      setAlertPreferences(JSON.parse(prefs))
    }
  }, [])

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('civicsense_notifications', JSON.stringify({
      notifications,
      unreadCount,
    }))
  }, [notifications, unreadCount])

  // Save alert preferences
  useEffect(() => {
    localStorage.setItem('civicsense_alert_preferences', JSON.stringify(alertPreferences))
  }, [alertPreferences])

  // Request push notification permission
  const requestPushPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support push notifications')
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      setPushEnabled(permission === 'granted')
      return permission === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }, [])

  // Send push notification
  const sendPushNotification = useCallback((title, body, icon = '/favicon.ico') => {
    if (pushEnabled && 'Notification' in window) {
      try {
        new Notification(title, {
          body,
          icon,
          badge: '/favicon.ico',
          tag: 'civicsense-alert',
        })
      } catch (error) {
        console.error('Error sending push notification:', error)
      }
    }
  }, [pushEnabled])

  // Add new notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    }

    setNotifications(prev => [newNotification, ...prev])
    setUnreadCount(prev => prev + 1)

    // Send push notification if enabled and preference allows
    if (alertPreferences[notification.type] !== false) {
      sendPushNotification(notification.title, notification.message)
    }
  }, [alertPreferences, sendPushNotification])

  // Mark notification as read
  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
    setUnreadCount(0)
  }, [])

  // Delete notification
  const deleteNotification = useCallback((id) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id)
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1))
      }
      return prev.filter(n => n.id !== id)
    })
  }, [])

  // Update alert preferences
  const updateAlertPreferences = useCallback((preferences) => {
    setAlertPreferences(prev => ({ ...prev, ...preferences }))
  }, [])

  // Simulate real-time alerts (in a real app, this would come from WebSocket or polling)
  const simulateAlert = useCallback((type) => {
    const alerts = {
      critical: {
        type: 'criticalAlerts',
        title: '🚨 Critical Alert',
        message: 'Severe flooding reported in your area. Stay safe!',
        icon: 'FiAlertTriangle',
        color: 'text-red-600',
      },
      nearby: {
        type: 'nearbyIssues',
        title: '📍 Issue Near You',
        message: 'Power outage reported within 500m of your location',
        icon: 'FiMapPin',
        color: 'text-orange-600',
      },
      resolved: {
        type: 'resolvedComplaints',
        title: '✅ Issue Resolved',
        message: 'The street light repair you reported has been completed',
        icon: 'FiCheckCircle',
        color: 'text-green-600',
      },
      points: {
        type: 'civicPoints',
        title: '🏆 Points Earned!',
        message: 'You earned 25 civic points for your community contribution',
        icon: 'FiStar',
        color: 'text-blue-600',
      },
    }

    if (alerts[type]) {
      addNotification(alerts[type])
    }
  }, [addNotification])

  return {
    notifications,
    unreadCount,
    pushEnabled,
    alertPreferences,
    requestPushPermission,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateAlertPreferences,
    simulateAlert,
  }
}