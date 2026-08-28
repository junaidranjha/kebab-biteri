// Kebab Biteri — Firebase Cloud Messaging Service Worker
// Handles push notifications when app is in background

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'kebab-biteri.firebaseapp.com',
  projectId: 'kebab-biteri',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification
  self.registration.showNotification(title, {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192-maskable.png',
    tag: payload.data?.orderNumber ?? 'kebab-biteri',
    data: payload.data,
    vibrate: [200, 100, 200],
  })
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const orderNumber = event.notification.data?.orderNumber
  const url = orderNumber ? `/orders/${orderNumber}` : '/'
  event.waitUntil(clients.openWindow(url))
})
