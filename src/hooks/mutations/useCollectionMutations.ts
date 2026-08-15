import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/hooks/queries/queryKeys'
import { normalizeError } from '@/lib/errors'
import type { CollectionInsert, CollectionUpdate } from '@/types/app'

/**
 * Collection mutations hook with storage synchronization and targeted query invalidations.
 */
export function useCollectionMutations() {
  const queryClient = useQueryClient()

  const createCollection = useMutation({
    mutationFn: async (payload: CollectionInsert) => {
      const { data, error } = await supabase
        .from('collections')
        .insert(payload)
        .select()
        .single()

      if (error || !data) {
        throw normalizeError(error)
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics() })
    },
    retry: false,
  })

  const updateCollection = useMutation({
    mutationFn: async ({
      id,
      updates,
      oldCoverPath,
    }: {
      id: string
      updates: CollectionUpdate
      oldCoverPath?: string | null
    }) => {
      const { data, error } = await supabase
        .from('collections')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error || !data) {
        throw normalizeError(error)
      }

      // If cover was changed/replaced, clean up old storage object after confirmed DB update
      if (
        oldCoverPath &&
        updates.cover_image_path !== undefined &&
        updates.cover_image_path !== oldCoverPath
      ) {
        try {
          await supabase.storage.from('brand-assets').remove([oldCoverPath])
        } catch (cleanErr) {
          console.error('[updateCollection] Old cover cleanup failure:', cleanErr)
        }
      }

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      if (data?.slug) {
        queryClient.invalidateQueries({ queryKey: queryKeys.collections.detail(data.slug) })
      }
    },
    retry: false,
  })

  const deleteCollection = useMutation({
    mutationFn: async ({ id, coverPath }: { id: string; coverPath?: string | null }) => {
      // 1. If coverPath wasn't passed, resolve it before DB delete
      let storagePathToClean = coverPath
      if (storagePathToClean === undefined) {
        const { data: col } = await supabase
          .from('collections')
          .select('cover_image_path')
          .eq('id', id)
          .maybeSingle()
        storagePathToClean = col?.cover_image_path || null
      }

      // 2. Delete database record (products.collection_id will SET NULL via Postgres foreign key)
      const { error: dbError } = await supabase.from('collections').delete().eq('id', id)
      if (dbError) {
        throw normalizeError(dbError)
      }

      // 3. Remove cover object from brand-assets bucket after confirmed DB delete
      if (storagePathToClean) {
        try {
          await supabase.storage.from('brand-assets').remove([storagePathToClean])
        } catch (cleanErr) {
          console.error('[deleteCollection] Storage cleanup failure (logged for retry):', cleanErr)
        }
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics() })
    },
    retry: false,
  })

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from('collections')
        .update({ is_active })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw normalizeError(error)
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics() })
    },
    retry: false,
  })

  return {
    createCollection,
    updateCollection,
    deleteCollection,
    toggleActive,
  }
}
