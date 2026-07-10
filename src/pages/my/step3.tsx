import { useLocation } from 'react-router-dom'
import MissionBottomNav from '../../components/MissionBottomNav'

type LocationState = {
  missionPath?: string
}

const stampPositions = [
  { left: '45%', top: '8%' },
  { left: '85%', top: '8%' },
  { left: '10%', top: '27%' },
  { left: '9%', top: '65%' },
  { left: '55%', top: '92%' },
]

function MyStep3() {
  const location = useLocation()
  const missionPath =
    typeof (location.state as LocationState | null)?.missionPath === 'string'
      ? (location.state as LocationState).missionPath
      : '/mission/step1'

  return (
    <section className="mission-step-page">
      <header className="my-page-header">
        <div>
          <h1>관계를 향한 한 걸음</h1>
          <p>지금 00명이 함께 하고 있어요</p>
        </div>
        <img src="/images/my_my.svg" alt="" aria-hidden="true" />
      </header>

      <main className="my-stamp-screen">
        <div className="my-stamp-heading">
          <h2>미션 수행 스탬프</h2>
          <p>다음 단계까지 3개 남았어요</p>
        </div>

        <div className="my-stamp-route my-step2-route" aria-label="미션 수행 스탬프 현황">
          <img className="my-stamp-path" src="/images/my_road3.svg" alt="" aria-hidden="true" />

          {stampPositions.map((position) => (
            <img
              className="my-stamp-check"
              src="/images/my_check.svg"
              alt=""
              aria-hidden="true"
              style={position}
              key={`${position.left}-${position.top}`}
            />
          ))}

          <img
            className="my-step3-character"
            src="/images/mychar3.svg"
            alt=""
            aria-hidden="true"
          />
          <img
            className="my-step2-next"
            src="/images/my_footstep_gray.svg"
            alt=""
            aria-hidden="true"
          />
        </div>
      </main>

      <MissionBottomNav activeTab="my" missionPath={missionPath} />
    </section>
  )
}

export default MyStep3