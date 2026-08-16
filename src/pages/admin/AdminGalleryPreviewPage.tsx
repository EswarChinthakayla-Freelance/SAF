import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { PageMeta } from '@/components/seo/PageMeta'
import { GalleryInspectorTopbar } from '@/components/admin/gallery/preview/GalleryInspectorTopbar'
import { GalleryImageCanvas } from '@/components/admin/gallery/preview/GalleryImageCanvas'
import { GalleryMetadataPanel } from '@/components/admin/gallery/preview/GalleryMetadataPanel'
import { GalleryInspectorSkeleton } from '@/components/admin/gallery/preview/GalleryInspectorSkeleton'
import { GalleryMetadataSheet } from '@/components/admin/gallery/GalleryMetadataSheet'
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog'
import { Button } from '@/components/ui/button'
import { useAdminGalleryDetail, useAdminGallerySequence } from '@/hooks/queries/useGallery'
import { useGalleryMutations } from '@/hooks/mutations/useGalleryMutations'
import { HugeiconsIcon } from '@hugeicons/react'
import { AlertCircleIcon, ArrowLeft01Icon } from '@hugeicons/core-free-icons'

export const AdminGalleryPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  // 1. Fetch Current Image Detail
  const {
    data: image,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminGalleryDetail(id)

  // 2. Fetch Sequence for Previous/Next navigation
  const { data: sequence = [] } = useAdminGallerySequence()

  // 3. Mutations
  const { deleteGalleryImage, toggleActive } = useGalleryMutations()

  // 4. Modal / Sheet / Fullscreen States
  const [showEditSheet, setShowEditSheet] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Determine current index and neighbor IDs
  const currentIndex = sequence.findIndex((item) => item.id === id)
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < sequence.length - 1

  const handlePrevious = () => {
    if (hasPrevious) {
      const prevImage = sequence[currentIndex - 1]
      navigate(`/admin/gallery/${prevImage.id}/preview`, { replace: true, state: location.state })
    }
  }

  const handleNext = () => {
    if (hasNext) {
      const nextImage = sequence[currentIndex + 1]
      navigate(`/admin/gallery/${nextImage.id}/preview`, { replace: true, state: location.state })
    }
  }

  const handleToggleActive = async () => {
    if (!image) return
    await toggleActive.mutateAsync({ id: image.id, is_active: !image.is_active })
  }

  const handleDeleteConfirm = async () => {
    if (!image) return
    setIsDeleting(true)
    try {
      await deleteGalleryImage.mutateAsync({
        id: image.id,
        storagePath: image.storage_path,
      })
      setShowDeleteDialog(false)
      navigate('/admin/gallery')
    } catch (err) {
      console.error('Failed to delete gallery image:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  // Fullscreen controller with native API and fallback
  const handleToggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement && !(document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen()
        } else if ((document.documentElement as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
          await (document.documentElement as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen()
        }
        setIsFullscreen(true)
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
          await (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen()
        }
        setIsFullscreen(false)
      }
    } catch {
      // Fallback to CSS overlay fullscreen
      setIsFullscreen((prev) => !prev)
    }
  }, [])

  // Listen to native fullscreen exit events (e.g. Esc key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNativeFull = Boolean(
        document.fullscreenElement ||
          (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement
      )
      if (!isNativeFull && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    }
  }, [isFullscreen])

  // 5. Loading State
  if (isLoading) {
    return <GalleryInspectorSkeleton />
  }

  // 6. Error State
  if (isError) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4 font-sans">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-950/50 border border-red-800/40 text-red-400">
          <HugeiconsIcon icon={AlertCircleIcon} className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-[#F5F0E8]">
            We couldn't load this gallery image
          </h1>
          <p className="text-xs text-[#8A847A]">
            {error?.message || 'The requested image could not be loaded.'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            className="h-9 px-4 text-xs bg-[#1C1C1C] border-[#2E2E2E] text-[#F5F0E8] hover:bg-[#262626]"
          >
            Try Again
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/admin/gallery')}
            className="h-9 px-4 text-xs text-[#9B958B] hover:text-[#F5F0E8]"
          >
            Back to Gallery
          </Button>
        </div>
      </div>
    )
  }

  // 7. Not Found State
  if (!image) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 font-sans">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#181818] border border-[#282828] text-[#C9A84C]">
          <HugeiconsIcon icon={AlertCircleIcon} className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-[#F5F0E8]">
            This gallery image could not be found
          </h1>
          <p className="text-xs text-[#8A847A]">
            The image record may have been deleted or moved.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/gallery')}
          className="h-9 px-4 text-xs bg-[#1C1C1C] border-[#2E2E2E] text-[#F5F0E8] hover:bg-[#262626]"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5 mr-1.5" />
          <span>Return to Gallery</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full max-w-[1600px] mx-auto pb-16 font-sans">
      <PageMeta
        title={`${image.room_type || 'Image'} Inspector | Sri Anjaneya Furnitures Admin`}
        description="Inspect high-resolution inspiration imagery, room metadata and catalogue product linking."
      />

      {/* Topbar */}
      <GalleryInspectorTopbar
        image={image}
        currentIndex={currentIndex >= 0 ? currentIndex : undefined}
        totalImages={sequence.length}
        onEditMetadata={() => setShowEditSheet(true)}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
        onToggleActive={handleToggleActive}
        onDelete={() => setShowDeleteDialog(true)}
        backHref="/admin/gallery"
      />

      {/* Main Workspace (Canvas 72-78% on desktop, Metadata 22-28%) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Full Image Canvas Stage */}
        <GalleryImageCanvas
          image={image}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />

        {/* Structured Metadata & Checklist Panel */}
        <GalleryMetadataPanel
          image={image}
          onOpenEditSheet={() => setShowEditSheet(true)}
        />
      </div>

      {/* Slide-Over Metadata Editing Sheet */}
      <GalleryMetadataSheet
        image={image}
        isOpen={showEditSheet}
        onClose={() => setShowEditSheet(false)}
        onSuccess={() => refetch()}
      />

      {/* Delete Confirmation Alert Dialog */}
      <ConfirmDeleteDialog
        isOpen={showDeleteDialog}
        recordType="Gallery Image"
        recordName={image.alt_text || `${image.room_type || 'Gallery'} image`}
        consequenceMessage="This will permanently delete this visual from the public inspiration gallery and clean up the stored photograph from cloud storage."
        confirmLabel="Delete Image"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default AdminGalleryPreviewPage
