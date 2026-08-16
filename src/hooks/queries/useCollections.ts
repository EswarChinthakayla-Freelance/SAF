import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from './queryKeys'
import { CACHE_TIMES } from '@/lib/constants'
import { normalizeError } from '@/lib/errors'
import type { CollectionRow, AdminCollectionItem } from '@/types/app'

export interface UseCollectionsOptions {
  activeOnly?: boolean
  [key: string]: unknown
}

export interface UseAdminCollectionsOptions {
  searchQuery?: string
  visibility?: 'all' | 'active' | 'inactive'
  [key: string]: unknown
}

export const COLLECTION_LIST_PROJECTION =
  'id, name, slug, description, cover_image_path, cover_image_alt, sort_order, is_active, created_at, updated_at'

/**
 * Public collections query hook.
 * Selects only collection fields, avoiding heavy product nesting.
 */
export function useCollections(options: UseCollectionsOptions = { activeOnly: true }) {
  return useQuery<CollectionRow[], Error>({
    queryKey: queryKeys.collections.list(options),
    queryFn: async ({ signal }) => {
      let query = supabase
        .from('collections')
        .select(COLLECTION_LIST_PROJECTION)
        .order('sort_order', { ascending: true })

      if (options.activeOnly !== false) {
        query = query.eq('is_active', true)
      }

      if (signal) {
        query = query.abortSignal(signal)
      }

      const { data, error } = await query

      if (error) {
        throw normalizeError(error)
      }

      return (data as CollectionRow[]) || []
    },
    staleTime: CACHE_TIMES.PUBLIC_STALE_MS,
  })
}

/**
 * Public collection detail query by URL slug.
 */
export function useCollection(slug?: string) {
  return useQuery<CollectionRow | null, Error>({
    queryKey: queryKeys.collections.detail(slug || ''),
    queryFn: async ({ signal }) => {
      if (!slug) return null

      let query = supabase
        .from('collections')
        .select(COLLECTION_LIST_PROJECTION)
        .eq('slug', slug)
        .eq('is_active', true)

      if (signal) {
        query = query.abortSignal(signal)
      }

      const { data, error } = await query.maybeSingle()

      if (error) {
        throw normalizeError(error)
      }

      return (data as CollectionRow) || null
    },
    enabled: Boolean(slug && slug.trim().length > 0),
    staleTime: CACHE_TIMES.PUBLIC_STALE_MS,
  })
}

/**
 * Admin collections management query with efficient product count aggregation.
 */
export function useAdminCollections(options: UseAdminCollectionsOptions = {}) {
  return useQuery<AdminCollectionItem[], Error>({
    queryKey: queryKeys.collections.adminList(options),
    queryFn: async ({ signal }) => {
      let query = supabase
        .from('collections')
        .select(
          'id, name, slug, description, cover_image_path, cover_image_alt, sort_order, is_active, created_at, updated_at, products(count)'
        )
        .order('sort_order', { ascending: true })

      if (options.visibility === 'active') {
        query = query.eq('is_active', true)
      } else if (options.visibility === 'inactive') {
        query = query.eq('is_active', false)
      }

      if (options.searchQuery && options.searchQuery.trim().length > 0) {
        const term = `%${options.searchQuery.trim()}%`
        query = query.or(`name.ilike.${term},slug.ilike.${term}`)
      }

      if (signal) {
        query = query.abortSignal(signal)
      }

      const { data, error } = await query

      if (error) {
        throw normalizeError(error)
      }

      interface RawCollectionQueryRow extends CollectionRow {
        products?: { count: number }[] | { count: number } | null
      }

      return ((data as unknown as RawCollectionQueryRow[]) || []).map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        cover_image_path: row.cover_image_path,
        cover_image_alt: row.cover_image_alt,
        sort_order: row.sort_order,
        is_active: row.is_active,
        created_at: row.created_at,
        updated_at: row.updated_at,
        product_count: Array.isArray(row.products)
          ? row.products[0]?.count ?? 0
          : row.products?.count ?? 0,
      }))
    },
    staleTime: CACHE_TIMES.ADMIN_STALE_MS,
  })
}
