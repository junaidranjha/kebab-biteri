'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-xl font-bold text-charcoal">Something went wrong</h1>
      <p className="mt-1 text-sm text-muted">Please try again.</p>
      <Button className="mt-6" onClick={reset} size="lg">
        Try again
      </Button>
    </div>
  )
}
