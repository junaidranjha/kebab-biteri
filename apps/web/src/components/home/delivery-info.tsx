'use client'

import { useState } from 'react'
import { Clock, Truck, Phone, MapPin, Store, ExternalLink, X } from 'lucide-react'
import { restaurantInfo } from '@/data/menu-data'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'

export function DeliveryInfo() {
  const [showLocationModal, setShowLocationModal] = useState(false)
  const { t, locale } = useI18n()

  return (
    <>
      <section className="mx-4 mb-4 rounded-3xl bg-gradient-to-br from-[#FFFDF0] to-[#FFF9D6] p-5 border border-amber-300 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-sans text-base font-black text-zinc-950 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#E50909]" />
            {t('home.deliveryAndPickupTitle')}
          </h2>
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-1.5 rounded-full bg-[#F4BE2C] px-3 py-1 text-xs font-black text-zinc-950 shadow-xs hover:bg-amber-400 active:scale-95 transition-all"
          >
            <Store className="h-4 w-4" />
            <span>{t('home.pickupPoint')}</span>
          </button>
        </div>

        <div className="space-y-3">
          {/* Store & Pickup Location Banner */}
          <div className="flex items-start gap-3 rounded-2xl bg-white p-3.5 border border-amber-200 shadow-2xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F4BE2C] text-zinc-950 font-bold shadow-xs">
              <Store className="h-5 w-5 text-[#E50909]" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black uppercase text-zinc-950">{t('home.pickupLocationTitle')}</p>
              <p className="text-xs font-bold text-zinc-700">{restaurantInfo.name} · Calle Viteri 12, Errenteria</p>
              <button
                onClick={() => setShowLocationModal(true)}
                className="mt-1 text-xs font-black text-[#D99F16] hover:underline flex items-center gap-1"
              >
                <span>{t('home.viewMapAndDirections')}</span>
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4BE2C] text-zinc-950 font-bold shadow-sm">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-zinc-900">{t('home.serviceHoursTitle')}</p>
              <p className="text-xs font-semibold text-zinc-700">{t('home.serviceHoursValue')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-bold shadow-sm">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-emerald-800">{t('home.freeHomeDelivery')}</p>
              <p className="text-xs font-medium text-zinc-700">{t('home.minOrderRenteriaVal')}</p>
              <p className="text-xs font-medium text-zinc-700">{t('home.minOrderPasajesVal')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-[#F4BE2C] font-bold shadow-sm">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-zinc-900">{t('home.phoneContactTitle')}</p>
              <div className="flex gap-3 text-xs font-extrabold text-zinc-950">
                <a href={`tel:${restaurantInfo.phone1}`} className="hover:underline">{restaurantInfo.phone1}</a>
                <a href={`tel:${restaurantInfo.phone2}`} className="hover:underline">{restaurantInfo.phone2}</a>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4BE2C] text-zinc-950 font-bold shadow-sm">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-zinc-900">{t('home.paymentDeliveryTitle')}</p>
              <p className="text-xs font-medium text-zinc-700">{t('home.paymentDeliveryVal')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Store Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowLocationModal(false)}>
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs" />
          <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-amber-300 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F4BE2C] text-zinc-950 shadow-xs">
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-sans text-xl font-black text-zinc-950">{t('home.pickupLocationTitle')}</h2>
                  <p className="text-xs font-semibold text-zinc-500">{restaurantInfo.name} · Errenteria</p>
                </div>
              </div>
              <button onClick={() => setShowLocationModal(false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-amber-100">
                <X className="h-5 w-5 text-zinc-950" />
              </button>
            </div>

            <div className="space-y-2.5 rounded-2xl bg-amber-50/80 p-4 border border-amber-200 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 shrink-0 text-[#E50909] mt-0.5" />
                <div>
                  <p className="font-black text-zinc-950 text-sm">{restaurantInfo.name}</p>
                  <p className="font-semibold text-zinc-700">Calle Viteri 12, 20100 Errenteria, Gipuzkoa</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 font-bold text-zinc-800 pt-1">
                <Phone className="h-4 w-4 text-[#D99F16]" />
                <span>Tel: {restaurantInfo.phone1} / {restaurantInfo.phone2}</span>
              </div>
              <div className="flex items-center gap-2.5 font-bold text-zinc-800">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span>{t('home.serviceHoursTitle')}: {t('home.serviceHoursValue')}</span>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-amber-300 shadow-2xs">
              <iframe
                width="100%"
                height="200"
                loading="lazy"
                src="https://www.google.com/maps?q=Kebab+Biteri+Errenteria+Gipuzkoa&output=embed"
                className="border-0"
                title="Kebab Biteri Google Maps location"
              />
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Kebab+Biteri+Errenteria+Gipuzkoa"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" fullWidth className="font-black gap-2">
                <ExternalLink className="h-4 w-4" />
                <span>{locale === 'es-ES' ? 'Abrir en Google Maps' : 'Open in Google Maps'}</span>
              </Button>
            </a>
          </div>
        </div>
      )}
    </>
  )
}
