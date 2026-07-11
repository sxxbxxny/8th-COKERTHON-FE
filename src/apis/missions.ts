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

export async function waitForMissionProceed(accessToken: string) {
  const retryDelays = [0, 200, 400]

  for (const delay of retryDelays) {
    if (delay > 0) {
      await new Promise((resolve) => window.setTimeout(resolve, delay))
    }

    const { result } = await getMissionProgress(accessToken)
    if (result.canProceed) return true
  }

  return false
}

export function proceedMission(accessToken: string) {
  return request<unknown>('/api/missions/proceed', {
    method: 'POST',
    accessToken,
  })
}

export function getTodayMissions(accessToken: string) {
  return request<unknown>('/api/missions/today', {
    accessToken,
  })
}

export type TodayMission = {
  id: number
  title: string
  reward: string
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

export type CompleteMissionResult = {
  trackComplete: boolean
}

export function completeMission(missionId: number, accessToken: string) {
  return request<CompleteMissionResult>(`/api/missions/${missionId}/complete`, {
    method: 'POST',
    accessToken,
  })
}

const completedStatusValues = new Set(['complete', 'completed', 'done', 'success', '완료'])

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getNumberValue = (value: unknown) => (typeof value === 'number' ? value : null)

export function extractTodayMissions(value: unknown) {
  const missions = new Map<number, TodayMission>()

  const visit = (current: unknown) => {
    if (Array.isArray(current)) {
      current.forEach(visit)
      return
    }

    if (!isRecord(current)) return

    const id = getNumberValue(current.missionId) ?? getNumberValue(current.id)
    const title = [current.title, current.missionTitle, current.content].find(
      (item): item is string => typeof item === 'string',
    )

    if (id !== null && title) {
      const reward = [current.reward, current.rewardText].find(
        (item): item is string => typeof item === 'string',
      )

      missions.set(id, { id, title, reward: reward ?? '' })
      return
    }

    Object.values(current).forEach(visit)
  }

  visit(value)

  return Array.from(missions.values())
}

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
