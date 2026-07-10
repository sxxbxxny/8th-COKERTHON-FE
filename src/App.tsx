import { useEffect, useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const moveTo = (nextPath: '/login' | '/signup') => {
    window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  if (path === '/signup') {
    return <Signup onMoveToLogin={() => moveTo('/login')} />
  }

  return <Login onMoveToSignup={() => moveTo('/signup')} />
}

export default App
