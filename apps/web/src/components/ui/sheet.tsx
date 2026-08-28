'use client'

import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function Sheet({ open, onClose, title, children, className }: SheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal-900/50 animate-fade-in"
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        className={cn(
          'relative max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-surface shadow-2xl animate-slide-up',
          className,
        )}
      >
        {/* Grab handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1.5 w-10 rounded-full bg-charcoal-200" />
        </div>
        {title && (
          <div className="flex items-center justify-between px-5 pb-3 pt-2">
            <h2 className="font-display text-lg font-bold text-charcoal">{title}</h2>
            <button onClick={onClose} className="touch-target -mr-2 flex items-center justify-center rounded-full text-muted">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="px-5 pb-8 safe-bottom">{children}</div>
      </div>
    </div>
  )
}
