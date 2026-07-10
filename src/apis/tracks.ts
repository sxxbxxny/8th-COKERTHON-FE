import { request } from './client'
import type { TrackType } from '../utils/tracks'

export type MyTrackResult = {
  trackName: string
  memberCount: number
}

export type OnboardingTrackRequest = {
  trackType: TrackType
}

export function getMyTrack() {
  return request<MyTrackResult>('/api/tracks/me')
}

export function assignOnboardingTrack(body: OnboardingTrackRequest) {
  return request<MyTrackResult>('/api/tracks/onboarding', {
    method: 'POST',
    body,
  })
}
