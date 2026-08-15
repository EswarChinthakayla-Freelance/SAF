import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from './queryKeys'
import { CACHE_TIMES } from '@/lib/constants'
import { normalizeError } from '@/lib/errors'

export interface DashboardMetrics {
  totalProducts: number
  activeCollections: number
  activeGalleryImages: number
  newInquiries7Days: number
}

/**
 * Hook to fetch aggregate dashboard KPI counts using lightweight head: true queries.
 * Prevents downloading any table rows into browser memory.
 */
export function useDashboardMetrics() {
  return useQuery<DashboardMetrics, Error>({
    queryKey: queryKeys.dashboard.metrics(),
    queryFn: async ({ signal }) => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

      // Execute small count queries in parallel
      const [productsRes, collectionsRes, galleryRes, inquiriesRes] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }).abortSignal(signal || new AbortController().signal),
        supabase.from('collections').select('*', { count: 'exact', head: true }).eq('is_active', true).abortSignal(signal || new AbortController().signal),
        supabase.from('gallery_images').select('*', { count: 'exact', head: true }).eq('is_active', true).abortSignal(signal || new AbortController().signal),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new').gte('created_at', sevenDaysAgo).abortSignal(signal || new AbortController().signal),
      ])

      if (productsRes.error) throw normalizeError(productsRes.error)
      if (collectionsRes.error) throw normalizeError(collectionsRes.error)
      if (galleryRes.error) throw normalizeError(galleryRes.error)
      if (inquiriesRes.error) throw normalizeError(inquiriesRes.error)

      return {
        totalProducts: productsRes.count || 0,
        activeCollections: collectionsRes.count || 0,
        activeGalleryImages: galleryRes.count || 0,
        newInquiries7Days: inquiriesRes.count || 0,
      }
    },
    staleTime: CACHE_TIMES.ADMIN_STALE_MS,
  })
}
