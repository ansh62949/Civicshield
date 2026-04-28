import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import Globe from 'react-globe.gl'
import { FiX, FiArrowRight } from 'react-icons/fi'
import { STATE_SCORES, FEED_POSTS, getScoreColor } from '../constants/civicSenseData'

// Cached GeoJSON - stored in localStorage
const GEOJSON_CACHE_KEY = 'india_geojson_cache'
const GEOJSON_CACHE_TIME = 24 * 60 * 60 * 1000 // 24 hours

const getCachedGeoJSON = async () => {
  try {
    const cached = localStorage.getItem(GEOJSON_CACHE_KEY)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < GEOJSON_CACHE_TIME) {
        return JSON.parse(data)
      }
    }
  } catch (e) {
    console.warn('Cache read error:', e)
  }

  // Fetch and cache
  const response = await fetch(
    'https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson'
  )
  const data = await response.json()
  try {
    localStorage.setItem(
      GEOJSON_CACHE_KEY,
      JSON.stringify({
        data: JSON.stringify(data),
        timestamp: Date.now(),
      })
    )
  } catch (e) {
    console.warn('Cache write error:', e)
  }
  return data
}

// Get civic score color based on score value
const getScoreColorRgba = (score) => {
  if (score > 70) return 'rgba(29, 158, 117, 0.5)' // Teal
  if (score >= 50) return 'rgba(239, 159, 39, 0.5)' // Orange
  return 'rgba(226, 75, 74, 0.5)' // Red
}

const getScoreColorRgbaBright = (score) => {
  if (score > 70) return 'rgba(29, 158, 117, 0.7)' // Teal bright
  if (score >= 50) return 'rgba(239, 159, 39, 0.7)' // Orange bright
  return 'rgba(226, 75, 74, 0.7)' // Red bright
}

const calculateCentroid = (coordinates) => {
  let sumLat = 0,
    sumLng = 0,
    count = 0

  const flattenCoords = (coords) => {
    if (!Array.isArray(coords[0])) {
      sumLng += coords[0]
      sumLat += coords[1]
      count++
    } else {
      coords.forEach((coord) => flattenCoords(coord))
    }
  }

  flattenCoords(coordinates)
  return {
    lat: sumLat / count,
    lon: sumLng / count,
  }
}

const formatCount = (value) => value.toLocaleString()

/**
 * Enhanced GlobeView Component for CivicSense
 * - Colors states by civicsense score (not tension)
 * - Shows bottom sheet/side panel on state click
 * - Displays state score, subscores, top posts
 */
