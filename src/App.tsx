import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import MyCh from './pages/my_ch'
import My from './pages/my'
import MyComplete1 from './pages/my/complete1'
import MyComplete2 from './pages/my/complete2'
import MyStep2 from './pages/my/step2'
import MyStep3 from './pages/my/step3'
import Mvp1 from './pages/mvp1'
import Complete from './pages/mission/complete'
import Goal from './pages/mission/goal'
import Step1 from './pages/mission/step1'
import Step2 from './pages/mission/step2'
import Step3 from './pages/mission/step3'
import Signup from './pages/Signup'

function App() {
  const navigate = useNavigate()

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <Login
            onMoveToSignup={() => navigate('/signup')}
            onLoginSuccess={() => navigate('/mvp1', { replace: true })}
          />
        }
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
      <Route path="/my_ch" element={<MyCh />} />
      <Route path="/my" element={<My />} />
      <Route path="/my/step1" element={<My />} />
      <Route path="/my/complete1" element={<MyComplete1 />} />
      <Route path="/my/complete2" element={<MyComplete2 />} />
      <Route path="/my/step2" element={<MyStep2 />} />
      <Route path="/my/step3" element={<MyStep3 />} />
      <Route path="/mission/step1" element={<Step1 />} />
      <Route path="/mission/step2" element={<Step2 />} />
      <Route path="/mission/step3" element={<Step3 />} />
      <Route path="/mission/goal" element={<Goal />} />
      <Route path="/mission/complete" element={<Complete />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
