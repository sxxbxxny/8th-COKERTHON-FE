import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../apis/client'
import { assignOnboardingTrack, getMyTrack } from '../apis/tracks'
import Button from '../components/Button'
import { useTrackMemberCount, type TrackTitle } from '../hooks/useTrackMemberCount'
import {
  getMissionPathByTrackName,
  trackTypeByDifficulty,
  type Difficulty,
} from '../utils/tracks'

type LocationState = {
  difficulty?: string
}

const challengeByDifficulty: Record<
  Difficulty,
  {
    title: TrackTitle
    imageSrc: string
    imageClassName: string
    ellipseSrc: string
    ellipseClassName: string
    artClassName: string
    missionPath: string
  }
> = {
  move: {
    title: '이불 밖으로 한 걸음',
    imageSrc: '/images/step1.svg',
    imageClassName: 'top-[93px] left-[84px] h-[74px] w-[191px]',
    ellipseSrc: '/images/ellipse-210.svg',
    ellipseClassName: 'top-[151px] left-[82px] h-[26px] w-[196px]',
    artClassName: 'mt-[58px]',
    missionPath: '/mission/step1',
  },
  outside: {
    title: '문 밖으로 한 걸음',
    imageSrc: '/images/step2.svg',
    imageClassName: 'top-[62px] left-[103px] h-[117px] w-[155px]',
    ellipseSrc: '/images/ellipse-211.svg',
    ellipseClassName: 'top-[172px] left-[101px] h-[13px] w-[159px]',
    artClassName: 'mt-[58px]',
    missionPath: '/mission/step2',
  },
  people: {
    title: '관계를 향한 한 걸음',
    imageSrc: '/images/step3.svg',
    imageClassName: 'top-[40px] left-[119px] h-[138px] w-[123px]',
    ellipseSrc: '/images/ellipse-212.svg',
    ellipseClassName: 'top-[179px] left-[101px] h-[14px] w-[159px]',
    artClassName: 'mt-[58px]',
    missionPath: '/mission/step3',
  },
}

const isDifficulty = (value: string | undefined): value is Difficulty =>
  value === 'move' || value === 'outside' || value === 'people'

function MyCh() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedDifficulty = useMemo(() => {
    const stateDifficulty = (state as LocationState | null)?.difficulty

    if (isDifficulty(stateDifficulty)) {
      return stateDifficulty
    }

    const storedDifficulty = localStorage.getItem('selectedDifficulty') ?? undefined

    if (isDifficulty(storedDifficulty)) {
      return storedDifficulty
    }

    return 'move'
  }, [state])

  const challenge = challengeByDifficulty[selectedDifficulty]
  const memberCount = useTrackMemberCount(challenge.title)

  const moveToMission = async () => {
    setMessage('')
    setIsSubmitting(true)

    try {
      const response = await assignOnboardingTrack({
        trackType: trackTypeByDifficulty[selectedDifficulty],
      })
      navigate(getMissionPathByTrackName(response.result.trackName) ?? challenge.missionPath)
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        try {
          const response = await getMyTrack()
          navigate(getMissionPathByTrackName(response.result.trackName) ?? challenge.missionPath)
          return
        } catch {
          navigate(challenge.missionPath)
          return
        }
      }

      setMessage(error instanceof Error ? error.message : '트랙 배정에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main
      className="relative flex h-full flex-col overflow-hidden px-[15px]"
      style={{
        background:
          'var(--2, linear-gradient(180deg, #FFE9E2 0%, #FFF6EB 33.65%, #FFF 66.83%))',
      }}
    >
      <div className="relative z-10 min-h-0 flex-1 animate-[onboarding-content-enter_1000ms_ease-out] pt-[142px] motion-reduce:animate-none">
        <h1 className="m-0 mx-auto w-[260px] text-center font-[Pretendard] text-[24px] leading-[140%] font-semibold tracking-[-0.6px] text-[var(--gray-100,#171717)] not-italic">
          {challenge.title}
        </h1>
        <p className="m-0 mx-auto mt-[31px] w-[300px] text-center font-[Pretendard] text-[16px] leading-[140%] font-normal tracking-[-0.4px] text-[var(--P-60,#DB8774)] not-italic">
          당신과 같은 목표를 바라보는 사람들이
          <br />
          {memberCount ?? '00'}명이에요.
        </p>

        <div className={`relative mx-auto h-[250px] w-[360px] max-w-full ${challenge.artClassName}`}>
          <img
            className={`absolute block ${challenge.ellipseClassName}`}
            src={challenge.ellipseSrc}
            alt=""
            aria-hidden="true"
          />
          <img
            className={`absolute z-10 block ${challenge.imageClassName}`}
            src={challenge.imageSrc}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>

      <footer className="relative z-10 shrink-0 pt-4 pb-[max(50px,env(safe-area-inset-bottom))]">
        {message && (
          <p className="mx-auto mb-3 w-[300px] text-center font-[Pretendard] text-[14px] leading-[140%] font-normal text-[var(--P-60,#DB8774)]">
            {message}
          </p>
        )}
        <Button className="mx-auto" disabled={isSubmitting} onClick={moveToMission}>
          {isSubmitting ? '배정 중...' : '시작하기'}
        </Button>
      </footer>
    </main>
  )
}

export default MyCh
