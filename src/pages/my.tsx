import { useLocation } from 'react-router-dom'
import MissionBottomNav from '../components/MissionBottomNav'

type LocationState = {
  missionPath?: string
}

function My() {
  const location = useLocation()
  const missionPath =
    typeof (location.state as LocationState | null)?.missionPath === 'string'
      ? (location.state as LocationState).missionPath
      : '/mission/step1'

  return (
    <section className="mission-step-page">
      <MissionBottomNav activeTab="my" missionPath={missionPath} />
    </section>
  )
}

export default My
