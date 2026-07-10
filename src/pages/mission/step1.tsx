import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { completeMission, extractCompletedMissionIds, getTodayMissions } from '../../apis/missions'
import MissionBottomNav from '../../components/MissionBottomNav'

const missions = [
  { id: 1, title: '물 한 잔 마시기', reward: '00명 수행 중' },
  { id: 2, title: '창문 열고 10분 환기하기', reward: '00명 수행 중' },
  { id: 3, title: '내 공간 5분 정리하기', reward: '00명 수행 중' },
]

const personalMissionsStorageKey = 'step1PersonalMissionsV2'
const completedMissionsStorageKey = 'step1CompletedMissionsV1'

const getPersonalMissions = () => {
  const storedMissions = localStorage.getItem(personalMissionsStorageKey)

  if (storedMissions) {
    try {
      const parsedMissions = JSON.parse(storedMissions)

      if (Array.isArray(parsedMissions)) {
        return parsedMissions.filter((mission): mission is string => typeof mission === 'string')
      }
    } catch {
      return []
    }
  }

  return []
}

const getStoredCompletedMissions = () => {
  const storedMissionIds = localStorage.getItem(completedMissionsStorageKey)

  if (!storedMissionIds) return new Set<number>()

  try {
    const parsedMissionIds = JSON.parse(storedMissionIds)

    if (Array.isArray(parsedMissionIds)) {
      return new Set(
        parsedMissionIds.filter((missionId): missionId is number => typeof missionId === 'number'),
      )
    }
  } catch {
    return new Set<number>()
  }

  return new Set<number>()
}

const storeCompletedMissions = (missionIds: Set<number>) => {
  localStorage.setItem(completedMissionsStorageKey, JSON.stringify(Array.from(missionIds)))
}

function Step1() {
  const navigate = useNavigate()
  const [completedMissions, setCompletedMissions] = useState<Set<number>>(getStoredCompletedMissions)
  const [submittingMissions, setSubmittingMissions] = useState<Set<number>>(new Set())
  const [missionError, setMissionError] = useState('')
  const [personalMissions] = useState(getPersonalMissions)
  const [completedPersonalMissions, setCompletedPersonalMissions] = useState<Set<string>>(new Set())
  const totalMissionCount = missions.length + personalMissions.length
  const completedMissionCount = completedMissions.size + completedPersonalMissions.size
  const isAllMissionsCompleted =
    totalMissionCount > 0 && completedMissionCount === totalMissionCount

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return

    let isMounted = true
    const visibleMissionIds = new Set(missions.map((mission) => mission.id))

    getTodayMissions(accessToken)
      .then(({ result }) => {
        if (!isMounted) return

        const serverCompletedMissionIds = Array.from(extractCompletedMissionIds(result)).filter(
          (missionId) => visibleMissionIds.has(missionId),
        )

        setCompletedMissions((prev) => {
          const next = new Set([...prev, ...serverCompletedMissionIds])
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
  }, [])

  const moveToGoal = () => {
    navigate('/mission/goal', {
      state: { returnTo: '/mission/step1', storageKey: personalMissionsStorageKey },
    })
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
      await completeMission(missionId, accessToken)
      setCompletedMissions((prev) => {
        const next = new Set(prev).add(missionId)
        storeCompletedMissions(next)
        return next
      })
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
    setCompletedPersonalMissions((prev) => {
      const next = new Set(prev)

      if (next.has(title)) {
        next.delete(title)
      } else {
        next.add(title)
      }

      return next
    })
  }

  return (
    <section className="mission-step-page">
      <div className="mission-step-hero">
        <div className="mission-step-copy">
          <h1>이불 밖으로 한 걸음</h1>
          <p>지금 00명이 함께 하고 있어요</p>
        </div>
      </div>

      <main className="mission-step-content">
        <div className="mission-gradient-panel mission-gradient-panel-step1">
          <img
            className="mission-step-image mission-step-image-ellipse210"
            src="/images/ellipse-210.svg"
            alt=""
          />
          <img className="mission-step-image mission-step-image-step1" src="/images/step1.svg" alt="" />
          {isAllMissionsCompleted && (
            <img className="mission-step-image mission-step-image-flag-step1" src="/images/flag.svg" alt="" />
          )}
          <div className="mission-status-pill">오늘도 화이팅하세요 :)</div>
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

      <MissionBottomNav activeTab="mission" missionPath="/mission/step1" />
    </section>
  )
}

export default Step1
