import { useState, useEffect } from 'react'
import { Login } from './components/Login'
import { Dashboard } from './components/Dashboard'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLoginSuccess = (newToken: string, userData: any) => {
    localStorage.setItem('auth_token', newToken)
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <>
      {!isAuthenticated ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </>
  )
}

export default App
