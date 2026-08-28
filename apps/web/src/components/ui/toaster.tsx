'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastVariant = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  variant: ToastVariant
}

// Simple toast store — no external dep
let toastQueue: Toast[] = []
let listeners: Array<(toasts: Toast[]) => void> = []

function notify() {
  listeners.forEach((l) => l([...toastQueue]))
}

export const toast = {
  success: (message: string) => pushToast(message, 'success'),
  error: (message: string) => pushToast(message, 'error'),
  info: (message: string) => pushToast(message, 'info'),
}

function pushToast(message: string, variant: ToastVariant) {
  const id = Math.random().toString(36).slice(2)
  toastQueue = [...toastQueue, { id, message, variant }]
  notify()
  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== id)
    notify()
  }, 3500)
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const colors = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-info',
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    listeners.push(setToasts)
    return () => {
      listeners = listeners.filter((l) => l !== setToasts)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-center gap-2 p-4 safe-top">
      {toasts.map((t) => {
        const Icon = icons[t.variant]
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex w-full app-container items-center gap-3 rounded-xl bg-charcoal-800 px-4 py-3 text-white shadow-lg animate-slide-up"
          >
            <Icon className={cn('h-5 w-5 shrink-0', colors[t.variant])} />
            <span className="flex-1 text-sm font-medium">{t.message}</span>
            <button
              onClick={() => {
                toastQueue = toastQueue.filter((x) => x.id !== t.id)
                notify()
              }}
              className="shrink-0 text-white/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
