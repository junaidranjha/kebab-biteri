'use client'

import { useState, useEffect } from 'react'
import type { MenuResponse, Product } from '@kebab-biteri/types'
import { menuData, getProductBySlug, getPopularProducts } from '@/data/menu-data'

function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = [], options?: { enabled?: boolean }) {
  const [data, setData] = useState<T | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (options?.enabled === false) return
    let cancelled = false
    setIsLoading(true)
    fn()
      .then((result: T) => { if (!cancelled) { setData(result); setIsLoading(false) } })
      .catch((err: unknown) => { if (!cancelled) { setError(err as Error); setIsLoading(false) } })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, isLoading, error }
}

export function useMenu() {
  // Return static data directly — no API call needed
  const [data, setData] = useState<MenuResponse | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate brief loading for smooth UX
    const timer = setTimeout(() => {
      setData(menuData)
      setIsLoading(false)
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  return { data, isLoading }
}

export function useProduct(slug: string) {
  return useAsync<Product>(
    () => Promise.resolve((getProductBySlug(slug) as unknown as Product) ?? null),
    ['product', slug],
    { enabled: !!slug },
  )
}

export function usePopularProducts() {
  return useAsync<Product[]>(
    () => Promise.resolve(getPopularProducts() as unknown as Product[]),
    ['products', 'popular'],
  )
}

export function useCategories() {
  return useAsync<unknown[]>(
    () => Promise.resolve(menuData.categories),
    ['categories'],
  )
}

export function useBranches() {
  return useAsync<unknown[]>(
    () => Promise.resolve([]),
    ['branches'],
  )
}
