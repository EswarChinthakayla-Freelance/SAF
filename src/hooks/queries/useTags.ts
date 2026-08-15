import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from './queryKeys'
import { CACHE_TIMES } from '@/lib/constants'
import { normalizeError } from '@/lib/errors'
import type { TagRow } from '@/types/app'

/**
 * Public query hook for fetching available furniture tags.
 * Cached efficiently with 5m staleTime to prevent redundant requests.
 */
export function useTags() {
  return useQuery<TagRow[], Error>({
    queryKey: queryKeys.tags.list(),
    queryFn: async ({ signal }) => {
      let query = supabase
        .from('tags')
        .select('id, name, slug')
        .order('name', { ascending: true })

      if (signal) {
        query = query.abortSignal(signal)
      }

      const { data, error } = await query

      if (error) {
        throw normalizeError(error)
      }

      return (data as TagRow[]) || []
    },
    staleTime: CACHE_TIMES.PUBLIC_STALE_MS,
  })
}
