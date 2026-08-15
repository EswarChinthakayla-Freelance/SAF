import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { BasicInfoSection, type BasicInfoValues } from './BasicInfoSection'
import { PricingSection, type PricingValues } from './PricingSection'
import { SpecificationsSection, type SpecificationsValues } from './SpecificationsSection'
import { MediaSection } from './MediaSection'
import { VariantsSection, type VariantDraft } from './VariantsSection'
import { TagsSection } from './TagsSection'
import { GoldButton } from '@/components/brand/GoldButton'
import type { CollectionRow, TagRow, ProductImageRow } from '@/types/app'

export interface AdminProductFormValues {
  basic: BasicInfoValues
  pricing: PricingValues
  specs: SpecificationsValues
  images: ProductImageRow[]
  variants: VariantDraft[]
  tagIds: string[]
}

export interface AdminProductFormProps {
  initialValues: AdminProductFormValues
  collections: CollectionRow[]
  availableTags: TagRow[]
  onSave: (values: AdminProductFormValues) => Promise<void>
  onUploadImages: (files: File[]) => Promise<ProductImageRow[] | void>
  onCreateTag?: (name: string) => Promise<TagRow>
  isEditing?: boolean
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  initialValues,
  collections,
  availableTags,
  onSave,
  onUploadImages,
  onCreateTag,
  isEditing = false,
}) => {
  const [values, setValues] = useState<AdminProductFormValues>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Track dirty state relative to initial values
  const handleFieldChange = <K extends keyof AdminProductFormValues>(
    key: K,
    updater: AdminProductFormValues[K] | ((prev: AdminProductFormValues[K]) => AdminProductFormValues[K])
  ) => {
    setValues((prev) => {
      const nextVal = typeof updater === 'function' ? (updater as any)(prev[key]) : updater
      return { ...prev, [key]: nextVal }
    })
    setIsDirty(true)
  }

  // Prevent accidental tab closure if unsaved form is dirty
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!values.basic.name.trim()) errs.name = 'Product title is required'
    if (!values.basic.slug.trim()) errs.slug = 'Slug is required'
    if (values.pricing.price < 0) errs.price = 'Price cannot be negative'
    if (
      values.pricing.compare_price !== null &&
      values.pricing.compare_price !== undefined &&
      values.pricing.compare_price < values.pricing.price
    ) {
      errs.compare_price = 'Compare price must be >= base price'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSaving(true)
    try {
      await onSave(values)
      setIsDirty(false)
    } catch (err: any) {
      console.error('Failed to save product:', err)
      alert(err?.message || 'Failed to save product record.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUploadImagesWrapper = async (files: File[]) => {
    const uploaded = await onUploadImages(files)
    if (uploaded && Array.isArray(uploaded) && uploaded.length > 0) {
      handleFieldChange('images', (prevImages) => {
        const isFirst = prevImages.length === 0
        const mapped = uploaded.map((img, idx) => ({
          ...img,
          is_cover: isFirst && idx === 0,
          sort_order: prevImages.length + idx,
        }))
        return [...prevImages, ...mapped]
      })
    }
  }

  const handleSetCover = (imageId: string) => {
    handleFieldChange('images', (prev) =>
      prev.map((img) => ({
        ...img,
        is_cover: img.id === imageId,
      }))
    )
  }

  const handleUpdateAltText = (imageId: string, altText: string) => {
    handleFieldChange('images', (prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, alt_text: altText } : img
      )
    )
  }

  const handleDeleteImage = (imageId: string) => {
    handleFieldChange('images', (prev) => {
      const remaining = prev.filter((img) => img.id !== imageId)
      // If deleted image was cover, make first remaining image cover
      const hasCover = remaining.some((img) => img.is_cover)
      if (!hasCover && remaining.length > 0) {
        remaining[0].is_cover = true
      }
      return remaining.map((img, idx) => ({ ...img, sort_order: idx }))
    })
  }

  const handleReorderImage = (fromIndex: number, toIndex: number) => {
    handleFieldChange('images', (prev) => {
      const nextImages = [...prev]
      const [moved] = nextImages.splice(fromIndex, 1)
      nextImages.splice(toIndex, 0, moved)
      return nextImages.map((img, idx) => ({ ...img, sort_order: idx }))
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-24">
      {/* Basic Info */}
      <BasicInfoSection
        values={values.basic}
        onChange={(updates) =>
          handleFieldChange('basic', (prev) => ({ ...prev, ...updates }))
        }
        collections={collections}
        errors={errors}
      />

      {/* Pricing & Visibility */}
      <PricingSection
        values={values.pricing}
        onChange={(updates) =>
          handleFieldChange('pricing', (prev) => ({ ...prev, ...updates }))
        }
        errors={errors}
      />

      {/* Specifications */}
      <SpecificationsSection
        values={values.specs}
        onChange={(updates) =>
          handleFieldChange('specs', (prev) => ({ ...prev, ...updates }))
        }
      />

      {/* Media Management */}
      <MediaSection
        images={values.images}
        onUploadImages={handleUploadImagesWrapper}
        onSetCover={handleSetCover}
        onUpdateAltText={handleUpdateAltText}
        onDeleteImage={handleDeleteImage}
        onReorderImage={handleReorderImage}
      />

      {/* Structured Variants */}
      <VariantsSection
        variants={values.variants}
        onChange={(variants) => handleFieldChange('variants', variants)}
        basePrice={values.pricing.price}
      />

      {/* Tags Taxonomy */}
      <TagsSection
        availableTags={availableTags}
        selectedTagIds={values.tagIds}
        onChange={(tagIds) => handleFieldChange('tagIds', tagIds)}
        onCreateTag={onCreateTag}
      />

      {/* Sticky Save Bar (Desktop bottom right, Mobile safe-area bar) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#111111]/95 border-t border-[#2A2A2A] backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="text-xs text-[#9B958B] hidden sm:flex items-center gap-2">
            {isDirty ? (
              <span className="text-[#E8B84B] font-mono font-medium">● Unsaved catalogue changes</span>
            ) : (
              <span className="text-[#7A746B] font-mono">
                {isEditing ? 'Catalogue record synchronized' : 'New product draft'}
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
            <Link
              to="/admin/products"
              className="px-4 py-2.5 text-xs text-[#9B958B] hover:text-[#F5F0E8] rounded-none border border-[#2A2A2A] transition-colors"
            >
              Discard Changes
            </Link>

            <GoldButton
              type="submit"
              size="default"
              loading={isSaving}
              loadingText={isEditing ? 'Saving Updates...' : 'Creating Product...'}
              className="text-xs uppercase tracking-wider font-semibold px-6"
            >
              {isEditing ? 'Save Product Changes' : 'Create Product Record'}
            </GoldButton>
          </div>
        </div>
      </div>
    </form>
  )
}
