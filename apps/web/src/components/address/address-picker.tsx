'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, Search, LocateFixed, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/toaster'
import { api } from '@/lib/api-client'

export interface SelectedAddress {
  label: string
  street: string
  city: string
  postalCode: string
  lat: number
  lng: number
}

interface AddressPickerProps {
  onSelect: (address: SelectedAddress) => void
  initialAddress?: string
}

export function AddressPicker({ onSelect, initialAddress }: AddressPickerProps) {
  const [query, setQuery] = useState(initialAddress ?? '')
  const [selected, setSelected] = useState<SelectedAddress | null>(null)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])

  // Fetch saved addresses on mount
  useEffect(() => {
    api.get('/addresses').then((res: any) => {
      if (Array.isArray(res)) setSavedAddresses(res)
    }).catch(() => {})
  }, [])

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      toast.error('Geolocalización no disponible en este dispositivo')
      return
    }

    setLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const addr: SelectedAddress = {
          label: 'Ubicación actual',
          street: `Ubicación detectada (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          city: 'Madrid',
          postalCode: '',
          lat: latitude,
          lng: longitude,
        }
        setSelected(addr)
        setQuery(addr.street)
        setLoadingLocation(false)
        toast.success('Ubicación detectada')
      },
      (err) => {
        toast.error('Could not get your location: ' + err.message)
        setLoadingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  const handleManualEntry = () => {
    if (query.trim().length < 5) {
      toast.error('Introduce una dirección completa')
      return
    }
    const addr: SelectedAddress = {
      label: 'Dirección personalizada',
      street: query.trim(),
      city: 'Madrid',
      postalCode: '',
      lat: 40.42,
      lng: -3.70,
    }
    setSelected(addr)
  }

  return (
    <div className="space-y-3">
      {/* Manual address input */}
      <div className="relative">
        <MapPin className="absolute left-3.5 top-3.5 h-5 w-5 text-subtle" />
        <input
          type="text"
          placeholder="Introduce tu dirección completa…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 w-full rounded-xl border border-border bg-surface-alt pl-11 pr-10 text-sm text-charcoal placeholder:text-subtle focus:border-primary focus:outline-none"
        />
        {query && (
          <button onClick={() => { setQuery(''); setSelected(null) }} className="absolute right-3 top-3 text-subtle">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <Button variant="outline" fullWidth onClick={handleManualEntry} disabled={query.trim().length < 5}>
        <Search className="h-4 w-4" /> Confirmar dirección
      </Button>

      {/* Current location button */}
      <button onClick={handleUseCurrentLocation} disabled={loadingLocation}
        className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary-5 px-4 py-3 text-left active:scale-[0.99]">
        <LocateFixed className={cn('h-5 w-5 text-primary', loadingLocation && 'animate-spin')} />
        <span className="text-sm font-semibold text-primary">
          {loadingLocation ? 'Detectando ubicación…' : 'Use my current location (GPS)'}
        </span>
      </button>

      {/* Saved addresses */}
      {savedAddresses.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-subtle">Addresses guardadas</p>
          <div className="space-y-2">
            {savedAddresses.map((addr: any) => (
              <button key={addr._id} onClick={() => {
                setSelected({ label: addr.label, street: addr.street, city: addr.city, postalCode: addr.postalCode, lat: addr.lat, lng: addr.lng })
                setQuery(`${addr.street}, ${addr.city} ${addr.postalCode}`)
              }} className="flex w-full items-start gap-3 rounded-xl border border-border p-3 text-left active:bg-surface-alt">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-charcoal">{addr.label}</p>
                  <p className="text-xs text-muted">{addr.street}, {addr.city} {addr.postalCode}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected address confirmation */}
      {selected && (
        <div className="rounded-xl border-2 border-success/30 bg-success/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-white">
              <Check className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-charcoal">Dirección seleccionada</p>
              <p className="text-sm text-muted">{selected.street}, {selected.city} {selected.postalCode}</p>
              {selected.lat && <p className="mt-1 text-xs text-subtle">Coordenadas: {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}</p>}
            </div>
          </div>
          <Button size="sm" fullWidth className="mt-3" onClick={() => onSelect(selected)}>Confirmar dirección</Button>
        </div>
      )}
    </div>
  )
}
