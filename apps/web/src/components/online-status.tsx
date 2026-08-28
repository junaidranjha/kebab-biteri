'use client'

import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

export function OnlineStatus() {
  const [online, setOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    setOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (online) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[60] app-container bg-warning/90 px-4 py-2 text-center text-sm font-medium text-charcoal-900 safe-top">
      <span className="inline-flex items-center gap-2">
        <WifiOff className="h-4 w-4" />
        Sin conexión. Reconectando automáticamente…
      </span>
    </div>
  )
}
