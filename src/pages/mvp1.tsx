import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../apis/client'
import { assignOnboardingTrack, getMyTrack } from '../apis/tracks'
import Button from '../components/Button'
import Radio from '../components/Radio'
import { trackTypeByDifficulty, type Difficulty } from '../utils/tracks'

const difficultyOptions = [
  { value: 'move', label: '한 발자국 움직이는 것' },
  { value: 'outside', label: '밖으로 나가는 것' },
  { value: 'people', label: '사람과 대면하는 것' },
] as const

function Mvp1() {
  const navigate = useNavigate()
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const moveToMyChallenge = async () => {
    if (!difficulty || isSubmitting) return

    setMessage('')
    setIsSubmitting(true)
    localStorage.setItem('selectedDifficulty', difficulty)

    try {
      const response = await assignOnboardingTrack({
        trackType: trackTypeByDifficulty[difficulty],
      })
      navigate('/my_ch', { state: { difficulty, memberCount: response.result.memberCount } })
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        try {
          const response = await getMyTrack()
          navigate('/my_ch', { state: { difficulty, memberCount: response.result.memberCount } })
        } catch {
          navigate('/my_ch', { state: { difficulty } })
        }
        return
      }

      setMessage(error instanceof Error ? error.message : '트랙 저장에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative flex h-full flex-col overflow-hidden bg-[#F8F8F8] px-[15px]">
      <div className="relative z-10 min-h-0 flex-1 overflow-hidden pt-[clamp(60px,22.22dvh,190px)] pb-6">
        <h1 className="m-0 ml-[15px] h-[68px] w-[248px] text-left font-[Pretendard] text-[24px] leading-[140%] font-semibold tracking-[-0.6px] text-[var(--gray-100,#171717)] not-italic">
          지금 가장 어려운 한 걸음은
          <br />
          무엇인가요?
        </h1>

        <fieldset className="mt-[78px] flex min-w-0 flex-col items-center gap-4 border-0 p-0">
          <legend className="sr-only">가장 어려운 한 걸음 선택</legend>
          {difficultyOptions.map((option) => (
            <Radio
              key={option.value}
              name="difficulty"
              value={option.value}
              checked={difficulty === option.value}
              onChange={() => setDifficulty(option.value)}
            >
              {option.label}
            </Radio>
          ))}
        </fieldset>
      </div>

      <footer className="relative z-10 shrink-0 pt-4 pb-[max(50px,env(safe-area-inset-bottom))]">
        {message && (
          <p className="mx-auto mb-3 w-[300px] text-center font-[Pretendard] text-[14px] leading-[140%] font-normal text-[var(--P-60,#DB8774)]">
            {message}
          </p>
        )}
        <Button
          className="mx-auto"
          disabled={!difficulty || isSubmitting}
          onClick={moveToMyChallenge}
        >
          {isSubmitting ? '저장 중...' : '다음'}
        </Button>
      </footer>
    </main>
  )
}

export default Mvp1
