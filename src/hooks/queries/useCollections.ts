import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from './queryKeys'
import { CACHE_TIMES } from '@/lib/constants'
import { normalizeError } from '@/lib/errors'
import type { CollectionRow } from '@/types/app'

export interface UseCollectionsOptions {
  activeOnly?: boolean
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
 * Admin collections management query.
 */
export function useAdminCollections() {
  return useQuery<CollectionRow[], Error>({
    queryKey: queryKeys.collections.adminList(),
    queryFn: async ({ signal }) => {
      let query = supabase
        .from('collections')
        .select(COLLECTION_LIST_PROJECTION)
        .order('sort_order', { ascending: true })

      if (signal) {
        query = query.abortSignal(signal)
      }

      const { data, error } = await query

      if (error) {
        throw normalizeError(error)
      }

      return (data as CollectionRow[]) || []
    },
    staleTime: CACHE_TIMES.ADMIN_STALE_MS,
  })
}
