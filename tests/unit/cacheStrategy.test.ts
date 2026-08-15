import { describe, it, expect } from 'vitest'
import { CACHE_TIMES } from '@/lib/constants'
import { queryKeys, normalizeQueryKeyFilters } from '@/hooks/queries/queryKeys'
import { shouldRetryQuery, calculateRetryDelay } from '@/lib/queryClient'
import { AppError } from '@/lib/errors'

describe('Section 6.8: Cache Freshness & Invalidation Strategy', () => {
  describe('Authoritative Cache Freshness Matrix', () => {
    it('enforces 5-minute staleTime for public catalogue and site settings', () => {
      expect(CACHE_TIMES.PUBLIC_STALE_MS).toBe(5 * 60 * 1000)
      expect(CACHE_TIMES.SETTINGS_STALE_MS).toBe(5 * 60 * 1000)
      expect(CACHE_TIMES.GALLERY_STALE_MS).toBe(5 * 60 * 1000)
    })

    it('enforces 30-60 second staleTime for admin operational data', () => {
      expect(CACHE_TIMES.ADMIN_PRODUCTS_STALE_MS).toBe(60 * 1000)
      expect(CACHE_TIMES.ADMIN_STALE_MS).toBe(30 * 1000)
      expect(CACHE_TIMES.ADMIN_DASHBOARD_STALE_MS).toBe(30 * 1000)
    })

    it('enforces session-scoped lifecycle for auth profiles and 15m public GC retention', () => {
      expect(CACHE_TIMES.AUTH_PROFILE_STALE_MS).toBe(Infinity)
      expect(CACHE_TIMES.GC_TIME_PUBLIC_MS).toBe(15 * 60 * 1000)
      expect(CACHE_TIMES.GC_TIME_ADMIN_MS).toBe(5 * 60 * 1000)
    })
  })

  describe('Query Key Normalization & Hierarchies', () => {
    it('normalizes tag order so equivalent filters produce identical cache identities', () => {
      const key1 = queryKeys.products.list({ tags: ['teak', 'sheesham', 'brass'] })
      const key2 = queryKeys.products.list({ tags: ['brass', 'teak', 'sheesham'] })

      expect(key1).toEqual(key2)
    })

    it('omits undefined, null, and empty string noise from cache keys', () => {
      const keyWithNoise = queryKeys.products.list({
        collectionSlug: 'living-sanctuary',
        searchQuery: '',
        minPrice: undefined,
        maxPrice: null,
      })
      const cleanKey = queryKeys.products.list({
        collectionSlug: 'living-sanctuary',
      })

      expect(keyWithNoise).toEqual(cleanKey)
    })

    it('creates distinct cache identities for different gallery room spaces', () => {
      const allKey = queryKeys.gallery.list('all')
      const bedroomKey = queryKeys.gallery.list('bedroom')
      const diningKey = queryKeys.gallery.list('dining')

      expect(allKey).not.toEqual(bedroomKey)
      expect(bedroomKey).not.toEqual(diningKey)
    })

    it('constructs scoped auth profile keys per user ID', () => {
      const userAKey = queryKeys.auth.profile('user-123')
      const userBKey = queryKeys.auth.profile('user-456')

      expect(userAKey).toEqual(['auth', 'profile', 'user-123'])
      expect(userBKey).toEqual(['auth', 'profile', 'user-456'])
      expect(userAKey).not.toEqual(userBKey)
    })
  })

  describe('Intelligent Query Retry Decider & Backoff', () => {
    it('never retries auth, authorization, validation, or not_found errors', () => {
      const authErr = new AppError('Unauthorized', { category: 'auth', status: 401, retryable: false })
      const forbiddenErr = new AppError('Forbidden', { category: 'authorization', status: 403, retryable: false })
      const validationErr = new AppError('Invalid email', { category: 'validation', status: 422, retryable: false })
      const notFoundErr = new AppError('Not Found', { category: 'not_found', status: 404, retryable: false })

      expect(shouldRetryQuery(0, authErr)).toBe(false)
      expect(shouldRetryQuery(0, forbiddenErr)).toBe(false)
      expect(shouldRetryQuery(0, validationErr)).toBe(false)
      expect(shouldRetryQuery(0, notFoundErr)).toBe(false)
    })

    it('allows retry for transient network errors under failure count limit', () => {
      const networkErr = new AppError('Failed to fetch', { category: 'network', status: 0, retryable: true })

      expect(shouldRetryQuery(0, networkErr)).toBe(true)
      expect(shouldRetryQuery(1, networkErr)).toBe(true)
      expect(shouldRetryQuery(2, networkErr)).toBe(false) // Bounded at 2 attempts
    })

    it('calculates bounded exponential retry delay capped at 10 seconds', () => {
      expect(calculateRetryDelay(0)).toBe(1000)
      expect(calculateRetryDelay(1)).toBe(2000)
      expect(calculateRetryDelay(2)).toBe(4000)
      expect(calculateRetryDelay(3)).toBe(8000)
      expect(calculateRetryDelay(4)).toBe(10000) // Capped at 10000ms
    })
  })
})
