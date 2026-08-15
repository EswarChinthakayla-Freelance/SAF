/**
 * Centralized Type-Safe Query Key Factory
 * Avoid scattering raw string keys across the codebase.
 */
export const queryKeys = {
  // Products
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.products.lists(), filters ?? {}] as const,
    featured: () => [...queryKeys.products.all, 'featured'] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (slugOrId: string) => [...queryKeys.products.details(), slugOrId] as const,
    related: (productId: string) => [...queryKeys.products.all, 'related', productId] as const,
  },

  // Collections
  collections: {
    all: ['collections'] as const,
    lists: () => [...queryKeys.collections.all, 'list'] as const,
    list: (activeOnly?: boolean) => [...queryKeys.collections.lists(), { activeOnly }] as const,
    details: () => [...queryKeys.collections.all, 'detail'] as const,
    detail: (slugOrId: string) => [...queryKeys.collections.details(), slugOrId] as const,
  },

  // Gallery
  gallery: {
    all: ['gallery'] as const,
    lists: () => [...queryKeys.gallery.all, 'list'] as const,
    list: (roomType?: string, activeOnly?: boolean) =>
      [...queryKeys.gallery.lists(), { roomType, activeOnly }] as const,
    infinite: (roomType?: string) => [...queryKeys.gallery.all, 'infinite', { roomType }] as const,
    detail: (id: string) => [...queryKeys.gallery.all, 'detail', id] as const,
  },

  // Inquiries (Admin)
  inquiries: {
    all: ['inquiries'] as const,
    lists: () => [...queryKeys.inquiries.all, 'list'] as const,
    list: (filters?: { status?: string; search?: string; page?: number }) =>
      [...queryKeys.inquiries.lists(), filters ?? {}] as const,
    details: () => [...queryKeys.inquiries.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.inquiries.details(), id] as const,
    unreadCount: () => [...queryKeys.inquiries.all, 'unread_count'] as const,
  },

  // Site Settings
  settings: {
    all: ['site_settings'] as const,
    public: () => [...queryKeys.settings.all, 'public'] as const,
    admin: () => [...queryKeys.settings.all, 'admin'] as const,
  },

  // Admin Dashboard / Stats
  admin: {
    all: ['admin'] as const,
    stats: () => [...queryKeys.admin.all, 'stats'] as const,
    recentInquiries: () => [...queryKeys.admin.all, 'recent_inquiries'] as const,
  },

  // Tags
  tags: {
    all: ['tags'] as const,
    list: () => [...queryKeys.tags.all, 'list'] as const,
  },
} as const
