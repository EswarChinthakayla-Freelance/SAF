import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon, ArrowRight01Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { getMediaUrl } from '@/lib/media'
import { getCollectionFallbackImage } from '@/lib/collectionFallback'
import type { CollectionRow } from '@/types/app'

interface MobileRoomStripProps {
  collections: CollectionRow[]
}

/**
 * MobileRoomStrip
 * Purpose-built mobile & tablet experience using native CSS horizontal scroll snap.
 * Presents portrait 4:5 editorial cards with next-room peeking, room tabs, and accessible controls.
 */
export const MobileRoomStrip: React.FC<MobileRoomStripProps> = ({ collections }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Track active slide from native scroll position
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return
    const { scrollLeft, clientWidth } = containerRef.current
    if (clientWidth === 0) return
    const newIndex = Math.round(scrollLeft / (clientWidth * 0.88))
    const clampedIndex = Math.max(0, Math.min(collections.length - 1, newIndex))
    setActiveIndex((prev) => (prev !== clampedIndex ? clampedIndex : prev))
  }, [collections.length])

  const scrollToIndex = (index: number) => {
    if (!containerRef.current) return
    const cardWidth = containerRef.current.clientWidth * 0.88 + 16 // card + gap
    containerRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    })
    setActiveIndex(index)
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const totalFormatted = String(collections.length).padStart(2, '0')
  const currentFormatted = String(activeIndex + 1).padStart(2, '0')

  return (
    <div className="w-full space-y-6">
      {/* 1. Horizontal Room-Label Rail */}
      <div className="overflow-x-auto no-scrollbar px-4 sm:px-6">
        <div className="flex items-center gap-4 border-b border-[#2A2A2A]/60 pb-3 min-w-max">
          {collections.map((col, idx) => {
            const isActive = activeIndex === idx
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => scrollToIndex(idx)}
                className={`relative text-xs uppercase font-mono tracking-[0.18em] py-1 transition-colors ${
                  isActive ? 'text-[#C9A84C] font-semibold' : 'text-[#9B958B]/60 hover:text-[#9B958B]'
                }`}
              >
                {col.name}
                {isActive && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-[#C9A84C]" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Native Snap Horizontal Card Strip */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto px-4 sm:px-6 scroll-smooth snap-x snap-mandatory no-scrollbar"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {collections.map((collection, idx) => {
          const fallback = getCollectionFallbackImage(collection.slug, collection.name, idx)
          const imageUrl = collection.cover_image_path
            ? getMediaUrl('brand-assets', collection.cover_image_path, 'card') || fallback
            : fallback

          return (
            <div
              key={collection.id}
              className="w-[86vw] sm:w-[70vw] shrink-0 snap-start relative aspect-[4/5] bg-[#0E0E0E] border border-[#2A2A2A] overflow-hidden rounded-none shadow-xl flex flex-col justify-end"
            >
              <img
                src={imageUrl}
                alt={collection.cover_image_alt || `${collection.name} Collection`}
                loading={idx === 0 ? 'eager' : 'lazy'}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />

              {/* Contrast protection gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent pointer-events-none" />

              {/* Card Content Overlay */}
              <div className="relative z-10 p-6 space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#C9A84C] font-semibold block">
                  Curated Space // {String(idx + 1).padStart(2, '0')}
                </span>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F0E8] leading-tight">
                  {collection.name}
                </h3>

                {collection.description && (
                  <p className="text-xs text-[#D1CCC2]/90 line-clamp-2 font-sans font-light leading-relaxed">
                    {collection.description}
                  </p>
                )}

                <div className="pt-2">
                  <Link
                    to={`/collections/${collection.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[#E8B84B] font-semibold py-2"
                  >
                    <span>Explore Room</span>
                    <HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2} className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 3. Progress and Navigation Controls */}
      <div className="px-4 sm:px-6 flex items-center justify-between pt-2">
        <div className="text-xs font-mono tracking-wider text-[#9B958B]">
          <span className="text-[#F5F0E8] font-medium">{currentFormatted}</span>
          <span className="text-[#9B958B]/40"> / </span>
          <span>{totalFormatted}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            aria-label="Previous room"
            className="h-9 w-9 rounded-none border-[#2A2A2A] bg-[#0E0E0E] text-[#9B958B] hover:text-[#F5F0E8] disabled:opacity-30 transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="w-4 h-4" aria-hidden="true" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => scrollToIndex(Math.min(collections.length - 1, activeIndex + 1))}
            disabled={activeIndex === collections.length - 1}
            aria-label="Next room"
            className="h-9 w-9 rounded-none border-[#2A2A2A] bg-[#0E0E0E] text-[#9B958B] hover:text-[#F5F0E8] disabled:opacity-30 transition-colors"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MobileRoomStrip
