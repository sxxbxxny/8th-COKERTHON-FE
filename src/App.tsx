import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Mvp1 from './pages/mvp1'
import Signup from './pages/Signup'

function App() {
  const navigate = useNavigate()

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={<Login onMoveToSignup={() => navigate('/signup')} />}
      />
      <Route
        path="/signup"
        element={
          <Signup
            onMoveToLogin={() => navigate('/login')}
            onSignupSuccess={() => navigate('/mvp1', { replace: true })}
          />
        }
      />
      <Route path="/mvp1" element={<Mvp1 />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
