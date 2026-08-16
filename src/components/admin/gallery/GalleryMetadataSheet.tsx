import React, { useState, useEffect } from 'react'
import { getMediaUrl } from '@/lib/media'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { GoldButton } from '@/components/brand/GoldButton'
import { Button } from '@/components/ui/button'
import { GALLERY_ROOM_FILTERS } from '@/lib/constants'
import { useAdminProducts } from '@/hooks/queries/useProducts'
import { useGalleryMutations } from '@/hooks/mutations/useGalleryMutations'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Edit02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  LinkSquare02Icon,
  ViewIcon,
} from '@hugeicons/core-free-icons'
import type { AdminGalleryItem } from '@/types/app'

export interface GalleryMetadataSheetProps {
  image: AdminGalleryItem | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const GalleryMetadataSheet: React.FC<GalleryMetadataSheetProps> = ({
  image,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { data: productsData } = useAdminProducts({ pageSize: 100 })
  const { updateGalleryImage } = useGalleryMutations()

  const [formData, setFormData] = useState({
    alt_text: '',
    room_type: 'Living Room',
    product_id: null as string | null,
    sort_order: 0,
    is_active: true,
  })

  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Initialize form data when image changes
  useEffect(() => {
    if (image) {
      setFormData({
        alt_text: image.alt_text || '',
        room_type: image.room_type || 'Living Room',
        product_id: image.product_id || null,
        sort_order: image.sort_order || 0,
        is_active: image.is_active,
      })
      setIsDirty(false)
    }
  }, [image])

  if (!isOpen || !image) return null

  const handleClose = () => {
    if (isDirty) {
      const confirmDiscard = window.confirm('You have unsaved metadata edits. Discard changes?')
      if (!confirmDiscard) return
    }
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updateGalleryImage.mutateAsync({
        id: image.id,
        updates: {
          alt_text: formData.alt_text.trim() || null,
          room_type: formData.room_type,
          product_id: formData.product_id,
          sort_order: formData.sort_order,
          is_active: formData.is_active,
        },
      })
      setIsDirty(false)
      onSuccess?.()
      onClose()
    } catch (err) {
      console.error('Failed to update gallery image metadata:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const thumbUrl = getMediaUrl('gallery-images', image.storage_path, 'card')

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Slide-over Sheet */}
      <div className="relative z-10 w-full sm:max-w-lg bg-[#111111] border-l border-[#242424] h-full shadow-2xl flex flex-col overflow-hidden animate-slide-left">
        {/* Sheet Topbar */}
        <div className="px-6 py-4 border-b border-[#242424] flex items-center justify-between bg-[#141414]">
          <div className="space-y-0.5">
            <h2 className="text-base font-sans font-semibold text-[#F5F0E8] flex items-center gap-2">
              <HugeiconsIcon icon={Edit02Icon} className="w-4 h-4 text-[#C9A84C]" />
              <span>Edit Image Metadata</span>
            </h2>
            <p className="text-xs text-[#8A847A]">
              Update presentation metadata, room taxonomy, catalogue links and visibility.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close edit sheet"
            className="p-1.5 rounded text-[#9B958B] hover:text-[#F5F0E8] hover:bg-[#1E1E1E] transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
          </button>
        </div>

        {/* Sheet Body & Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 p-6 space-y-5 overflow-y-auto">
            {/* Live Context Banner */}
            <div className="flex items-center gap-3 p-3 bg-[#161616] border border-[#262626] rounded-none">
              <div className="relative w-16 h-16 rounded bg-[#0A0A0A] overflow-hidden shrink-0 border border-[#2A2A2A]">
                <img src={thumbUrl} alt="Preview thumbnail" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1 min-w-0">
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#0A0A0A] border border-[#2E2E2E] text-[#C9A84C]">
                  {image.room_type || 'Living Room'}
                </span>
                <p className="text-xs font-sans text-[#F5F0E8] truncate font-medium">
                  {image.alt_text || 'Untitled Gallery Asset'}
                </p>
                <p className="text-[10px] font-mono text-[#7A746B] truncate">
                  {image.storage_path}
                </p>
              </div>
            </div>

            {/* Image Description / Alt Text */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase font-semibold text-[#F5F0E8]">
                Image Description / Alt Text
              </label>
              <textarea
                rows={3}
                value={formData.alt_text}
                onChange={(e) => {
                  setFormData({ ...formData, alt_text: e.target.value })
                  setIsDirty(true)
                }}
                placeholder="Describe the image for visitors using assistive technology (e.g. Teak wood architectural four-poster bed in sunlit master suite)"
                className="w-full p-3 bg-[#0A0A0A] border border-[#282828] rounded-none text-xs font-sans text-[#F5F0E8] placeholder:text-[#666158] focus:border-[#C9A84C] focus:outline-none transition-colors resize-none leading-relaxed"
              />
              <p className="text-[11px] text-[#7A746B]">
                Used for public accessibility, screen readers, and showroom keyword discovery.
              </p>
            </div>

            {/* Canonical Room Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase font-semibold text-[#F5F0E8]">
                Room Space
              </label>
              <Select
                items={GALLERY_ROOM_FILTERS.filter((r) => r.slug !== 'all').reduce(
                  (acc, room) => ({ ...acc, [room.label]: room.label }),
                  {} as Record<string, string>
                )}
                value={formData.room_type}
                onValueChange={(val) => {
                  setFormData({ ...formData, room_type: val || 'Living Room' })
                  setIsDirty(true)
                }}
              >
                <SelectTrigger className="w-full h-10 bg-[#0A0A0A] border-[#282828] text-xs text-[#F5F0E8] focus:ring-1 focus:ring-[#C9A84C]">
                  <SelectValue placeholder="Select Room Space" />
                </SelectTrigger>
                <SelectContent className="bg-[#141414] border-[#282828] text-[#F5F0E8]">
                  <SelectGroup>
                    {GALLERY_ROOM_FILTERS.filter((r) => r.slug !== 'all').map((room) => (
                      <SelectItem key={room.slug} value={room.label} className="text-xs font-sans">
                        {room.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Linked Catalogue Product */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase font-semibold text-[#F5F0E8] flex items-center gap-1.5">
                <HugeiconsIcon icon={LinkSquare02Icon} className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>Connected Catalogue Piece (Optional)</span>
              </label>
              <Select
                items={{
                  none: 'No linked product',
                  ...(productsData?.products || []).reduce(
                    (acc, p) => ({
                      ...acc,
                      [p.id]: `${p.name} ${p.product_code ? `(${p.product_code})` : ''}`,
                    }),
                    {} as Record<string, string>
                  ),
                }}
                value={formData.product_id || 'none'}
                onValueChange={(val) => {
                  setFormData({
                    ...formData,
                    product_id: val === 'none' || !val ? null : val,
                  })
                  setIsDirty(true)
                }}
              >
                <SelectTrigger className="w-full h-10 bg-[#0A0A0A] border-[#282828] text-xs text-[#F5F0E8] focus:ring-1 focus:ring-[#C9A84C]">
                  <SelectValue placeholder="No linked product" />
                </SelectTrigger>
                <SelectContent className="bg-[#141414] border-[#282828] text-[#F5F0E8] max-h-60">
                  <SelectGroup>
                    <SelectItem value="none" className="text-xs font-sans text-[#8A847A]">
                      No linked product
                    </SelectItem>
                    {productsData?.products?.map((prod) => (
                      <SelectItem key={prod.id} value={prod.id} className="text-xs font-sans">
                        {prod.name} {prod.product_code ? `(${prod.product_code})` : ''}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-[#7A746B]">
                Visitors can tap "View Piece" on this photo to open the product details.
              </p>
            </div>

            {/* Display Order */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase font-semibold text-[#F5F0E8]">
                Display Order
              </label>
              <input
                type="number"
                min={0}
                value={formData.sort_order}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    sort_order: parseInt(e.target.value, 10) || 0,
                  })
                  setIsDirty(true)
                }}
                className="w-full h-10 px-3 bg-[#0A0A0A] border border-[#282828] rounded-none text-xs font-mono text-[#F5F0E8] focus:border-[#C9A84C] focus:outline-none"
              />
              <p className="text-[11px] text-[#7A746B]">
                Lower numeric values appear earlier in the public gallery sequence.
              </p>
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#161616] border border-[#262626] rounded-none">
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-[#F5F0E8] flex items-center gap-1.5">
                  <HugeiconsIcon icon={ViewIcon} className="w-3.5 h-3.5 text-[#4ADE80]" />
                  <span>Public Gallery Visibility</span>
                </div>
                <div className="text-[11px] text-[#8A847A]">
                  Active images appear in public gallery spaces and filter feeds.
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => {
                  setFormData({ ...formData, is_active: e.target.checked })
                  setIsDirty(true)
                }}
                className="w-4 h-4 accent-[#C9A84C] cursor-pointer"
              />
            </div>
          </div>

          {/* Footer Save & Cancel Controls */}
          <div className="px-6 py-4 border-t border-[#242424] bg-[#141414] flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isSaving}
              className="text-xs text-[#9B958B] hover:text-[#F5F0E8]"
            >
              Cancel
            </Button>

            <GoldButton
              type="submit"
              size="sm"
              loading={isSaving}
              loadingText="Saving Metadata..."
              icon={<HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5" />}
              className="px-5 text-xs font-semibold uppercase tracking-wider"
            >
              Save Metadata
            </GoldButton>
          </div>
        </form>
      </div>
    </div>
  )
}
