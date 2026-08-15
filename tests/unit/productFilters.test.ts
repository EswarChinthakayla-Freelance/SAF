import { describe, it, expect } from 'vitest'
import {
  parseProductFilters,
  serializeProductFilters,
  normalizeSortOption,
  isFilterActive,
  getActiveFilterCount,
} from '@/utils/productFilters'

describe('productFilters utility', () => {
  it('parses empty search params to empty filters object', () => {
    const params = new URLSearchParams()
    const filters = parseProductFilters(params)
    expect(filters).toEqual({})
    expect(isFilterActive(filters)).toBe(false)
    expect(getActiveFilterCount(filters)).toBe(0)
  })

  it('parses collection, tags, price, and availability filters correctly', () => {
    const params = new URLSearchParams(
      'collection=living-room&tags=teak,cane&minPrice=25000&maxPrice=80000&availability=in_stock&sort=price-asc&page=2'
    )
    const filters = parseProductFilters(params)

    expect(filters.collection).toBe('living-room')
    expect(filters.tags).toEqual(['cane', 'teak']) // sorted alphabetically
    expect(filters.minPrice).toBe(25000)
    expect(filters.maxPrice).toBe(80000)
    expect(filters.availability).toBe('in_stock')
    expect(filters.sort).toBe('price_asc')
    expect(filters.page).toBe(2)
    expect(isFilterActive(filters)).toBe(true)
    expect(getActiveFilterCount(filters)).toBe(5) // collection (1) + 2 tags (2) + price (1) + availability (1) = 5
  })

  it('normalizes sort options safely and ignores malicious/invalid sort values', () => {
    expect(normalizeSortOption('curated')).toBe('curated')
    expect(normalizeSortOption('featured')).toBe('curated')
    expect(normalizeSortOption('newest')).toBe('newest')
    expect(normalizeSortOption('price-asc')).toBe('price_asc')
    expect(normalizeSortOption('price_asc')).toBe('price_asc')
    expect(normalizeSortOption('price-desc')).toBe('price_desc')
    expect(normalizeSortOption('price_desc')).toBe('price_desc')
    expect(normalizeSortOption('arbitrary_sql_injection')).toBe('curated')
    expect(normalizeSortOption(null)).toBe('curated')
  })

  it('sanitizes invalid numbers and negative prices safely', () => {
    const params = new URLSearchParams('minPrice=-500&maxPrice=invalid&page=-3')
    const filters = parseProductFilters(params)

    expect(filters.minPrice).toBeUndefined()
    expect(filters.maxPrice).toBeUndefined()
    expect(filters.page).toBeUndefined()
  })

  it('serializes ProductFilters deterministically into URLSearchParams', () => {
    const filters = {
      collection: 'bedroom',
      tags: ['rosewood', 'brass'],
      minPrice: 30000,
      maxPrice: 95000,
      availability: 'made_to_order' as const,
      sort: 'price_desc' as const,
      page: 3,
    }

    const params = serializeProductFilters(filters)

    expect(params.get('collection')).toBe('bedroom')
    expect(params.get('tags')).toBe('brass,rosewood') // sorted
    expect(params.get('minPrice')).toBe('30000')
    expect(params.get('maxPrice')).toBe('95000')
    expect(params.get('availability')).toBe('made_to_order')
    expect(params.get('sort')).toBe('price_desc')
    expect(params.get('page')).toBe('3')
  })

  it('omits default/empty parameters during serialization', () => {
    const filters = {
      page: 1, // default page omitted
      sort: 'curated' as const, // default sort omitted
    }

    const params = serializeProductFilters(filters)
    expect(params.toString()).toBe('')
  })
})
