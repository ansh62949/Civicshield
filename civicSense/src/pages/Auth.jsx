/**
 * Auth Page - Login/Register
 * Handle user authentication and registration
 */

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'

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
      } else {
        const result = await register(formData.username, formData.email, formData.password)
        if (!result.success) {
          setError(result.message)
        }
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
        const regResult = await register('DemoUser', 'demo@example.com', 'demo123')
        if (!regResult.success) {
          setError(regResult.message)
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(139,92,246,0.4)] border border-white/20 p-1"
          >
            <div className="w-full h-full bg-[#020617] rounded-full flex items-center justify-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-black text-3xl tracking-tighter">CS</span>
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">CivicSense</h1>
          <p className="text-text-secondary text-sm md:text-base font-medium">Report issues. Engage community. Create change.</p>
        </div>

        {/* Form Card (Glassmorphism) */}
        <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 mb-6 border border-white/10">
          
          {/* Toggle */}
          <div className="flex gap-2 mb-8 bg-black/40 p-1.5 rounded-2xl border border-white/5">
            <button
              onClick={() => { setIsLogin(true); setError(null); }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 relative ${isLogin ? 'text-white' : 'text-text-secondary hover:text-white'}`}
            >
              {isLogin && <motion.div layoutId="auth-tab" className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg -z-10"></motion.div>}
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(null); }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 relative ${!isLogin ? 'text-white' : 'text-text-secondary hover:text-white'}`}
            >
              {!isLogin && <motion.div layoutId="auth-tab" className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg -z-10"></motion.div>}
              Register
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="bg-critical/10 border border-critical/30 text-critical px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
              >
                <span>⚠️</span> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 mb-8">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 ml-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    className="w-full px-4 py-3.5 bg-black/40 border border-white/10 text-white rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3.5 bg-black/40 border border-white/10 text-white rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-black/40 border border-white/10 text-white rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="px-3 bg-[#0f172a] text-text-tertiary">or connect with</span>
            </div>
          </div>

          {/* Demo Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl font-bold text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Try Demo Account'}
          </motion.button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm font-medium">
          <p className="text-text-secondary">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-white font-bold transition-colors ml-1"
            >
              {isLogin ? 'Register now' : 'Login instead'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