export default function GlobeView({
  complaints = [],
  loading = false,
  selectedRegion,
  onSelectRegion,
  onSelectComplaint,
  onViewStateReport,
}) {
  const globeEl = useRef(null)
  const [polygonsData, setPolygonsData] = useState([])
  const [hoveredPolygon, setHoveredPolygon] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [selectedStatePanel, setSelectedStatePanel] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  // ===== Responsive Handling =====
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ===== Load GeoJSON with Caching =====
  useEffect(() => {
    let isMounted = true

    const loadGeoJSON = async () => {
      try {
        const data = await getCachedGeoJSON()
        
        if (!isMounted) return

        const polygons = data.features.map((feature) => {
          const stateName = feature.properties.NAME_1
          const stateScores = STATE_SCORES[stateName] || { total: 50 }
          return {
            ...feature,
            name: stateName,
            civicScore: stateScores.total,
            subscores: stateScores,
          }
        })

        setPolygonsData(polygons)
      } catch (error) {
        console.error('Error loading GeoJSON:', error)
      }
    }

    loadGeoJSON()
    return () => {
      isMounted = false
    }
  }, [])

  // ===== Setup Globe Controls =====
  useEffect(() => {
    if (!globeEl.current) return

    const controls = globeEl.current.controls()
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.35
    controls.minDistance = isMobile ? 2 : 1.5
    controls.maxDistance = isMobile ? 3 : 4.5
  }, [isMobile])

  // ===== Camera Animation =====
  useEffect(() => {
    if (!selectedRegion || !globeEl.current || polygonsData.length === 0) return

    const polygon = polygonsData.find((p) => p.name === selectedRegion)
    if (!polygon) return

    const centroid = calculateCentroid(polygon.geometry.coordinates)
    globeEl.current.pointOfView(
      { lat: centroid.lat, lng: centroid.lon, altitude: isMobile ? 1.5 : 1.8 },
      1200
    )
  }, [selectedRegion, polygonsData, isMobile])

  // ===== Memoized Handlers =====
  const handlePolygonClick = useCallback(
    (polygon) => {
      onSelectRegion?.(polygon.name)
      // Show bottom sheet with state info
      setSelectedStatePanel({
        name: polygon.name,
        civicScore: polygon.civicScore,
        subscores: polygon.subscores,
      })
    },
    [onSelectRegion]
  )

  const handlePointClick = useCallback(
    (point) => {
      onSelectComplaint?.(point.complaint)
    },
    [onSelectComplaint]
  )

  // ===== Memoized Polygon Colors (using civic score) =====
  const polygonCapColor = useCallback(
    (d) => {
      if (selectedRegion === d.name) return '#1D9E75'
      if (hoveredPolygon === d.name) return getScoreColorRgbaBright(d.civicScore)
      return getScoreColorRgba(d.civicScore)
    },
    [selectedRegion, hoveredPolygon]
  )

  const polygonAltitude = useCallback(
    (d) => {
      if (selectedRegion === d.name) return 0.06
      if (hoveredPolygon === d.name) return 0.04
      return 0.01
    },
    [selectedRegion, hoveredPolygon]
  )

  // ===== Memoized Points Data =====
  const pointsData = useMemo(
    () =>
      complaints.map((complaint) => ({
        key: complaint.id,
        lat: complaint.latitude,
        lng: complaint.longitude,
        priority: complaint.priority,
        complaint,
      })),
    [complaints]
  )

  // ===== Search Functionality =====
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const filtered = polygonsData.filter(polygon =>
      polygon.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setSearchResults(filtered)
    setShowSearchResults(true)
  }, [searchQuery, polygonsData])

  const handleSearchSelect = (stateName) => {
    setSearchQuery('')
    setShowSearchResults(false)
    const polygon = polygonsData.find(p => p.name === stateName)
    if (polygon) {
      handlePolygonClick(polygon)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center text-white">
          <div className="mb-4 inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-slate-300 border-t-transparent rounded-full" />
          </div>
          <p className="text-base">Loading CivicSense Globe…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen relative bg-slate-950 overflow-hidden">
      {/* Search Bar */}
      <div className={`absolute z-30 rounded-3xl border border-white/10 bg-slate-900/85 backdrop-blur-xl shadow-xl ${
        isMobile 
          ? 'top-16 left-4 right-4 p-3' 
          : 'top-8 right-8 w-80 p-4'
      }`}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search states..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-lg max-h-48 overflow-y-auto">
              {searchResults.map((state) => (
                <button
                  key={state.name}
                  onClick={() => handleSearchSelect(state.name)}
                  className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  <div className="flex items-center justify-between">
                    <span>{state.name}</span>
                    <span className="text-sm text-white/60">Score: {state.civicScore}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        polygonsData={polygonsData}
        polygonCapColor={polygonCapColor}
        polygonSideColor={() => 'rgba(255,255,255,0.05)'}
        polygonStrokeColor={() => 'rgba(255,255,255,0.3)'}
        polygonAltitude={polygonAltitude}
        onPolygonHover={setHoveredPolygon}
        onPolygonClick={handlePolygonClick}
        pointsData={pointsData}
        pointLat={(d) => d.lat}
        pointLng={(d) => d.lng}
        pointColor={(d) => '#1D9E75'}
        pointAltitude={0.02}
        pointRadius={0.08}
        pointLabel={(d) => `${d.complaint.issueType}`}
        pointResolution={6}
        onPointClick={handlePointClick}
      />

      {/* Help text - top left */}
      <div className={`absolute z-30 rounded-3xl border border-white/10 bg-slate-900/85 backdrop-blur-xl text-white shadow-xl ${
        isMobile 
          ? 'top-32 left-4 right-4 p-3 text-xs' 
          : 'top-8 left-8 max-w-xs p-4 text-sm'
      }`}>
        <p className="text-slate-300">
          {isMobile ? 'Tap state to view score' : 'Click any state to view CivicSense Score'}
        </p>
      </div>

      {/* STATE DETAIL PANEL */}
      {selectedStatePanel && (
        isMobile ? (
          // Bottom Sheet on Mobile
          <StateBottomSheet
            state={selectedStatePanel}
            onClose={() => setSelectedStatePanel(null)}
            topPosts={topPostsForState}
          />
        ) : (
          // Side Panel on Desktop
          <StateSidePanel
            state={selectedStatePanel}
            onClose={() => setSelectedStatePanel(null)}
            topPosts={topPostsForState}
          />
        )
      )}
    </div>
  )
}

/**
 * StateBottomSheet Component
 * Mobile bottom sheet showing state details
 */
function StateBottomSheet({ state, onClose, topPosts }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-40 max-h-[75vh] overflow-y-auto animate-slide-up"
      style={{ animation: "slideUp 300ms ease" }}
    >
      {/* Drag Handle */}
      <div className="flex justify-center py-2">
        <div className="w-12 h-1 bg-[#e5e7eb] rounded-full" />
      </div>

      <div className="p-4 space-y-4">
        {/* Header with Close */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#111827]">{state.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold" style={{ color: "#1D9E75" }}>
                {state.civicScore}
              </span>
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(29, 158, 117, 0.1)", color: "#1D9E75" }}>
                {state.civicScore > 70 ? "Good" : state.civicScore >= 50 ? "Moderate" : "Poor"}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2">
            <FiX size={24} style={{ color: "#6b7280" }} />
          </button>
        </div>

        {/* Sub-scores Bars */}
        <div className="space-y-3">
          <h4 className="font-600 text-[#111827] text-sm">Sub-Scores</h4>
          {[
            { label: "Infrastructure", value: state.subscores.infra },
            { label: "Safety", value: state.subscores.safety },
            { label: "Civic Engagement", value: state.subscores.civic },
            { label: "Geo-Tension", value: state.subscores.tension },
            { label: "Environment", value: state.subscores.env },
            { label: "Govt Response", value: state.subscores.govt },
          ].map((score) => {
            const color = getScoreColor(score.value);
            const percentage = (score.value / 100) * 100;
            return (
              <div key={score.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-[#6b7280]">{score.label}</span>
                  <span className="text-xs font-600">{score.value}</span>
                </div>
                <div className="score-bar">
                  <div
                    className={`score-bar-fill ${color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Top Posts */}
        {topPosts.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-[#e5e7eb]">
            <h4 className="font-600 text-[#111827] text-sm">Recent Posts</h4>
            <div className="space-y-2">
              {topPosts.map((post) => (
                <div key={post.id} className="p-3 bg-[#f8f9fa] rounded-lg" style={{ border: "1px solid #e5e7eb" }}>
                  <p className="text-sm font-500 text-[#111827]">{post.user}</p>
                  <p className="text-xs text-[#6b7280] mt-1 line-clamp-2">{post.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-2 pt-4 border-t border-[#e5e7eb]">
          <button
            className="w-full py-2 px-4 rounded-lg font-600 text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: "#1D9E75" }}
          >
            View Full Report
            <FiArrowRight size={16} />
          </button>
          <button
            className="w-full py-2 px-4 rounded-lg font-600 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#f8f9fa", color: "#6b7280", border: "1px solid #e5e7eb" }}
          >
            See All Posts from {state.name.split(" ")[0]}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * StateSidePanel Component
 * Desktop side panel showing state details
 */
function StateSidePanel({ state, onClose, topPosts }) {
  return (
    <div
      className="absolute right-6 top-6 bottom-6 w-96 bg-white rounded-2xl shadow-2xl z-40 overflow-y-auto p-6 space-y-6"
      style={{ animation: "slideDown 300ms ease" }}
    >
      {/* Close Button */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">{state.name}</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-3xl font-bold" style={{ color: "#1D9E75" }}>
              {state.civicScore}
            </span>
            <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(29, 158, 117, 0.1)", color: "#1D9E75" }}>
              {state.civicScore > 70 ? "Good" : state.civicScore >= 50 ? "Moderate" : "Poor"}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-[#f8f9fa] rounded-full transition">
          <FiX size={24} style={{ color: "#6b7280" }} />
        </button>
      </div>

      {/* Sub-scores */}
      <div className="space-y-3">
        <h4 className="font-600 text-[#111827]">Sub-Scores</h4>
        {[
          { label: "Infrastructure", value: state.subscores.infra },
          { label: "Safety", value: state.subscores.safety },
          { label: "Civic Engagement", value: state.subscores.civic },
          { label: "Geo-Tension", value: state.subscores.tension },
          { label: "Environment", value: state.subscores.env },
          { label: "Govt Response", value: state.subscores.govt },
        ].map((score) => {
          const color = getScoreColor(score.value);
          const percentage = (score.value / 100) * 100;
          return (
            <div key={score.label}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#6b7280]">{score.label}</span>
                <span className="text-sm font-600">{score.value}</span>
              </div>
              <div className="score-bar">
                <div
                  className={`score-bar-fill ${color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Posts */}
      {topPosts.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-[#e5e7eb]">
          <h4 className="font-600 text-[#111827]">Recent Posts</h4>
          <div className="space-y-2">
            {topPosts.map((post) => (
              <div key={post.id} className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e5e7eb]">
                <p className="text-sm font-500 text-[#111827]">{post.user}</p>
                <p className="text-xs text-[#6b7280] mt-1">{post.text.slice(0, 80)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="space-y-2 pt-4 border-t border-[#e5e7eb]">
        <button
          className="w-full py-3 px-4 rounded-lg font-600 text-white flex items-center justify-center gap-2 transition"
          style={{ backgroundColor: "#1D9E75" }}
        >
          View Full Report
          <FiArrowRight size={16} />
        </button>
        <button
          className="w-full py-3 px-4 rounded-lg font-600 flex items-center justify-center gap-2 transition"
          style={{ backgroundColor: "#f8f9fa", color: "#1D9E75", border: "1px solid #e5e7eb" }}
        >
          See All Posts
        </button>
      </div>
    </div>
  )
}
