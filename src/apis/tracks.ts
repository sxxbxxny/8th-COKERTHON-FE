import { request } from './client'

export type MyTrackResult = {
  trackName: string
  memberCount: number
}

export function getMyTrack() {
  return request<MyTrackResult>('/api/tracks/me')
}
