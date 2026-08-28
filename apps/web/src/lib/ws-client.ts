'use client'

import { io, Socket } from 'socket.io-client'

const sockets = new Map<string, Socket>()

export function getSocket(): Socket | null {
  return getSocketForRole('user')
}

export function getAdminSocket(): Socket | null {
  return getSocketForRole('admin')
}

function getSocketForRole(type: 'user' | 'admin'): Socket | null {
  if (typeof window === 'undefined') return null

  const existing = sockets.get(type)
  if (existing?.connected) return existing

  if (existing) {
    existing.disconnect()
    sockets.delete(type)
  }

  const token = localStorage.getItem('kb_access_token')
  let userId: string | undefined
  let role: string | undefined

  try {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]))
      userId = payload.sub
      role = payload.role
    }
  } catch {}

  const wsUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:3001'

  const auth = type === 'admin'
    ? { userId, role, isAdmin: true }
    : { userId, role }

  const socket = io(wsUrl, {
    auth,
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: Infinity,
  })

  socket.on('connect', () => {
    console.log(`[WS:${type}] Connected`, auth)
  })

  socket.on('disconnect', () => {
    console.log(`[WS:${type}] Disconnected`)
  })

  socket.on('connect_error', (err) => {
    console.log(`[WS:${type}] Connection error:`, err.message)
  })

  sockets.set(type, socket)
  return socket
}

export function disconnectSocket() {
  for (const [key, socket] of sockets) {
    socket.disconnect()
    sockets.delete(key)
  }
}
