import Link from 'next/link'
import { WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-alt">
        <WifiOff className="h-10 w-10 text-muted" />
      </div>
      <h1 className="mt-4 font-display text-xl font-bold text-charcoal">Sin conexión</h1>
      <p className="mt-1 text-sm text-muted">
        Parece que no tienes conexión a internet. Reconectaremos automáticamente cuando vuelva la señal.
      </p>
      <Link href="/" className="mt-6">
        <Button variant="outline">Reintentar</Button>
      </Link>
    </div>
  )
}
