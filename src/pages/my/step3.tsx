import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getMissionProgress, proceedMission } from '../../apis/missions'
import { getMyTrack } from '../../apis/tracks'
import MissionBottomNav from '../../components/MissionBottomNav'
import { useTrackMemberCount } from '../../hooks/useTrackMemberCount'
import { getUserStorageKey } from '../../utils/missionStorage'
import { getMyPathByTrackName } from '../../utils/tracks'

type LocationState = {
  missionPath?: string
}

const stampPositions = [
  { left: '85%', top: '8%' },
  { left: '45%', top: '8%' },
  { left: '10%', top: '27%' },
  { left: '9%', top: '65%' },
  { left: '55%', top: '92%' },
]

const missionStep = 3

function MyStep3() {
  const location = useLocation()
  const navigate = useNavigate()
  const isProceedingRef = useRef(false)
  const memberCount = useTrackMemberCount('관계를 향한 한 걸음')
  const [progress, setProgress] = useState({
    requiredDays: stampPositions.length,
    completedDays: 0,
  })
  const missionPath =
    typeof (location.state as LocationState | null)?.missionPath === 'string'
      ? (location.state as LocationState).missionPath
      : '/mission/step3'

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return

    let isCancelled = false

    getMyTrack()
      .then(async (trackResponse) => {
        if (isCancelled) return

        const currentMyPath = getMyPathByTrackName(trackResponse.result.trackName)
        if (currentMyPath && currentMyPath !== '/my/step3') {
          navigate(currentMyPath, { replace: true })
          return
        }

        const response = await getMissionProgress(accessToken)
        if (isCancelled) return

        setProgress({
          requiredDays: response.result.requiredDays,
          completedDays: response.result.completedDays,
        })

        if (!response.result.canProceed || isProceedingRef.current) return

        isProceedingRef.current = true
        await proceedMission(accessToken)

        navigate('/my/complete3', { replace: true })
      })
      .catch(() => {
        isProceedingRef.current = false
      })

    return () => {
      isCancelled = true
    }
  }, [navigate])

  const lastCompletedMissionStep = Number(
    localStorage.getItem(getUserStorageKey('lastCompletedMissionStep')),
  )
  const hasCompletedCurrentStep = lastCompletedMissionStep === missionStep
  const normalizedCompletedDays = hasCompletedCurrentStep
    ? Math.max(progress.completedDays, 1)
    : progress.completedDays
  const completedStampCount = Math.min(
    Math.max(normalizedCompletedDays, 0),
    stampPositions.length,
  )
  const remainingDays = Math.max(progress.requiredDays - normalizedCompletedDays, 0)
  const isFootstepCompleted = completedStampCount === stampPositions.length

  return (
    <section className="mission-step-page">
      <header className="my-page-header">
        <div>
          <h1>관계를 향한 한 걸음</h1>
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
          <img className="my-stamp-path" src="/images/my_road3.svg" alt="" aria-hidden="true" />

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
            className="my-step3-character"
            src="/images/mychar3.svg"
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

      <MissionBottomNav activeTab="my" missionPath={missionPath} myPath="/my/step3" />
    </section>
  )
}

export default MyStep3
