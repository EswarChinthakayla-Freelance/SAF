import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { useSetAdminBreadcrumbs } from '@/contexts/AdminBreadcrumbContext'
import type { AppBreadcrumbItem } from '@/types/app'
import {
  AdminProductForm,
  type AdminProductFormValues,
} from '@/components/admin/product-form/AdminProductForm'
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog'
import { ErrorState } from '@/components/common/ErrorState'
import { useAdminProduct } from '@/hooks/queries/useProducts'
import { useCollections } from '@/hooks/queries/useCollections'
import { useTags, findOrCreateTag } from '@/hooks/queries/useTags'
import { useProductMutations } from '@/hooks/mutations/useProductMutations'
import { supabase } from '@/lib/supabase'
import type { TagRow, ProductImageRow } from '@/types/app'
import type { Json } from '@/types/database.types'

export const AdminProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: product, isLoading, isError, error, refetch } = useAdminProduct(id)
  const { data: collections = [] } = useCollections({ activeOnly: false })
  const { data: availableTags = [] } = useTags()
  const { updateProduct, deleteProduct } = useProductMutations()

  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [newUploadedPaths, setNewUploadedPaths] = useState<string[]>([])

  // Provide loaded product name to AdminTopbar breadcrumbs
  const breadcrumbItems = useMemo<AppBreadcrumbItem[]>(
    () => [
      { label: 'Admin', href: '/admin' },
      { label: 'Products', href: '/admin/products' },
      { label: product?.name || 'Edit Product', isCurrent: true, isLoading },
    ],
    [product?.name, isLoading]
  )
  useSetAdminBreadcrumbs(breadcrumbItems)

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-[#171717] rounded" />
        <div className="h-10 w-96 bg-[#171717] rounded" />
        <div className="h-96 bg-[#171717] rounded-none" />
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="p-8">
        <ErrorState
          title="Product Not Found"
          message={error?.message || 'The requested product record does not exist or has been deleted.'}
          onRetry={refetch}
        />
      </div>
    )
  }

  // Parse dimensions from JSONB
  const rawDims = (product.dimensions && typeof product.dimensions === 'object' ? product.dimensions : {}) as Record<string, unknown>
  const parsedDimensions: { length: number; width: number; height: number; unit?: 'inches' | 'cm' | 'mm' } = {
    length: Number(rawDims.length) || 0,
    width: Number(rawDims.width) || 0,
    height: Number(rawDims.height) || 0,
    unit: (rawDims.unit as 'inches' | 'cm' | 'mm') || 'inches',
  }

  const initialValues: AdminProductFormValues = {
    basic: {
      name: product.name,
      slug: product.slug,
      product_code: product.product_code || '',
      collection_id: product.collection_id,
      short_desc: product.short_desc || '',
      description: product.description || '',
    },
    pricing: {
      price: product.price,
      compare_price: product.compare_price,
      currency: product.currency,
      is_published: product.is_published,
      sort_order: product.sort_order,
    },
    specs: {
      dimensions: parsedDimensions,
      materials: product.materials || [],
      care_instructions: product.care_instructions || '',
      warranty_info: product.warranty_info || '',
      delivery_info: product.delivery_info || '',
    },
    images:
      product.product_images && product.product_images.length > 0
        ? product.product_images
        : product.cover_image_path
          ? [
              {
                id: `cover-${product.id}`,
                product_id: product.id,
                storage_path: product.cover_image_path,
                alt_text: product.name,
                sort_order: 0,
                is_cover: true,
                created_at: product.created_at,
              },
            ]
          : [],
    variants: (product.product_variants || []).map((v) => ({
      id: v.id,
      label: v.label,
      sku: v.sku || '',
      material: v.material || '',
      color: v.color || '',
      size_label: v.size_label || '',
      price: v.price ?? product.price,
      compare_price: v.compare_price,
      stock_status: v.stock_status,
      sort_order: v.sort_order,
    })),
    tagIds: (product.product_tags || []).map((pt) => pt.tag_id),
  }

  const handleUploadImages = async (files: File[]): Promise<ProductImageRow[]> => {
    const uploadedImages: ProductImageRow[] = []
    const pathsAdded: string[] = []

    for (const file of files) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Storage upload failed:', uploadError)
        throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`)
      }

      pathsAdded.push(filePath)

      uploadedImages.push({
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        product_id: id || '',
        storage_path: filePath,
        alt_text: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        sort_order: 0,
        is_cover: false,
        created_at: new Date().toISOString(),
      })
    }

    setNewUploadedPaths((prev) => [...prev, ...pathsAdded])
    return uploadedImages
  }

  const handleCreateTag = async (name: string): Promise<TagRow> => {
    return findOrCreateTag(name)
  }

  const handleSave = async (values: AdminProductFormValues) => {
    if (!id) return
    const coverImage = values.images.find((img) => img.is_cover) || values.images[0]

    // Compute removed storage paths that are no longer referenced in updated images
    const currentPaths = new Set(values.images.map((img) => img.storage_path))
    const originalImages = product?.product_images || []
    const removedStoragePaths = originalImages
      .map((img) => img.storage_path)
      .filter((p) => p && !currentPaths.has(p))

    const productPayload = {
      name: values.basic.name.trim(),
      slug: values.basic.slug.trim(),
      product_code: values.basic.product_code?.trim() || null,
      collection_id: values.basic.collection_id || null,
      short_desc: values.basic.short_desc?.trim() || null,
      description: values.basic.description?.trim() || null,
      price: values.pricing.price,
      compare_price: values.pricing.compare_price,
      currency: values.pricing.currency || 'INR',
      is_published: values.pricing.is_published,
      sort_order: values.pricing.sort_order || 0,
      dimensions: values.specs.dimensions as unknown as Json,
      materials: values.specs.materials,
      care_instructions: values.specs.care_instructions?.trim() || null,
      warranty_info: values.specs.warranty_info?.trim() || null,
      delivery_info: values.specs.delivery_info?.trim() || null,
      cover_image_path: coverImage?.storage_path || null,
    }

    const variantsPayload = values.variants.map((v, idx) => ({
      label: v.label || `Variant ${idx + 1}`,
      sku: v.sku || null,
      material: v.material || null,
      color: v.color || null,
      size_label: v.size_label || null,
      price: v.price ?? values.pricing.price,
      compare_price: v.compare_price ?? null,
      stock_status: v.stock_status || 'in_stock',
      sort_order: idx,
    }))

    const imagesPayload = values.images.map((img, idx) => ({
      storage_path: img.storage_path,
      alt_text: img.alt_text || null,
      is_cover: img.is_cover || idx === 0,
      sort_order: idx,
    }))

    await updateProduct.mutateAsync({
      id,
      product: productPayload,
      variants: variantsPayload,
      images: imagesPayload,
      tagIds: values.tagIds,
      newUploadedStoragePaths: newUploadedPaths,
      removedStoragePaths,
    })

    navigate('/admin/products')
  }

  const handleDeleteConfirm = async () => {
    if (!id) return
    setIsDeleting(true)
    try {
      await deleteProduct.mutateAsync(id)
      navigate('/admin/products')
    } catch (err) {
      console.error('Failed to delete product:', err)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        variant="admin"
        title={product.name}
        badge={
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold border ${product.is_published
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
              : 'bg-[#171717] text-[#9B958B] border-[#2A2A2A]'
              }`}
          >
            {product.is_published ? 'Published' : 'Draft'}
          </span>
        }
        description={
          product.product_code
            ? `SKU / Code: ${product.product_code}`
            : 'Edit specifications, materials, pricing, and variants.'
        }
        actions={
          <button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            className="text-xs text-red-400 hover:text-red-300 font-mono font-medium px-3 py-2 rounded-none border border-red-900/40 hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            Delete Piece
          </button>
        }
      />

      <AdminProductForm
        key={product.id}
        initialValues={initialValues}
        collections={collections}
        availableTags={availableTags}
        onSave={handleSave}
        onUploadImages={handleUploadImages}
        onCreateTag={handleCreateTag}
        isEditing={true}
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        isOpen={showDeleteDialog}
        recordType="Product"
        recordName={product.name}
        consequenceMessage={`Are you sure you want to permanently delete "${product.name}"? This action cannot be undone.`}
        confirmLabel="Delete Product"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default AdminProductEditPage
