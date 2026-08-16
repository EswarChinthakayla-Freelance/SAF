import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from './queryKeys'
import {
  PAGINATION,
  CACHE_TIMES,
  SORT_COLUMN_MAP,
  type SortOption,
} from '@/lib/constants'
import { normalizeError } from '@/lib/errors'
import { normalizeSortOption } from '@/utils/productFilters'
import type { ProductListItem, ProductWithRelations, StockStatus } from '@/types/app'

export const PRODUCT_LIST_PROJECTION = `
  id,
  name,
  slug,
  product_code,
  price,
  compare_price,
  currency,
  cover_image_path,
  collection_id,
  is_published,
  sort_order,
  created_at,
  collections (
    id,
    name,
    slug
  )
`

export const PRODUCT_DETAIL_PROJECTION = `
  id,
  name,
  slug,
  product_code,
  price,
  compare_price,
  currency,
  short_desc,
  description,
  dimensions,
  materials,
  care_instructions,
  warranty_info,
  delivery_info,
  cover_image_path,
  is_published,
  sort_order,
  created_at,
  updated_at,
  collections (
    id,
    name,
    slug,
    cover_image_path
  ),
  product_images (
    id,
    storage_path,
    alt_text,
    sort_order,
    is_cover
  ),
  product_variants (
    id,
    label,
    sku,
    material,
    color,
    size_label,
    price,
    compare_price,
    stock_status,
    sort_order
  ),
  product_tags (
    tag_id,
    tags (
      id,
      name,
      slug
    )
  )
`

export interface ProductListFilters {
  page?: number
  pageSize?: number
  collectionId?: string
  collectionSlug?: string
  tagSlug?: string
  tags?: string[]
  searchQuery?: string
  search?: string
  q?: string
  minPrice?: number
  maxPrice?: number
  availability?: StockStatus
  materials?: string[]
  sort?: string
  enabled?: boolean
  [key: string]: unknown
}

