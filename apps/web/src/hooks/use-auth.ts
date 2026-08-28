'use client'

import { useState, useEffect, useCallback } from 'react'
import { api, setAccessToken, getAccessToken } from '@/lib/api-client'

export interface AuthUser {
  id: string
  email: string | null
  phone: string | null
  firstName: string
  lastName: string
  role: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      setLoading(false)
      return
    }

    // Set a timeout so we don't hang forever if backend is slow
    let cancelled = false
    const timeout = setTimeout(() => {
      if (!cancelled) {
        setLoading(false)
      }
    }, 5000)

    api.get<{ user: AuthUser }>('/profile')
      .then((res) => {
        if (!cancelled && res?.user) {
          setUser(res.user)
        }
      })
      .catch(() => {
        // Token might be invalid — clear it
        if (!cancelled) setAccessToken(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
        clearTimeout(timeout)
      })

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ user: AuthUser; tokens: { accessToken: string; refreshToken: string } }>(
      '/auth/login', { email, password }, { skipAuth: true },
    )
    setAccessToken(res.tokens.accessToken)
    setUser(res.user)
    return res
  }, [])

  const register = useCallback(async (data: {
    email?: string; phone?: string; password: string; firstName: string; lastName: string
  }) => {
    const res = await api.post<{ user: AuthUser; tokens: { accessToken: string; refreshToken: string } }>(
      '/auth/register', data, { skipAuth: true },
    )
    setAccessToken(res.tokens.accessToken)
    setUser(res.user)
    return res
  }, [])

  const logout = useCallback(() => {
    setAccessToken(null)
    setUser(null)
  }, [])

  return { user, loading, login, register, logout }
}
