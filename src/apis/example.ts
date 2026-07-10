import { request } from './client'

export type ExampleRequest = {
  name: string
  description: string
}

export type ExampleResult = {
  id: number
  name: string
  description: string
}

export function createExample(body: ExampleRequest, accessToken?: string) {
  return request<ExampleResult>('/api/example', {
    method: 'POST',
    body,
    accessToken,
  })
}

export function getExample(id: number, accessToken?: string) {
  return request<ExampleResult>(`/api/example/${id}`, {
    accessToken,
  })
}

export function deleteExample(id: number, accessToken?: string) {
  return request<Record<string, never>>(`/api/example/${id}`, {
    method: 'DELETE',
    accessToken,
  })
}
