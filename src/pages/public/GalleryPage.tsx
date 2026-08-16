import React, { useEffect, useRef, useMemo, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { PageMeta } from '@/components/seo/PageMeta'
import { PublicGalleryHero } from '@/components/features/gallery/PublicGalleryHero'
import { GalleryFilterRail } from '@/components/features/gallery/GalleryFilterRail'
import { GalleryGrid } from '@/components/features/gallery/GalleryGrid'
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

  const totalCount = data?.pages?.[0]?.totalCount ?? allImages.length

  const sentinelRef = useRef<HTMLDivElement>(null)

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
      { rootMargin: '400px 0px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, handleFetchNextPage])

  const activeRoomLabel = GALLERY_ROOM_FILTERS.find((f) => f.slug === activeRoomSlug)?.label || 'All Spaces'

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-24 sm:pt-28 pb-24">
      <PageMeta
        title="Spaces, Styled. — Inspiration Gallery | Sri Anjaneya Furnitures"
        description="Explore curated interior spaces and architectural residences featuring bespoke handcrafted solid wood furniture by Sri Anjaneya Furnitures."
        canonicalUrl="/gallery"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* 1. Editorial Public Gallery Hero */}
        <PublicGalleryHero
          totalCount={totalCount}
          activeRoomLabel={activeRoomLabel}
        />

        {/* 2. Room Filter Rail */}
        <div className="pt-1">
          <GalleryFilterRail activeRoom={activeRoomSlug} onSelectRoom={handleSelectRoom} />
        </div>

        {/* 3. Initial Error State */}
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
          /* 4. Refined Empty Room Filter State */
          <div className="py-20 text-center max-w-md mx-auto space-y-4 bg-[#0E0E0E] border border-[#222222] p-8">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
              Curated Spaces
            </span>
            <h2 className="font-serif text-2xl text-[#F5F0E8] font-bold">
              No inspiration images are available for this room yet.
            </h2>
            <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
              We are regularly photographing new residences and interior commissions in {activeRoomLabel}.
            </p>
            <div className="pt-3 flex flex-wrap justify-center gap-3">
              <GoldButton onClick={() => handleSelectRoom('all')} size="sm">
                View All Spaces
              </GoldButton>
              <Link to="/products">
                <GoldButton variant="outline" size="sm">
                  Browse Creations
                </GoldButton>
              </Link>
            </div>
          </div>
        ) : (
          /* 5. Responsive Curated Gallery Grid */
          <div className="space-y-12">
            <GalleryGrid
              images={allImages}
              isLoading={isLoading}
              roomSlug={activeRoomSlug}
            />

            {/* Next-Page Loading & Failure Handlers */}
            <div className="flex flex-col items-center justify-center pt-4 space-y-4">
              {/* Localized Next-Page Error Recovery */}
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

              {/* Manual Load More fallback */}
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
                <div className="text-center pt-6 space-y-2">
                  <span className="text-[11px] font-mono text-[#555047] uppercase tracking-[0.2em] block">
                    End of Inspiration Archive
                  </span>
                  <p className="text-xs text-[#7A746B] font-sans">
                    Have a bespoke residential project in mind?
                  </p>
                </div>
              )}
            </div>

            {/* Invisible Scroll Sentinel */}
            <div ref={sentinelRef} className="h-10 w-full pointer-events-none" aria-hidden="true" />
          </div>
        )}

        {/* 6. Closing Spatial Commission Exploration CTA */}
        <section
          aria-label="Bespoke Spatial Commission Call to Action"
          className="mt-16 p-8 sm:p-12 bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#0A0A0A] border border-[#2A2A2A] flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
              BESPOKE ARCHITECTURAL CRAFT
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F0E8]">
              Envisioning a Custom Spatial Suite?
            </h2>
            <p className="text-xs sm:text-sm text-[#9B958B] font-sans font-light">
              Collaborate directly with our master artisans to sculpt bespoke teak, rosewood, or walnut furniture tailored to your residence.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
            <Link to="/contact">
              <GoldButton size="lg" className="text-xs tracking-wider uppercase font-semibold">
                Request Consultation
              </GoldButton>
            </Link>
            <Link to="/products">
              <GoldButton variant="outline" size="lg" className="text-xs tracking-wider uppercase">
                Explore Creations
              </GoldButton>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default GalleryPage
