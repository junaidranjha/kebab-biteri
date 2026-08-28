'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { QrCode, Smartphone, Download, Check, Sparkles, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PwaQrCard() {
  const [appUrl, setAppUrl] = useState('')
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}?utm_source=qr_install`
      setAppUrl(url)

      // Detect iOS
      const userAgent = window.navigator.userAgent.toLowerCase()
      setIsIOS(/iphone|ipad|ipod/.test(userAgent))

      // Check if installed in standalone mode
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
      }

      const handler = (e: Event) => {
        e.preventDefault()
        setDeferredPrompt(e as BeforeInstallPromptEvent)
      }

      const installedHandler = () => {
        setIsInstalled(true)
      }

      window.addEventListener('beforeinstallprompt', handler)
      window.addEventListener('appinstalled', installedHandler)

      return () => {
        window.removeEventListener('beforeinstallprompt', handler)
        window.removeEventListener('appinstalled', installedHandler)
      }
    }
  }, [])

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true)
      return
    }
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      if (choice.outcome === 'accepted') {
        setIsInstalled(true)
      }
      setDeferredPrompt(null)
    } else {
      setShowIOSInstructions(true)
    }
  }

  const handleCopyLink = () => {
    if (appUrl) {
      navigator.clipboard.writeText(appUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const qrImageUrl = appUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(appUrl)}&color=d92b2b&bgcolor=ffffff&margin=1`
    : ''

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 p-5 shadow-xl text-white">
      {/* Background glowing ambient light */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-saffron/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <QrCode className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display text-base font-extrabold text-white">Instala la App</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-saffron uppercase">
                  <Sparkles className="h-3 w-3" /> PWA
                </span>
              </div>
              <p className="text-xs text-white/70">Escanea con tu cámara para instalar en tu móvil</p>
            </div>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-5 rounded-2xl bg-white/5 p-4 backdrop-blur-md border border-white/10">
          <div className="relative flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-lg">
            {qrImageUrl ? (
              <Image
                src={qrImageUrl}
                alt="QR Code para instalar Kebab Biteri PWA"
                width={150}
                height={150}
                className="h-full w-full object-contain"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-charcoal">
                <QrCode className="h-10 w-10 animate-pulse text-primary" />
              </div>
            )}
            <div className="absolute inset-0 pointer-events-none rounded-2xl border border-primary/30" />
          </div>

          <div className="flex flex-1 flex-col justify-center text-center sm:text-left">
            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-semibold text-saffron">
                <Smartphone className="h-4 w-4" />
                <span>Acceso directo sin tienda de apps</span>
              </div>
              <p className="text-xs leading-relaxed text-white/80">
                Escanea el código QR desde tu smartphone. Abre automáticamente **Kebab Biteri** y te permite instalar la App en tu pantalla de inicio en 1 segundo.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
              {isInstalled ? (
                <div className="flex items-center gap-2 rounded-xl bg-success/20 px-3 py-2 text-xs font-bold text-success">
                  <Check className="h-4 w-4" /> App Instalada en este dispositivo
                </div>
              ) : (
                <Button
                  onClick={handleInstallClick}
                  size="sm"
                  className="bg-primary text-white hover:bg-primary-dark font-bold gap-2"
                >
                  <Download className="h-4 w-4" />
                  Instalar en este dispositivo
                </Button>
              )}

              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20 font-medium gap-1.5"
              >
                {copied ? <Check className="h-4 w-4 text-success" /> : <Share2 className="h-4 w-4" />}
                {copied ? '¡Copiado!' : 'Copiar Enlace'}
              </Button>
            </div>
          </div>
        </div>

        {/* Modal / Instructions for iOS / Manual installation */}
        {showIOSInstructions && (
          <div className="mt-3 rounded-xl bg-saffron/15 border border-saffron/30 p-3 text-xs text-saffron-light">
            <p className="font-bold">💡 Cómo instalar en tu pantalla de inicio:</p>
            <ol className="mt-1 space-y-1 pl-4 list-decimal text-white/90">
              <li>Abre esta página en el navegador de tu móvil (Safari en iPhone o Chrome en Android).</li>
              <li>Pulsa el botón <strong>Compartir / Menú (⋮)</strong>.</li>
              <li>Selecciona <strong>&quot;Añadir a la pantalla de inicio&quot;</strong>.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
