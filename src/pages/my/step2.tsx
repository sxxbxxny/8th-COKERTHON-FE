import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getMissionProgress } from '../../apis/missions'
import MissionBottomNav from '../../components/MissionBottomNav'
import { useTrackMemberCount } from '../../hooks/useTrackMemberCount'

type LocationState = {
  missionPath?: string
}

const stampPositions = [
  { left: '84%', top: '8%' },
  { left: '50%', top: '8%' },
  { left: '20%', top: '8%' },
  { left: '10%', top: '30%' },
  { left: '8%', top: '58%' },
  { left: '20%', top: '90%' },
  { left: '50%', top: '92%' },
]

function MyStep2() {
  const location = useLocation()
  const memberCount = useTrackMemberCount('문 밖으로 한 걸음')
  const [progress, setProgress] = useState({
    requiredDays: stampPositions.length,
    completedDays: 0,
  })
  const missionPath =
    typeof (location.state as LocationState | null)?.missionPath === 'string'
      ? (location.state as LocationState).missionPath
      : '/mission/step2'

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return

    let isCancelled = false

    getMissionProgress(accessToken)
      .then((response) => {
        if (isCancelled) return

        setProgress({
          requiredDays: response.result.requiredDays,
          completedDays: response.result.completedDays,
        })
      })
      .catch(() => {
        if (isCancelled) return
      })

    return () => {
      isCancelled = true
    }
  }, [])

  const completedStampCount = Math.min(
    Math.max(progress.completedDays, 0),
    stampPositions.length,
  )
  const remainingDays = Math.max(progress.requiredDays - progress.completedDays, 0)
  const isFootstepCompleted = completedStampCount === stampPositions.length

  return (
    <section className="mission-step-page">
      <header className="my-page-header">
        <div>
          <h1>문 밖으로 한 걸음</h1>
          <p>지금 {memberCount ?? '00'}명이 함께 하고 있어요</p>
        </div>
        <img src="/images/my_my.svg" alt="" aria-hidden="true" />
      </header>

      <main className="my-stamp-screen">
        <div className="my-stamp-heading">
          <h2>미션 수행 스탬프</h2>
          <p>다음 단계까지 {remainingDays}개 남았어요</p>
        </div>

        <div className="my-stamp-route my-step2-route" aria-label="미션 수행 스탬프 현황">
          <img className="my-stamp-path" src="/images/my_road2.svg" alt="" aria-hidden="true" />

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
            className="my-step2-character"
            src="/images/mychar2.svg"
            alt=""
            aria-hidden="true"
          />
          <img
            className="my-step2-next"
            src={
              isFootstepCompleted
                ? '/images/my_footstep_pink.svg'
                : '/images/my_footstep_gray.svg'
            }
            alt=""
            aria-hidden="true"
          />
        </div>
      </main>

      <MissionBottomNav activeTab="my" missionPath={missionPath} myPath="/my/step2" />
    </section>
  )
}

export default MyStep2
