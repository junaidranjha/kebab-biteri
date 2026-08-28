'use client'

import { useEffect, useState, useRef } from 'react'

interface TrackingMapProps {
  deliveryAddress: string
  status: string
  orderType: string
}

const RESTAURANT = {
  lat: 43.3125,
  lng: -1.8990,
  name: 'Kebab Biteri',
}

export function TrackingMap({ deliveryAddress, status, orderType }: TrackingMapProps) {
  const [riderPos, setRiderPos] = useState<{ lat: number; lng: number }>(RESTAURANT)
  const [customerPos, setCustomerPos] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const animRef = useRef<number | null>(null)

  const showMap = orderType === 'DELIVERY' &&
    ['ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(status)
  const showRider = status === 'OUT_FOR_DELIVERY'

  useEffect(() => {
    if (!showMap || !deliveryAddress) {
      setLoading(false)
      return
    }
    const offset = 0.018 + Math.random() * 0.01
    setCustomerPos({
      lat: RESTAURANT.lat + offset,
      lng: RESTAURANT.lng + (Math.random() * 0.02 - 0.01),
    })
    setLoading(false)
  }, [showMap, deliveryAddress])

  useEffect(() => {
    if (!showRider || !customerPos) return
    const startLat = RESTAURANT.lat
    const startLng = RESTAURANT.lng
    const endLat = customerPos.lat
    const endLng = customerPos.lng
    const duration = 45000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const lat = startLat + (endLat - startLat) * progress
      const lng = startLng + (endLng - startLng) * progress
      setRiderPos({ lat, lng })
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      }
    }
    animRef.current = requestAnimationFrame(animate)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [showRider, customerPos])

  if (!showMap || loading) return null

  const mapSrc = `https://maps.google.com/maps?width=100%25&height=300&hl=en&q=${encodeURIComponent(deliveryAddress)}&t=&z=14&ie=UTF8&iwloc=B&output=embed`

  return (
    <div className="mb-4 rounded-2xl border border-border overflow-hidden">
      <div className="flex items-center gap-2 bg-primary px-4 py-2">
        <div className="flex items-center gap-2 text-white">
          {showRider ? (
            <>
              <span className="flex h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
              <span className="text-sm font-bold">Rider is on the way!</span>
            </>
          ) : status === 'DELIVERED' ? (
            <span className="text-sm font-bold">✓ Delivered</span>
          ) : (
            <span className="text-sm font-bold">Preparing your order</span>
          )}
        </div>
      </div>

      <div className="relative h-64 w-full bg-surface-alt">
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          src={mapSrc}
          className="border-0"
          title="Delivery tracking map"
        />
      </div>

      <div className="flex items-center justify-between p-3 bg-surface-alt">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">R</div>
          <div>
            <p className="text-xs font-semibold text-charcoal">Restaurant</p>
            <p className="text-[10px] text-muted">Kebab Biteri</p>
          </div>
        </div>

        {showRider && (
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold animate-bounce">D</div>
            <p className="mt-1 text-[10px] font-semibold text-green-600">Rider</p>
          </div>
        )}

        {customerPos && (
          <div className="flex items-center gap-2">
            <div>
              <p className="text-xs font-semibold text-charcoal text-right">You</p>
              <p className="text-[10px] text-muted text-right max-w-24 truncate">{deliveryAddress}</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">C</div>
          </div>
        )}
      </div>

      {showRider && (
        <div className="flex items-center justify-center gap-2 py-2 bg-surface">
          <span className="text-xs text-muted">📍 Estimated arrival:</span>
          <span className="text-xs font-bold text-primary">~15-20 min</span>
        </div>
      )}
    </div>
  )
}
