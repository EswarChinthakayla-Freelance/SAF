import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { PageMeta } from '@/components/seo/PageMeta'
import { ErrorState } from '@/components/common/ErrorState'
import { useGalleryItem, useGalleryList } from '@/hooks/queries/useGallery'
import { GalleryInspectTopbar } from '@/components/features/gallery/GalleryInspectTopbar'
import { GalleryInspectCanvas } from '@/components/features/gallery/GalleryInspectCanvas'
import { GalleryInspectInfo } from '@/components/features/gallery/GalleryInspectInfo'
import { ImageControlDock } from '@/components/features/products/ImageControlDock'
import { getMediaUrl } from '@/lib/media'
import { getCollectionFallbackImage } from '@/lib/collectionFallback'
import { STORAGE_BUCKETS } from '@/lib/constants'

/**
 * GalleryInspectPage
 * Dedicated full-screen image inspection studio at `/gallery/frame/:id`.
 * Provides 100svh light-table examination, deep-zoom, pan, sequence browsing,
 * responsive specifications drawer, and image-aware Web Share.
 */
export const GalleryInspectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const roomSlug = searchParams.get('room') || 'all'

  // Fetch individual frame metadata
  const {
    data: singleImage,
    isLoading: isItemLoading,
    isError: isItemError,
    error: itemError,
    refetch,
  } = useGalleryItem(id)

  // Fetch sequence list for neighboring navigation
  const { data: sequenceList } = useGalleryList(roomSlug, 48)

  const images = useMemo(() => {
    if (!sequenceList || sequenceList.length === 0) {
      return singleImage ? [singleImage] : []
    }
    // If single image not in sequence list, prepend it
    if (singleImage && !sequenceList.some((img) => img.id === singleImage.id)) {
      return [singleImage, ...sequenceList]
    }
    return sequenceList
  }, [sequenceList, singleImage])

  // Current item index within sequence
  const currentIndex = useMemo(() => {
    if (!id || images.length === 0) return 0
    const foundIdx = images.findIndex((img) => img.id === id)
    return foundIdx >= 0 ? foundIdx : 0
  }, [id, images])

  const activeImage = images[currentIndex] || singleImage

  // 1. Zoom, Pan, Drawer, Fullscreen States
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const minZoom = 1
  const maxZoom = 4
  const zoomStep = 0.5

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(maxZoom, Number((prev + zoomStep).toFixed(1))))
  }

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(minZoom, Number((prev - zoomStep).toFixed(1)))
      if (next <= 1) {
        setPan({ x: 0, y: 0 })
      }
      return next
    })
  }

  const handleFit = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleToggleZoom = () => {
    if (zoom > 1.2) {
      handleFit()
    } else {
      setZoom(2)
    }
  }

  // 2. Sequence Navigation
  const handleNavigateSequence = useCallback(
    (targetIndex: number) => {
      if (images.length === 0) return
      const clamped = (targetIndex + images.length) % images.length
      const targetImage = images[clamped]
      if (targetImage) {
        const frameQuery = roomSlug && roomSlug !== 'all' ? `?room=${roomSlug}` : ''
        navigate(`/gallery/frame/${targetImage.id}${frameQuery}`, { replace: true })
        setZoom(1)
        setPan({ x: 0, y: 0 })
      }
    },
    [images, roomSlug, navigate]
  )

  // 3. Fullscreen Controls
  const supportsFullscreen = typeof document !== 'undefined' && Boolean(document.fullscreenEnabled)

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
        setIsFullscreen(false)
      }
    }
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // 4. Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)
      ) {
        return
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          handleNavigateSequence(currentIndex - 1)
          break
        case 'ArrowRight':
          e.preventDefault()
          handleNavigateSequence(currentIndex + 1)
          break
        case '+':
        case '=':
          e.preventDefault()
          handleZoomIn()
          break
        case '-':
        case '_':
          e.preventDefault()
          handleZoomOut()
          break
        case '0':
          e.preventDefault()
          handleFit()
          break
        case 'f':
        case 'F':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'Escape':
          e.preventDefault()
          if (isInfoOpen) {
            setIsInfoOpen(false)
          } else if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {})
          } else {
            const galleryBackUrl = roomSlug && roomSlug !== 'all' ? `/gallery?room=${roomSlug}` : '/gallery'
            navigate(galleryBackUrl)
          }
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, handleNavigateSequence, isInfoOpen, roomSlug, navigate, toggleFullscreen])

  // 5. Loading State
  if (isItemLoading && !activeImage) {
    return (
      <div className="fixed inset-0 bg-[#060606] flex flex-col z-50 font-sans select-none">
        <div className="h-14 bg-[#0B0B0B] border-b border-[#2A2A2A] px-4 flex items-center justify-between">
          <div className="h-4 w-32 bg-[#1A1A1A] animate-pulse" />
          <div className="h-4 w-20 bg-[#1A1A1A] animate-pulse" />
          <div className="h-8 w-8 bg-[#1A1A1A] animate-pulse" />
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-3xl aspect-[4/3] bg-[#111111] border border-[#2A2A2A] animate-pulse flex items-center justify-center">
            <span className="font-mono text-xs text-[#7A746B] uppercase tracking-widest">
              Loading Inspiration Frame...
            </span>
          </div>
        </div>
      </div>
    )
  }

  // 6. Error / Not Found State
  if (isItemError || !activeImage) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center p-6 text-[#F5F0E8]">
        <div className="space-y-4 text-center max-w-md">
          <ErrorState
            title="Inspiration Frame Unavailable"
            message={itemError?.message || 'This inspiration frame is no longer available in the public archive.'}
            onRetry={refetch}
          />
          <div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C9A84C] hover:text-[#E8B84B] pt-2"
            >
              ← Return to Gallery
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const activeImageUrl = activeImage.storage_path
    ? getMediaUrl(STORAGE_BUCKETS.GALLERY_IMAGES, activeImage.storage_path, 'gallery-share')
    : getCollectionFallbackImage(activeImage.room_type || undefined, activeImage.alt_text || undefined, currentIndex)

  const metaTitle = `${activeImage.alt_text || 'Spaces, Styled'} — Inspiration Frame | Sri Anjaneya Furnitures`
  const metaDescription = `Explore architectural inspiration and handcrafted solid wood interior scenes by Sri Anjaneya Furnitures.`

  return (
    <div className="fixed inset-0 bg-[#060606] text-[#F5F0E8] flex flex-col z-50 overflow-hidden font-sans select-none">
      <PageMeta
        title={metaTitle}
        description={metaDescription}
        canonicalUrl={`/gallery/frame/${activeImage.id}`}
        ogImage={activeImageUrl}
      />

      {/* A. Light-Table Topbar */}
      <GalleryInspectTopbar
        image={activeImage}
        currentIndex={currentIndex}
        totalCount={images.length}
        roomSlug={roomSlug}
        isInfoOpen={isInfoOpen}
        onToggleInfo={() => setIsInfoOpen((prev) => !prev)}
        activeImageUrl={activeImageUrl}
      />

      {/* B. Central Light-Table Workspace */}
      <main className="flex-1 relative flex overflow-hidden">
        {/* Main Image Canvas */}
        <div className="flex-1 relative h-full w-full">
          <GalleryInspectCanvas
            image={activeImage}
            zoom={zoom}
            onZoomChange={setZoom}
            pan={pan}
            onPanChange={setPan}
            onToggleZoom={handleToggleZoom}
          />

          {/* Floating Image Control Dock */}
          <div className="absolute bottom-16 lg:bottom-8 left-1/2 -translate-x-1/2 z-20 max-w-[96vw]">
            <ImageControlDock
              zoom={zoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFit={handleFit}
              onReset={handleReset}
              onPrevImage={() => handleNavigateSequence(currentIndex - 1)}
              onNextImage={() => handleNavigateSequence(currentIndex + 1)}
              hasMultipleImages={images.length > 1}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              supportsFullscreen={supportsFullscreen}
            />
          </div>

          {/* Mobile Bottom Sequence Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 lg:hidden flex justify-center z-10 font-mono text-[10px] text-[#7A746B] uppercase tracking-widest pointer-events-none">
              Frame {currentIndex + 1} of {images.length}
            </div>
          )}
        </div>

        {/* C. Collapsible Specifications Sheet */}
        <GalleryInspectInfo
          image={activeImage}
          isOpen={isInfoOpen}
          onClose={() => setIsInfoOpen(false)}
        />
      </main>
    </div>
  )
}

export default GalleryInspectPage
