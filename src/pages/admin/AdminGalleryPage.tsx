import React, { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AdminImageUploader } from '@/components/admin/AdminImageUploader'
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog'
import { GoldButton } from '@/components/brand/GoldButton'
import { useAdminGallery } from '@/hooks/queries/useGallery'
import { useAdminProducts } from '@/hooks/queries/useProducts'
import { useGalleryMutations } from '@/hooks/mutations/useGalleryMutations'
import { getMediaUrl } from '@/lib/media'
import { GALLERY_ROOM_FILTERS } from '@/lib/constants'
import { supabase } from '@/lib/supabase'
import type { GalleryImageRow } from '@/types/app'

export const AdminGalleryPage: React.FC = () => {
  const { data: galleryImages = [], isLoading, isError, error, refetch } = useAdminGallery()
  const { data: productsData } = useAdminProducts({ pageSize: 100 })
  const { createGalleryImage, updateGalleryImage, deleteGalleryImage, toggleActive } =
    useGalleryMutations()

  // Sheet / Modal Editing State
  const [editingImage, setEditingImage] = useState<GalleryImageRow | null>(null)
  const [editFormData, setEditFormData] = useState({
    alt_text: '',
    room_type: 'Living Room',
    product_id: '' as string | null,
    sort_order: 0,
    is_active: true,
  })
  const [isSaving, setIsSaving] = useState(false)

  // Upload modal state
  const [showUploader, setShowUploader] = useState(false)

  // Delete state
  const [imageToDelete, setImageToDelete] = useState<GalleryImageRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOpenEdit = (img: GalleryImageRow) => {
    setEditingImage(img)
    setEditFormData({
      alt_text: img.alt_text || '',
      room_type: img.room_type || 'Living Room',
      product_id: img.product_id || '',
      sort_order: img.sort_order || 0,
      is_active: img.is_active,
    })
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingImage) return
    setIsSaving(true)
    try {
      await updateGalleryImage.mutateAsync({
        id: editingImage.id,
        updates: {
          alt_text: editFormData.alt_text.trim() || null,
          room_type: editFormData.room_type,
          product_id: editFormData.product_id || null,
          sort_order: editFormData.sort_order,
          is_active: editFormData.is_active,
        },
      })
      setEditingImage(null)
    } catch (err) {
      console.error('Failed to update gallery image:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return
    setIsDeleting(true)
    try {
      await deleteGalleryImage.mutateAsync({
        id: imageToDelete.id,
        storagePath: imageToDelete.storage_path,
      })
      setImageToDelete(null)
    } catch (err) {
      console.error('Failed to delete gallery image:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleReorderImage = async (currentIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= galleryImages.length) return

    const reordered = [...galleryImages]
    const [moved] = reordered.splice(currentIndex, 1)
    reordered.splice(targetIndex, 0, moved)

    const payload = reordered.map((item, idx) => ({
      id: item.id,
      sort_order: idx,
    }))

    try {
      await useGalleryMutations().reorderGalleryImages.mutateAsync(payload)
    } catch (err) {
      console.error('Failed to save gallery order:', err)
    }
  }

  const handleBulkUploadFiles = async (files: File[]) => {
    // Bounded concurrency upload (2 concurrent worker tasks)
    const BATCH_SIZE = 2
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const chunk = files.slice(i, i + BATCH_SIZE)
      await Promise.all(
        chunk.map(async (file, chunkIdx) => {
          const fileExt = file.name.split('.').pop()
          const filePath = `inspiration/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`
          const { error: uploadErr } = await supabase.storage
            .from('gallery-images')
            .upload(filePath, file, { upsert: false })

          if (uploadErr) throw uploadErr

          try {
            await createGalleryImage.mutateAsync({
              storage_path: filePath,
              alt_text: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
              room_type: 'Living Room',
              sort_order: (galleryImages.length || 0) + i + chunkIdx + 1,
              is_active: true,
            })
          } catch (dbErr) {
            // Compensate: Delete uploaded storage object if metadata insert fails
            console.error('[handleBulkUploadFiles] Metadata insert failed. Compensating storage file:', filePath)
            await supabase.storage.from('gallery-images').remove([filePath])
            throw dbErr
          }
        })
      )
    }
    setShowUploader(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        variant="admin"
        title="Inspiration Gallery"
        description="Manage inspiration images shown in the public gallery and connect furniture catalogue pieces."
        actions={
          <GoldButton
            onClick={() => setShowUploader((prev) => !prev)}
            size="sm"
            className="text-xs uppercase tracking-wider"
          >
            {showUploader ? 'Close Uploader' : '+ Upload Images'}
          </GoldButton>
        }
      />

      {/* Bulk Uploader Drawer / Panel */}
      {showUploader && (
        <div className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-none space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-serif font-bold text-[#F5F0E8]">Bulk Media Upload</h3>
              <p className="text-xs text-[#9B958B]">
                Upload up to 10 images at once to the gallery bucket with bounded concurrency.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowUploader(false)}
              className="text-xs text-[#9B958B] hover:text-[#F5F0E8]"
            >
              Cancel
            </button>
          </div>

          <AdminImageUploader
            maxFiles={10}
            onUploadFiles={handleBulkUploadFiles}
          />
        </div>
      )}

      {/* Visual Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div key={idx} className="aspect-[4/3] bg-[#111111] rounded-none border border-[#2A2A2A] animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-[#111111] rounded-none border border-[#2A2A2A] space-y-3">
          <p className="text-xs text-red-400">{error?.message || 'Failed to load gallery images.'}</p>
          <GoldButton onClick={() => refetch()} size="sm">
            Try Again
          </GoldButton>
        </div>
      ) : galleryImages.length === 0 ? (
        <div className="p-12 text-center bg-[#111111] rounded-none border border-[#2A2A2A] space-y-3">
          <p className="text-sm font-serif text-[#F5F0E8]">No gallery visuals yet.</p>
          <p className="text-xs text-[#9B958B]">Upload residential interior shoots to populate the public gallery.</p>
          <GoldButton onClick={() => setShowUploader(true)} size="sm">
            + Upload Images
          </GoldButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryImages.map((img, idx) => {
            const thumbUrl = getMediaUrl('gallery-images', img.storage_path, 'card')
            return (
              <div
                key={img.id}
                className="bg-[#111111] border border-[#2A2A2A] rounded-none overflow-hidden group hover:border-[#C9A84C]/40 transition-colors flex flex-col justify-between"
              >
                <div className="aspect-[4/3] bg-[#0A0A0A] relative overflow-hidden">
                  <img
                    src={thumbUrl}
                    alt={img.alt_text || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-black/70 text-[#C9A84C] backdrop-blur-sm border border-black/40">
                      {img.room_type || 'Living Room'}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleActive.mutate({ id: img.id, is_active: !img.is_active })}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold backdrop-blur-sm transition-colors ${img.is_active
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                        : 'bg-black/80 text-stone-400 border border-stone-800'
                        }`}
                    >
                      {img.is_active ? 'Active' : 'Hidden'}
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[#F5F0E8] truncate">
                        {img.alt_text || 'Untitled Visual'}
                      </div>
                      <div className="text-[11px] text-[#7A746B] font-mono">
                        Order: {img.sort_order}
                      </div>
                    </div>

                    {/* Accessible Reorder Controls */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleReorderImage(idx, 'up')}
                        title="Move Up"
                        aria-label={`Move image ${idx + 1} up`}
                        className="p-1 text-xs text-[#9B958B] hover:text-[#C9A84C] disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-[#171717]"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={idx === galleryImages.length - 1}
                        onClick={() => handleReorderImage(idx, 'down')}
                        title="Move Down"
                        aria-label={`Move image ${idx + 1} down`}
                        className="p-1 text-xs text-[#9B958B] hover:text-[#C9A84C] disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-[#171717]"
                      >
                        ▼
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#2A2A2A]">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(img)}
                      className="text-xs text-[#C9A84C] hover:text-[#E8B84B] font-mono font-semibold"
                    >
                      Edit Metadata
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageToDelete(img)}
                      className="text-xs text-red-400 hover:text-red-300 font-mono"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Metadata Editor Slide-Over Sheet */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-fade-in"
            onClick={() => setEditingImage(null)}
          />

          <div className="relative z-10 w-full sm:max-w-md bg-[#111111] border-l border-[#2A2A2A] h-full shadow-2xl flex flex-col overflow-hidden animate-slide-left">
            <div className="px-6 py-5 border-b border-[#2A2A2A] flex items-center justify-between bg-[#141414]">
              <h2 className="text-base font-serif font-semibold text-[#F5F0E8]">Edit Image Metadata</h2>
              <button
                type="button"
                onClick={() => setEditingImage(null)}
                className="p-2 text-[#9B958B] hover:text-[#F5F0E8] rounded-none transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex-1 p-6 space-y-5 overflow-y-auto font-sans text-xs">
              {/* Preview */}
              <div className="aspect-[16/9] rounded-none overflow-hidden bg-[#0A0A0A] border border-[#2A2A2A]">
                <img
                  src={getMediaUrl('gallery-images', editingImage.storage_path, 'card')}
                  alt={editFormData.alt_text}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Alt Text */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-[#F5F0E8] font-semibold">
                  Alt Text / Caption
                </label>
                <input
                  type="text"
                  value={editFormData.alt_text}
                  onChange={(e) => setEditFormData({ ...editFormData, alt_text: e.target.value })}
                  placeholder="e.g. Royal Teak dining set in modern minimalist residence"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-2.5 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
                />
              </div>

              {/* Canonical Room Type */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-[#F5F0E8] font-semibold">
                  Canonical Room Space
                </label>
                <Select
                  items={GALLERY_ROOM_FILTERS.filter((r) => r.slug !== 'all').reduce(
                    (acc, room) => {
                      acc[room.label] = room.label
                      return acc
                    },
                    {} as Record<string, string>
                  )}
                  value={editFormData.room_type}
                  onValueChange={(val) =>
                    setEditFormData({ ...editFormData, room_type: val || 'Living Room' })
                  }
                >
                  <SelectTrigger className="w-full bg-[#0A0A0A] border-[#2A2A2A] text-[#F5F0E8] rounded-none h-10 px-4 text-xs">
                    <SelectValue placeholder="Select Room Space" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border-[#2A2A2A] text-[#F5F0E8] rounded-none shadow-2xl z-50">
                    <SelectGroup>
                      {GALLERY_ROOM_FILTERS.filter((r) => r.slug !== 'all').map((room) => (
                        <SelectItem key={room.slug} value={room.label}>
                          {room.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Linked Product Selection */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-[#F5F0E8] font-semibold">
                  Linked Product CTA (Optional)
                </label>
                <Select
                  items={{
                    none: 'No linked product',
                    ...(productsData?.products || []).reduce((acc, prod) => {
                      acc[prod.id] = `${prod.name} (${prod.product_code || prod.slug})`
                      return acc
                    }, {} as Record<string, string>),
                  }}
                  value={editFormData.product_id || 'none'}
                  onValueChange={(val) =>
                    setEditFormData({
                      ...editFormData,
                      product_id: val === 'none' || !val ? null : val,
                    })
                  }
                >
                  <SelectTrigger className="w-full bg-[#0A0A0A] border-[#2A2A2A] text-[#F5F0E8] rounded-none h-10 px-4 text-xs">
                    <SelectValue placeholder="No linked product" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border-[#2A2A2A] text-[#F5F0E8] rounded-none shadow-2xl z-50 max-h-60">
                    <SelectGroup>
                      <SelectItem value="none">No linked product</SelectItem>
                      {productsData?.products?.map((prod) => (
                        <SelectItem key={prod.id} value={prod.id}>
                          {prod.name} ({prod.product_code || prod.slug})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-[#F5F0E8] font-semibold">
                  Sort Order
                </label>
                <input
                  type="number"
                  min={0}
                  value={editFormData.sort_order}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      sort_order: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-2.5 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-[#171717] rounded-none border border-[#2A2A2A]">
                <div>
                  <div className="font-medium text-[#F5F0E8] text-xs">Public Gallery Visibility</div>
                  <div className="text-[11px] text-[#9B958B]">Visible in public inspiration gallery.</div>
                </div>
                <input
                  type="checkbox"
                  checked={editFormData.is_active}
                  onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.checked })}
                  className="w-4 h-4 accent-[#C9A84C] cursor-pointer"
                />
              </div>

              <div className="pt-4 border-t border-[#2A2A2A] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingImage(null)}
                  className="px-4 py-2 text-xs text-[#9B958B] hover:text-[#F5F0E8] rounded-none border border-[#2A2A2A]"
                >
                  Cancel
                </button>
                <GoldButton
                  type="submit"
                  size="sm"
                  loading={isSaving}
                  loadingText="Saving..."
                >
                  Save Metadata
                </GoldButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        isOpen={Boolean(imageToDelete)}
        recordType="Gallery Visual"
        recordName={imageToDelete?.alt_text || 'Visual'}
        consequenceMessage="Are you sure you want to delete this inspiration image from the public gallery and storage?"
        confirmLabel="Delete Visual"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setImageToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default AdminGalleryPage
