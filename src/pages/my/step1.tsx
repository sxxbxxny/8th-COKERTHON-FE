import { useLocation } from 'react-router-dom'
import MissionBottomNav from '../../components/MissionBottomNav'

type LocationState = {
  missionPath?: string
}

const stampPositions = [
  { left: '71.5%', top: '10.5%' },
  { left: '46.5%', top: '15%' },
  { left: '25%', top: '18.5%' },
  { left: '5.5%', top: '25.5%' },
  { left: '30%', top: '33.5%' },
  { left: '50%', top: '38%' },
  { left: '70%', top: '42%' },
  { left: '93%', top: '50%' },
  { left: '70%', top: '57%' },
  { left: '40%', top: '62.5%' },
  { left: '10%', top: '72%' },
  { left: '30%', top: '81%' },
  { left: '60%', top: '88%' },
]

const completedStampCount = 10

function MyStep1() {
  const location = useLocation()
  const missionPath =
    typeof (location.state as LocationState | null)?.missionPath === 'string'
      ? (location.state as LocationState).missionPath
      : '/mission/step1'

  const isFootstepCompleted =
    completedStampCount === stampPositions.length

  return (
    <section className="mission-step-page">
      <header className="my-page-header">
        <div>
          <h1>이불 밖으로 한 걸음</h1>
          <p>지금 00걸음 함께 하고 있어요</p>
        </div>

        <img
          src="/images/my_my.svg"
          alt=""
          aria-hidden="true"
        />
      </header>

      <main className="my-stamp-screen">
        <div className="my-stamp-heading">
          <h2>미션 수행 스탬프</h2>
          <p>다음 단계까지 3개 남았어요</p>
        </div>

        <div
          className="my-stamp-route"
          aria-label="미션 수행 스탬프 현황"
        >
          <img
            className="my-stamp-path"
            src="/images/my_load1.svg"
            alt=""
            aria-hidden="true"
          />

          {stampPositions.map((position, index) => {
            const isCompleted = index < completedStampCount

            return (
              <img
                className="my-stamp-check"
                src={
                  isCompleted
                    ? '/images/my_check.svg'
                    : '/images/my_uncheck.svg'
                }
                alt=""
                aria-hidden="true"
                style={position}
                key={`${position.left}-${position.top}`}
              />
            )
          })}

          <img
            className="my-stamp-next"
            src={
              isFootstepCompleted
                ? '/images/my_footstep_pink.svg'
                : '/images/my_footstep_gray.svg'
            }
            alt=""
            aria-hidden="true"
          />

          <img
            className="my-stamp-character"
            src="/images/mychar1.svg"
            alt=""
            aria-hidden="true"
          />
        </div>
      </main>

      <MissionBottomNav
        activeTab="my"
        missionPath={missionPath}
      />
    </section>
  )
}

export default MyStep1