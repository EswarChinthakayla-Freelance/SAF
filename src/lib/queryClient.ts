import { QueryClient } from '@tanstack/react-query'
import { CACHE_TIMES } from './constants'
import { normalizeError, AppError } from './errors'

/**
 * Intelligent retry decider.
 * Prevents retry storms for client/auth errors while allowing recovery from transient network drops.
 */
export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) return false

  const appErr = error instanceof AppError ? error : normalizeError(error)

  // Never retry auth, forbidden, validation, conflict, not_found, or intentionally aborted requests
  if (
    appErr.category === 'auth' ||
    appErr.category === 'authorization' ||
    appErr.category === 'validation' ||
    appErr.category === 'conflict' ||
    appErr.category === 'not_found' ||
    appErr.category === 'aborted'
  ) {
    return false
  }

  return appErr.retryable
}

/**
 * Bounded exponential backoff calculation.
 */
export function calculateRetryDelay(attemptIndex: number): number {
  return Math.min(1000 * 2 ** attemptIndex, 10000)
}

/**
 * Global TanStack QueryClient with conservative defaults.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_TIMES.PUBLIC_STALE_MS,
      gcTime: CACHE_TIMES.GC_TIME_MS,
      retry: shouldRetryQuery,
      retryDelay: calculateRetryDelay,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false, // Critical writes must NEVER auto-retry to prevent duplicates
    },
  },
})
