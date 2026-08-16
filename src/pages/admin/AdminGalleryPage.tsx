import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageMeta } from '@/components/seo/PageMeta'
import { AdminGalleryHeader } from '@/components/admin/gallery/AdminGalleryHeader'
import { AdminGalleryToolbar } from '@/components/admin/gallery/AdminGalleryToolbar'
import { AdminGalleryGrid } from '@/components/admin/gallery/AdminGalleryGrid'
import { AdminGalleryReorder } from '@/components/admin/gallery/AdminGalleryReorder'
import { AdminGalleryUploadQueue } from '@/components/admin/gallery/AdminGalleryUploadQueue'
import { GalleryMetadataSheet } from '@/components/admin/gallery/GalleryMetadataSheet'
import { AdminGalleryPagination } from '@/components/admin/gallery/AdminGalleryPagination'
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog'
import { useAdminGallery, useAdminGallerySequence } from '@/hooks/queries/useGallery'
import { useGalleryMutations } from '@/hooks/mutations/useGalleryMutations'
import type { AdminGalleryItem } from '@/types/app'

export const AdminGalleryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // 1. Filter & Pagination state synced with URL search params
  const search = searchParams.get('q') || ''
  const roomType = searchParams.get('room') || 'all'
  const status = (searchParams.get('status') || 'all') as 'all' | 'active' | 'inactive'
  const linkedStatus = (searchParams.get('linked') || 'all') as 'all' | 'linked' | 'unlinked'
  const page = parseInt(searchParams.get('page') || '1', 10) || 1
  const pageSize = 24

  const isFiltered = Boolean(
    search.trim().length > 0 ||
      roomType !== 'all' ||
      status !== 'all' ||
      linkedStatus !== 'all'
  )

  const updateFilters = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '' || val === 'all') {
        next.delete(key)
      } else {
        next.set(key, val)
      }
    })
    // Reset to page 1 on filter changes if page wasn't explicitly passed
    if (!('page' in updates)) {
      next.delete('page')
    }
    setSearchParams(next, { replace: true })
  }

  // 2. Fetch Paginated Gallery Data
  const {
    data: galleryData,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminGallery({
    search,
    roomType,
    status,
    linkedStatus,
    page,
    pageSize,
  })

  // 3. Mutations
  const { deleteGalleryImage, toggleActive, reorderGalleryImages } = useGalleryMutations()

  // 4. Mode States
  const [isReorderMode, setIsReorderMode] = useState(false)
  const [showUploader, setShowUploader] = useState(false)
  const [editingImage, setEditingImage] = useState<AdminGalleryItem | null>(null)
  const [imageToDelete, setImageToDelete] = useState<AdminGalleryItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // 5. Sequence query for Reorder mode
  const { data: sequenceItems = [] } = useAdminGallerySequence({
    search,
    roomType,
    status,
    linkedStatus,
  })

  const handleToggleActive = (img: AdminGalleryItem) => {
    toggleActive.mutate({ id: img.id, is_active: !img.is_active })
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

  const handleSaveOrder = async (orderedPayload: { id: string; sort_order: number }[]) => {
    await reorderGalleryImages.mutateAsync(orderedPayload)
    setIsReorderMode(false)
  }

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }

  const totalCount = galleryData?.totalCount ?? 0
  const activeCount = galleryData?.activeCount ?? 0
  const images = useMemo(() => galleryData?.images ?? [], [galleryData?.images])
  const totalPages = galleryData?.totalPages ?? 1

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto pb-16 font-sans">
      <PageMeta
        title="Gallery Management | Sri Anjaneya Furnitures Admin"
        description="Admin visual media studio for inspiration gallery, room taxonomy and catalogue product links."
      />

      {/* Page Header */}
      <AdminGalleryHeader
        totalCount={totalCount}
        activeCount={activeCount}
        isReorderMode={isReorderMode}
        onToggleReorderMode={() => setIsReorderMode((prev) => !prev)}
        onOpenUpload={() => setShowUploader(true)}
      />

      {/* Reorder Mode Workspace or Media Command Bar + Grid */}
      {isReorderMode ? (
        <AdminGalleryReorder
          items={sequenceItems}
          onSaveOrder={handleSaveOrder}
          onCancel={() => setIsReorderMode(false)}
        />
      ) : (
        <div className="space-y-6">
          {/* Media Command Bar */}
          <AdminGalleryToolbar
            search={search}
            onSearchChange={(val) => updateFilters({ q: val || null })}
            roomType={roomType}
            onRoomTypeChange={(val) => updateFilters({ room: val === 'all' ? null : val })}
            status={status}
            onStatusChange={(val) => updateFilters({ status: val === 'all' ? null : val })}
            linkedStatus={linkedStatus}
            onLinkedStatusChange={(val) => updateFilters({ linked: val === 'all' ? null : val })}
            onResetFilters={handleResetFilters}
            totalCount={totalCount}
            isFiltered={isFiltered}
          />

          {/* Media Tile Grid */}
          <AdminGalleryGrid
            images={images}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRefetch={refetch}
            isFiltered={isFiltered}
            onResetFilters={handleResetFilters}
            onOpenUpload={() => setShowUploader(true)}
            onEditMetadata={(img) => setEditingImage(img)}
            onToggleActive={handleToggleActive}
            onDelete={(img) => setImageToDelete(img)}
          />

          {/* Pagination */}
          {!isLoading && !isError && (
            <AdminGalleryPagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={(newPage) => updateFilters({ page: String(newPage) })}
            />
          )}
        </div>
      )}

      {/* Bulk Upload Queue Workspace */}
      <AdminGalleryUploadQueue
        isOpen={showUploader}
        onClose={() => setShowUploader(false)}
        currentCount={totalCount}
      />

      {/* Edit Metadata Slide-Over Sheet */}
      <GalleryMetadataSheet
        image={editingImage}
        isOpen={Boolean(editingImage)}
        onClose={() => setEditingImage(null)}
        onSuccess={() => refetch()}
      />

      {/* Delete Confirmation Alert Dialog */}
      <ConfirmDeleteDialog
        isOpen={Boolean(imageToDelete)}
        recordType="Gallery Visual Asset"
        recordName={imageToDelete?.alt_text || imageToDelete?.room_type || 'Image'}
        consequenceMessage="This will permanently delete this visual from the public inspiration gallery and remove its stored photograph from cloud storage."
        confirmLabel="Delete Visual"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setImageToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default AdminGalleryPage
