/**
 * Filter serialization and room filter utilities
 */
export const APPROVED_ROOM_FILTERS = [
  'All',
  'Living Room',
  'Bedroom',
  'Dining',
  'Executive Office',
  'Sacred Space',
] as const

export type RoomFilterType = (typeof APPROVED_ROOM_FILTERS)[number]

export interface CatalogueFilterState {
  collectionId?: string
  minPrice?: number
  maxPrice?: number
  materials?: string[]
  searchQuery?: string
  stockStatus?: string
  sortOrder?: 'price_asc' | 'price_desc' | 'featured' | 'newest'
}

export function parseFilterParams(searchParams: URLSearchParams): CatalogueFilterState {
  return {
    collectionId: searchParams.get('collection') || undefined,
    minPrice: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    maxPrice: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    materials: searchParams.getAll('material'),
    searchQuery: searchParams.get('q') || undefined,
    stockStatus: searchParams.get('stock') || undefined,
    sortOrder: (searchParams.get('sort') as CatalogueFilterState['sortOrder']) || 'featured',
  }
}
