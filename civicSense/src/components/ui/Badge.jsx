/**
 * Badge Component
 * Color-coded severity and category badges
 */

export function Badge({ category, severity, text, variant = 'category' }) {
  const getSeverityColor = (sev) => {
    switch (sev?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-700 border border-red-200'
      case 'HIGH':
        return 'bg-orange-100 text-orange-700 border border-orange-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
      case 'LOW':
        return 'bg-green-100 text-green-700 border border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200'
    }
  }

  const getCategoryColor = (cat) => {
    switch (cat?.toUpperCase()) {
      case 'POTHOLE':
        return 'bg-slate-100 text-slate-700 border border-slate-200'
      case 'GARBAGE':
        return 'bg-green-50 text-green-700 border border-green-200'
      case 'WATER':
        return 'bg-blue-50 text-blue-700 border border-blue-200'
      case 'CRIME':
        return 'bg-red-50 text-red-700 border border-red-200'
      case 'ROAD':
        return 'bg-amber-50 text-amber-700 border border-amber-200'
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
  }

  if (variant === 'severity') {
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(severity)}`}>
        {severity}
      </span>
    )
  }

  if (variant === 'category') {
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(category)}`}>
        {category}
      </span>
    )
  }

  return (
    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
      {text}
    </span>
  )
}
