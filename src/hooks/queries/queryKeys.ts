/**
 * Centralized, Stable TanStack Query Key Factory
 * Sri Anjaneya Furnitures — Blueprint Version 2.0
 *
 * Implements strict hierarchical key families and filter normalization to prevent
 * cache identity fragmentation and redundant network requests.
 */

/**
 * Normalizes filter parameters for query keys so semantically equivalent states
 * (e.g. tag order, empty values) generate identical cache keys.
 */
export function normalizeQueryKeyFilters(filters: Record<string, unknown> = {}): Record<string, unknown> {
  const normalized: Record<string, unknown> = {}

  Object.keys(filters)
    .sort()
    .forEach((key) => {
      const val = filters[key]
      if (val === undefined || val === null || val === '') {
        return
      }

      if (Array.isArray(val)) {
        if (val.length === 0) return
        // Sort primitive arrays (e.g., tags, materials) for deterministic key identity
        normalized[key] = [...val].sort()
      } else if (typeof val === 'object') {
        normalized[key] = normalizeQueryKeyFilters(val as Record<string, unknown>)
      } else {
        normalized[key] = val
      }
    })

  return normalized
}

export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: Record<string, unknown> = {}) =>
      [...queryKeys.products.lists(), normalizeQueryKeyFilters(filters)] as const,
    featured: () => [...queryKeys.products.all, 'featured'] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.products.details(), slug] as const,
    adminLists: () => [...queryKeys.products.all, 'admin-list'] as const,
    adminList: (filters: Record<string, unknown> = {}) =>
      [...queryKeys.products.adminLists(), normalizeQueryKeyFilters(filters)] as const,
    adminDetail: (id: string) => [...queryKeys.products.all, 'admin-detail', id] as const,
  },

  collections: {
    all: ['collections'] as const,
    lists: () => [...queryKeys.collections.all, 'list'] as const,
    list: (options: Record<string, unknown> = {}) =>
      [...queryKeys.collections.lists(), normalizeQueryKeyFilters(options)] as const,
    details: () => [...queryKeys.collections.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.collections.details(), slug] as const,
    adminLists: () => [...queryKeys.collections.all, 'admin-list'] as const,
    adminList: (filters: Record<string, unknown> = {}) =>
      [...queryKeys.collections.adminLists(), normalizeQueryKeyFilters(filters)] as const,
  },

  gallery: {
    all: ['gallery'] as const,
    infiniteLists: () => [...queryKeys.gallery.all, 'infinite-list'] as const,
    infiniteList: (roomType = 'all') =>
      [...queryKeys.gallery.infiniteLists(), { roomType }] as const,
    lists: () => [...queryKeys.gallery.all, 'list'] as const,
    list: (roomType = 'all') =>
      [...queryKeys.gallery.lists(), { roomType }] as const,
    details: () => [...queryKeys.gallery.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.gallery.details(), id] as const,
    adminLists: () => [...queryKeys.gallery.all, 'admin-list'] as const,
    adminList: (filters: Record<string, unknown> = {}) =>
      [...queryKeys.gallery.adminLists(), normalizeQueryKeyFilters(filters)] as const,
    adminDetail: (id: string) => [...queryKeys.gallery.all, 'admin-detail', id] as const,
  },

  inquiries: {
    all: ['inquiries'] as const,
    lists: () => [...queryKeys.inquiries.all, 'list'] as const,
    list: (filters: Record<string, unknown> = {}) =>
      [...queryKeys.inquiries.lists(), normalizeQueryKeyFilters(filters)] as const,
    recent: (limit = 10) => [...queryKeys.inquiries.all, 'recent', limit] as const,
    newCount: () => [...queryKeys.inquiries.all, 'new-count'] as const,
    counts: () => [...queryKeys.inquiries.all, 'counts'] as const,
    details: () => [...queryKeys.inquiries.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.inquiries.details(), id] as const,
  },

  settings: {
    all: ['settings'] as const,
    detail: () => [...queryKeys.settings.all, 'detail'] as const,
  },

  tags: {
    all: ['tags'] as const,
    list: () => [...queryKeys.tags.all, 'list'] as const,
  },

  dashboard: {
    all: ['dashboard'] as const,
    metrics: () => ['dashboard', 'metrics'] as const,
  },

  auth: {
    all: ['auth'] as const,
    profile: (userId: string) => ['auth', 'profile', userId] as const,
  },
} as const
