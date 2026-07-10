import { request } from './client'

export type MyTrackResult = {
  trackName: string
  memberCount: number
}

export function getMyTrack(accessToken: string) {
  return request<MyTrackResult>('/api/tracks/me', {
    accessToken,
  })
}
