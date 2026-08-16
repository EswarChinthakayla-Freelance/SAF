import type { Database } from './database.types'

export type ProductRow = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type ProductImageRow = Database['public']['Tables']['product_images']['Row']
export type ProductImageInsert = Database['public']['Tables']['product_images']['Insert']
export type ProductImageUpdate = Database['public']['Tables']['product_images']['Update']

export type ProductVariantRow = Database['public']['Tables']['product_variants']['Row']
export type ProductVariantInsert = Database['public']['Tables']['product_variants']['Insert']
export type ProductVariantUpdate = Database['public']['Tables']['product_variants']['Update']

export type CollectionRow = Database['public']['Tables']['collections']['Row']
export type CollectionInsert = Database['public']['Tables']['collections']['Insert']
export type CollectionUpdate = Database['public']['Tables']['collections']['Update']

export interface AdminCollectionItem extends CollectionRow {
  product_count?: number
}

export type TagRow = Database['public']['Tables']['tags']['Row']
export type TagInsert = Database['public']['Tables']['tags']['Insert']

export type GalleryImageRow = Database['public']['Tables']['gallery_images']['Row']
export type GalleryImageInsert = Database['public']['Tables']['gallery_images']['Insert']
export type GalleryImageUpdate = Database['public']['Tables']['gallery_images']['Update']

export interface GalleryItemWithProduct extends GalleryImageRow {
  products?: {
    id: string
    name: string
    slug: string
    product_code?: string | null
    cover_image_path?: string | null
    is_published: boolean
    price?: number | null
  } | null
}

export type AdminGalleryItem = GalleryItemWithProduct

export interface AdminGalleryFilters {
  search?: string
  roomType?: string
  status?: 'all' | 'active' | 'inactive'
  linkedStatus?: 'all' | 'linked' | 'unlinked'
  page?: number
  pageSize?: number
}

export interface AdminGalleryListResult {
  images: AdminGalleryItem[]
  totalCount: number
  activeCount: number
  page: number
  pageSize: number
  totalPages: number
}

export type InquiryRow = Database['public']['Tables']['inquiries']['Row']
export type InquiryInsert = Database['public']['Tables']['inquiries']['Insert']
export type InquiryUpdate = Database['public']['Tables']['inquiries']['Update']

export interface AdminInquiryProductRef {
  id: string
  name: string
  slug: string
  is_published?: boolean
  cover_image_path?: string | null
}

export interface AdminInquiryListItem extends InquiryRow {
  product?: AdminInquiryProductRef | null
}

export interface AdminInquiryDetail extends InquiryRow {
  product?: AdminInquiryProductRef | null
}

export interface InquiryStatusCounts {
  all: number
  new: number
  read: number
  replied: number
  closed: number
}

export type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row']
export type SiteSettingsUpdate = Database['public']['Tables']['site_settings']['Update']

export type AdminProfileRow = Database['public']['Tables']['admin_profiles']['Row']

export type StockStatus = Database['public']['Enums'] extends { stock_status: infer T }
  ? T
  : 'in_stock' | 'made_to_order' | 'out_of_stock'

/**
 * Minimal Product List Item projection for catalogue cards
 */
export interface ProductListItem extends ProductRow {
  collections?: {
    id: string
    name: string
    slug: string
    cover_image_path?: string | null
  } | null
}

/**
 * Joined Product Detail Model with Images, Variants, Tags and Collection relations
 */
export interface ProductWithRelations extends ProductRow {
  collections?: {
    id: string
    name: string
    slug: string
    cover_image_path?: string | null
  } | null
  product_images?: ProductImageRow[]
  product_variants?: ProductVariantRow[]
  product_tags?: {
    tag_id: string
    tags?: {
      id: string
      name: string
      slug: string
    } | null
  }[]
}

export type ProductDetail = ProductWithRelations

/**
 * Product Catalogue Filtering & URL State
 */
export interface ProductFilters {
  collection?: string // collection slug
  tags?: string[] // tag slugs
  minPrice?: number
  maxPrice?: number
  availability?: 'in_stock' | 'made_to_order' | 'out_of_stock'
  sort?: 'curated' | 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'price-asc' | 'price-desc'
  q?: string // search query
  page?: number
}

/**
 * Product Specification & Dimensions
 */
export interface ProductDimensions {
  length?: number | string
  width?: number | string
  height?: number | string
  unit?: 'inches' | 'cm' | 'mm'
}

/**
 * Media Delivery Transformation Options
 */
export interface MediaTransformOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'origin'
  resize?: 'cover' | 'contain' | 'fill'
}

/**
 * Inquiry Submission Payload for submit-inquiry Edge Function
 */
export interface InquiryPayload {
  name: string
  email: string
  phone?: string
  productId?: string
  subject?: string
  message: string
  turnstileToken?: string
  honeypot?: string
}

/**
 * Shared Breadcrumb item model for public and admin navigation contexts
 */
export interface AppBreadcrumbItem {
  label: string
  href?: string
  isCurrent?: boolean
  mobileLabel?: string
  isLoading?: boolean
}
