import { useInfiniteQuery, useQuery, type InfiniteData, type UseInfiniteQueryResult } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from './queryKeys'
import { PAGINATION, CACHE_TIMES, GALLERY_ROOM_FILTERS, type GalleryRoomSlug } from '@/lib/constants'
import { normalizeError } from '@/lib/errors'
import type { GalleryItemWithProduct, GalleryImageRow } from '@/types/app'

export interface GalleryPageResult {
  images: GalleryItemWithProduct[]
  nextPage: number | null
  totalCount: number
}

export const GALLERY_QUERY_PROJECTION =
  'id, storage_path, alt_text, room_type, product_id, sort_order, is_active, created_at, updated_at, products(id, name, slug, is_published)'

/**
 * Public infinite-loading gallery query hook.
 * Bounded by 24 items per page to prevent browser memory saturation and request storms.
 */
export function useGallery(
  roomSlug: GalleryRoomSlug | string = 'all'
): UseInfiniteQueryResult<InfiniteData<GalleryPageResult, number>, Error> {
  const pageSize = PAGINATION.GALLERY_PAGE_SIZE

  // Find room filter definition
  const normalizedSlug = (roomSlug?.toLowerCase() || 'all') as GalleryRoomSlug
  const roomFilter = GALLERY_ROOM_FILTERS.find((f) => f.slug === normalizedSlug)

  return useInfiniteQuery<
    GalleryPageResult,
    Error,
    InfiniteData<GalleryPageResult, number>,
    readonly unknown[],
    number
  >({
    queryKey: queryKeys.gallery.list(normalizedSlug === 'all' ? undefined : normalizedSlug),
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1, signal }) => {
      const page = Number(pageParam) || 1
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      let query = supabase
        .from('gallery_images')
        .select(GALLERY_QUERY_PROJECTION, { count: 'exact' })
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (roomFilter && roomFilter.dbValue) {
        if (roomFilter.slug === 'office') {
          query = query.or('room_type.eq.Executive Office,room_type.eq.Office,room_type.ilike.%office%')
        } else if (roomFilter.slug === 'outdoor') {
          query = query.or('room_type.eq.Outdoor & Patio,room_type.eq.Outdoor,room_type.ilike.%outdoor%')
        } else {
          query = query.ilike('room_type', `%${roomFilter.label}%`)
        }
      }

      if (signal) {
        query = query.abortSignal(signal)
      }

      const { data, count, error } = await query

      if (error) {
        throw normalizeError(error)
      }

      const rawItems = (data as unknown as GalleryItemWithProduct[]) || []
      
      // Filter linked products to ensure only published ones are linked
      const images: GalleryItemWithProduct[] = rawItems.map((item) => ({
        ...item,
        products: item.products && item.products.is_published ? item.products : null,
      }))

      const totalCount = count || 0
      const hasNextPage = to + 1 < totalCount

      return {
        images,
        nextPage: hasNextPage ? page + 1 : null,
        totalCount,
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: CACHE_TIMES.PUBLIC_STALE_MS,
  })
}

/**
 * Admin gallery management query.
 */
export function useAdminGallery() {
  return useQuery<GalleryImageRow[], Error>({
    queryKey: queryKeys.gallery.adminList(),
    queryFn: async ({ signal }) => {
      let query = supabase
        .from('gallery_images')
        .select(
          'id, storage_path, alt_text, room_type, product_id, sort_order, is_active, created_at, updated_at'
        )
        .order('sort_order', { ascending: true })

      if (signal) {
        query = query.abortSignal(signal)
      }

      const { data, error } = await query

      if (error) {
        throw normalizeError(error)
      }

      return (data as GalleryImageRow[]) || []
    },
    staleTime: CACHE_TIMES.ADMIN_STALE_MS,
  })
}
