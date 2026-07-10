import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import closeIcon from '../../assets/X.svg'

type GoalLocationState = {
  returnTo?: string
  storageKey?: string
}

function Goal() {
  const navigate = useNavigate()
  const location = useLocation()
  const [goal, setGoal] = useState('')
  const [viewportHeight, setViewportHeight] = useState(
    window.visualViewport?.height ?? window.innerHeight,
  )
  const { returnTo = '/mission/step1', storageKey = 'step1PersonalMissionsV2' } =
    (location.state as GoalLocationState | null) ?? {}

  useEffect(() => {
    const viewport = window.visualViewport

    const updateViewportHeight = () => {
      setViewportHeight(viewport?.height ?? window.innerHeight)
    }

    updateViewportHeight()
    viewport?.addEventListener('resize', updateViewportHeight)
    window.addEventListener('resize', updateViewportHeight)

    return () => {
      viewport?.removeEventListener('resize', updateViewportHeight)
      window.removeEventListener('resize', updateViewportHeight)
    }
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedGoal = goal.trim()
    if (!trimmedGoal) return

    let savedGoals: string[] = []
    const storedGoals = localStorage.getItem(storageKey)

    if (storedGoals) {
      try {
        const parsedGoals = JSON.parse(storedGoals)
        if (Array.isArray(parsedGoals)) {
          savedGoals = parsedGoals.filter(
            (item): item is string => typeof item === 'string',
          )
        }
      } catch {
        savedGoals = []
      }
    }

    localStorage.setItem(storageKey, JSON.stringify([...savedGoals, trimmedGoal]))
    navigate(returnTo, { replace: true })
  }

  return (
    <section
      className="group relative max-h-full overflow-hidden bg-[var(--gray-00,#FFF)] px-[15px]"
      style={{ height: viewportHeight }}
    >
      <button
        type="button"
        aria-label="목표 설정 닫기"
        className="absolute top-[57px] right-[15px] flex size-[15px] cursor-pointer items-center justify-center border-0 bg-transparent p-0"
        onClick={() => navigate(-1)}
      >
        <img src={closeIcon} alt="" aria-hidden="true" className="size-[15px]" />
      </button>

      <form className="relative h-full pt-[153px]" onSubmit={handleSubmit}>
        <div className="ml-[15px]">
          <label
            htmlFor="personal-goal"
            className="block text-left font-[Pretendard] text-[16px] leading-[140%] font-semibold tracking-[-0.4px] text-[var(--gray-100,#171717)]"
          >
            가볍게 이룰 수 있는
            <br />
            나만의 목표를 설정해주세요.
          </label>
        </div>

        <input
          id="personal-goal"
          type="text"
          value={goal}
          placeholder="집 오는 길에 편의점 들르기"
          className="mt-[21px] h-[50px] w-[360px] max-w-full rounded-[20px] border border-[var(--P-50,#FFB89F)] bg-transparent px-[15px] font-[Pretendard] text-[14px] text-[var(--gray-100,#171717)] outline-none placeholder:text-[var(--gray-60,#909090)] focus:border-[var(--P-60,#DB8774)]"
          onChange={(event) => setGoal(event.target.value)}
        />

        <button
          type="submit"
          disabled={!goal.trim()}
          className="mx-auto mt-[164px] flex h-[40px] w-[160px] cursor-pointer items-center justify-center gap-[10px] rounded-[20px] border-0 bg-linear-to-r from-[#FFB8B8] to-[#FFB89F] px-0 py-3 font-[Pretendard] text-[18px] leading-none font-semibold tracking-[-0.45px] text-[var(--color-gray-10,#F8F8F8)] shadow-[0_0_8px_0_#FFB8B8] disabled:cursor-not-allowed disabled:opacity-50 group-focus-within:absolute group-focus-within:bottom-6 group-focus-within:left-1/2 group-focus-within:mt-0 group-focus-within:-translate-x-1/2"
        >
          저장
        </button>
      </form>
    </section>
  )
}

export default Goal
