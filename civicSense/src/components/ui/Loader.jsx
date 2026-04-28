/**
 * Loader Component
 * Skeleton loading states and spinners
 */

export function Loader({ size = 'md', type = 'spinner' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  if (type === 'spinner') {
    return (
      <div className={`${sizes[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`} />
    )
  }

  if (type === 'skeleton') {
    return <div className="bg-gray-200 rounded animate-pulse h-full" />
  }

  return null
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
      {/* Avatar + Info */}
      <div className="flex gap-3 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-32 h-3 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>

      {/* Image */}
      <div className="w-full h-64 bg-gray-200 rounded-xl animate-pulse mb-3" />

      {/* Text */}
      <div className="space-y-2 mb-3">
        <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
        <div className="w-4/5 h-4 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Badges */}
      <div className="flex gap-2 mb-3">
        <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
      </div>

      {/* Interactions */}
      <div className="flex gap-4">
        <div className="w-12 h-6 bg-gray-100 rounded animate-pulse" />
        <div className="w-12 h-6 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  )
}
