import { describe, it, expect } from 'vitest'
import { shouldRetryQuery, calculateRetryDelay } from '@/lib/queryClient'
import {
  AuthError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  AbortedError,
  NetworkError,
} from '@/lib/errors'

describe('QueryClient Retry and Backoff Rules', () => {
  it('rejects retrying auth, authorization, not_found, conflict, and validation errors', () => {
    expect(shouldRetryQuery(0, new AuthError())).toBe(false)
    expect(shouldRetryQuery(0, new ForbiddenError())).toBe(false)
    expect(shouldRetryQuery(0, new NotFoundError())).toBe(false)
    expect(shouldRetryQuery(0, new ConflictError())).toBe(false)
    expect(shouldRetryQuery(0, new ValidationError('Invalid payload'))).toBe(false)
    expect(shouldRetryQuery(0, new AbortedError())).toBe(false)
  })

  it('allows retrying transient network errors up to failure count limit', () => {
    const netErr = new NetworkError()
    expect(shouldRetryQuery(0, netErr)).toBe(true)
    expect(shouldRetryQuery(1, netErr)).toBe(true)
    expect(shouldRetryQuery(2, netErr)).toBe(false) // Capped at 2 attempts
  })

  it('calculates exponential retry delay with a 10s maximum cap', () => {
    expect(calculateRetryDelay(0)).toBe(1000)
    expect(calculateRetryDelay(1)).toBe(2000)
    expect(calculateRetryDelay(2)).toBe(4000)
    expect(calculateRetryDelay(3)).toBe(8000)
    expect(calculateRetryDelay(4)).toBe(10000) // Capped at 10,000ms
  })
})
