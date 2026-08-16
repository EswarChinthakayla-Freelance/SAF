import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoomRail } from './RoomRail'
import { RoomSlide } from './RoomSlide'
import { RoomProgress } from './RoomProgress'
import { getMediaUrl } from '@/lib/media'
import { getCollectionFallbackImage } from '@/lib/collectionFallback'
import type { CollectionRow } from '@/types/app'

interface RoomJourneyViewportProps {
  collections: CollectionRow[]
  activeIndex: number
  onSelectIndex: (index: number) => void
  onPrev: () => void
  onNext: () => void
  scrollProgress?: number
  shouldReduceMotion?: boolean
}

/**
 * RoomJourneyViewport
 * Desktop 100svh sticky spatial composition hosting the vertical rail, main canvas,
 * next-room preview, progress indicators, and keyboard handlers.
 */
export const RoomJourneyViewport: React.FC<RoomJourneyViewportProps> = ({
  collections,
  activeIndex,
  onSelectIndex,
  onPrev,
  onNext,
  scrollProgress = 0,
  shouldReduceMotion = false,
}) => {
  const currentCollection = collections[activeIndex] || collections[0]
  const nextCollection = collections[activeIndex + 1]

  const [dragStartX, setDragStartX] = useState<number | null>(null)
  const isDragging = useRef(false)

  // Keyboard navigation within the focused spatial region
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      onNext()
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      onPrev()
    }
  }

  // Restrained mouse drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartX(e.clientX)
    isDragging.current = true
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current || dragStartX === null) return
    const diff = dragStartX - e.clientX
    if (diff > 60) {
      onNext()
    } else if (diff < -60) {
      onPrev()
    }
    isDragging.current = false
    setDragStartX(null)
  }

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Spatial Room Rail Carousel"
      className="relative w-full h-[100svh] flex flex-col justify-between p-6 sm:p-8 lg:px-12 lg:py-8 bg-[#0A0A0A] text-[#F5F0E8] overflow-hidden select-none outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C]/50"
    >
      {/* 1. Subtle Section Top Identity & Initial Scroll Cue */}
      <div className="w-full flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#C9A84C] font-semibold">
            02 / SPATIAL NARRATIVE
          </span>
          <span className="w-6 h-[1px] bg-[#2A2A2A]" />
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#9B958B]/60 uppercase hidden sm:inline">
            ARCHITECTURAL INTERIORS
          </span>
        </div>

        {/* Directional Scroll Hint (fades out as user scrolls) */}
        {activeIndex === 0 && scrollProgress < 0.1 && !shouldReduceMotion && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-[#C9A84C]/80"
          >
            <span>SCROLL TO EXPLORE</span>
            <span className="inline-block animate-pulse">↓</span>
          </motion.div>
        )}
      </div>

      {/* 2. Main 12-Column Architectural Layout */}
      <div className="relative flex-1 w-full max-w-7xl mx-auto my-auto grid grid-cols-12 gap-8 items-center z-20">
        
        {/* Left Column: Room Index Rail (Cols 1–2) */}
        <div className="col-span-2 hidden lg:block pr-4">
          <RoomRail
            collections={collections}
            activeIndex={activeIndex}
            onSelect={onSelectIndex}
          />
        </div>

        {/* Center Main Canvas: Active Room Viewport (Cols 3–10) */}
        <div
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="col-span-12 lg:col-span-8 h-[60vh] sm:h-[65vh] lg:h-[68vh] w-full relative cursor-grab active:cursor-grabbing"
        >
          {currentCollection && (
            <RoomSlide
              collection={currentCollection}
              index={activeIndex}
              isPriority={activeIndex === 0}
              shouldReduceMotion={shouldReduceMotion}
            />
          )}
        </div>

        {/* Right Column: Next Room Preview Slice (Cols 11–12) */}
        <div className="col-span-2 hidden lg:flex flex-col justify-center h-[60vh] sm:h-[65vh] lg:h-[68vh] relative">
          <AnimatePresence mode="wait">
            {nextCollection ? (
              <motion.button
                key={nextCollection.id}
                type="button"
                onClick={onNext}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                aria-label={`Preview next room: ${nextCollection.name}`}
                className="group relative w-full h-full bg-[#111111] border border-[#2A2A2A] overflow-hidden text-left cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C]"
              >
                <img
                  src={
                    nextCollection.cover_image_path
                      ? getMediaUrl('brand-assets', nextCollection.cover_image_path, 'card') ||
                        getCollectionFallbackImage(nextCollection.slug, nextCollection.name, activeIndex + 1)
                      : getCollectionFallbackImage(nextCollection.slug, nextCollection.name, activeIndex + 1)
                  }
                  alt=""
                  role="presentation"
                  loading="lazy"
                  className="w-full h-full object-cover filter brightness-[0.4] group-hover:brightness-[0.6] transition-all duration-500 scale-100 group-hover:scale-105"
                />

                {/* Ambient dark veil */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />

                {/* Vertical Anticipation Tag */}
                <div className="absolute bottom-6 left-4 right-4 space-y-1">
                  <span className="text-[9px] uppercase font-mono tracking-[0.2em] text-[#C9A84C] block">
                    NEXT SPACE // {String(activeIndex + 2).padStart(2, '0')}
                  </span>
                  <span className="font-serif text-sm text-[#F5F0E8] font-semibold line-clamp-1 block group-hover:text-[#E8B84B] transition-colors">
                    {nextCollection.name}
                  </span>
                </div>
              </motion.button>
            ) : (
              <div className="w-full h-full border border-dashed border-[#2A2A2A]/40 flex items-center justify-center p-4 text-center">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#9B958B]/30">
                  FINAL SPACE
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Bottom Architectural Progress & Navigation Bar */}
      <div className="w-full max-w-7xl mx-auto z-30">
        <RoomProgress
          total={collections.length}
          activeIndex={activeIndex}
          onPrev={onPrev}
          onNext={onNext}
          canPrev={activeIndex > 0}
          canNext={activeIndex < collections.length - 1}
        />
      </div>
    </div>
  )
}

export default RoomJourneyViewport
