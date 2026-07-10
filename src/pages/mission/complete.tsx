import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createCheer } from '../../apis/cheers'
import goBackIcon from '../../assets/GoBack.svg'
import closeIcon from '../../assets/X.svg'
import { getUserStorageKey } from '../../utils/missionStorage'

type CompleteLocationState = {
  step?: number
}

const characterByStep: Record<number, string> = {
  1: '/images/mychar1.svg',
  2: '/images/mychar2.svg',
  3: '/images/mychar3.svg',
}

const getMissionStep = (state: CompleteLocationState | null) => {
  const stateStep = state?.step

  if (stateStep === 1 || stateStep === 2 || stateStep === 3) {
    return stateStep
  }

  const storedStep = Number(localStorage.getItem(getUserStorageKey('lastCompletedMissionStep')))

  if (storedStep === 1 || storedStep === 2 || storedStep === 3) {
    return storedStep
  }

  return 1
}

function Complete() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [isMessageInputOpen, setIsMessageInputOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [submitMessage, setSubmitMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const messageInputRef = useRef<HTMLInputElement>(null)
  const missionStep = getMissionStep(state as CompleteLocationState | null)
  const characterSrc = characterByStep[missionStep]

  const moveToCompletedStep = () => {
    navigate(`/mission/step${missionStep}`, {
      replace: true,
      state: { restoreCompleted: true },
    })
  }

  useEffect(() => {
    if (!isMessageInputOpen) return

    messageInputRef.current?.focus()
  }, [isMessageInputOpen])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const content = message.trim()
    if (!content || isSubmitting) return

    setSubmitMessage('')
    setIsSubmitting(true)

    try {
      await createCheer({ content })
      setMessage('')
      setSubmitMessage('응원 메시지를 보냈어요!')
      moveToCompletedStep()
    } catch (error) {
      setSubmitMessage(
        error instanceof Error ? error.message : '응원 메시지 전송에 실패했습니다.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isMessageInputOpen) {
    return (
      <section className="mission-goal-input-page">
        <form className="mission-goal-input-panel" onSubmit={handleSubmit}>
          <button
            className="mission-goal-input-close"
            type="button"
            aria-label="응원 메시지 입력 닫기"
            onClick={() => setIsMessageInputOpen(false)}
          >
            <img src={closeIcon} alt="" aria-hidden="true" />
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
            {submitMessage && <p className="mission-cheer-message">{submitMessage}</p>}
          </div>

          <button
            className="mission-goal-input-submit"
            type="submit"
            disabled={!message.trim() || isSubmitting}
          >
            {isSubmitting ? '전송 중...' : '전송하기'}
          </button>
        </form>
      </section>
    )
  }

  return (
    <section className="mission-goal-page">
      <button
        className="mission-goal-back"
        type="button"
        aria-label="뒤로가기"
        onClick={moveToCompletedStep}
      >
        <img src={goBackIcon} alt="" aria-hidden="true" />
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
            className={`mission-goal-character mission-goal-character-step${missionStep}`}
            src={characterSrc}
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
          onFocus={() => {
            setSubmitMessage('')
            setIsMessageInputOpen(true)
          }}
        />
        {submitMessage && <p className="mission-cheer-message">{submitMessage}</p>}
      </footer>
    </section>
  )
}

export default Complete
