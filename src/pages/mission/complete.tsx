import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Complete() {
  const navigate = useNavigate()
  const [isMessageInputOpen, setIsMessageInputOpen] = useState(false)
  const [message, setMessage] = useState('')
  const messageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isMessageInputOpen) return

    messageInputRef.current?.focus()
  }, [isMessageInputOpen])

  if (isMessageInputOpen) {
    return (
      <section className="mission-goal-input-page">
        <main className="mission-goal-input-panel">
          <button
            className="mission-goal-input-close"
            type="button"
            aria-label="응원 메시지 입력 닫기"
            onClick={() => setIsMessageInputOpen(false)}
          >
            <img src="/src/assets/X.svg" alt="" aria-hidden="true" />
          </button>

          <div className="mission-goal-input-copy">
            <p>
              아직 미션 수행 중인 팀원들에게
              <br />
              응원 메시지를 작성해주세요!
            </p>

            <input
              ref={messageInputRef}
              value={message}
              placeholder="오늘도 힘내세요!"
              onChange={(event) => setMessage(event.target.value)}
            />
          </div>

          <button className="mission-goal-input-submit" type="button">
            전송하기
          </button>
        </main>
      </section>
    )
  }

  return (
    <section className="mission-goal-page">
      <button
        className="mission-goal-back"
        type="button"
        aria-label="뒤로가기"
        onClick={() => navigate(-1)}
      >
        <img src="/src/assets/GoBack.svg" alt="" aria-hidden="true" />
      </button>

      <main className="mission-goal-content">
        <div className="mission-goal-message">
          <h1>
            오늘의 목표를
            <br />
            다 이뤘어요
          </h1>
          <p>
            오늘도 한걸음 더 나아간 당신!
            <br />
            너무 수고 많았어요.
          </p>
          <img
            className="mission-goal-character"
            src="/src/assets/캐릭터 1 1.svg"
            alt=""
            aria-hidden="true"
          />
        </div>
      </main>

      <footer className="mission-goal-footer">
        <p>
          아직 미션 수행 중인 팀원들에게
          <br />
          응원 메시지 한 줄 어때요?
        </p>
        <input
          aria-label="응원 메시지"
          placeholder="응원 메시지를 작성해주세요"
          onFocus={() => setIsMessageInputOpen(true)}
        />
      </footer>
    </section>
  )
}

export default Complete
