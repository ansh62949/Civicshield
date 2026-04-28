cd C:\Users\satam\OneDrive\Desktop\New folder (3)\civicshield-frontend (2)/**
 * Auth Page - Login/Register
 * Handle user authentication and registration
 */

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'

export function AuthPage() {
  const navigate = useNavigate()
  const { user, login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigated = useRef(false)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  })

  // Redirect if already logged in (only once)
  useEffect(() => {
    if (user && !navigated.current) {
      navigated.current = true
      navigate('/', { replace: true })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password)
        if (!result.success) {
          setError(result.message)
        }
        // Don't navigate - let useEffect handle it when user state updates
      } else {
        const result = await register(formData.username, formData.email, formData.password)
        if (!result.success) {
          setError(result.message)
        }
        // Don't navigate - let useEffect handle it when user state updates
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await login('demo@example.com', 'demo123')
      if (!result.success) {
        // If demo account doesn't exist, register it
        const regResult = await register('DemoUser', 'demo@example.com', 'demo123')
        if (!regResult.success) {
          setError(regResult.message)
        }
      }
      // Don't navigate - let useEffect handle it when user state updates
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-blue-600 font-bold text-2xl">CS</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">CivicSense</h1>
          <p className="text-blue-100">Report issues. Engage community. Create change.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          {/* Toggle */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => {
                setIsLogin(true)
                setError(null)
              }}
              className={`flex-1 py-2 px-4 rounded font-semibold transition-all ${
                isLogin
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setError(null)
              }}
              className={`flex-1 py-2 px-4 rounded font-semibold transition-all ${
                !isLogin
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold"
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Demo Button */}
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Try Demo Account'}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-blue-100 text-sm">
          <p>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white font-semibold hover:underline"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
