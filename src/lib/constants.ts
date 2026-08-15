/**
 * Application Constants
 * Sri Anjaneya Furnitures — Blueprint Version 2.0
 */

export const BRAND_NAME = 'Sri Anjaneya Furnitures'
export const BRAND_TAGLINE = 'Bespoke Solid Wood Craftsmanship & Architectural Furniture'
export const DEFAULT_CURRENCY = 'INR'

export const STORAGE_BUCKETS = {
  PRODUCT_IMAGES: 'product-images',
  GALLERY_IMAGES: 'gallery-images',
  BRAND_ASSETS: 'brand-assets',
} as const

export const PAGINATION = {
  PRODUCTS_PAGE_SIZE: 12,
  GALLERY_PAGE_SIZE: 24,
  INQUIRIES_PAGE_SIZE: 20,
  ADMIN_PRODUCTS_PAGE_SIZE: 20,
  RECENT_INQUIRIES_LIMIT: 10,
  FEATURED_PRODUCTS_LIMIT: 6,
} as const

export const CACHE_TIMES = {
  PUBLIC_STALE_MS: 5 * 60 * 1000,        // 5 minutes for public catalogue (products, collections, details, tags)
  SETTINGS_STALE_MS: 5 * 60 * 1000,      // 5 minutes for site settings singleton
  GALLERY_STALE_MS: 5 * 60 * 1000,       // 5 minutes for public inspiration gallery
  ADMIN_PRODUCTS_STALE_MS: 60 * 1000,    // 60 seconds for admin product management
  ADMIN_STALE_MS: 30 * 1000,             // 30 seconds for admin inquiries & operational data
  ADMIN_DASHBOARD_STALE_MS: 30 * 1000,   // 30 seconds for dashboard KPI counts
  AUTH_PROFILE_STALE_MS: Infinity,       // Session lifecycle for auth profile
  GC_TIME_PUBLIC_MS: 15 * 60 * 1000,     // 15 minutes garbage collection for public cache
  GC_TIME_ADMIN_MS: 5 * 60 * 1000,       // 5 minutes garbage collection for private admin cache
  GC_TIME_MS: 15 * 60 * 1000,            // Default fallback GC time
} as const

export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE_MB: 10,
  MAX_FILES_PER_BATCH: 10,
  UPLOAD_CONCURRENCY: 3,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
} as const

export const SEARCH_CONSTRAINTS = {
  DEBOUNCE_MS: 300,
  MIN_QUERY_LENGTH: 2,
} as const

export const INQUIRY_STATUSES = ['new', 'read', 'replied', 'closed'] as const
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number]

export const STOCK_STATUSES = ['in_stock', 'made_to_order', 'out_of_stock'] as const
export type StockStatus = (typeof STOCK_STATUSES)[number]

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  in_stock: 'In Stock',
  made_to_order: 'Made to Order',
  out_of_stock: 'Out of Stock',
}

export const ROOM_TYPES = [
  'Living Room',
  'Dining',
  'Bedroom',
  'Executive Office',
  'Sacred Space',
  'Outdoor & Patio',
] as const

export interface GalleryRoomOption {
  slug: 'all' | 'living-room' | 'bedroom' | 'dining' | 'office' | 'outdoor'
  label: string
  dbValue: string | null
}

export const GALLERY_ROOM_FILTERS: readonly GalleryRoomOption[] = [
  { slug: 'all', label: 'All', dbValue: null },
  { slug: 'living-room', label: 'Living Room', dbValue: 'Living Room' },
  { slug: 'bedroom', label: 'Bedroom', dbValue: 'Bedroom' },
  { slug: 'dining', label: 'Dining', dbValue: 'Dining' },
  { slug: 'office', label: 'Office', dbValue: 'Executive Office' },
  { slug: 'outdoor', label: 'Outdoor', dbValue: 'Outdoor & Patio' },
] as const

export type GalleryRoomSlug = (typeof GALLERY_ROOM_FILTERS)[number]['slug']

export const SORT_OPTIONS = [
  { value: 'curated', label: 'Curated Order' },
  { value: 'newest', label: 'Newest Additions' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
] as const

export type SortOption = (typeof SORT_OPTIONS)[number]['value']

export const SORT_COLUMN_MAP: Record<SortOption, { column: string; ascending: boolean }> = {
  curated: { column: 'sort_order', ascending: true },
  newest: { column: 'created_at', ascending: false },
  price_asc: { column: 'price', ascending: true },
  price_desc: { column: 'price', ascending: false },
}

export interface NavItem {
  name: string
  path: string
  exact?: boolean
}

export const PUBLIC_NAV_ITEMS: readonly NavItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Collections', path: '/collections' },
  { name: 'Catalogue', path: '/products' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About', path: '/about' },
  { name: 'Contact & Quote', path: '/contact' },
]

export const ADMIN_NAV_ITEMS: readonly NavItem[] = [
  { name: 'Dashboard', path: '/admin', exact: true },
  { name: 'Products', path: '/admin/products' },
  { name: 'Collections', path: '/admin/collections' },
  { name: 'Gallery Manager', path: '/admin/gallery' },
  { name: 'Quote Inquiries', path: '/admin/inquiries' },
  { name: 'Site Settings', path: '/admin/settings' },
]

export const APP_ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  COLLECTIONS: '/collections',
  COLLECTION_DETAIL: (slug: string) => `/collections/${slug}`,
  GALLERY: '/gallery',
  ABOUT: '/about',
  CONTACT: '/contact',
  SEARCH: '/search',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_NEW: '/admin/products/new',
  ADMIN_PRODUCT_EDIT: (id: string) => `/admin/products/${id}`,
  ADMIN_COLLECTIONS: '/admin/collections',
  ADMIN_GALLERY: '/admin/gallery',
  ADMIN_INQUIRIES: '/admin/inquiries',
  ADMIN_SETTINGS: '/admin/settings',
} as const
