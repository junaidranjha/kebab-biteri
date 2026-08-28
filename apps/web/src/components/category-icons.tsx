import { Flame, Utensils, UtensilsCrossed, Pizza, Leaf, CookingPot, Sparkles, CupSoda, Star, Zap } from 'lucide-react'

export function CategoryIcon({ slug, className = "h-6 w-6" }: { slug: string; className?: string }) {
  switch (slug) {
    case 'doner-kebab':
      return <Flame className={`${className} text-[#E50909]`} />
    case 'doner-durum':
      return <Utensils className={`${className} text-[#D99F16]`} />
    case 'hamburguesa':
      return <UtensilsCrossed className={`${className} text-amber-700`} />
    case 'wrap':
      return <Utensils className={`${className} text-[#D99F16]`} />
    case 'lahmacun':
      return <Pizza className={`${className} text-[#E50909]`} />
    case 'ensaladas':
      return <Leaf className={`${className} text-emerald-600`} />
    case 'platos-menus':
      return <CookingPot className={`${className} text-[#D99F16]`} />
    case 'raciones':
      return <Sparkles className={`${className} text-amber-500`} />
    case 'bebidas':
      return <CupSoda className={`${className} text-blue-600`} />
    case 'featured':
      return <Star className={`${className} text-[#F4BE2C] fill-[#F4BE2C]`} />
    case 'offers':
      return <Zap className={`${className} text-[#E50909] fill-[#E50909]`} />
    default:
      return <Utensils className={`${className} text-zinc-800`} />
  }
}
