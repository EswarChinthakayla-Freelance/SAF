import type { ProductFilters, StockStatus } from '@/types/app'
import { STOCK_STATUSES } from '@/lib/constants'

export const VALID_SORTS = [
  'curated',
  'featured',
  'newest',
  'price_asc',
  'price_desc',
  'price-asc',
  'price-desc',
] as const

export type ValidSort = (typeof VALID_SORTS)[number]

/**
 * Normalizes sort option to standard database key
 */
export function normalizeSortOption(sort?: string | null): 'curated' | 'newest' | 'price_asc' | 'price_desc' {
  if (!sort) return 'curated'
  const normalized = sort.toLowerCase().trim()
  if (normalized === 'featured' || normalized === 'curated') return 'curated'
  if (normalized === 'newest') return 'newest'
  if (normalized === 'price_asc' || normalized === 'price-asc') return 'price_asc'
  if (normalized === 'price_desc' || normalized === 'price-desc') return 'price_desc'
  return 'curated'
}

/**
 * Parses URL search parameters into strongly-typed ProductFilters
 */
export function parseProductFilters(searchParams: URLSearchParams): ProductFilters {
  const filters: ProductFilters = {}

  // Collection
  const collection = searchParams.get('collection')
  if (collection && collection.trim().length > 0) {
    filters.collection = collection.trim().toLowerCase()
  }

  // Tags (comma-separated e.g. tags=teak,rosewood)
  const tagsParam = searchParams.get('tags') || searchParams.get('tag')
  if (tagsParam) {
    const rawTags = tagsParam
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0)
    if (rawTags.length > 0) {
      // Sort alphabetically for deterministic cache keys
      filters.tags = Array.from(new Set(rawTags)).sort()
    }
  }

  // Price Range
  const minPriceStr = searchParams.get('minPrice') || searchParams.get('min_price')
  if (minPriceStr !== null && minPriceStr !== '') {
    const parsedMin = Number(minPriceStr)
    if (!isNaN(parsedMin) && parsedMin >= 0) {
      filters.minPrice = parsedMin
    }
  }

  const maxPriceStr = searchParams.get('maxPrice') || searchParams.get('max_price')
  if (maxPriceStr !== null && maxPriceStr !== '') {
    const parsedMax = Number(maxPriceStr)
    if (!isNaN(parsedMax) && parsedMax >= 0) {
      // If minPrice is set and parsedMax < minPrice, ignore or clamp maxPrice
      if (filters.minPrice === undefined || parsedMax >= filters.minPrice) {
        filters.maxPrice = parsedMax
      }
    }
  }

  // Availability
  const availabilityParam = searchParams.get('availability')
  if (availabilityParam) {
    const normalizedAvail = availabilityParam.trim().toLowerCase() as StockStatus
    if (STOCK_STATUSES.includes(normalizedAvail)) {
      filters.availability = normalizedAvail
    }
  }

  // Sort
  const sortParam = searchParams.get('sort')
  if (sortParam) {
    const normalizedSort = normalizeSortOption(sortParam)
    if (normalizedSort !== 'curated') {
      filters.sort = normalizedSort
    }
  }

  // Search Query
  const qParam = searchParams.get('q') || searchParams.get('search')
  if (qParam && qParam.trim().length >= 2) {
    filters.q = qParam.trim()
  }

  // Page
  const pageParam = searchParams.get('page')
  if (pageParam) {
    const parsedPage = parseInt(pageParam, 10)
    if (!isNaN(parsedPage) && parsedPage > 1) {
      filters.page = parsedPage
    }
  }

  return filters
}

/**
 * Serializes ProductFilters into clean, deterministic URLSearchParams
 */
export function serializeProductFilters(filters: ProductFilters): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.collection) {
    params.set('collection', filters.collection)
  }

  if (filters.tags && filters.tags.length > 0) {
    const sortedTags = [...filters.tags].sort()
    params.set('tags', sortedTags.join(','))
  }

  if (filters.minPrice !== undefined && filters.minPrice >= 0) {
    params.set('minPrice', filters.minPrice.toString())
  }

  if (filters.maxPrice !== undefined && filters.maxPrice >= 0) {
    params.set('maxPrice', filters.maxPrice.toString())
  }

  if (filters.availability && STOCK_STATUSES.includes(filters.availability)) {
    params.set('availability', filters.availability)
  }

  if (filters.sort && filters.sort !== 'curated' && filters.sort !== 'featured') {
    params.set('sort', filters.sort)
  }

  if (filters.q && filters.q.trim().length >= 2) {
    params.set('q', filters.q.trim())
  }

  if (filters.page && filters.page > 1) {
    params.set('page', filters.page.toString())
  }

  return params
}

/**
 * Checks whether any non-default, non-pagination filter is active
 */
export function isFilterActive(filters: ProductFilters): boolean {
  return Boolean(
    filters.collection ||
      (filters.tags && filters.tags.length > 0) ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      filters.availability ||
      (filters.q && filters.q.trim().length > 0)
  )
}

/**
 * Computes count of active filter dimensions (excluding sort and pagination)
 */
export function getActiveFilterCount(filters: ProductFilters): number {
  let count = 0
  if (filters.collection) count += 1
  if (filters.tags && filters.tags.length > 0) count += filters.tags.length
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count += 1
  if (filters.availability) count += 1
  if (filters.q && filters.q.trim().length > 0) count += 1
  return count
}
