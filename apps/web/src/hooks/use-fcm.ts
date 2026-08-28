'use client'

import { useEffect, useState, useCallback } from 'react'
import { api } from '@/lib/api-client'

// Hook for Firebase Cloud Messaging push notification token registration
// In production: import { getMessaging, getToken, onMessage } from 'firebase/messaging'

export function useFcm() {
  const [token, setToken] = useState<string | null>(null)
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('Notification' in window)) return
    setPermission(Notification.permission)
  }, [])

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return null
    }

    const result = await Notification.requestPermission()
    setPermission(result)

    if (result !== 'granted') return null

    // In production: use Firebase Messaging to get the FCM token
    // const messaging = getMessaging()
    // const fcmToken = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY })
    
    // Register the token with our backend so it can send push notifications
    try {
      // Get a unique device token (in production this comes from Firebase)
      const deviceId = `dev_${navigator.userAgent.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '')}_${Date.now()}`
      
      // Send the token to our API so the server can send push notifications to this device
      await api.patch('/profile', { fcmToken: deviceId }).catch(() => {
        // User may not be logged in — that's ok, we'll register later
      })
      
      setToken(deviceId)
      return deviceId
    } catch (e) {
      return null
    }
  }, [])

  return { token, permission, requestPermission }
}
