export type Difficulty = 'move' | 'outside' | 'people'

export type TrackType = 'SELF_CARE' | 'GO_OUTSIDE' | 'CONNECT_PEOPLE'

export const trackTypeByDifficulty: Record<Difficulty, TrackType> = {
  move: 'SELF_CARE',
  outside: 'GO_OUTSIDE',
  people: 'CONNECT_PEOPLE',
}

const missionPathByTrackName: Record<string, string> = {
  나를돌보기: '/mission/step1',
  이불밖으로한걸음: '/mission/step1',
  바깥으로나가기: '/mission/step2',
  문밖으로한걸음: '/mission/step2',
  사람과연결하기: '/mission/step3',
  관계를향한한걸음: '/mission/step3',
}

const normalizeTrackName = (trackName: string) => trackName.replace(/\s/g, '')

export function getMissionPathByTrackName(trackName: string) {
  return missionPathByTrackName[normalizeTrackName(trackName)] ?? null
}

export function getMyPathByTrackName(trackName: string) {
  const missionPath = getMissionPathByTrackName(trackName)

  return missionPath?.replace('/mission/', '/my/') ?? null
}
