import { useEffect, useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Cheer from './pages/mission/cheer'
import Complete from './pages/mission/complete'
import Goal from './pages/mission/goal'
import Step1 from './pages/mission/step1'
import Step2 from './pages/mission/step2'
import Step3 from './pages/mission/step3'
import Signup from './pages/Signup'

type AppPath =
  | '/login'
  | '/signup'
  | '/mission/step1'
  | '/mission/step2'
  | '/mission/step3'
  | '/mission/goal'
  | '/mission/complete'
  | '/mission/cheer'

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

  const moveTo = (nextPath: AppPath) => {
    window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  if (path === '/signup') {
    return <Signup onMoveToLogin={() => moveTo('/login')} />
  }

  if (path === '/mission/step1') {
    return <Step1 />
  }

  if (path === '/mission/step2') {
    return <Step2 />
  }

  if (path === '/mission/step3') {
    return <Step3 />
  }

  if (path === '/mission/goal') {
    return <Goal />
  }

  if (path === '/mission/complete') {
    return <Complete />
  }

  if (path === '/mission/cheer') {
    return <Cheer />
  }

  return <Login onMoveToSignup={() => moveTo('/signup')} />
}

export default App
