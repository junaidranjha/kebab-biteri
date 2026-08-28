'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api-client'

export interface Address {
  _id: string
  label: string
  street: string
  city: string
  postalCode: string
  country: string
  lat: number
  lng: number
  instructions?: string
  isDefault: boolean
}

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await api.get('/addresses')
      // Ensure we always set an array
      if (Array.isArray(res)) {
        setAddresses(res)
      } else {
        setAddresses([])
      }
    } catch (e) {
      // Not logged in or API error — keep empty array
      setAddresses([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAddresses() }, [fetchAddresses])

  const create = useCallback(async (data: Omit<Address, '_id' | 'isDefault'> & { isDefault?: boolean }) => {
    const res = await api.post<Address>('/addresses', data)
    await fetchAddresses()
    return res
  }, [fetchAddresses])

  const update = useCallback(async (id: string, data: Partial<Address>) => {
    const res = await api.patch<Address>(`/addresses/${id}`, data)
    await fetchAddresses()
    return res
  }, [fetchAddresses])

  const remove = useCallback(async (id: string) => {
    await api.delete(`/addresses/${id}`)
    await fetchAddresses()
  }, [fetchAddresses])

  return { addresses, loading, create, update, remove, refetch: fetchAddresses }
}
