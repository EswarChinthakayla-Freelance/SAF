import { useInfiniteQuery, useQuery, type InfiniteData, type UseInfiniteQueryResult } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from './queryKeys'
import { PAGINATION, CACHE_TIMES, GALLERY_ROOM_FILTERS, type GalleryRoomSlug } from '@/lib/constants'
import { normalizeError } from '@/lib/errors'
import type {
  GalleryItemWithProduct,
  AdminGalleryItem,
  AdminGalleryFilters,
  AdminGalleryListResult,
} from '@/types/app'

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
    queryKey: queryKeys.gallery.infiniteList(normalizedSlug === 'all' ? undefined : normalizedSlug),
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
    getNextPageParam: (lastPage) => (lastPage && lastPage.nextPage ? lastPage.nextPage : undefined),
    staleTime: CACHE_TIMES.PUBLIC_STALE_MS,
  })
}

/**
 * Single gallery item inspection query hook by ID.
 * Resolves item with linked product metadata for dedicated full-screen inspection route.
 */
export function useGalleryItem(id?: string) {
  return useQuery<GalleryItemWithProduct | null, Error>({
    queryKey: queryKeys.gallery.detail(id || ''),
    queryFn: async ({ signal }) => {
      if (!id) return null

      let query = supabase
        .from('gallery_images')
        .select(GALLERY_QUERY_PROJECTION)
        .eq('id', id)
        .eq('is_active', true)

      if (signal) {
        query = query.abortSignal(signal)
      }

      const { data, error } = await query.maybeSingle()

      if (error) {
        throw normalizeError(error)
      }

      if (!data) return null

      const rawItem = data as unknown as GalleryItemWithProduct
      return {
        ...rawItem,
        products: rawItem.products && rawItem.products.is_published ? rawItem.products : null,
      }
    },
    enabled: Boolean(id && id.trim().length > 0),
    staleTime: CACHE_TIMES.PUBLIC_STALE_MS,
  })
}

/**
 * Public flat gallery list query for sequence inspection and carousel context.
 */
export function useGalleryList(roomSlug: GalleryRoomSlug | string = 'all', limit = 48) {
  const normalizedSlug = (roomSlug?.toLowerCase() || 'all') as GalleryRoomSlug
  const roomFilter = GALLERY_ROOM_FILTERS.find((f) => f.slug === normalizedSlug)

  return useQuery<GalleryItemWithProduct[], Error>({
    queryKey: queryKeys.gallery.list(normalizedSlug === 'all' ? undefined : normalizedSlug),
    queryFn: async ({ signal }) => {
      let query = supabase
        .from('gallery_images')
        .select(GALLERY_QUERY_PROJECTION)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(limit)

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

      const { data, error } = await query

      if (error) {
        throw normalizeError(error)
      }

      const rawItems = (data as unknown as GalleryItemWithProduct[]) || []
      return rawItems.map((item) => ({
        ...item,
        products: item.products && item.products.is_published ? item.products : null,
      }))
    },
    staleTime: CACHE_TIMES.PUBLIC_STALE_MS,
  })
}

export const ADMIN_GALLERY_PROJECTION =
  'id, storage_path, alt_text, room_type, product_id, sort_order, is_active, created_at, updated_at, products(id, name, slug, product_code, cover_image_path, is_published, price)'

/**
 * Admin gallery management query with search, room filter, visibility filter, product-link filter and pagination.
 */
