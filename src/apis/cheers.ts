import { request } from './client'

export type CreateCheerRequest = {
  content: string
}

export type CreateCheerResult = Record<string, never>

export type Cheer = {
  senderId: number
  senderName: string
  content: string
  createdAt: string
}

export function createCheer(body: CreateCheerRequest) {
  return request<CreateCheerResult>('/api/cheers', {
    method: 'POST',
    body,
  })
}

export function getCheers() {
  return request<Cheer[]>('/api/cheers')
}
