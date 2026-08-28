'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Mail, Lock, ArrowRight, AlertCircle, User as UserIcon } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toaster'
import { useAuth } from '@/hooks/use-auth'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/profile'
  const { login, register, user } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' })

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(redirect)
    }
  }, [user, router, redirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        if (!form.email) {
          setError('Please enter your email')
          setLoading(false)
          return
        }
        if (!form.password) {
          setError('Please enter your password')
          setLoading(false)
          return
        }
        await login(form.email, form.password)
        toast.success('Logged in!')
      } else {
        if (!form.firstName || !form.lastName || !form.email || !form.password) {
          setError('Please fill in all fields')
          setLoading(false)
          return
        }
        await register(form)
        toast.success('Account created!')
      }
      // Navigate after successful auth
      router.push(redirect)
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="safe-top sticky top-0 z-20 bg-surface/95 px-4 pb-3 pt-3 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <Link href="/" className="touch-target -ml-2 flex items-center justify-center rounded-full">
            <ChevronLeft className="h-6 w-6 text-charcoal" />
          </Link>
          <h1 className="font-display text-xl font-extrabold text-charcoal">{mode === 'login' ? 'Log in' : 'Sign up'}</h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col px-5 py-6">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size="lg" className="mb-2" />
          <h2 className="mt-2 font-display text-2xl font-extrabold text-charcoal">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-sm text-muted">Order authentic kebab online</p>
        </div>

        {error && (
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-danger/10 p-3 text-sm text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3.5 h-5 w-5 text-subtle" />
                <input type="text" placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="h-12 w-full rounded-xl border border-border bg-surface-alt pl-11 pr-4 text-sm text-charcoal placeholder:text-subtle focus:border-primary focus:outline-none" />
              </div>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3.5 h-5 w-5 text-subtle" />
                <input type="text" placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="h-12 w-full rounded-xl border border-border bg-surface-alt pl-11 pr-4 text-sm text-charcoal placeholder:text-subtle focus:border-primary focus:outline-none" />
              </div>
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-subtle" />
            <input type="email" inputMode="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-12 w-full rounded-xl border border-border bg-surface-alt pl-11 pr-4 text-sm text-charcoal placeholder:text-subtle focus:border-primary focus:outline-none" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-subtle" />
            <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="h-12 w-full rounded-xl border border-border bg-surface-alt pl-11 pr-4 text-sm text-charcoal placeholder:text-subtle focus:border-primary focus:outline-none" />
          </div>
          <Button type="submit" size="xl" fullWidth loading={loading} disabled={loading} className="mt-4">
            {loading
              ? (mode === 'login' ? 'Logging in...' : 'Creating account...')
              : <>{mode === 'login' ? 'Log in' : 'Sign up'} <ArrowRight className="h-5 w-5" /></>
            }
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }} className="font-semibold text-primary">
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
        <p className="mt-4 text-center text-xs text-subtle">
          By continuing, you agree to our <Link href="/terms" className="text-primary">Terms</Link> and <Link href="/privacy" className="text-primary">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
