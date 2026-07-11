import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  completeMission,
  extractCompletedMissionIds,
  extractTodayMissions,
  getTodayMissions,
  proceedMission,
  waitForMissionProceed,
} from '../../apis/missions'
import type { TodayMission } from '../../apis/missions'
import MissionBottomNav from '../../components/MissionBottomNav'
import { useLatestCheer } from '../../hooks/useLatestCheer'
import { useTrackMemberCount } from '../../hooks/useTrackMemberCount'
import {
  getNumberSet,
  getStringList,
  getUserStorageKey,
  storeNumberSet,
} from '../../utils/missionStorage'

type StepLocationState = {
  restoreCompleted?: boolean
}

const personalMissionsStorageKey = 'step2PersonalMissionsV2'
const completedMissionsStorageKey = 'step2CompletedMissionsV1'
const missionStep = 2

const getPersonalMissions = () => {
  return getStringList(personalMissionsStorageKey)
}

const getStoredCompletedMissions = () => {
  return getNumberSet(completedMissionsStorageKey)
}

const storeCompletedMissions = (missionIds: Set<number>) => {
  storeNumberSet(completedMissionsStorageKey, missionIds)
}

function Step2() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const memberCount = useTrackMemberCount('문 밖으로 한 걸음')
  const cheerMessage = useLatestCheer()
  const shouldRestoreCompleted =
    (state as StepLocationState | null)?.restoreCompleted === true
  const [missions, setMissions] = useState<TodayMission[]>([])
  const [personalMissions] = useState(getPersonalMissions)
  const [completedMissions, setCompletedMissions] = useState<Set<number>>(() => {
    return getStoredCompletedMissions()
  })
  const [completedPersonalMissions, setCompletedPersonalMissions] = useState<Set<string>>(
    () => new Set(shouldRestoreCompleted ? personalMissions : []),
  )
  const [submittingMissions, setSubmittingMissions] = useState<Set<number>>(new Set())
  const [missionError, setMissionError] = useState('')
  const totalMissionCount = missions.length + personalMissions.length
  const completedMissionCount =
    missions.filter((mission) => completedMissions.has(mission.id)).length +
    completedPersonalMissions.size
  const isAllMissionsCompleted =
    totalMissionCount > 0 && completedMissionCount === totalMissionCount

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return

    let isMounted = true

    getTodayMissions(accessToken)
      .then(({ result }) => {
        if (!isMounted) return

        const todayMissions = extractTodayMissions(result)
        const visibleMissionIds = new Set(todayMissions.map((mission) => mission.id))
        const serverCompletedMissionIds = Array.from(extractCompletedMissionIds(result)).filter(
          (missionId) => visibleMissionIds.has(missionId),
        )

        setMissions(todayMissions)

        setCompletedMissions((prev) => {
          const next = shouldRestoreCompleted
            ? new Set(visibleMissionIds)
            : new Set([...prev, ...serverCompletedMissionIds])
          storeCompletedMissions(next)
          return next
        })
      })
      .catch(() => {
        if (isMounted) setMissionError('미션 완료 상태를 불러오지 못했습니다.')
      })

    return () => {
      isMounted = false
    }
  }, [shouldRestoreCompleted])

  const moveToGoal = () => {
    navigate('/mission/goal', {
      state: { returnTo: '/mission/step2', storageKey: personalMissionsStorageKey },
    })
  }

  const moveToComplete = () => {
    localStorage.setItem(getUserStorageKey('lastCompletedMissionStep'), String(missionStep))
    navigate('/mission/complete', { replace: true, state: { step: missionStep } })
  }

  const handleMissionComplete = async (missionId: number) => {
    if (completedMissions.has(missionId) || submittingMissions.has(missionId)) return

    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      setMissionError('로그인이 필요합니다.')
      return
    }

    setMissionError('')
    setSubmittingMissions((prev) => new Set(prev).add(missionId))

    try {
      const { result } = await completeMission(missionId, accessToken)

      const nextCompletedMissions = new Set(completedMissions).add(missionId)
      setCompletedMissions(nextCompletedMissions)
      storeCompletedMissions(nextCompletedMissions)

      const areAllMissionsCompleted =
        totalMissionCount > 0 &&
        missions.every((mission) => nextCompletedMissions.has(mission.id)) &&
        completedPersonalMissions.size === personalMissions.length

      const canProceed =
        result.trackComplete ||
        (areAllMissionsCompleted && await waitForMissionProceed(accessToken))

      if (canProceed) {
        await proceedMission(accessToken)
        navigate('/my/step3', { replace: true })
        return
      }

      if (areAllMissionsCompleted) moveToComplete()
    } catch (error) {
      setMissionError(
        error instanceof Error ? error.message : '미션 완료 처리에 실패했습니다.',
      )
    } finally {
      setSubmittingMissions((prev) => {
        const next = new Set(prev)
        next.delete(missionId)
        return next
      })
    }
  }

  const togglePersonalMission = (title: string) => {
    const nextCompletedPersonalMissions = new Set(completedPersonalMissions)

    if (nextCompletedPersonalMissions.has(title)) {
      nextCompletedPersonalMissions.delete(title)
    } else {
      nextCompletedPersonalMissions.add(title)
    }

    setCompletedPersonalMissions(nextCompletedPersonalMissions)

    if (
      totalMissionCount > 0 &&
      completedMissions.size + nextCompletedPersonalMissions.size === totalMissionCount
    ) {
      moveToComplete()
    }
  }

  return (
    <section className="mission-step-page">
      <div className="mission-step-hero">
        <div className="mission-step-copy">
          <h1>문 밖으로 한 걸음</h1>
          <p>지금 {memberCount ?? '00'}명이 함께 하고 있어요</p>
        </div>
      </div>

      <main className="mission-step-content">
        <div className="mission-gradient-panel">
          <img
            className="mission-step-image mission-step-image-ellipse211"
            src="/images/ellipse-211.svg"
            alt=""
          />
          <img className="mission-step-image mission-step-image-step2" src="/images/step2.svg" alt="" />
          {isAllMissionsCompleted && (
            <img className="mission-step-image mission-step-image-flag-step2" src="/images/flag.svg" alt="" />
          )}
          <div className="mission-status-pill">{cheerMessage}</div>
        </div>

        <section className="mission-list-section" aria-labelledby="today-mission-title">
          <div className="mission-list-heading">
            <h2 id="today-mission-title">오늘의 미션</h2>
            <p>공동 미션</p>
          </div>
          {missionError && <p role="alert" className="mission-api-error">{missionError}</p>}

          <ul className="mission-list">
            {missions.map((mission) => {
              const isCompleted = completedMissions.has(mission.id)

              return (
                <li
                  className={`mission-card${isCompleted ? ' is-completed' : ''}`}
                  key={mission.id}
                >
                  <button
                    className={`mission-check${isCompleted ? ' is-completed' : ''}`}
                    type="button"
                    aria-label={`${mission.title} 완료`}
                    aria-pressed={isCompleted}
                    disabled={isCompleted || submittingMissions.has(mission.id)}
                    onClick={() => handleMissionComplete(mission.id)}
                  >
                    {isCompleted && <img className="mission-check-icon" src="/images/check_f.svg" alt="" />}
                  </button>
                  <span className="mission-title">{mission.title}</span>
                  <span className="mission-reward">{mission.reward}</span>
                </li>
              )
            })}
          </ul>

          <section className="personal-mission-section" aria-labelledby="personal-mission-title">
            <div className="personal-mission-heading">
              <h2 id="personal-mission-title">나의 미션</h2>
              {personalMissions.length > 0 && (
                <button
                  className="personal-mission-add"
                  type="button"
                  aria-label="나의 미션 등록"
                  onClick={moveToGoal}
                >
                  +
                </button>
              )}
            </div>

            {personalMissions.length > 0 ? (
              <ul className="personal-mission-list">
                {personalMissions.map((mission, index) => {
                  const isCompleted = completedPersonalMissions.has(mission)

                  return (
                    <li
                      className={`personal-mission-item${isCompleted ? ' is-completed' : ''}`}
                      key={`${mission}-${index}`}
                    >
                      <button
                        className={`mission-check${isCompleted ? ' is-completed' : ''}`}
                        type="button"
                        aria-label={`${mission} 완료`}
                        aria-pressed={isCompleted}
                        onClick={() => togglePersonalMission(mission)}
                      >
                        {isCompleted && <img className="mission-check-icon" src="/images/check_f.svg" alt="" />}
                      </button>
                      <span>{mission}</span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="personal-mission-card">
                <p>오늘 나를 위한 미션 추가하기</p>
                <button
                  className="personal-mission-icon-button"
                  type="button"
                  aria-label="나의 미션 추가하기"
                  onClick={moveToGoal}
                >
                  <img className="personal-mission-icon-bg" src="/images/ellipse-1.svg" alt="" />
                  <img
                    className="personal-mission-icon-plus"
                    src="/images/humbleicons-plus.svg"
                    alt=""
                  />
                </button>
              </div>
            )}
          </section>
        </section>
      </main>

      <MissionBottomNav activeTab="mission" missionPath="/mission/step2" myPath="/my/step2" />
    </section>
  )
}

export default Step2
