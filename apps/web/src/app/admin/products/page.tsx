'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'
import { products, categories } from '@/data/menu-data'

export default function AdminProductsPage() {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = products.filter(p => {
    const catMatch = filter === 'all' || p.categoryId === filter
    const queryMatch = !query || p.name.toLowerCase().includes(query.toLowerCase())
    return catMatch && queryMatch
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">Products</h1>
        <p className="mt-1 text-sm text-muted">{products.length} total products</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
        <input
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 w-full rounded-lg border border-border bg-surface pl-10 pr-4 text-sm text-charcoal placeholder:text-subtle focus:border-primary focus:outline-none"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilter('all')}
          className={cn('shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold', filter === 'all' ? 'bg-primary text-white' : 'bg-surface-alt text-muted')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={cn('shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold', filter === cat.id ? 'bg-primary text-white' : 'bg-surface-alt text-muted')}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-charcoal">{p.name}</p>
                <p className="text-xs text-muted">{p.category}</p>
              </div>
              {p.isNew && (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">NEW</span>
              )}
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-muted">{p.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-bold text-primary">
                {formatPrice(p.basePrice)}{p.priceUnit ? `/${p.priceUnit}` : ''}
              </span>
              <span className={cn('rounded-md px-2 py-0.5 text-xs font-semibold', p.isPopular ? 'bg-saffron/10 text-saffron-dark' : 'text-muted')}>
                {p.isPopular ? '★ Popular' : '—'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
