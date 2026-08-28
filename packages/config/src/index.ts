// Kebab Biteri — Brand & Design Config
// Strong red + black + warm light + gold — inspired by the Kebab Biteri brand

export const brand = {
  name: 'Kebab Biteri',
  tagline: 'Authentic Kebab & Grill',
  domain: 'kebabbiteri.com',
  currency: 'EUR',
  currencySymbol: '€',
  locale: 'en-US',
  locales: ['en-US', 'es-ES'],
  defaultLocale: 'en-US',
  themeColor: '#F4BE2C',
  backgroundColor: '#FFFDF2',
  contactEmail: 'hola@kebabbiteri.com',
  supportPhone: '+34 600 000 000',
} as const

export const brandColors = {
  // Primary — Vibrant Golden Yellow (Signature Brand Color)
  primary: {
    DEFAULT: '#F4BE2C',
    50: '#FFFDF0',
    100: '#FFF9D6',
    200: '#FFF1AD',
    300: '#FFE680',
    400: '#FCD44D',
    500: '#F4BE2C',
    600: '#D99F16',
    700: '#B27F0A',
    800: '#8A6005',
    900: '#634402',
  },
  // Charcoal — Deep premium dark slate/black
  charcoal: {
    DEFAULT: '#18181B',
    50: '#F4F4F5',
    100: '#E4E4E7',
    200: '#D4D4D8',
    300: '#A1A1AA',
    400: '#71717A',
    500: '#52525B',
    600: '#3F3F46',
    700: '#27272A',
    800: '#18181B',
    900: '#09090B',
  },
  // Accent — Fiery Spit Red (from logo badge)
  accentRed: {
    DEFAULT: '#E50909',
    light: '#FF3B3B',
    dark: '#B30000',
  },
  saffron: {
    DEFAULT: '#F4BE2C',
    light: '#FFE485',
    dark: '#D99F16',
  },
  // Functional
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#E50909',
  info: '#2563EB',
  // Surfaces
  surface: '#FFFFFF',
  surfaceAlt: '#FFFDF2',
  surfaceElevated: '#FFFFFF',
  border: '#FDE68A',
  text: '#18181B',
  textMuted: '#71717A',
  textSubtle: '#A1A1AA',
} as const

export const spacing = {
  touchTarget: 44,
  bottomNavHeight: 64,
  headerHeight: 56,
  safeAreaBottom: 'env(safe-area-inset-bottom)',
  safeAreaTop: 'env(safe-area-inset-top)',
} as const

export const breakpoints = {
  sm: '360px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
} as const

export const formatPrice = (amount: number, currency = 'EUR', locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (iso: string, locale = 'en-US'): string => {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso))
}
