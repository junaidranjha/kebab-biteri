'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'
import { getAccessToken } from '@/lib/api-client'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // Don't redirect if already on the login page
    if (pathname === '/admin/login') {
      setAuthChecked(true)
      return
    }

    const token = getAccessToken()
    if (!token) {
      router.push('/admin/login')
      return
    }

    // Check if token has admin role
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.role !== 'ADMIN' && payload.role !== 'MANAGER') {
        router.push('/admin/login')
        return
      }
    } catch {
      router.push('/admin/login')
      return
    }

    setAuthChecked(true)
  }, [router, pathname])

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface-alt">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  // Login page renders without the sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-dvh bg-surface-alt">
      <AdminSidebar />
      <div className="flex flex-1 flex-col lg:ml-64">
        <AdminHeader />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
