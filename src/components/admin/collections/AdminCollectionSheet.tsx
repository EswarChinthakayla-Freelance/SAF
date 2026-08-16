import React, { useState, useEffect } from 'react'
import { AdminImageUploader } from '@/components/admin/AdminImageUploader'
import { GoldButton } from '@/components/brand/GoldButton'
import { getMediaUrl } from '@/lib/media'
import { supabase } from '@/lib/supabase'
import { slugify } from '@/utils/slugify'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Cancel01Icon,
  Image01Icon,
  RefreshIcon,
  Delete02Icon,
  AlertCircleIcon,
} from '@hugeicons/core-free-icons'
import type { AdminCollectionItem, CollectionInsert, CollectionUpdate } from '@/types/app'

export interface AdminCollectionSheetProps {
  isOpen: boolean
  collection: AdminCollectionItem | null
  totalCollectionsCount: number
  onClose: () => void
  onSave: (payload: {
    data: CollectionInsert | CollectionUpdate
    oldCoverPath?: string | null
  }) => Promise<void>
}

export const AdminCollectionSheet: React.FC<AdminCollectionSheetProps> = ({
  isOpen,
  collection,
  totalCollectionsCount,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(collection)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    cover_image_path: null as string | null,
    cover_image_alt: '',
    is_active: true,
    sort_order: 1,
  })

  const [initialData, setInitialData] = useState(formData)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  // Initialize or reset form data when opened
  useEffect(() => {
    if (isOpen) {
      if (collection) {
        const initial = {
          name: collection.name,
          slug: collection.slug,
          description: collection.description || '',
          cover_image_path: collection.cover_image_path,
          cover_image_alt: collection.cover_image_alt || '',
          is_active: collection.is_active,
          sort_order: collection.sort_order,
        }
        setFormData(initial)
        setInitialData(initial)
        setIsSlugManuallyEdited(true)
      } else {
        const initial = {
          name: '',
          slug: '',
          description: '',
          cover_image_path: null,
          cover_image_alt: '',
          is_active: true,
          sort_order: (totalCollectionsCount || 0) + 1,
        }
        setFormData(initial)
        setInitialData(initial)
        setIsSlugManuallyEdited(false)
      }
      setErrorMessage(null)
      setShowDiscardConfirm(false)
    }
  }, [isOpen, collection, totalCollectionsCount])

  // Check if form is dirty
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData)

  const handleRequestClose = () => {
    if (isDirty) {
      setShowDiscardConfirm(true)
    } else {
      onClose()
    }
  }

  const handleForceClose = () => {
    setShowDiscardConfirm(false)
    onClose()
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isSlugManuallyEdited ? prev.slug : slugify(name),
    }))
  }

  const handleRegenerateSlug = () => {
    setFormData((prev) => ({
      ...prev,
      slug: slugify(prev.name),
    }))
    setIsSlugManuallyEdited(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setErrorMessage('Collection name is required.')
      return
    }

    if (!formData.slug.trim()) {
      setErrorMessage('A URL slug is required.')
      return
    }

    setIsSaving(true)
    setErrorMessage(null)

    try {
      await onSave({
        data: {
          name: formData.name.trim(),
          slug: formData.slug.trim().toLowerCase(),
          description: formData.description.trim() || null,
          cover_image_path: formData.cover_image_path || null,
          cover_image_alt: formData.cover_image_alt.trim() || null,
          is_active: formData.is_active,
          sort_order: formData.sort_order,
        },
        oldCoverPath: collection?.cover_image_path,
      })
      onClose()
    } catch (err: unknown) {
      console.error('Failed to save collection:', err)
      const msg = (err instanceof Error ? err.message : null) || 'Failed to save collection record.'
      if (
        msg.includes('unique') ||
        msg.includes('duplicate') ||
        msg.includes('collections_slug_key')
      ) {
        setErrorMessage('A collection with this URL slug already exists. Please choose a distinct slug.')
      } else {
        setErrorMessage(msg)
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={handleRequestClose}
      />

      {/* Slide-Over Sheet Container */}
      <div className="relative z-10 w-full sm:max-w-md md:max-w-lg bg-[#111111] border-l border-[#242424] h-full shadow-2xl flex flex-col overflow-hidden animate-slide-left">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222222] flex items-center justify-between bg-[#141414]">
          <div>
            <h2 className="text-base font-semibold text-[#F5F0E8] tracking-tight">
              {isEditing ? `Edit Collection: ${collection?.name}` : 'Add Collection'}
            </h2>
            <p className="text-xs text-[#8A847A] mt-0.5">
              {isEditing
                ? 'Update collection details, cover image, and visibility.'
                : 'Create a public collection for grouping catalogue products.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRequestClose}
            aria-label="Close sheet"
            className="p-1.5 text-[#8A847A] hover:text-[#F5F0E8] hover:bg-[#1E1E1E] rounded-md transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
          </button>
        </div>

        {/* Unsaved Changes Confirmation Warning */}
        {showDiscardConfirm && (
          <div className="bg-[#1C150A] border-b border-[#C9A84C]/40 px-6 py-3 flex items-center justify-between gap-3 text-xs animate-fade-in">
            <div className="flex items-center gap-2 text-[#E8B84B]">
              <HugeiconsIcon icon={AlertCircleIcon} className="w-4 h-4 shrink-0" />
              <span>You have unsaved edits. Discard changes?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(false)}
                className="px-2.5 py-1 rounded bg-[#242424] hover:bg-[#2C2C2C] text-[#F5F0E8] text-[11px]"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={handleForceClose}
                className="px-2.5 py-1 rounded bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 text-[11px]"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6 overflow-y-auto text-xs">
          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-800/80 text-red-300 text-xs rounded-md flex items-start gap-2">
              <HugeiconsIcon icon={AlertCircleIcon} className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#C9A84C] font-semibold">
              Basic Information
            </div>

            {/* Collection Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="collection-name"
                className="block text-xs font-medium text-[#F5F0E8]"
              >
                Collection Name <span className="text-[#C9A84C]">*</span>
              </label>
              <input
                id="collection-name"
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. Dining & Banquet"
                className="w-full bg-[#161616] border border-[#2A2A2A] hover:border-[#383838] focus:border-[#C9A84C] rounded-md px-3.5 py-2 text-xs text-[#F5F0E8] placeholder:text-[#666158] outline-none transition-colors"
              />
            </div>

            {/* URL Slug */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="collection-slug"
                  className="block text-xs font-medium text-[#F5F0E8]"
                >
                  URL Slug <span className="text-[#C9A84C]">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleRegenerateSlug}
                  className="inline-flex items-center gap-1 text-[11px] text-[#C9A84C] hover:text-[#E8B84B] font-mono cursor-pointer"
                >
                  <HugeiconsIcon icon={RefreshIcon} className="w-3 h-3" />
                  <span>Regenerate</span>
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#666158] font-mono text-xs pointer-events-none">
                  /collections/
                </span>
                <input
                  id="collection-slug"
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => {
                    setIsSlugManuallyEdited(true)
                    setFormData({ ...formData, slug: e.target.value })
                  }}
                  placeholder="dining-banquet"
                  className="w-full bg-[#161616] border border-[#2A2A2A] hover:border-[#383838] focus:border-[#C9A84C] rounded-md pl-24 pr-3 py-2 text-xs text-[#F5F0E8] font-mono placeholder:text-[#666158] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label
                htmlFor="collection-desc"
                className="block text-xs font-medium text-[#F5F0E8]"
              >
                Description
              </label>
              <textarea
                id="collection-desc"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Curated solid wood furniture designed for architectural living spaces..."
                className="w-full bg-[#161616] border border-[#2A2A2A] hover:border-[#383838] focus:border-[#C9A84C] rounded-md p-3 text-xs text-[#F5F0E8] placeholder:text-[#666158] outline-none resize-none leading-relaxed transition-colors"
              />
            </div>
          </div>

          {/* Section 2: Cover & Photography */}
          <div className="space-y-4 pt-4 border-t border-[#222222]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#C9A84C] font-semibold">
              Cover & Photography
            </div>

            {formData.cover_image_path ? (
              <div className="space-y-3">
                <div className="relative aspect-[16/10] rounded-md overflow-hidden bg-[#161616] border border-[#2A2A2A] group">
                  <img
                    src={getMediaUrl('brand-assets', formData.cover_image_path, 'card')}
                    alt={formData.cover_image_alt || formData.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, cover_image_path: null })}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-950/90 text-red-300 border border-red-800 rounded-md text-xs hover:bg-red-900 transition-colors cursor-pointer"
                    >
                      <HugeiconsIcon icon={Delete02Icon} className="w-3.5 h-3.5" />
                      <span>Remove Cover</span>
                    </button>
                  </div>
                </div>

                {/* Alt Text */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="collection-alt"
                    className="block text-xs font-medium text-[#F5F0E8]"
                  >
                    Cover image description
                  </label>
                  <p className="text-[11px] text-[#7A746B]">
                    Describe the image for visitors using assistive technology.
                  </p>
                  <input
                    id="collection-alt"
                    type="text"
                    value={formData.cover_image_alt}
                    onChange={(e) =>
                      setFormData({ ...formData, cover_image_alt: e.target.value })
                    }
                    placeholder="e.g. Master teak dining table with natural oil finish"
                    className="w-full bg-[#161616] border border-[#2A2A2A] hover:border-[#383838] focus:border-[#C9A84C] rounded-md px-3.5 py-2 text-xs text-[#F5F0E8] placeholder:text-[#666158] outline-none transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#9B958B]">
                  <HugeiconsIcon icon={Image01Icon} className="w-4 h-4 text-[#C9A84C]" />
                  <span>Upload high-resolution collection photography:</span>
                </div>
                <AdminImageUploader
                  maxFiles={1}
                  onUploadFiles={async (files) => {
                    if (files.length === 0) return
                    const file = files[0]
                    const fileExt = file.name.split('.').pop()
                    const filePath = `collections/${Date.now()}_${Math.random()
                      .toString(36)
                      .substring(2, 9)}.${fileExt}`
                    const { error: uploadErr } = await supabase.storage
                      .from('brand-assets')
                      .upload(filePath, file, { upsert: false })
                    if (uploadErr) throw uploadErr

                    setFormData((prev) => ({
                      ...prev,
                      cover_image_path: filePath,
                      cover_image_alt:
                        prev.cover_image_alt ||
                        file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
                    }))
                  }}
                />
              </div>
            )}
          </div>

          {/* Section 3: Publishing & Display Order */}
          <div className="space-y-4 pt-4 border-t border-[#222222]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#C9A84C] font-semibold">
              Publishing & Display Order
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-[#161616] rounded-md border border-[#262626]">
              <div>
                <div className="font-medium text-[#F5F0E8] text-xs">Public Visibility</div>
                <div className="text-[11px] text-[#8A847A] mt-0.5">
                  Active collections appear on public catalogue pages.
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                aria-label="Public visibility"
                className="w-4 h-4 accent-[#C9A84C] cursor-pointer"
              />
            </div>

            {/* Display Order Number */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="collection-order"
                  className="block text-xs font-medium text-[#F5F0E8]"
                >
                  Display Order
                </label>
                <span className="text-[10px] text-[#7A746B] font-mono">
                  Lower values appear first
                </span>
              </div>
              <input
                id="collection-order"
                type="number"
                min={0}
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sort_order: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full bg-[#161616] border border-[#2A2A2A] hover:border-[#383838] focus:border-[#C9A84C] rounded-md px-3.5 py-2 text-xs text-[#F5F0E8] outline-none transition-colors font-mono"
              />
            </div>
          </div>

          {/* Spacer for sticky footer */}
          <div className="h-4" />
        </form>

        {/* Sticky Action Footer */}
        <div className="px-6 py-4 border-t border-[#222222] bg-[#141414] flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={handleRequestClose}
            className="px-4 py-2 text-xs font-medium text-[#9B958B] hover:text-[#F5F0E8] rounded-md border border-[#2A2A2A] hover:bg-[#1E1E1E] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <GoldButton
            type="submit"
            onClick={handleSubmit}
            size="sm"
            loading={isSaving}
            loadingText="Saving Collection…"
            className="text-xs uppercase font-mono tracking-wider font-semibold"
          >
            {isEditing ? 'Update Collection' : 'Create Collection'}
          </GoldButton>
        </div>
      </div>
    </div>
  )
}

export default AdminCollectionSheet
