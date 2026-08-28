'use client'

// Error monitoring — Firebase Crashlytics equivalent
// In production: initialize Firebase Crashlytics or Sentry
// CRITICAL: Never log passwords, card details, tokens, or sensitive personal info

type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info'

interface ErrorContext {
  userId?: string
  action?: string
  screen?: string
  metadata?: Record<string, unknown>
}

const SENSITIVE_KEYS = ['password', 'card', 'token', 'secret', 'auth', 'cvv', 'pin']

function sanitize(context: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(context)) {
    if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s))) {
      clean[key] = '[REDACTED]'
    } else {
      clean[key] = value
    }
  }
  return clean
}

export const errorMonitor = {
  capture(error: Error | string, context?: ErrorContext, severity: ErrorSeverity = 'error') {
    const sanitized = context?.metadata ? sanitize(context.metadata) : {}

    // In production: send to Firebase Crashlytics / Sentry
    // FirebaseCrashlytics.recordError(error, sanitized)

    if (process.env.NODE_ENV === 'development') {
      console.error(`[${severity}]`, error, context ? sanitize({ ...context, metadata: sanitized }) : '')
    }

    // Track specific business-critical errors
    if (severity === 'fatal') {
      // Failed checkout, failed payment, order failures
      // These should trigger alerts
    }
  },

  captureCheckoutFailure(orderId: string, reason: string) {
    this.capture(`Checkout failed for order ${orderId}: ${reason}`, {
      action: 'checkout',
      metadata: { orderId, reason },
    }, 'fatal')
  },

  capturePaymentFailure(orderId: string, reason: string) {
    this.capture(`Payment failed for order ${orderId}: ${reason}`, {
      action: 'payment',
      metadata: { orderId, reason },
    }, 'fatal')
  },

  captureOrderFailure(orderId: string, reason: string) {
    this.capture(`Order failed: ${orderId}: ${reason}`, {
      action: 'order',
      metadata: { orderId, reason },
    }, 'fatal')
  },
}
