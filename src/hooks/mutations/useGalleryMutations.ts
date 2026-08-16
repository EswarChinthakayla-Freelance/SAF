import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/hooks/queries/queryKeys'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { normalizeError } from '@/lib/errors'
import type { GalleryImageInsert, GalleryImageUpdate } from '@/types/app'

/**
 * Gallery mutations hook with storage synchronization and targeted cache invalidations.
 */
export function useGalleryMutations() {
  const queryClient = useQueryClient()

  const createGalleryImage = useMutation({
    mutationFn: async (payload: GalleryImageInsert) => {
      const { data, error } = await supabase
        .from('gallery_images')
        .insert(payload)
        .select()
        .single()

      if (error || !data) {
        throw normalizeError(error)
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics() })
    },
    retry: false,
  })

  const updateGalleryImage = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: GalleryImageUpdate }) => {
      const { data, error } = await supabase
        .from('gallery_images')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error || !data) {
        throw normalizeError(error)
      }
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all })
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.gallery.adminDetail(data.id) })
      }
    },
    retry: false,
  })

  const deleteGalleryImage = useMutation({
    mutationFn: async ({ id, storagePath }: { id: string; storagePath?: string }) => {
      // 1. Delete database record
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id)

      if (dbError) {
        throw normalizeError(dbError)
      }

      // 2. Remove file from storage if path provided
      if (storagePath) {
        try {
          await supabase.storage.from(STORAGE_BUCKETS.GALLERY_IMAGES).remove([storagePath])
        } catch (storageErr) {
          console.warn('[deleteGalleryImage] Storage cleanup warning:', storageErr)
        }
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics() })
    },
    retry: false,
  })

  const reorderGalleryImages = useMutation({
    mutationFn: async (items: { id: string; sort_order: number }[]) => {
      // Bounded batch updates for reordered items
      const updates = items.map((item) =>
        supabase
          .from('gallery_images')
          .update({ sort_order: item.sort_order })
          .eq('id', item.id)
      )

      await Promise.all(updates)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all })
    },
    retry: false,
  })

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from('gallery_images')
        .update({ is_active })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw normalizeError(error)
      }
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics() })
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.gallery.adminDetail(data.id) })
      }
    },
    retry: false,
  })

  return {
    createGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
    reorderGalleryImages,
    toggleActive,
  }
}
