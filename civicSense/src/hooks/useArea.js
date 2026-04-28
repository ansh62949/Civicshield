/**
 * useArea Hook
 * Manage area data and statistics
 */

import { useState, useCallback } from 'react'
import { areasAPI } from '../services/api'

export const useArea = () => {
  const [area, setArea] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch area details
  const fetchArea = useCallback(async (areaName, state = 'Delhi') => {
    try {
      setLoading(true)
      setError(null)

      const response = await areasAPI.getArea(areaName, state)
      setArea(response.data)

      return { success: true, area: response.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load area'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Get property report for area
  const getPropertyReport = useCallback(async (areaName, state = 'Delhi') => {
    try {
      setLoading(true)
      setError(null)

      const response = await areasAPI.getPropertyReport(areaName, state)
      return { success: true, report: response.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load property report'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Get leaderboard
  const fetchLeaderboard = useCallback(async (state = 'Delhi') => {
    try {
      setLoading(true)
      setError(null)

      const response = await areasAPI.getLeaderboard(state)
      return { success: true, leaderboard: response.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load leaderboard'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    area,
    loading,
    error,
    fetchArea,
    getPropertyReport,
    fetchLeaderboard,
  }
}
