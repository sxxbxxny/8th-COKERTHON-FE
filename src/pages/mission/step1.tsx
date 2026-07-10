import { useState } from 'react'

const missions = [
  { title: '물 한 잔 마시기', reward: '10장 수줍음' },
  { title: '창문 열고 10분 환기하기', reward: '10장 수줍음' },
  { title: '내 공간 5분 정리하기', reward: '10장 수줍음' },
]

type ActiveTab = 'mission' | 'my'

function Step1() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('mission')
  const isMissionTab = activeTab === 'mission'

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
            <div className="mission-status-pill">오늘도 화이팅하세요 :)</div>

            <section className="mission-list-section" aria-labelledby="today-mission-title">
              <div className="mission-list-heading">
                <h2 id="today-mission-title">오늘의 미션</h2>
                <p>공동 미션</p>
              </div>

              <ul className="mission-list">
                {missions.map((mission) => (
                  <li className="mission-card" key={mission.title}>
                    <span className="mission-check" aria-hidden="true" />
                    <span className="mission-title">{mission.title}</span>
                    <span className="mission-reward">{mission.reward}</span>
                  </li>
                ))}
              </ul>
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
