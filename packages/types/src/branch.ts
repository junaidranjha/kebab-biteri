export interface Branch {
  id: string
  name: string
  slug: string
  street: string
  city: string
  postalCode: string
  lat: number
  lng: number
  phone: string
  deliveryRadiusKm: number
  deliveryFee: number
  minOrderAmount: number
  avgPrepTimeMin: number
  isActive: boolean
  openingHours: OpeningHour[]
  isOpen: boolean
}

export interface OpeningHour {
  dayOfWeek: number // 0=Sun ... 6=Sat
  openTime: string // "11:00"
  closeTime: string // "23:00"
  closed: boolean
}
