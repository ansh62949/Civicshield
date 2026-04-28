import { useMemo } from 'react'
import { FiArrowLeft, FiChevronRight, FiTrendingUp, FiShield, FiThumbsUp, FiClock } from 'react-icons/fi'
import { STATE_TENSION } from '../mockApi'

const priorityStyles = {
  CRITICAL: 'bg-red-100 text-red-700',
  HIGH: 'bg-orange-100 text-orange-700',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  LOW: 'bg-slate-100 text-slate-900',
}

const statusStyles = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  RESOLVED: 'bg-emerald-100 text-emerald-700',
}

const getTensionAIInsight = (stateName, complaints, tension) => {
  const stateComplaints = complaints.filter((c) => c.state === stateName)
  const criticalCount = stateComplaints.filter((c) => c.priority === 'CRITICAL').length
  
  if (tension > 70) {
    return `High civic tension detected. ${criticalCount} critical incidents reported. Recommend immediate deployment of emergency maintenance crews.`
  }
  if (tension >= 40) {
    return `Moderate activity level. Monitor drain and road complaints — weather patterns suggest escalation risk. Prepare contingency teams.`
  }
  return `Stable region. Routine maintenance scheduling recommended. Proactive infrastructure checks will prevent future escalation.`
}

const getTensionClass = (tension) => {
  if (tension > 70) return 'bg-red-100 text-red-700'
  if (tension >= 40) return 'bg-orange-100 text-orange-700'
  return 'bg-emerald-100 text-emerald-700'
}

