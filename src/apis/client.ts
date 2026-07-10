const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.VITE_API_PROXY_TARGET ??
  ''
).replace(/\/$/, '')

type RequestOptions = {
  method?: string
  body?: unknown
  accessToken?: string
}

export type ApiResponse<T> = {
  isSuccess: boolean
  code: string
  message: string
  result: T
}

export class ApiError extends Error {
  code: string
  status: number

  constructor(message: string, code: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

export async function request<T>(
  path: string,
  { method = 'GET', body, accessToken }: RequestOptions = {},
) {
  const token = accessToken ?? localStorage.getItem('accessToken') ?? undefined

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const text = await response.text()
  let data: ApiResponse<T>

  try {
    data = text
      ? (JSON.parse(text) as ApiResponse<T>)
      : {
          isSuccess: response.ok,
          code: String(response.status),
          message: response.statusText,
          result: undefined as T,
        }
  } catch {
    data = {
      isSuccess: false,
      code: String(response.status),
      message: text || 'API 응답을 읽을 수 없습니다.',
      result: undefined as T,
    }
  }

  if (!response.ok || !data.isSuccess) {
    throw new ApiError(
      data.message || 'API 요청에 실패했습니다.',
      data.code || String(response.status),
      response.status,
    )
  }

  return data
}
