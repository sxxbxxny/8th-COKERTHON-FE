import { useState } from 'react'
import Button from '../components/Button'
import Radio from '../components/Radio'

const difficultyOptions = [
  { value: 'move', label: '한 발자국 움직이는 것' },
  { value: 'outside', label: '밖으로 나가는 것' },
  { value: 'people', label: '사람과 대면하는 것' },
] as const

function Mvp1() {
  const [difficulty, setDifficulty] = useState('')
  const [step, setStep] = useState<1 | 2>(1)

  const isIntroStep = step === 2

  return (
    <main className="relative flex h-full flex-col overflow-hidden bg-[#F8F8F8] px-[15px]">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none ${
          isIntroStep ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            'var(--2, linear-gradient(180deg, #FFE9E2 0%, #FFF6EB 33.65%, #FFF 66.83%))',
        }}
      />

      {!isIntroStep && (
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
      )}

      {isIntroStep && (
        <div className="relative z-10 min-h-0 flex-1 animate-[onboarding-content-enter_1000ms_ease-out] pt-[186px] motion-reduce:animate-none">
          <h1 className="m-0 mx-auto w-[178px] text-center font-[Pretendard] text-[24px] leading-[140%] font-semibold tracking-[-0.6px] text-[var(--gray-100,#171717)] not-italic">
            이불 밖으로 한 걸음
          </h1>
          <p className="m-0 mx-auto mt-5 w-[228px] text-center font-[Pretendard] text-[16px] leading-[140%] font-normal tracking-[-0.4px] text-[var(--P-60,#DB8774)] not-italic">
            당신과 같은 목표를 바라보는 사람이 00명이에요.
          </p>
        </div>
      )}

      <footer className="relative z-10 shrink-0 pt-4 pb-[max(50px,env(safe-area-inset-bottom))]">
        <Button
          className="mx-auto"
          disabled={!isIntroStep && !difficulty}
          onClick={() => {
            if (!isIntroStep) setStep(2)
          }}
        >
          {isIntroStep ? '시작하기' : '다음'}
        </Button>
      </footer>
    </main>
  )
}

export default Mvp1
