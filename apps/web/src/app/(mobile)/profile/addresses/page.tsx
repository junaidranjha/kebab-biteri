'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Plus, MapPin, Home, Briefcase, Star, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { AddressPicker, type SelectedAddress } from '@/components/address/address-picker'
import { useAddresses } from '@/hooks/use-addresses'

const labelIcons: Record<string, typeof Home> = { Casa: Home, Trabajo: Briefcase }

export default function AddressesPage() {
  const { addresses, loading, create, remove } = useAddresses()
  const [showAdd, setShowAdd] = useState(false)

  const handleAdd = async (addr: SelectedAddress) => {
    try {
      await create({ label: addr.label, street: addr.street, city: addr.city, postalCode: addr.postalCode, country: 'España', lat: addr.lat, lng: addr.lng })
      setShowAdd(false)
    } catch (e: any) {
      // Error handled in hook
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="safe-top sticky top-0 z-20 bg-surface/95 px-4 pb-3 pt-3 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/profile" className="touch-target -ml-2 flex items-center justify-center rounded-full"><ChevronLeft className="h-6 w-6 text-charcoal" /></Link>
            <h1 className="font-display text-xl font-extrabold text-charcoal">Addresses</h1>
          </div>
          <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4" /> Add</Button>
        </div>
      </header>

      <div className="flex-1 px-4 py-4">
        {loading ? (
          <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MapPin className="h-16 w-16 text-subtle" />
            <p className="mt-4 text-lg font-semibold text-charcoal">No addresses</p>
            <p className="mt-1 text-sm text-muted">Add an address for your orders</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => {
              const Icon = labelIcons[addr.label] ?? MapPin
              return (
                <div key={addr._id} className={`card-app p-4 ${addr.isDefault ? 'border-2 border-primary' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-alt"><Icon className="h-5 w-5 text-charcoal" /></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-charcoal">{addr.label}</p>
                        {addr.isDefault && <span className="flex items-center gap-1 text-xs font-semibold text-primary"><Star className="h-3 w-3 fill-primary" /> Predeterminada</span>}
                      </div>
                      <p className="mt-0.5 text-sm text-muted">{addr.street}</p>
                      <p className="text-sm text-muted">{addr.city} · {addr.postalCode}</p>
                    </div>
                    <button onClick={() => remove(addr._id)} className="touch-target text-subtle"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Sheet open={showAdd} onClose={() => setShowAdd(false)} title="New address">
        <AddressPicker onSelect={handleAdd} />
      </Sheet>
    </div>
  )
}
