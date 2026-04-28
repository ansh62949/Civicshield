import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import { AuthPage } from './pages/Auth.jsx'
import './index.css'
import { AuthProvider, useAuth } from './hooks/useAuth'

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={ <AuthPage /> } />
        <Route path="/*" element={ isAuthenticated ? <App /> : <Navigate to="/login" /> } />
      </Routes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>,
)
