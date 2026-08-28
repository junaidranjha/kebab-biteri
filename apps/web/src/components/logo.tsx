import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

// Kebab Biteri logo — black roof/house shape with red kebab skewer
export function Logo({ className, showText = true, size = 'md', lightText = false }: LogoProps & { lightText?: boolean }) {
  const sizes = {
    sm: { box: 'h-8 w-8', text: 'text-base font-black' },
    md: { box: 'h-10 w-10', text: 'text-lg font-black' },
    lg: { box: 'h-14 w-14', text: 'text-2xl font-black' },
  }
  const s = sizes[size]

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* Circular Logo mark matching brand badge */}
      <div className={cn(s.box, 'shrink-0 rounded-full bg-white border-2 border-zinc-900 shadow-sm flex items-center justify-center overflow-hidden p-1')}>
        <svg
          viewBox="0 0 48 48"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* House outline — dark charcoal */}
          <path
            d="M24 6 L8 18 L13 18 L13 40 L35 40 L35 18 L40 18 Z"
            stroke="#18181B"
            strokeWidth="3.5"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Doner Spit Center Axis */}
          <line x1="24" y1="12" x2="24" y2="38" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Kebab Meat Layers (Red Doner Cone) */}
          <path d="M17 18 C17 16.5, 31 16.5, 31 18 L29 24 L19 24 Z" fill="#E50909" />
          <path d="M18.5 25 L29.5 25 L28 31 L20 31 Z" fill="#E50909" />
          <path d="M20 32 L28 32 L26.5 37 L21.5 37 Z" fill="#E50909" />
          {/* Flame icon accent */}
          <path d="M24 10 Q22 13 24 15 Q26 13 24 10 Z" fill="#F4BE2C" />
        </svg>
      </div>
      {showText && (
        <div className="leading-none">
          <p className={cn('tracking-tight font-extrabold italic font-sans', lightText ? 'text-white' : 'text-zinc-900', s.text)}>
            Kebab Biteri
          </p>
        </div>
      )}
    </div>
  )
}

// Compact logo mark only (no text)
export function LogoMark({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  return <Logo className={className} showText={false} size={size} />
}
