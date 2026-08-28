import { GeoPoint } from './common'

export interface Address {
  id: string
  label: string
  street: string
  city: string
  postalCode: string
  country: string
  lat: number
  lng: number
  instructions: string | null
  isDefault: boolean
  createdAt: string
}

export interface CreateAddressDto {
  label: string
  street: string
  city: string
  postalCode: string
  country?: string
  lat: number
  lng: number
  instructions?: string
  isDefault?: boolean
}