export interface PaginatedProductsResult {
  products: ProductListItem[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/**
 * Public paginated catalogue query hook.
 * Strictly requests bounded list projections to prevent oversized JSON responses.
 */
export function useProducts(filters: ProductListFilters = {}) {
  const page = Math.max(1, filters.page || 1)
  const pageSize = filters.pageSize || PAGINATION.PRODUCTS_PAGE_SIZE
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const normalizedSortKey = normalizeSortOption(filters.sort as string)
  const sortConfig = SORT_COLUMN_MAP[normalizedSortKey as SortOption] || SORT_COLUMN_MAP.curated

  // Extract search term from search, q, or searchQuery
  const searchTerm = (filters.search || filters.q || filters.searchQuery || '').trim()

  // Collect tag slugs
  const tagSlugs = filters.tags && filters.tags.length > 0
    ? filters.tags
    : filters.tagSlug ? [filters.tagSlug] : []

  // Normalize collection slug from collectionSlug or collection alias
  const collectionSlug = (filters.collectionSlug || filters.collection) as string | undefined

  return useQuery<PaginatedProductsResult, Error>({
    queryKey: queryKeys.products.list({
      ...filters,
      collectionSlug: collectionSlug || undefined,
      collection: undefined,
      page,
      pageSize,
      sort: normalizedSortKey,
      searchQuery: searchTerm || undefined,
      search: undefined,
      q: undefined,
      tags: tagSlugs.length > 0 ? tagSlugs : undefined,
      enabled: undefined,
    }),
    enabled: filters.enabled !== undefined ? filters.enabled : true,
    queryFn: async ({ signal }) => {
      // Build dynamic select string based on whether inner joins are required for relational filtering
      let selectFields = PRODUCT_LIST_PROJECTION

      if (collectionSlug) {
        selectFields = `
          id,
          name,
          slug,
          product_code,
          price,
          compare_price,
          currency,
          cover_image_path,
          collection_id,
          is_published,
          sort_order,
          created_at,
          collections!inner (
            id,
            name,
            slug
          )
        `
      }

      if (tagSlugs.length > 0) {
        selectFields += `,
          product_tags!inner (
            tag_id,
            tags!inner (
              id,
              name,
              slug
            )
          )
        `
      }

      if (filters.availability) {
        selectFields += `,
          product_variants!inner (
            id,
            stock_status
          )
        `
      }

      let query = supabase
        .from('products')
        .select(selectFields, { count: 'exact' })
        .eq('is_published', true)
        .order(sortConfig.column, { ascending: sortConfig.ascending })
        .range(from, to)

      if (signal) {
        query = query.abortSignal(signal)
      }

      // Filter by Collection ID or Slug
      if (filters.collectionId) {
        query = query.eq('collection_id', filters.collectionId)
      } else if (collectionSlug) {
        query = query.eq('collections.slug', collectionSlug)
      }

      // Filter by Tag Slugs
      if (tagSlugs.length > 0) {
        query = query.in('product_tags.tags.slug', tagSlugs)
      }

      // Filter by Variant Availability
      if (filters.availability) {
        query = query.eq('product_variants.stock_status', filters.availability)
      }

      // Filter by Price Range
      if (filters.minPrice !== undefined && !isNaN(filters.minPrice) && filters.minPrice >= 0) {
        query = query.gte('price', filters.minPrice)
      }

      if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice) && filters.maxPrice >= 0) {
        query = query.lte('price', filters.maxPrice)
      }

      // Search Query
      if (searchTerm.length >= 2) {
        query = query.or(`name.ilike.%${searchTerm}%,short_desc.ilike.%${searchTerm}%`)
      }

      // Material overlaps (if present)
      if (filters.materials && filters.materials.length > 0) {
        query = query.overlaps('materials', filters.materials)
      }

      const { data, count, error } = await query

      if (error) {
        throw normalizeError(error)
      }

      const totalCount = count || 0
      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

      return {
        products: (data as unknown as ProductListItem[]) || [],
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    },
    placeholderData: keepPreviousData,
    staleTime: CACHE_TIMES.PUBLIC_STALE_MS,
  })
}

/**
 * Public featured products query for homepage.
 * Strictly queries authoritative homepage_featured_products relation.
 * If no relations exist, returns an empty array to allow graceful section omission.
 */
export function useFeaturedProducts(limit = PAGINATION.FEATURED_PRODUCTS_LIMIT) {
  return useQuery<ProductListItem[], Error>({
    queryKey: queryKeys.products.featured(),
    queryFn: async ({ signal }) => {
      let featQuery = supabase
        .from('homepage_featured_products')
        .select(`
          sort_order,
          products!inner (
            ${PRODUCT_LIST_PROJECTION}
          )
        `)
        .eq('products.is_published', true)
        .order('sort_order', { ascending: true })
        .limit(limit)

      if (signal) {
        featQuery = featQuery.abortSignal(signal)
      }

      const { data: featData, error: featError } = await featQuery

      if (featError) {
        throw normalizeError(featError)
      }

      if (!featData || featData.length === 0) {
        // Fallback: If admin has not yet curated featured products,
        // display top published products so the exhibition stage always displays.
        let fallbackQuery = supabase
          .from('products')
          .select(PRODUCT_LIST_PROJECTION)
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
          .limit(limit)

        if (signal) {
          fallbackQuery = fallbackQuery.abortSignal(signal)
        }

        const { data: fallbackData, error: fallbackError } = await fallbackQuery

        if (fallbackError) {
          throw normalizeError(fallbackError)
        }

        return (fallbackData as unknown as ProductListItem[]) || []
      }

      return featData.map((row) => (row as unknown as { products: ProductListItem }).products)
    },
    staleTime: CACHE_TIMES.PUBLIC_STALE_MS,
  })
}

/**
 * Public product detail query by URL slug.
 */
export function useProduct(slug?: string) {
  return useQuery<ProductWithRelations | null, Error>({
    queryKey: queryKeys.products.detail(slug || ''),
    queryFn: async ({ signal }) => {
      if (!slug) return null

      let query = supabase
        .from('products')
        .select(PRODUCT_DETAIL_PROJECTION)
        .eq('slug', slug)
        .eq('is_published', true)

      if (signal) {
        query = query.abortSignal(signal)
      }

      const { data, error } = await query.maybeSingle()

      if (error) {
        throw normalizeError(error)
      }

      const productData = (data as unknown as ProductWithRelations) || null
      if (productData) {
        if (Array.isArray(productData.product_images)) {
          productData.product_images.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        }
        if (Array.isArray(productData.product_variants)) {
          productData.product_variants.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        }
      }
      return productData
    },
    enabled: Boolean(slug && slug.trim().length > 0),
    staleTime: CACHE_TIMES.PUBLIC_STALE_MS,
  })
}

/**
 * Public related products query hook for Product Detail Page.
 * Fetches published pieces from the same collection, excluding current product.
 */
export function useRelatedProducts(
  collectionId?: string | null,
  currentProductId?: string,
  limit = 3
) {
  return useQuery<ProductListItem[], Error>({
    queryKey: ['products', 'related', collectionId || '', currentProductId || '', limit],
    queryFn: async ({ signal }) => {
      if (!collectionId) return []

      let query = supabase
        .from('products')
        .select(PRODUCT_LIST_PROJECTION)
        .eq('is_published', true)
        .eq('collection_id', collectionId)
        .order('sort_order', { ascending: true })
        .limit(limit + 1)

      if (signal) {
        query = query.abortSignal(signal)
      }

      if (currentProductId) {
        query = query.neq('id', currentProductId)
      }

      const { data, error } = await query

      if (error) {
        throw normalizeError(error)
      }

      const items = (data as unknown as ProductListItem[]) || []
      return items.slice(0, limit)
    },
    enabled: Boolean(collectionId),
    staleTime: CACHE_TIMES.PUBLIC_STALE_MS,
  })
}

/**
 * Admin paginated product management query.
 */
export function useAdminProducts(filters: ProductListFilters = {}) {
  const page = Math.max(1, filters.page || 1)
  const pageSize = filters.pageSize || PAGINATION.ADMIN_PRODUCTS_PAGE_SIZE
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  return useQuery<PaginatedProductsResult, Error>({
    queryKey: queryKeys.products.adminList({ ...filters, page, pageSize }),
    queryFn: async ({ signal }) => {
      let query = supabase
        .from('products')
        .select(PRODUCT_LIST_PROJECTION, { count: 'exact' })
        .order('sort_order', { ascending: true })
        .range(from, to)

      if (signal) {
        query = query.abortSignal(signal)
      }

      if (filters.collectionId) {
        query = query.eq('collection_id', filters.collectionId)
      }

      if (filters.status === 'published' || filters.isPublished === true) {
        query = query.eq('is_published', true)
      } else if (filters.status === 'draft' || filters.isPublished === false) {
        query = query.eq('is_published', false)
      }

      if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
        const term = filters.searchQuery.trim()
        query = query.or(`name.ilike.%${term}%,product_code.ilike.%${term}%`)
      }

      const { data, count, error } = await query

      if (error) {
        throw normalizeError(error)
      }

      const totalCount = count || 0
      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

      return {
        products: (data as unknown as ProductListItem[]) || [],
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    },
    staleTime: CACHE_TIMES.ADMIN_PRODUCTS_STALE_MS,
  })
}

/**
 * Admin product editing query by record ID.
 */
export function useAdminProduct(id?: string) {
  return useQuery<ProductWithRelations | null, Error>({
    queryKey: queryKeys.products.adminDetail(id || ''),
    queryFn: async ({ signal }) => {
      if (!id) return null

      let query = supabase
        .from('products')
        .select(PRODUCT_DETAIL_PROJECTION)
        .eq('id', id)

      if (signal) {
        query = query.abortSignal(signal)
      }

      const { data, error } = await query.maybeSingle()

      if (error) {
        throw normalizeError(error)
      }

      const productData = (data as unknown as ProductWithRelations) || null
      if (productData) {
        if (Array.isArray(productData.product_images)) {
          productData.product_images.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        }
        if (Array.isArray(productData.product_variants)) {
          productData.product_variants.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        }
      }
      return productData
    },
    enabled: Boolean(id && id.trim().length > 0),
    staleTime: CACHE_TIMES.ADMIN_PRODUCTS_STALE_MS,
  })
}