export function useAdminGallery(filters?: AdminGalleryFilters) {
  const page = filters?.page || 1
  const pageSize = filters?.pageSize || 24
  const search = filters?.search?.trim() || ''
  const roomType = filters?.roomType || 'all'
  const status = filters?.status || 'all'
  const linkedStatus = filters?.linkedStatus || 'all'

  return useQuery<AdminGalleryListResult, Error>({
    queryKey: queryKeys.gallery.adminList({
      page,
      pageSize,
      search,
      roomType,
      status,
      linkedStatus,
    }),
    queryFn: async ({ signal }) => {
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      let query = supabase
        .from('gallery_images')
        .select(ADMIN_GALLERY_PROJECTION, { count: 'exact' })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      // Status filter
      if (status === 'active') {
        query = query.eq('is_active', true)
      } else if (status === 'inactive') {
        query = query.eq('is_active', false)
      }

      // Room filter
      if (roomType && roomType !== 'all') {
        const roomFilter = GALLERY_ROOM_FILTERS.find((f) => f.slug === roomType.toLowerCase() || f.label === roomType)
        if (roomFilter?.dbValue) {
          if (roomFilter.slug === 'office') {
            query = query.or('room_type.eq.Executive Office,room_type.eq.Office,room_type.ilike.%office%')
          } else if (roomFilter.slug === 'outdoor') {
            query = query.or('room_type.eq.Outdoor & Patio,room_type.eq.Outdoor,room_type.ilike.%outdoor%')
          } else {
            query = query.ilike('room_type', `%${roomFilter.label}%`)
          }
        } else {
          query = query.ilike('room_type', `%${roomType}%`)
        }
      }

      // Linked status filter
      if (linkedStatus === 'linked') {
        query = query.not('product_id', 'is', null)
      } else if (linkedStatus === 'unlinked') {
        query = query.is('product_id', null)
      }

      // Search filter (alt text or room)
      if (search) {
        query = query.or(`alt_text.ilike.%${search}%,room_type.ilike.%${search}%`)
      }

      query = query.range(from, to)

      if (signal) {
        query = query.abortSignal(signal)
      }

      const { data, count, error } = await query

      if (error) {
        throw normalizeError(error)
      }

      const rawItems = (data as unknown as AdminGalleryItem[]) || []
      const totalCount = count || 0
      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

      // Also get overall active count for admin stats header
      const { count: activeCount } = await supabase
        .from('gallery_images')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      return {
        images: rawItems,
        totalCount,
        activeCount: activeCount || 0,
        page,
        pageSize,
        totalPages,
      }
    },
    staleTime: CACHE_TIMES.ADMIN_STALE_MS,
  })
}

/**
 * Admin gallery flat sequence query for Reorder Mode and Inspector previous/next navigation.
 */
export function useAdminGallerySequence(filters?: Omit<AdminGalleryFilters, 'page' | 'pageSize'>) {
  const search = filters?.search?.trim() || ''
  const roomType = filters?.roomType || 'all'
  const status = filters?.status || 'all'
  const linkedStatus = filters?.linkedStatus || 'all'

  return useQuery<AdminGalleryItem[], Error>({
    queryKey: queryKeys.gallery.adminList({
      scope: 'sequence',
      search,
      roomType,
      status,
      linkedStatus,
    }),
    queryFn: async ({ signal }) => {
      let query = supabase
        .from('gallery_images')
        .select(ADMIN_GALLERY_PROJECTION)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (status === 'active') {
        query = query.eq('is_active', true)
      } else if (status === 'inactive') {
        query = query.eq('is_active', false)
      }

      if (roomType && roomType !== 'all') {
        const roomFilter = GALLERY_ROOM_FILTERS.find((f) => f.slug === roomType.toLowerCase() || f.label === roomType)
        if (roomFilter?.dbValue) {
          if (roomFilter.slug === 'office') {
            query = query.or('room_type.eq.Executive Office,room_type.eq.Office,room_type.ilike.%office%')
          } else if (roomFilter.slug === 'outdoor') {
            query = query.or('room_type.eq.Outdoor & Patio,room_type.eq.Outdoor,room_type.ilike.%outdoor%')
          } else {
            query = query.ilike('room_type', `%${roomFilter.label}%`)
          }
        } else {
          query = query.ilike('room_type', `%${roomType}%`)
        }
      }

      if (linkedStatus === 'linked') {
        query = query.not('product_id', 'is', null)
      } else if (linkedStatus === 'unlinked') {
        query = query.is('product_id', null)
      }

      if (search) {
        query = query.or(`alt_text.ilike.%${search}%,room_type.ilike.%${search}%`)
      }

      if (signal) {
        query = query.abortSignal(signal)
      }

      const { data, error } = await query

      if (error) {
        throw normalizeError(error)
      }

      return (data as unknown as AdminGalleryItem[]) || []
    },
    staleTime: CACHE_TIMES.ADMIN_STALE_MS,
  })
}

/**
 * Admin gallery single item detail query for The Media Inspector.
 * Fetches record by ID with linked product context regardless of active status.
 */
export function useAdminGalleryDetail(id?: string) {
  return useQuery<AdminGalleryItem | null, Error>({
    queryKey: queryKeys.gallery.adminDetail(id || ''),
    queryFn: async ({ signal }) => {
      if (!id) return null

      let query = supabase
        .from('gallery_images')
        .select(ADMIN_GALLERY_PROJECTION)
        .eq('id', id)

      if (signal) {
        query = query.abortSignal(signal)
      }

      const { data, error } = await query.maybeSingle()

      if (error) {
        throw normalizeError(error)
      }

      if (!data) return null
      return data as unknown as AdminGalleryItem
    },
    enabled: Boolean(id && id.trim().length > 0),
    staleTime: CACHE_TIMES.ADMIN_STALE_MS,
  })
}
