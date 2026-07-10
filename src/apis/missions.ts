import { request } from './client'

export function getCustomMissions(accessToken: string) {
  return request<unknown>('/api/missions/custom', {
    accessToken,
  })
}

export type MissionProgressResult = {
  requiredDays: number
  completedDays: number
  canProceed: boolean
}

export function getMissionProgress(accessToken: string) {
  return request<MissionProgressResult>('/api/missions/progress', {
    accessToken,
  })
}

export function getTodayMissions(accessToken: string) {
  return request<unknown>('/api/missions/today', {
    accessToken,
  })
}

export type CreateCustomMissionRequest = {
  title: string
}

export function createCustomMission(
  body: CreateCustomMissionRequest,
  accessToken: string,
) {
  return request<unknown>('/api/missions/custom', {
    method: 'POST',
    body,
    accessToken,
  })
}

export function completeMission(missionId: number, accessToken: string) {
  return request<unknown>(`/api/missions/${missionId}/complete`, {
    method: 'POST',
    accessToken,
  })
}

const completedStatusValues = new Set(['complete', 'completed', 'done', 'success', '완료'])

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getNumberValue = (value: unknown) => (typeof value === 'number' ? value : null)

const hasCompletedFlag = (mission: Record<string, unknown>) => {
  const booleanFlags = [
    mission.completed,
    mission.isCompleted,
    mission.complete,
    mission.done,
    mission.checked,
  ]

  if (booleanFlags.some((flag) => flag === true)) return true

  const status = [mission.status, mission.missionStatus, mission.state].find(
    (value): value is string => typeof value === 'string',
  )

  if (status && completedStatusValues.has(status.toLowerCase())) return true

  return typeof mission.completedAt === 'string' && mission.completedAt.length > 0
}

export function extractCompletedMissionIds(value: unknown) {
  const completedMissionIds = new Set<number>()

  const isCompletedKey = (key: string) => {
    const normalizedKey = key.toLowerCase()

    return normalizedKey.includes('completed') || normalizedKey.includes('complete')
  }

  const visit = (current: unknown, parentKey = '') => {
    if (typeof current === 'number' && isCompletedKey(parentKey)) {
      completedMissionIds.add(current)
      return
    }

    if (Array.isArray(current)) {
      current.forEach((item) => visit(item, parentKey))
      return
    }

    if (!isRecord(current)) return

    const missionId = getNumberValue(current.missionId) ?? getNumberValue(current.id)

    if (missionId !== null && (isCompletedKey(parentKey) || hasCompletedFlag(current))) {
      completedMissionIds.add(missionId)
    }

    Object.entries(current).forEach(([key, nestedValue]) => {
      if (typeof nestedValue === 'number' && isCompletedKey(key)) {
        completedMissionIds.add(nestedValue)
        return
      }

      visit(nestedValue, key)
    })
  }

  visit(value)

  return completedMissionIds
}
