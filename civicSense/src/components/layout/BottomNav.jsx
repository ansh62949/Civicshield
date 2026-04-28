/**
 * BottomNav Component
 * Mobile-first bottom navigation with 5 tabs
 * Shows on all devices, important for navigation
 */

import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiPlus, FiMapPin, FiBell, FiUser } from 'react-icons/fi'

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: FiHome },
  { path: '/create', label: 'Report', icon: FiPlus },
  { path: '/area', label: 'Map', icon: FiMapPin },
  { path: '/notifications', label: 'Alerts', icon: FiBell },
  { path: '/profile', label: 'Profile', icon: FiUser },
]

export function BottomNav({ userName }) {
  const location = useLocation()

  return (
    <>
      {/* Mobile Navigation (Bottom) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 z-40 md:hidden">
        <div className="flex justify-around items-center h-20 px-2">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path

            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center justify-center w-1/5 h-full gap-1 transition-colors duration-200 rounded-lg ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <div className="relative">
                  <Icon size={24} strokeWidth={1.5} />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  )}
                </div>
                <span className="text-xs font-semibold">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop Navigation (Top Right - Simplified) */}
      <nav className="hidden md:flex fixed top-20 right-6 z-30 gap-2 flex-col">
        <div className="bg-white rounded-full shadow-lg p-3 hover:shadow-xl transition-shadow">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
            {userName?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </nav>

      {/* Add padding to prevent content from hiding under nav */}
      <div className="h-20 md:h-0" />
    </>
  )
}
