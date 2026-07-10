import { useEffect, useState } from 'react'
import { ApiError } from '../apis/client'
import { getMyTrack } from '../apis/tracks'

export type TrackTitle =
  | '이불 밖으로 한 걸음'
  | '문 밖으로 한 걸음'
  | '관계를 향한 한 걸음'

const trackNamesByTitle: Record<TrackTitle, string[]> = {
  '이불 밖으로 한 걸음': ['나를 돌보기', '이불 밖으로 한 걸음'],
  '문 밖으로 한 걸음': ['바깥으로 나가기', '문 밖으로 한 걸음'],
  '관계를 향한 한 걸음': ['사람과 연결하기', '관계를 향한 한 걸음'],
}

const normalizeTrackName = (trackName: string) => trackName.replace(/\s/g, '')

export function useTrackMemberCount(title: TrackTitle) {
  const [memberCount, setMemberCount] = useState<number | null>(null)

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return

    let isCancelled = false

    getMyTrack()
      .then((response) => {
        if (isCancelled) return

        const currentTrackName = normalizeTrackName(response.result.trackName)
        const isMatchingTrack = trackNamesByTitle[title]
          .map(normalizeTrackName)
          .includes(currentTrackName)

        setMemberCount(isMatchingTrack ? response.result.memberCount : null)
      })
      .catch((error) => {
        if (isCancelled) return

        if (error instanceof ApiError && error.code === 'TRACK404_2') {
          setMemberCount(0)
          return
        }

        setMemberCount(null)
      })

    return () => {
      isCancelled = true
    }
  }, [title])

  return memberCount
}
