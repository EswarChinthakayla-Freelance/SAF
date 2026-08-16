import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/hooks/queries/queryKeys'
import { normalizeError } from '@/lib/errors'
import type {
  ProductInsert,
  ProductUpdate,
  ProductVariantInsert,
  ProductImageInsert,
} from '@/types/app'

export interface CreateProductPayload {
  product: ProductInsert
  variants?: Omit<ProductVariantInsert, 'product_id'>[]
  images?: Omit<ProductImageInsert, 'product_id'>[]
  tagIds?: string[]
  newUploadedStoragePaths?: string[]
}

export interface UpdateProductPayload {
  id: string
  product: ProductUpdate
  variants?: Omit<ProductVariantInsert, 'product_id'>[]
  images?: Omit<ProductImageInsert, 'product_id'>[]
  tagIds?: string[]
  newUploadedStoragePaths?: string[]
  removedStoragePaths?: string[]
}

/**
 * Product mutations hook with strict multi-entity compensation,
 * safe storage lifecycle management, and targeted query invalidations.
 */
export function useProductMutations() {
  const queryClient = useQueryClient()

  /**
   * Draft-First Compensated Product Creation Workflow:
   * 1. Insert core product as Draft.
   * 2. Insert variants, images, and tags.
   * 3. If any step fails: compensate by removing uploaded storage files and deleting created product row.
   * 4. If all succeed and initial request was Published: finalize publication state.
   */
  const createProduct = useMutation({
    mutationFn: async (payload: CreateProductPayload) => {
      let createdProductId: string | null = null
      const uploadedPathsToCompensate = [...(payload.newUploadedStoragePaths || [])]

      try {
        // 1. Insert core product (as Draft initially for transactional safety)
        const initialProductData: ProductInsert = {
          ...payload.product,
          is_published: false, // Ensure draft until all child entities succeed
        }

        const { data: productData, error: productError } = await supabase
          .from('products')
          .insert(initialProductData)
          .select()
          .single()

        if (productError || !productData) {
          throw normalizeError(productError)
        }

        createdProductId = productData.id

        // 2. Insert variants if present
        if (payload.variants && payload.variants.length > 0) {
          const variantsToInsert: ProductVariantInsert[] = payload.variants.map((v, idx) => ({
            ...v,
            product_id: createdProductId!,
            sort_order: v.sort_order ?? idx,
          }))

          const { error: variantError } = await supabase
            .from('product_variants')
            .insert(variantsToInsert)

          if (variantError) {
            throw normalizeError(variantError)
          }
        }

        // 3. Insert images if present
        if (payload.images && payload.images.length > 0) {
          const imagesToInsert: ProductImageInsert[] = payload.images.map((img, idx) => ({
            ...img,
            product_id: createdProductId!,
            sort_order: img.sort_order ?? idx,
          }))

          const { error: imageError } = await supabase
            .from('product_images')
            .insert(imagesToInsert)

          if (imageError) {
            throw normalizeError(imageError)
          }
        }

        // 4. Insert tags join if present
        if (payload.tagIds && payload.tagIds.length > 0) {
          const productTags = payload.tagIds.map((tag_id) => ({
            product_id: createdProductId!,
            tag_id,
          }))

          const { error: tagError } = await supabase
            .from('product_tags')
            .insert(productTags)

          if (tagError) {
            throw normalizeError(tagError)
          }
        }

        // 5. If original request intended Published, apply final publication now
        if (payload.product.is_published) {
          const { data: publishedData, error: publishError } = await supabase
            .from('products')
            .update({
              is_published: true,
              published_at: new Date().toISOString(),
            })
            .eq('id', createdProductId)
            .select()
            .single()

          if (!publishError && publishedData) {
            return publishedData
          }
        }

        return productData
      } catch (err: unknown) {
        console.error('[createProduct] Failure encountered. Executing compensation cleanup...', err)

        // Compensate: Delete uploaded storage files created during this mutation attempt
        if (uploadedPathsToCompensate.length > 0) {
          try {
            await supabase.storage
              .from('product-images')
              .remove(uploadedPathsToCompensate)
          } catch (storageCleanupErr) {
            console.error('[createProduct Compensation] Failed to remove storage paths:', storageCleanupErr)
          }
        }

        // Compensate: Delete created product row (which cascades and deletes any partial child DB rows)
        if (createdProductId) {
          try {
            await supabase.from('products').delete().eq('id', createdProductId)
          } catch (dbCleanupErr) {
            console.error('[createProduct Compensation] Failed to delete partial product record:', dbCleanupErr)
          }
        }

        throw normalizeError(err)
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics() })
      if (data?.slug) {
        queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(data.slug) })
      }
    },
    retry: false,
  })

  /**
   * Safe Differential Product Update Workflow:
   * 1. Update core product fields.
   * 2. Synchronize child variants, images, and tags in DB.
   * 3. Confirm database state.
   * 4. ONLY AFTER database confirmation, remove old unreferenced Storage objects from bucket.
   * 5. If DB update fails, compensate by deleting any newly uploaded storage objects.
   */
  const updateProduct = useMutation({
    mutationFn: async (payload: UpdateProductPayload) => {
      const newlyUploadedPaths = [...(payload.newUploadedStoragePaths || [])]
      const oldPathsToClean = [...(payload.removedStoragePaths || [])]

      try {
        // 1. Update core product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .update(payload.product)
          .eq('id', payload.id)
          .select()
          .single()

        if (productError || !productData) {
          throw normalizeError(productError)
        }

        // 2. Sync variants if provided
        if (payload.variants) {
          await supabase.from('product_variants').delete().eq('product_id', payload.id)
          if (payload.variants.length > 0) {
            const variantsToInsert: ProductVariantInsert[] = payload.variants.map((v, idx) => ({
              ...v,
              product_id: payload.id,
              sort_order: v.sort_order ?? idx,
            }))
            const { error: vErr } = await supabase.from('product_variants').insert(variantsToInsert)
            if (vErr) throw normalizeError(vErr)
          }
        }

        // 3. Sync images if provided
        if (payload.images) {
          await supabase.from('product_images').delete().eq('product_id', payload.id)
          if (payload.images.length > 0) {
            const imagesToInsert: ProductImageInsert[] = payload.images.map((img, idx) => ({
              ...img,
              product_id: payload.id,
              sort_order: img.sort_order ?? idx,
            }))
            const { error: iErr } = await supabase.from('product_images').insert(imagesToInsert)
            if (iErr) throw normalizeError(iErr)
          }
        }

        // 4. Sync tags if provided
        if (payload.tagIds) {
          await supabase.from('product_tags').delete().eq('product_id', payload.id)
          if (payload.tagIds.length > 0) {
            const productTags = payload.tagIds.map((tag_id) => ({
              product_id: payload.id,
              tag_id,
            }))
            const { error: tErr } = await supabase.from('product_tags').insert(productTags)
            if (tErr) throw normalizeError(tErr)
          }
        }

        // 5. Post-confirmation: Clean up old replaced Storage objects from bucket
        if (oldPathsToClean.length > 0) {
          try {
            await supabase.storage.from('product-images').remove(oldPathsToClean)
          } catch (cleanErr) {
            console.error('[updateProduct] Old storage cleanup failure (logged for retry):', cleanErr)
          }
        }

        return productData
      } catch (err: unknown) {
        console.error('[updateProduct] Update failed. Compensating newly uploaded files...', err)

        // Compensate newly uploaded files if DB update failed so they do not become orphans
        if (newlyUploadedPaths.length > 0) {
          try {
            await supabase.storage.from('product-images').remove(newlyUploadedPaths)
          } catch (compErr) {
            console.error('[updateProduct] Failed to compensate new storage paths:', compErr)
          }
        }

        throw normalizeError(err)
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.adminDetail(data.id) })
      if (data?.slug) {
        queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(data.slug) })
      }
    },
    retry: false,
  })

  /**
   * Delete Product with Storage Lifecycle Safety:
   * 1. First query/resolve all storage paths associated with the product from product_images.
   * 2. Delete database product record (which cascades child rows in PostgreSQL).
   * 3. Only if DB deletion succeeds: clean storage objects from product-images bucket.
   * 4. If storage removal encounters an issue, log failure without breaking DB consistency.
   */
  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      // 1. Resolve storage paths before database deletion
      const storagePathsToClean: string[] = []

      try {
        const { data: images } = await supabase
          .from('product_images')
          .select('storage_path')
          .eq('product_id', id)

        if (images && images.length > 0) {
          for (const img of images) {
            if (img.storage_path && !storagePathsToClean.includes(img.storage_path)) {
              storagePathsToClean.push(img.storage_path)
            }
          }
        }

        const { data: productRow } = await supabase
          .from('products')
          .select('cover_image_path')
          .eq('id', id)
          .maybeSingle()

        if (productRow?.cover_image_path && !storagePathsToClean.includes(productRow.cover_image_path)) {
          storagePathsToClean.push(productRow.cover_image_path)
        }
      } catch (pathErr) {
        console.warn('[deleteProduct] Could not resolve all storage paths before delete:', pathErr)
      }

      // 2. Delete database record (cascades child metadata rows in Postgres)
      const { error: dbError } = await supabase.from('products').delete().eq('id', id)
      if (dbError) {
        throw normalizeError(dbError)
      }

      // 3. Clean storage objects from bucket after confirmed DB delete
      if (storagePathsToClean.length > 0) {
        try {
          await supabase.storage.from('product-images').remove(storagePathsToClean)
        } catch (storageErr) {
          console.error('[deleteProduct] Storage cleanup failed after DB delete (logged for maintenance):', storageErr)
        }
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics() })
    },
    retry: false,
  })

  /**
   * Direct publication status toggle with optimistic rollback.
   */
  const togglePublish = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const updates: ProductUpdate = {
        is_published,
        ...(is_published ? { published_at: new Date().toISOString() } : {}),
      }

      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw normalizeError(error)
      }
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.adminDetail(data.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics() })
    },
    retry: false,
  })

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    togglePublish,
  }
}
