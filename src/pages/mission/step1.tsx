import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const missions = [
  { title: '물 한 잔 마시기', reward: '10장 수줍음' },
  { title: '창문 열고 10분 환기하기', reward: '10장 수줍음' },
  { title: '내 공간 5분 정리하기', reward: '10장 수줍음' },
  { title: '햇빛 5분 쬐기', reward: '10장 수줍음' },
]

const personalMissionsStorageKey = 'step1PersonalMissionsV2'

type ActiveTab = 'mission' | 'my'

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

function Step1() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<ActiveTab>('mission')
  const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set())
  const [personalMissions] = useState(getPersonalMissions)
  const [completedPersonalMissions, setCompletedPersonalMissions] = useState<Set<string>>(new Set())
  const isMissionTab = activeTab === 'mission'

  const moveToGoal = () => {
    navigate('/mission/goal', {
      state: { returnTo: '/mission/step1', storageKey: personalMissionsStorageKey },
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
      {isMissionTab ? (
        <>
          <div className="mission-step-hero">
            <div className="mission-step-copy">
              <h1>이불 밖으로 한 걸음</h1>
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
        </>
      ) : (
        <main className="mission-my-page">
          <section className="mission-my-profile" aria-labelledby="my-page-title">
            <div className="mission-my-avatar" aria-hidden="true">
              <img src="/images/my_c.svg" alt="" />
            </div>
            <h1 id="my-page-title">마이페이지</h1>
            <p>아직 준비 중이에요</p>
          </section>

          <section className="mission-my-summary" aria-label="내 미션 요약">
            <div>
              <strong>0</strong>
              <span>완료 미션</span>
            </div>
            <div>
              <strong>0장</strong>
              <span>모은 수줍음</span>
            </div>
          </section>

          <section className="mission-my-card">
            <h2>나의 기록</h2>
            <p>미션을 완료하면 이곳에서 활동 기록을 확인할 수 있어요.</p>
          </section>
        </main>
      )}

      <nav className="mission-bottom-nav" aria-label="미션 화면 메뉴">
        <button
          className={`mission-nav-item${isMissionTab ? ' is-active' : ''}`}
          type="button"
          aria-current={isMissionTab ? 'page' : undefined}
          onClick={() => setActiveTab('mission')}
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
          onClick={() => setActiveTab('my')}
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
    </section>
  )
}

export default Step1
