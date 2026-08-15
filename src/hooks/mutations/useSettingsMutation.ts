import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/hooks/queries/queryKeys'
import { normalizeError } from '@/lib/errors'
import type { SiteSettingsUpdate } from '@/types/app'

export interface SaveSettingsPayload {
  settings: SiteSettingsUpdate
  featuredProductIds?: string[]
  oldLogoPath?: string | null
  newUploadedLogoPath?: string | null
}

/**
 * Site settings mutation hook for updating singleton brand/contact configuration
 * and homepage featured products relation in one coordinated workflow.
 */
export function useSettingsMutation() {
  const queryClient = useQueryClient()

  const saveSettings = useMutation({
    mutationFn: async ({
      settings,
      featuredProductIds,
      oldLogoPath,
      newUploadedLogoPath,
    }: SaveSettingsPayload) => {
      try {
        // 1. Update site_settings singleton (id = 1)
        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .update(settings)
          .eq('id', 1)
          .select()
          .single()

        if (settingsError || !settingsData) {
          throw normalizeError(settingsError)
        }

        // 2. Synchronize homepage_featured_products relation if provided
        if (featuredProductIds !== undefined) {
          // Delete all current featured product associations
          const { error: deleteError } = await supabase
            .from('homepage_featured_products')
            .delete()
            .neq('product_id', '00000000-0000-0000-0000-000000000000') // Deletes all

          if (deleteError) {
            console.error('[saveSettings] Failed to clear featured products:', deleteError)
            throw normalizeError(deleteError)
          }

          // Insert new featured associations with deterministic sort_order
          if (featuredProductIds.length > 0) {
            const rowsToInsert = featuredProductIds.map((pid, idx) => ({
              product_id: pid,
              sort_order: idx,
            }))

            const { error: insertError } = await supabase
              .from('homepage_featured_products')
              .insert(rowsToInsert)

            if (insertError) {
              console.error('[saveSettings] Failed to insert featured products:', insertError)
              throw normalizeError(insertError)
            }
          }
        }

        // 3. Post-DB confirmation: clean up old replaced logo
        if (
          oldLogoPath &&
          settings.logo_path !== undefined &&
          settings.logo_path !== oldLogoPath
        ) {
          try {
            await supabase.storage.from('brand-assets').remove([oldLogoPath])
          } catch (cleanErr) {
            console.error('[saveSettings] Old logo cleanup failure:', cleanErr)
          }
        }

        return settingsData
      } catch (err) {
        // Compensate newly uploaded logo if DB operation failed
        if (newUploadedLogoPath) {
          try {
            await supabase.storage.from('brand-assets').remove([newUploadedLogoPath])
          } catch (compErr) {
            console.error('[saveSettings] Failed to compensate uploaded logo:', compErr)
          }
        }
        throw normalizeError(err)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.featured() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics() })
    },
    retry: false,
  })

  return {
    saveSettings,
    updateSettings: saveSettings, // Alias for backward compatibility
  }
}
