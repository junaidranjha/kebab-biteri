'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight, Globe, Moon, Download, Trash2, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toaster'
import { useI18n } from '@/lib/i18n'

export default function SettingsPage() {
  const { locale, setLocale } = useI18n()
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="safe-top sticky top-0 z-20 bg-surface/95 px-4 pb-3 pt-3 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <Link href="/profile" className="touch-target -ml-2 flex items-center justify-center rounded-full">
            <ChevronLeft className="h-6 w-6 text-charcoal" />
          </Link>
          <h1 className="font-display text-xl font-extrabold text-charcoal">Settings</h1>
        </div>
      </header>

      <div className="flex-1 px-4 py-4 space-y-6">
        {/* Language */}
        <div>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-subtle">Language</h2>
          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
              <Globe className="h-5 w-5 text-muted" />
              <span className="flex-1 text-sm font-medium text-charcoal">Language de la app</span>
            </div>
            <div className="flex">
              <button
                onClick={() => setLocale('es-ES')}
                className={cn(
                  'flex-1 py-3 text-sm font-semibold',
                  locale === 'es-ES' ? 'bg-primary text-white' : 'text-muted',
                )}
              >
                🇪🇸 Spanish
              </button>
              <div className="w-px bg-border" />
              <button
                onClick={() => setLocale('en-US')}
                className={cn(
                  'flex-1 py-3 text-sm font-semibold',
                  locale === 'en-US' ? 'bg-primary text-white' : 'text-muted',
                )}
              >
                🇬🇧 English
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-subtle">Appearance</h2>
          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Moon className="h-5 w-5 text-muted" />
              <span className="flex-1 text-sm font-medium text-charcoal">Dark mode</span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={cn(
                  'relative h-6 w-11 rounded-full transition-colors',
                  darkMode ? 'bg-primary' : 'bg-border',
                )}
              >
                <span className={cn(
                  'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                  darkMode ? 'translate-x-[22px]' : 'translate-x-0.5',
                )} />
              </button>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-subtle">Data & privacy (GDPR)</h2>
          <div className="overflow-hidden rounded-2xl border border-border">
            <Link href="/profile/privacy" className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
              <Download className="h-5 w-5 text-muted" />
              <span className="flex-1 text-sm font-medium text-charcoal">Export my data</span>
              <ChevronRight className="h-5 w-5 text-subtle" />
            </Link>
            <button
              onClick={() => toast.info('Solicitud de eliminación enviada. Se procesará en 30 días.')}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-danger"
            >
              <Trash2 className="h-5 w-5" />
              <span className="flex-1 text-left text-sm font-medium">Remove mi cuenta</span>
              <ChevronRight className="h-5 w-5 text-subtle" />
            </button>
          </div>
        </div>

        {/* Logout */}
        <Button variant="outline" fullWidth onClick={() => toast.info('Sesión cerrada')}>
          <LogOut className="h-5 w-5" />
          Log out
        </Button>

        <p className="text-center text-xs text-subtle">Kebab Biteri v0.1.0</p>
      </div>
    </div>
  )
}
