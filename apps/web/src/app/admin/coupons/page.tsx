import { Ticket } from 'lucide-react'

export default function AdminCouponsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">Coupons</h1>
        <p className="mt-1 text-sm text-muted">Manage discount codes</p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-alt">
          <Ticket className="h-10 w-10 text-subtle" />
        </div>
        <p className="mt-4 text-lg font-semibold text-charcoal">No coupons yet</p>
        <p className="text-sm text-muted">Create discount codes to attract customers</p>
      </div>
    </div>
  )
}
