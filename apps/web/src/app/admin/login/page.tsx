'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, ShieldAlert } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toaster'
import { api, setAccessToken, getAccessToken } from '@/lib/api-client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  useEffect(() => {
    // If already logged in as admin, redirect to dashboard
    const token = getAccessToken()
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.role === 'ADMIN' || payload.role === 'MANAGER') {
          router.push('/admin')
        }
      } catch {}
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Por favor introduce email y contraseña / Please enter email and password')
      return
    }

    setLoading(true)

    try {
      const res = await api.post<{ user: any; tokens: { accessToken: string } }>(
        '/auth/admin/login',
        { email: form.email, password: form.password },
        { skipAuth: true },
      )

      // Decode JWT token payload to strictly verify admin role
      const token = res.tokens.accessToken
      const payload = JSON.parse(atob(token.split('.')[1]))

      if (payload.role !== 'ADMIN' && payload.role !== 'MANAGER') {
        setError('Acceso denegado: Esta cuenta no tiene permisos de administrador. / Access denied: Only admin accounts can sign in.')
        setLoading(false)
        return
      }

      setAccessToken(token)
      localStorage.setItem('kb_admin_token', token)
      toast.success('Sesión de administrador iniciada / Admin logged in!')
      router.push('/admin')
    } catch (err: any) {
      const msg = err?.message || 'Credenciales de administrador no válidas / Invalid admin credentials'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-amber-50/40 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl border border-amber-200">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo size="lg" className="mb-3" />
          <h1 className="font-sans text-2xl font-black text-zinc-950">Panel de Administración</h1>
          <p className="mt-1 text-xs font-semibold text-zinc-500">
            Inicia sesión con credenciales de administrador
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2.5 rounded-2xl bg-red-50 p-3 text-xs font-bold text-red-700 border border-red-200">
            <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
            <input
              type="email"
              inputMode="email"
              placeholder="Email de administrador"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-12 w-full rounded-2xl border border-amber-300 bg-amber-50/20 pl-11 pr-4 text-sm font-semibold text-zinc-950 placeholder:text-zinc-400 focus:border-[#F4BE2C] focus:outline-none focus:ring-2 focus:ring-[#F4BE2C]/40"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
            <input
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="h-12 w-full rounded-2xl border border-amber-300 bg-amber-50/20 pl-11 pr-4 text-sm font-semibold text-zinc-950 placeholder:text-zinc-400 focus:border-[#F4BE2C] focus:outline-none focus:ring-2 focus:ring-[#F4BE2C]/40"
            />
          </div>

          <Button type="submit" size="xl" fullWidth loading={loading} disabled={loading} className="mt-4 font-black">
            {loading ? 'Iniciando sesión...' : <>Iniciar sesión <ArrowRight className="h-5 w-5" /></>}
          </Button>
        </form>

        <p className="mt-6 text-center">
          <Link href="/" className="text-xs font-bold text-zinc-500 hover:text-zinc-950 hover:underline">
            ← Volver a la tienda
          </Link>
        </p>
      </div>
    </div>
  )
}
