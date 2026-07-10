import { request } from './client'

export type SignupRequest = {
  email: string
  password: string
  name: string
}

export type SignupResult = {
  id: number
  email: string
  name: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type TokenResult = {
  grantType: string
  accessToken: string
  refreshToken: string
}

export type ReissueRequest = {
  refreshToken: string
}

export function signup(body: SignupRequest) {
  return request<SignupResult>('/api/auth/signup', {
    method: 'POST',
    body,
  })
}

export function login(body: LoginRequest) {
  return request<TokenResult>('/api/auth/login', {
    method: 'POST',
    body,
  })
}

export function reissue(body: ReissueRequest) {
  return request<TokenResult>('/api/auth/reissue', {
    method: 'POST',
    body,
  })
}
