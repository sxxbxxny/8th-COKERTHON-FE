import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  const [page, setPage] = useState<'login' | 'signup'>('login')

  return (
    <main className="auth-page">
      {page === 'login' ? (
        <Login onMoveToSignup={() => setPage('signup')} />
      ) : (
        <Signup />
      )}
    </main>
  )
}

export default App
