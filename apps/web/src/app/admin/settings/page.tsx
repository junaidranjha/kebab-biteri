import { Settings, Store, Bell, CreditCard, Globe, Shield } from 'lucide-react'

const settingsSections = [
  { icon: Store, title: 'Restaurant info', desc: 'Name, logo, brand colors' },
  { icon: CreditCard, title: 'Payments', desc: 'Stripe, Redsys, Bizum configuration' },
  { icon: Bell, title: 'Notifications', desc: 'Firebase Cloud Messaging, templates' },
  { icon: Globe, title: 'Language & region', desc: 'English (default), Spanish' },
  { icon: Shield, title: 'Security & privacy', desc: 'GDPR, consent, data management' },
]

export default function AdminSettingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">Settings</h1>
        <p className="mt-1 text-sm text-muted">Manage your restaurant configuration</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {settingsSections.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.title} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-charcoal">{s.title}</p>
                <p className="text-sm text-muted">{s.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
