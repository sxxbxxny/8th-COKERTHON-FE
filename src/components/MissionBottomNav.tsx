import { useNavigate } from 'react-router-dom'

type MissionBottomNavProps = {
  activeTab: 'mission' | 'my'
  missionPath?: string
}

function MissionBottomNav({ activeTab, missionPath = '/mission/step1' }: MissionBottomNavProps) {
  const navigate = useNavigate()
  const isMissionTab = activeTab === 'mission'

  return (
    <nav className="mission-bottom-nav" aria-label="미션 화면 메뉴">
      <button
        className={`mission-nav-item${isMissionTab ? ' is-active' : ''}`}
        type="button"
        aria-current={isMissionTab ? 'page' : undefined}
        onClick={() => navigate(missionPath)}
      >
        <img
          className="mission-nav-icon"
          src={isMissionTab ? '/images/check.svg' : '/images/check_c.svg'}
          alt=""
          aria-hidden="true"
        />
        <span>미션</span>
      </button>
      <button
        className={`mission-nav-item${!isMissionTab ? ' is-active' : ''}`}
        type="button"
        aria-current={!isMissionTab ? 'page' : undefined}
        onClick={() => navigate('/my', { state: { missionPath } })}
      >
        <img
          className="mission-nav-icon"
          src={isMissionTab ? '/images/my_c.svg' : '/images/my.svg'}
          alt=""
          aria-hidden="true"
        />
        <span>마이</span>
      </button>
    </nav>
  )
}

export default MissionBottomNav
