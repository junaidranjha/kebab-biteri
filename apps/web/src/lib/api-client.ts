'use client'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

// Token storage — localStorage for PWA
let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('kb_access_token', token)
    else localStorage.removeItem('kb_access_token')
  }
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('kb_access_token')
  }
  return accessToken
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: Record<string, unknown>,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  path: string,
  options?: RequestInit & { skipAuth?: boolean; timeout?: number },
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  }

  if (!options?.skipAuth) {
    const token = getAccessToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  // Add timeout via AbortController — default 10 seconds
  const timeoutMs = options?.timeout ?? 10000
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({ message: 'Something went wrong' }))
      throw new ApiError(body.message ?? 'Something went wrong', res.status, body.details)
    }

    return res.status === 204 ? (undefined as T) : res.json()
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new ApiError('Request timed out. Please try again.', 408)
    }
    throw err
  } finally {
    clearTimeout(timeoutId)
  }
}

export const api = {
  get: <T>(path: string, opts?: { skipAuth?: boolean; timeout?: number }) =>
    request<T>(path, { method: 'GET', skipAuth: opts?.skipAuth, timeout: opts?.timeout }),
  post: <T>(path: string, body?: unknown, opts?: { skipAuth?: boolean; timeout?: number }) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined, skipAuth: opts?.skipAuth, timeout: opts?.timeout }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
}
