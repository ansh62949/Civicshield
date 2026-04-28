/**
 * Area Page
 * Display area statistics and recent issues
 */

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AreaCard } from '../components/area/AreaCard'
import { AreaStats } from '../components/area/AreaStats'
import { useArea } from '../hooks/useArea'
import { Loader } from '../components/ui/Loader'
import { postsAPI } from '../services/api'

export function AreaPage() {
  const [searchParams] = useSearchParams()
  const areaName = searchParams.get('area') || 'Noida'
  const state = searchParams.get('state') || 'Delhi'
  const [selectedArea, setSelectedArea] = useState(null)
  const [areaPosts, setAreaPosts] = useState([])
  const [postsLoading, setPostsLoading] = useState(false)

  const { loading: areaLoading, fetchArea } = useArea()

  // Load area data
  useEffect(() => {
    if (areaName) {
      fetchArea(areaName, state).then((result) => {
        if (result.success) {
          setSelectedArea(result.area)
        }
      })
    }
  }, [areaName, state])

  // Load area posts after area data is loaded
  useEffect(() => {
    if (selectedArea?.latitude && selectedArea?.longitude) {
      setPostsLoading(true)
      postsAPI
        .getFeed(selectedArea.latitude, selectedArea.longitude, 8, 0)
        .then((res) => {
          const posts = Array.isArray(res.data?.content) ? res.data.content : []
          setAreaPosts(posts)
        })
        .catch((err) => console.error('Failed to load area posts:', err))
        .finally(() => setPostsLoading(false))
    }
  }, [selectedArea])

  if (areaLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-24 md:pb-0">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-28 md:pb-4">
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        {selectedArea ? (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Sidebar - Area Card */}
            <div className="md:col-span-1">
              <AreaCard area={selectedArea} />
            </div>

            {/* Main - Area Stats */}
            <div className="md:col-span-2">
              <AreaStats
                area={selectedArea}
                recentPosts={areaPosts}
                loading={postsLoading}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Area not found</p>
          </div>
        )}
      </div>
    </div>
  )
}
