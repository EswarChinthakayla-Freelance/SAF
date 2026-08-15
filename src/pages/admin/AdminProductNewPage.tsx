import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import {
  AdminProductForm,
  type AdminProductFormValues,
} from '@/components/admin/product-form/AdminProductForm'
import { useCollections } from '@/hooks/queries/useCollections'
import { useTags } from '@/hooks/queries/useTags'
import { useProductMutations } from '@/hooks/mutations/useProductMutations'
import { supabase } from '@/lib/supabase'
import type { TagRow, ProductImageRow } from '@/types/app'
import type { Json } from '@/types/database.types'

export const AdminProductNewPage: React.FC = () => {
  const navigate = useNavigate()
  const { data: collections = [] } = useCollections({ activeOnly: false })
  const { data: availableTags = [] } = useTags()
  const { createProduct } = useProductMutations()

  const [initialValues] = useState<AdminProductFormValues>({
    basic: {
      name: '',
      slug: '',
      product_code: '',
      collection_id: null,
      short_desc: '',
      description: '',
    },
    pricing: {
      price: 0,
      compare_price: null,
      currency: 'INR',
      is_published: false,
      sort_order: 0,
    },
    specs: {
      dimensions: { length: 0, width: 0, height: 0, unit: 'inches' },
      materials: [],
      care_instructions: '',
      warranty_info: '',
      delivery_info: '',
    },
    images: [],
    variants: [],
    tagIds: [],
  })

  // Prevent accidental tab closure if unsaved form is active
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const [newUploadedPaths, setNewUploadedPaths] = useState<string[]>([])

  const handleUploadImages = async (files: File[]): Promise<ProductImageRow[]> => {
    // Direct upload to Supabase Storage bucket 'product-images'
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
        product_id: '',
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
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
    const { data, error } = await supabase
      .from('tags')
      .insert({ name: name.trim(), slug })
      .select()
      .single()

    if (error || !data) {
      throw new Error(error?.message || 'Failed to create tag.')
    }
    return data as TagRow
  }

  const handleSave = async (values: AdminProductFormValues) => {
    const coverImage = values.images.find((img) => img.is_cover) || values.images[0]

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

    await createProduct.mutateAsync({
      product: productPayload,
      variants: variantsPayload,
      images: imagesPayload,
      tagIds: values.tagIds,
      newUploadedStoragePaths: newUploadedPaths,
    })

    navigate('/admin/products')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        variant="admin"
        title="Create Furniture Piece"
        description="Configure dimensions, timber species, structured variants, and upload high-res imagery."
      />

      <AdminProductForm
        initialValues={initialValues}
        collections={collections}
        availableTags={availableTags}
        onSave={handleSave}
        onUploadImages={handleUploadImages}
        onCreateTag={handleCreateTag}
        isEditing={false}
      />
    </div>
  )
}

export default AdminProductNewPage
