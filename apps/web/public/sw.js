// Kebab Biteri — Service Worker
// Cache strategy: stale-while-revalidate for app shell, network-first for API, cache-first for static

const CACHE_VERSION = 'v1'
const STATIC_CACHE = `kb-static-${CACHE_VERSION}`
const IMAGE_CACHE = `kb-images-${CACHE_VERSION}`
const OFFLINE_URL = '/offline'

const STATIC_ASSETS = [
  '/',
  '/menu',
  '/offline',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => {}),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('kb-') && ![STATIC_CACHE, IMAGE_CACHE].includes(key))
          .map((key) => caches.delete(key)),
      ),
    ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET
  if (request.method !== 'GET') return

  // Skip cross-origin (API, maps, etc.) — let network handle
  if (url.origin !== self.location.origin) return

  // API calls: network-first, never cache (orders/payments require fresh data)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request)),
    )
    return
  }

  // Images: cache-first with background update
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(request)
        const networkFetch = fetch(request)
          .then((res) => {
            if (res.ok) cache.put(request, res.clone())
            return res
          })
          .catch(() => cached)
        return cached || networkFetch
      }),
    )
    return
  }

  // App shell: stale-while-revalidate
  event.respondWith(
    caches.open(STATIC_CACHE).then(async (cache) => {
      const cached = await cache.match(request)
      const networkFetch = fetch(request)
        .then((res) => {
          if (res.ok && res.type === 'basic') cache.put(request, res.clone())
          return res
        })
        .catch(() => cached || caches.match(OFFLINE_URL))
      return cached || networkFetch
    }),
  )
})

// Listen for messages from the app
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})
