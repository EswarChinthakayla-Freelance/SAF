import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from './queryKeys'
import { CACHE_TIMES } from '@/lib/constants'
import { normalizeError } from '@/lib/errors'
import type { SiteSettingsRow } from '@/types/app'

/**
 * Global site settings singleton query hook.
 * Shared by Navbar, Footer, Contact, About, and ACP Settings.
 */
export function useSiteSettings() {
  return useQuery<SiteSettingsRow | null, Error>({
    queryKey: queryKeys.settings.detail(),
    queryFn: async ({ signal }) => {
      let query = supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)

      if (signal) {
        query = query.abortSignal(signal)
      }

      const { data, error } = await query.maybeSingle()

      if (error) {
        throw normalizeError(error)
      }

      return (data as SiteSettingsRow) || null
    },
    staleTime: CACHE_TIMES.SETTINGS_STALE_MS,
  })
}
