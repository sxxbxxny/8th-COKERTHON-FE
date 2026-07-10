import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MissionBottomNav from '../../components/MissionBottomNav'

const missions = [
  { title: '집 앞 5분 걷기', reward: '10장 수줍음' },
]

const personalMissionsStorageKey = 'step2PersonalMissionsV2'

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

function Step2() {
  const navigate = useNavigate()
  const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set())
  const [personalMissions] = useState(getPersonalMissions)
  const [completedPersonalMissions, setCompletedPersonalMissions] = useState<Set<string>>(new Set())

  const moveToGoal = () => {
    navigate('/mission/goal', {
      state: { returnTo: '/mission/step2', storageKey: personalMissionsStorageKey },
    })
  }

  const toggleMission = (title: string) => {
    setCompletedMissions((prev) => {
      const next = new Set(prev)

      if (next.has(title)) {
        next.delete(title)
      } else {
        next.add(title)
      }

      return next
    })
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
          <h1>문 밖으로 한 걸음</h1>
          <p>지금 00명이 함께 하고 있어요</p>
        </div>
      </div>

      <main className="mission-step-content">
        <div className="mission-gradient-panel">
          <div className="mission-status-pill">오늘도 화이팅하세요 :)</div>
        </div>

        <section className="mission-list-section" aria-labelledby="today-mission-title">
          <div className="mission-list-heading">
            <h2 id="today-mission-title">오늘의 미션</h2>
            <p>공동 미션</p>
          </div>

          <ul className="mission-list">
            {missions.map((mission) => {
              const isCompleted = completedMissions.has(mission.title)

              return (
                <li
                  className={`mission-card${isCompleted ? ' is-completed' : ''}`}
                  key={mission.title}
                >
                  <button
                    className={`mission-check${isCompleted ? ' is-completed' : ''}`}
                    type="button"
                    aria-label={`${mission.title} 완료`}
                    aria-pressed={isCompleted}
                    onClick={() => toggleMission(mission.title)}
                  />
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
                      />
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

      <MissionBottomNav activeTab="mission" missionPath="/mission/step2" />
    </section>
  )
}

export default Step2