const formatDistance = (complaint, userLocation) => {
  if (!userLocation) return '—'
  const dLat = (complaint.latitude - userLocation.lat) * Math.PI / 180
  const dLon = (complaint.longitude - userLocation.lng) * Math.PI / 180
  const lat1 = (userLocation.lat * Math.PI) / 180
  const lat2 = (complaint.latitude * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = 6371 * c
  return `${distance.toFixed(1)} km`
}

const RegionDetail = ({
  regionName,
  complaints = [],
  onBack,
  onReport,
  userLocation,
}) => {
  if (!regionName) return null

  // Memoized calculations
  const memoizedData = useMemo(() => {
    const tension = STATE_TENSION[regionName] || 50
    const regionComplaints = complaints.filter((c) => c.state === regionName)
    const activeIssues = regionComplaints.length
    const criticalCount = regionComplaints.filter((c) => c.priority === 'CRITICAL').length
    const inProgressCount = regionComplaints.filter((c) => c.status === 'IN_PROGRESS').length
    const resolvedCount = regionComplaints.filter((c) => c.status === 'RESOLVED').length
    const resolvedIssues = regionComplaints.filter((c) => c.status === 'RESOLVED')
    const averageFix = resolvedIssues.length > 0 ? '2.4d' : '—'

    const topComplaints = [...regionComplaints]
      .sort((a, b) => {
        const priorityScore = { CRITICAL: 3, HIGH: 2, MEDIUM: 1, LOW: 0 }
        return (priorityScore[b.priority] - priorityScore[a.priority]) || (b.upvoteCount - a.upvoteCount)
      })
      .slice(0, 5)

    return {
      tension,
      regionComplaints,
      activeIssues,
      criticalCount,
      inProgressCount,
      resolvedCount,
      averageFix,
      topComplaints,
    }
  }, [regionName, complaints])

  const { tension, activeIssues, criticalCount, inProgressCount, averageFix, topComplaints } = memoizedData

  return (
    <div className="h-full flex flex-col bg-white shadow-[0_0_35px_rgba(15,23,42,0.08)] rounded-3xl overflow-hidden">
      <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-200 flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900"
        >
          <FiArrowLeft size={16} className="md:w-[18px] md:h-[18px]" />
          <span className="font-semibold text-sm md:text-base">Back</span>
        </button>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Civic tension</p>
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${getTensionClass(tension)}`}>
            <span className="h-2.5 w-2.5 rounded-full bg-current block" />
            {tension}% tension
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-4 md:py-5 space-y-4 md:space-y-5 overflow-y-auto">
        <div className="rounded-3xl bg-slate-50 p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-slate-500 uppercase tracking-[0.24em] text-xs font-semibold">State focus</p>
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 truncate">{regionName}</h2>
              <p className="mt-2 text-xs md:text-sm text-slate-600 line-clamp-2">
                All active civic incidents tracked. Review critical issues and coordinate response teams.
              </p>
            </div>
            <div className={`rounded-3xl px-3 md:px-4 py-2 md:py-3 text-xs font-semibold whitespace-nowrap ${getTensionClass(tension)}`}>
              {tension}%
            </div>
          </div>

          <div className="mt-4 md:mt-6 grid gap-2 md:gap-3 grid-cols-2 md:grid-cols-4">
            <div className="rounded-3xl bg-white p-3 md:p-4 shadow-sm border border-slate-200">
              <p className="text-xs text-slate-500 uppercase tracking-[0.18em] font-semibold line-clamp-1">Active</p>
              <p className="mt-2 text-2xl md:text-3xl font-semibold text-slate-900">{activeIssues}</p>
            </div>
            <div className="rounded-3xl bg-white p-3 md:p-4 shadow-sm border border-slate-200">
              <p className="text-xs text-slate-500 uppercase tracking-[0.18em] font-semibold line-clamp-1">Critical</p>
              <p className="mt-2 text-2xl md:text-3xl font-semibold text-slate-900">{criticalCount}</p>
            </div>
            <div className="rounded-3xl bg-white p-3 md:p-4 shadow-sm border border-slate-200">
              <p className="text-xs text-slate-500 uppercase tracking-[0.18em] font-semibold line-clamp-1">Progress</p>
              <p className="mt-2 text-2xl md:text-3xl font-semibold text-slate-900">{inProgressCount}</p>
            </div>
            <div className="rounded-3xl bg-white p-3 md:p-4 shadow-sm border border-slate-200">
              <p className="text-xs text-slate-500 uppercase tracking-[0.18em] font-semibold line-clamp-1">Fix time</p>
              <p className="mt-2 text-2xl md:text-3xl font-semibold text-slate-900">{averageFix}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-50 p-4 md:p-5">
          <div className="flex items-center justify-between mb-3 md:mb-4 gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500 font-semibold">AI Insights</p>
              <h3 className="mt-1 md:mt-2 text-base md:text-lg font-semibold text-slate-900">Predictive risk</h3>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-white px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm text-slate-600 shadow-sm border border-slate-200 whitespace-nowrap">
              <FiTrendingUp size={14} className="md:w-4 md:h-4" /> Live
            </div>
          </div>
          <p className="text-xs md:text-sm leading-5 md:leading-6 text-slate-700 line-clamp-3">
            {getTensionAIInsight(regionName, complaints, tension)}
          </p>
        </div>

        {memoizedData.regionComplaints.length > 0 && (
          <div className="rounded-3xl bg-white p-4 md:p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-3 md:mb-4 gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 font-semibold">Top incidents</p>
                <h3 className="text-base md:text-lg font-semibold text-slate-900">Immediate attention</h3>
              </div>
              <span className="text-xs uppercase tracking-[0.24em] text-slate-500 whitespace-nowrap">{memoizedData.regionComplaints.length} reports</span>
            </div>

            <div className="space-y-2">
              {topComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="w-full text-left rounded-2xl md:rounded-3xl border border-slate-200 p-3 md:p-4 hover:border-slate-300 hover:bg-slate-50 transition text-xs md:text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 truncate">{complaint.issueType}</p>
                      <p className="mt-1 text-slate-600 line-clamp-1">{complaint.description}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold whitespace-nowrap ${priorityStyles[complaint.priority]}`}>
                      {complaint.priority}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-slate-500 gap-1 text-xs">
                    <span className="truncate">{complaint.citizenName}</span>
                    <span className="whitespace-nowrap">{formatDistance(complaint, userLocation)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 md:gap-4">
          <button
            onClick={onReport}
            className="inline-flex items-center justify-center gap-2 rounded-full md:rounded-3xl bg-emerald-600 px-4 md:px-5 py-2 md:py-3 text-xs md:text-sm font-semibold text-white shadow-lg shadow-emerald-200/40 hover:bg-emerald-700 transition"
          >
            <FiShield size={16} className="md:w-[18px] md:h-[18px]" /> Report issue
          </button>
          <div className="rounded-2xl md:rounded-3xl bg-slate-50 p-3 md:p-5 border border-slate-200">
            <div className="flex items-start gap-2 md:gap-3 text-slate-600 text-xs md:text-sm">
              <FiClock size={16} className="mt-0.5 flex-shrink-0 md:w-[18px] md:h-[18px]" />
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">Live tracking</p>
                <p className="text-slate-500 mt-1 line-clamp-2">Incidents ranked by real-time civic telemetry and community reports.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegionDetail
