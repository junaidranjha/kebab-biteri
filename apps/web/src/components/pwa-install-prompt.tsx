'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('kb-install-dismissed')
    if (dismissed === 'true') return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show prompt after 3 seconds (don't interrupt immediately)
      setTimeout(() => setShowPrompt(true), 3000)
    }

    const installedHandler = () => {
      setInstalled(true)
      setShowPrompt(false)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', installedHandler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') {
      setInstalled(true)
    }
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('kb-install-dismissed', 'true')
  }

  if (!showPrompt || installed) return null

  return (
    <div className="fixed inset-x-0 bottom-20 z-50 app-container px-4 animate-slide-up">
      <div className="flex items-center gap-3 rounded-2xl bg-charcoal-800 p-4 shadow-2xl">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-2xl">
          🌯
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">Instala Kebab Biteri</p>
          <p className="text-xs text-white/70">Accede más rápido desde tu pantalla de inicio</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleDismiss} className="touch-target flex items-center justify-center text-white/50">
            <X className="h-5 w-5" />
          </button>
          <Button size="sm" onClick={handleInstall}>
            <Download className="h-4 w-4" />
            Instalar
          </Button>
        </div>
      </div>
    </div>
  )
}
