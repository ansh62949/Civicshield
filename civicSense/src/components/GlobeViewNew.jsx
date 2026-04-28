import { useEffect, useRef, useState } from 'react'
import Globe from 'react-globe.gl'
import { STATE_TENSION } from '../mockApi'

const PRIORITY_COLORS = {
  CRITICAL: '#E24B4A',
  HIGH: '#EF9F27',
  MEDIUM: '#378ADD',
  LOW: '#1D9E75',
}

const getTensionColor = (tension) => {
  if (tension > 70) return 'rgba(226,75,74,0.6)' // Red
  if (tension >= 40) return 'rgba(239,159,39,0.5)' // Orange
  return 'rgba(29,158,117,0.4)' // Teal
}

const getTensionColorBright = (tension) => {
  if (tension > 70) return 'rgba(226,75,74,0.85)' // Red bright
  if (tension >= 40) return 'rgba(239,159,39,0.75)' // Orange bright
  return 'rgba(29,158,117,0.65)' // Teal bright
}

const getTensionInsight = (tension) => {
  if (tension > 70) {
    return `High tension — political and civil activity detected`
  }
  if (tension >= 40) {
    return `Moderate — monitor for escalation`
  }
  return `Calm — normal civic activity`
}

const getTensionAIInsight = (stateName, complaints, tension) => {
  const stateComplaints = complaints.filter((c) => c.state === stateName)
  const criticalCount = stateComplaints.filter((c) => c.priority === 'CRITICAL').length
  
  if (tension > 70) {
    return `Elevated civil activity detected. ${criticalCount} complaints in critical zones. Recommend pre-deployment of emergency maintenance crews.`
  }
  if (tension >= 40) {
    return `Moderate activity. Monitor drain and road complaints — weather patterns suggest escalation risk.`
  }
  return `Stable region. Routine maintenance scheduling recommended.`
}

const calculateCentroid = (coordinates) => {
  let sumLat = 0,
    sumLng = 0,
    count = 0

  const flattenCoords = (coords, depth = 0) => {
    if (!Array.isArray(coords[0])) {
      // This is a coordinate pair [lng, lat]
      sumLng += coords[0]
      sumLat += coords[1]
      count++
    } else {
      // Recurse into nested array
      coords.forEach((coord) => flattenCoords(coord, depth + 1))
    }
  }

  flattenCoords(coordinates)

  return {
    lat: sumLat / count,
    lon: sumLng / count,
  }
}

const formatTimeAgo = (dateString) => {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export default function GlobeViewNew({
  complaints = [],
  loading = false,
  selectedState,
  onSelectState,
  onSelectComplaint,
}) {
  const globeEl = useRef(null)
  const [polygonsData, setPolygonsData] = useState([])
  const [hoveredPolygon, setHoveredPolygon] = useState(null)
  const [pointsData, setPointsData] = useState([])

  // Fetch GeoJSON on mount
  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson'
        )
        const data = await response.json()
        
        const polygons = data.features.map((feature) => {
          const stateName = feature.properties.NAME_1
          const tension = STATE_TENSION[stateName] || 50
          return {
            ...feature,
            name: stateName,
            tension,
          }
        })

        setPolygonsData(polygons)
      } catch (error) {
        console.error('Error fetching GeoJSON:', error)
      }
    }

    fetchGeoJSON()
  }, [])

  // Setup globe controls
  useEffect(() => {
    if (!globeEl.current) return

    const controls = globeEl.current.controls()
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.35
    controls.minDistance = 1.5
    controls.maxDistance = 4.5
  }, [])

  // Camera fly to selected state
  useEffect(() => {
    if (!selectedState || !globeEl.current) return

    const polygon = polygonsData.find((p) => p.name === selectedState)
    if (!polygon) return

    const centroid = calculateCentroid(polygon.geometry.coordinates)
    globeEl.current.pointOfView(
      { lat: centroid.lat, lng: centroid.lon, altitude: 1.8 },
      1200
    )
  }, [selectedState, polygonsData])

  // Prepare points data from complaints
  useEffect(() => {
    const points = complaints.map((complaint) => ({
      key: complaint.id,
      lat: complaint.latitude,
      lng: complaint.longitude,
      priority: complaint.priority,
      complaint,
    }))
    setPointsData(points)
  }, [complaints])

  const handlePolygonClick = (polygon) => {
    const stateName = polygon.name
    onSelectState && onSelectState(stateName)
  }

  const handlePointClick = (point) => {
    onSelectComplaint && onSelectComplaint(point.complaint)
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center text-white">
          <div className="mb-4 inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-slate-300 border-t-transparent rounded-full" />
          </div>
          <p className="text-base">Loading civic globe…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen relative bg-slate-950 overflow-hidden">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        polygonsData={polygonsData}
        polygonCapColor={(d) =>
          selectedState === d.name
            ? '#1D9E75'
            : hoveredPolygon === d.name
            ? getTensionColorBright(d.tension)
            : getTensionColor(d.tension)
        }
        polygonSideColor={() => 'rgba(255,255,255,0.05)'}
        polygonStrokeColor={() => 'rgba(255,255,255,0.3)'}
        polygonAltitude={(d) =>
          selectedState === d.name ? 0.06 : hoveredPolygon === d.name ? 0.04 : 0.01
        }
        onPolygonHover={setHoveredPolygon}
        onPolygonClick={handlePolygonClick}
        pointsData={pointsData}
        pointLat={(d) => d.lat}
        pointLng={(d) => d.lng}
        pointColor={(d) => PRIORITY_COLORS[d.priority]}
        pointAltitude={0.02}
        pointRadius={0.08}
        pointLabel={(d) => `${d.complaint.issueType} (${d.priority})`}
        pointResolution={6}
        onPointClick={(point) => handlePointClick(point)}
      />

      {/* Bottom-left stats card */}
      <div className="absolute bottom-8 left-8 z-30 max-w-sm rounded-3xl border border-white/10 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl text-white">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Live civic map</p>
            <p className="mt-2 text-2xl font-semibold">{complaints.length} Reports</p>
          </div>
          <div className="inline-flex items-center rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-400">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            <span className="text-xs font-semibold">Live</span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Critical:</span>
            <span className="font-semibold text-red-400">{complaints.filter((c) => c.priority === 'CRITICAL').length}</span>
          </div>
          {selectedState && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-1">Selected</p>
              <p className="font-semibold text-teal-400">{selectedState}</p>
              <div className="inline-flex items-center gap-2 mt-2 rounded-full bg-teal-500/20 px-2 py-1">
                <span className="text-xs text-teal-300">{STATE_TENSION[selectedState] || 50}% tension</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help text */}
      <div className="absolute top-8 left-8 z-30 max-w-xs rounded-3xl border border-white/10 bg-slate-900/85 p-4 shadow-xl backdrop-blur-xl text-white text-sm">
        <p className="text-slate-300">Click any state region to view civic intelligence and complaints</p>
      </div>
    </div>
  )
}
