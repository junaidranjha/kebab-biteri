import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-6xl font-extrabold text-primary">404</p>
      <h1 className="mt-2 font-display text-xl font-bold text-charcoal">Page not found</h1>
      <p className="mt-1 text-sm text-muted">The page you're looking for doesn't exist or has moved.</p>
      <Link href="/" className="mt-6">
        <Button size="lg">Back to home</Button>
      </Link>
    </div>
  )
}
