const authUserStorageKey = 'authUserKey'

const normalizeUserKey = (value: string) => value.trim().toLowerCase()

const decodeJwtPayload = (token: string) => {
  const [, payload] = token.split('.')
  if (!payload) return null

  try {
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decodedPayload = atob(normalizedPayload)

    return JSON.parse(decodedPayload) as Record<string, unknown>
  } catch {
    return null
  }
}

export const setAuthUserKey = (userKey: string) => {
  const normalizedUserKey = normalizeUserKey(userKey)

  if (normalizedUserKey) {
    localStorage.setItem(authUserStorageKey, normalizedUserKey)
  }
}

export const getCurrentUserKey = () => {
  const storedUserKey = localStorage.getItem(authUserStorageKey)
  if (storedUserKey) return storedUserKey

  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) return 'anonymous'

  const tokenPayload = decodeJwtPayload(accessToken)
  const tokenUserKey = [
    tokenPayload?.email,
    tokenPayload?.sub,
    tokenPayload?.userId,
    tokenPayload?.id,
  ].find((value): value is string | number => {
    return typeof value === 'string' || typeof value === 'number'
  })

  return tokenUserKey === undefined ? 'anonymous' : normalizeUserKey(String(tokenUserKey))
}

export const getUserStorageKey = (storageKey: string) => {
  return `${getCurrentUserKey()}:${storageKey}`
}

export const getStringList = (storageKey: string) => {
  const storedValue = localStorage.getItem(getUserStorageKey(storageKey))

  if (!storedValue) return []

  try {
    const parsedValue = JSON.parse(storedValue)

    if (Array.isArray(parsedValue)) {
      return parsedValue.filter((value): value is string => typeof value === 'string')
    }
  } catch {
    return []
  }

  return []
}

export const storeStringList = (storageKey: string, values: string[]) => {
  localStorage.setItem(getUserStorageKey(storageKey), JSON.stringify(values))
}

export const getNumberSet = (storageKey: string) => {
  const storedValue = localStorage.getItem(getUserStorageKey(storageKey))

  if (!storedValue) return new Set<number>()

  try {
    const parsedValue = JSON.parse(storedValue)

    if (Array.isArray(parsedValue)) {
      return new Set(
        parsedValue.filter((value): value is number => typeof value === 'number'),
      )
    }
  } catch {
    return new Set<number>()
  }

  return new Set<number>()
}

export const storeNumberSet = (storageKey: string, values: Set<number>) => {
  localStorage.setItem(getUserStorageKey(storageKey), JSON.stringify(Array.from(values)))
}
