import { FiHome, FiShare2, FiUpload, FiBarChart2, FiSettings, FiMenu, FiX } from 'react-icons/fi'

export default function Navbar({
  currentScreen,
  setCurrentScreen,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:bg-white md:border-r md:border-gray-200 md:shadow-lg md:flex md:flex-col md:p-6 md:z-40">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">CivicShield</h1>
          <p className="text-gray-500 text-sm">AI-powered civic reporting</p>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem
            icon={<FiHome />}
            label="Globe View"
            screen="globe"
            active={currentScreen === 'globe'}
            onClick={() => setCurrentScreen('globe')}
          />
          <NavItem
            icon={<FiShare2 />}
            label="Social Feed"
            screen="feed"
            active={currentScreen === 'feed'}
            onClick={() => setCurrentScreen('feed')}
          />
          <NavItem
            icon={<FiUpload />}
            label="Report Issue"
            screen="submit"
            active={currentScreen === 'submit'}
            onClick={() => setCurrentScreen('submit')}
          />
          <NavItem
            icon={<FiBarChart2 />}
            label="Leaderboard"
            screen="leaderboard"
            active={currentScreen === 'leaderboard'}
            onClick={() => setCurrentScreen('leaderboard')}
          />
        </nav>

        <div className="border-t border-gray-200 pt-4">
          <NavItem
            icon={<FiSettings />}
            label="Admin Panel"
            screen="admin"
            active={currentScreen === 'admin'}
            onClick={() => setCurrentScreen('admin')}
          />
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-lg flex items-center justify-between px-4 z-50">
        <h1 className="text-xl font-bold text-primary">CivicShield</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-600 hover:text-primary transition-colors"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </header>

      {/* Mobile Top Padding */}
      <div className="md:hidden h-16"></div>
    </>
  )
}

function NavItem({ icon, label, screen, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        active
          ? 'bg-primary text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  )
}
