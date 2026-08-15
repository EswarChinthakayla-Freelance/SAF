import { normalizeError, type ErrorCategory } from './errors'

export interface ErrorReportContext {
  category?: ErrorCategory
  route?: string
  operation?: string
  status?: number
  metadata?: Record<string, unknown>
}

export interface StructuredLogPayload {
  timestamp: string
  environment: string
  category: ErrorCategory
  message: string
  code: string
  status: number
  route: string
  operation?: string
  metadata?: Record<string, unknown>
}

// Sensitive key patterns to redact automatically
const SENSITIVE_KEYS = [
  'password',
  'token',
  'jwt',
  'secret',
  'key',
  'authorization',
  'message',
  'phone',
  'email',
  'cookie',
  'service_role',
]

/**
 * Sanitizes arbitrary context objects to remove PII and credential leakages before logging.
 */
export function sanitizeContext(context?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!context || typeof context !== 'object') return undefined

  const sanitized: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(context)) {
    const lowerKey = key.toLowerCase()
    const isSensitive = SENSITIVE_KEYS.some((pattern) => lowerKey.includes(pattern))

    if (isSensitive) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeContext(value as Record<string, unknown>)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * Centralized Client-Side Structured Error Reporter
 * Captures, categorizes, sanitizes, and emits structured diagnostic logs.
 */
export function reportError(err: unknown, context: ErrorReportContext = {}): void {
  const normalized = normalizeError(err)

  // Don't report intentionally cancelled or aborted requests
  if (normalized.category === 'aborted') {
    return
  }

  const payload: StructuredLogPayload = {
    timestamp: new Date().toISOString(),
    environment: import.meta.env.MODE || 'production',
    category: context.category || normalized.category,
    message: normalized.message,
    code: normalized.code,
    status: context.status || normalized.status,
    route: context.route || (typeof window !== 'undefined' ? window.location.pathname : '/'),
    operation: context.operation,
    metadata: sanitizeContext(context.metadata),
  }

  // If Sentry is initialized / available in global window
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    try {
      ;(window as any).Sentry.captureException(err, {
        tags: {
          category: payload.category,
          route: payload.route,
        },
        extra: payload.metadata,
      })
    } catch {
      // Ignore monitoring library failure
    }
  }

  // Development & Diagnostics structured output
  if (import.meta.env.DEV) {
    console.error('[SAF Observability Report]', payload)
  }
}
