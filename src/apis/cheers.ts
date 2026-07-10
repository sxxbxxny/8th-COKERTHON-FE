import { request } from './client'

export type CreateCheerRequest = {
  content: string
}

export type CreateCheerResult = Record<string, never>

export function createCheer(body: CreateCheerRequest) {
  return request<CreateCheerResult>('/api/cheers', {
    method: 'POST',
    body,
  })
}
