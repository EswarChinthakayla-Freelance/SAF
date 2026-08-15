import { describe, it, expect } from 'vitest'
import {
  normalizeError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  NetworkError,
  AbortedError,
  ValidationError,
} from '@/lib/errors'

describe('Error Normalization Architecture', () => {
  it('identifies PostgreSQL 23505 unique violation as ConflictError', () => {
    const pgError = { code: '23505', message: 'duplicate key value violates unique constraint "products_slug_key"' }
    const normalized = normalizeError(pgError)
    expect(normalized).toBeInstanceOf(ConflictError)
    expect(normalized.category).toBe('conflict')
    expect(normalized.status).toBe(409)
    expect(normalized.retryable).toBe(false)
  })

  it('identifies RLS 42501 permission denied as ForbiddenError', () => {
    const rlsError = { code: '42501', message: 'new row violates row-level security policy for table "products"' }
    const normalized = normalizeError(rlsError)
    expect(normalized).toBeInstanceOf(ForbiddenError)
    expect(normalized.category).toBe('authorization')
    expect(normalized.status).toBe(403)
    expect(normalized.retryable).toBe(false)
  })

  it('identifies PGRST116 single row not found as NotFoundError', () => {
    const pgrstError = { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' }
    const normalized = normalizeError(pgrstError)
    expect(normalized).toBeInstanceOf(NotFoundError)
    expect(normalized.category).toBe('not_found')
    expect(normalized.status).toBe(404)
    expect(normalized.retryable).toBe(false)
  })

  it('identifies fetch network / HTTP2 protocol failures as NetworkError', () => {
    const fetchError = new Error('Failed to fetch: net::ERR_HTTP2_PROTOCOL_ERROR')
    const normalized = normalizeError(fetchError)
    expect(normalized).toBeInstanceOf(NetworkError)
    expect(normalized.category).toBe('network')
    expect(normalized.retryable).toBe(true)
    expect(normalized.userMessage).toContain('check your internet connection')
  })

  it('identifies AbortError without treating it as a fatal failure', () => {
    const abortErr = new Error('The user aborted a request.')
    abortErr.name = 'AbortError'
    const normalized = normalizeError(abortErr)
    expect(normalized).toBeInstanceOf(AbortedError)
    expect(normalized.category).toBe('aborted')
    expect(normalized.retryable).toBe(false)
  })

  it('preserves ValidationError instances directly', () => {
    const valErr = new ValidationError('Name is required', { name: ['Must not be blank'] })
    const normalized = normalizeError(valErr)
    expect(normalized).toBe(valErr)
    expect(normalized.category).toBe('validation')
    expect(normalized.status).toBe(400)
  })
})
