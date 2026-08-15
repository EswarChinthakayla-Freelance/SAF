import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { PageMeta } from '@/components/seo/PageMeta'
import { RoomFilter } from '@/components/features/gallery/RoomFilter'
import { GalleryGrid } from '@/components/features/gallery/GalleryGrid'
import { LightboxModal } from '@/components/features/gallery/LightboxModal'
import { GoldButton } from '@/components/brand/GoldButton'
import { useGallery } from '@/hooks/queries/useGallery'
import { GALLERY_ROOM_FILTERS, type GalleryRoomSlug } from '@/lib/constants'

export const GalleryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawRoomParam = searchParams.get('room')?.toLowerCase() || 'all'

  // Validate and normalize room parameter against approved list
  const activeRoomSlug: GalleryRoomSlug = useMemo(() => {
    const matched = GALLERY_ROOM_FILTERS.find((f) => f.slug === rawRoomParam)
    return matched ? matched.slug : 'all'
  }, [rawRoomParam])

  // Gallery Infinite Query (24 records per page)
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useGallery(activeRoomSlug)

  // Flattened gallery items from all loaded pages
  const allImages = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page) => page.images)
  }, [data])

  // Lightbox state & Focus return management
  const [selectedLightboxIndex, setSelectedLightboxIndex] = useState<number | null>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const lastOpenedIndexRef = useRef<number | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Track opened index for focus restoration
  const handleSelectImage = (index: number) => {
    lastOpenedIndexRef.current = index
    setSelectedLightboxIndex(index)
  }

  // Restore focus to the originating tile when Lightbox closes
  const handleCloseLightbox = () => {
    setSelectedLightboxIndex(null)
    const restoreIdx = lastOpenedIndexRef.current
    if (restoreIdx !== null && itemRefs.current[restoreIdx]) {
      setTimeout(() => {
        itemRefs.current[restoreIdx]?.focus()
      }, 50)
    }
  }

  // Room Filter Change handler
  const handleSelectRoom = (roomSlug: GalleryRoomSlug) => {
    const nextParams = new URLSearchParams(searchParams)
    if (roomSlug === 'all') {
      nextParams.delete('room')
    } else {
      nextParams.set('room', roomSlug)
    }
    setSearchParams(nextParams, { replace: false })
  }

  // Safe fetchNextPage wrapper that avoids discriminated union narrowing
  const handleFetchNextPage = useCallback(() => {
    void fetchNextPage()
  }, [fetchNextPage])

  // IntersectionObserver for accessible Infinite Scroll Sentinel
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
          handleFetchNextPage()
        }
      },
      { rootMargin: '300px 0px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, handleFetchNextPage])

  const activeRoomLabel = GALLERY_ROOM_FILTERS.find((f) => f.slug === activeRoomSlug)?.label || 'All Spaces'

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-24 sm:pt-28 pb-24">
      <PageMeta
        title="Furniture Inspiration Gallery | Sri Anjaneya Furnitures"
        description="Explore curated interior spaces and architectural residences featuring bespoke handcrafted solid wood furniture by Sri Anjaneya Furnitures."
        canonicalUrl="/gallery"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* PageHeader Introduction */}
        <PageHeader
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Gallery', isCurrent: true },
          ]}
          eyebrow="INSPIRATION"
          title="Spaces, Styled."
          description="Discover real-world architectural settings, room layouts, and refined living environments elevated by bespoke solid woodcraft."
          className="text-center"
        />

        {/* Room Filter Segmented Controls */}
        <div className="flex justify-center pt-2">
          <RoomFilter activeRoom={activeRoomSlug} onSelectRoom={handleSelectRoom} />
        </div>

        {/* Initial Error State */}
        {isError ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-4 bg-[#111111] border border-[#2A2A2A] p-8 rounded-none">
            <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-800/40 flex items-center justify-center mx-auto text-red-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="font-serif text-xl font-semibold text-[#F5F0E8]">
              We couldn't load inspiration imagery.
            </h2>
            <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
              {error?.message || 'A network error occurred while retrieving gallery images.'}
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <GoldButton onClick={() => refetch()} size="sm">
                Try Again
              </GoldButton>
              <Link to="/products">
                <GoldButton variant="outline" size="sm">
                  Browse Furniture
                </GoldButton>
              </Link>
            </div>
          </div>
        ) : allImages.length === 0 && !isLoading ? (
          /* Empty Room Filter State */
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
              Curated Spaces
            </span>
            <h2 className="font-serif text-2xl text-[#F5F0E8] font-bold">
              No inspiration images are available for this room yet.
            </h2>
            <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
              We are regularly photographing new residences and interior commissions in {activeRoomLabel}.
            </p>
            <div className="pt-3">
              <GoldButton onClick={() => handleSelectRoom('all')} size="sm">
                View All Spaces
              </GoldButton>
            </div>
          </div>
        ) : (
          /* Responsive Editorial Gallery Grid */
          <div className="space-y-12">
            <GalleryGrid
              images={allImages}
              isLoading={isLoading}
              onSelectImage={handleSelectImage}
              itemRefs={itemRefs}
            />

            {/* Next-Page Loading & Failure Handlers */}
            <div className="flex flex-col items-center justify-center pt-4 space-y-4">
              {/* Localized Next-Page Error Recovery (keeps already loaded images) */}
              {isFetchNextPageError && (
                <div className="p-4 rounded-none bg-[#1A1816] border border-red-900/40 text-center space-y-2">
                  <p className="text-xs text-red-400 font-mono">Unable to load more images.</p>
                  <GoldButton onClick={handleFetchNextPage} size="sm">
                    Try Again
                  </GoldButton>
                </div>
              )}

              {/* Next-Page Fetching Spinner */}
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-xs font-mono text-[#C9A84C] py-4">
                  <div className="w-4 h-4 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
                  <span>Loading more inspiration...</span>
                </div>
              )}

              {/* Manual Load More fallback when hasNextPage is true */}
              {hasNextPage && !isFetchingNextPage && !isFetchNextPageError && (
                <GoldButton
                  variant="outline"
                  size="sm"
                  onClick={handleFetchNextPage}
                  className="text-xs uppercase tracking-wider"
                >
                  Load More Inspiration
                </GoldButton>
              )}

              {/* End of Gallery Indicator */}
              {!hasNextPage && allImages.length > 0 && !isLoading && (
                <span className="text-[11px] font-mono text-[#555047] uppercase tracking-[0.2em] pt-6">
                  End of Inspiration Gallery
                </span>
              )}
            </div>

            {/* Invisible Scroll Sentinel */}
            <div ref={sentinelRef} className="h-10 w-full pointer-events-none" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Accessible Dialog Lightbox Modal */}
      <LightboxModal
        images={allImages}
        selectedIndex={selectedLightboxIndex}
        onClose={handleCloseLightbox}
        onSelectIndex={setSelectedLightboxIndex}
      />
    </div>
  )
}

export default GalleryPage
