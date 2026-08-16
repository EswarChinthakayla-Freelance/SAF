import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { getMediaUrl } from '@/lib/media'
import { getCollectionFallbackImage } from '@/lib/collectionFallback'
import type { CollectionRow } from '@/types/app'

interface RoomSlideProps {
  collection: CollectionRow
  index: number
  isPriority?: boolean
  shouldReduceMotion?: boolean
}

/**
 * RoomSlide
 * Architectural viewport displaying the active room with independent text transitions,
 * outsized background numerals, framing linework, and customized Link CTA.
 */
export const RoomSlide: React.FC<RoomSlideProps> = ({
  collection,
  index,
  isPriority = false,
  shouldReduceMotion = false,
}) => {
  const fallback = getCollectionFallbackImage(collection.slug, collection.name, index)
  const initialUrl = collection.cover_image_path
    ? getMediaUrl('brand-assets', collection.cover_image_path, 'hero') ||
      getMediaUrl('product-images', collection.cover_image_path, 'hero') ||
      fallback
    : fallback

  const [imgSrc, setImgSrc] = useState(initialUrl)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setImgSrc(initialUrl)
    setHasError(false)
  }, [initialUrl])

  const indexFormatted = String(index + 1).padStart(2, '0')

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#0A0A0A] border border-[#2A2A2A]/80 shadow-2xl">
      {/* 1. Architectural Outsized Background Numeral (Subtle watermark) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-6 text-[180px] lg:text-[240px] font-serif font-bold text-[#F5F0E8]/[0.03] select-none leading-none z-0"
      >
        {indexFormatted}
      </div>

      {/* 2. Architectural Frame Corner Linework */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
        <span className="absolute top-0 left-0 w-8 h-[1px] bg-[#C9A84C]/50" />
        <span className="absolute top-0 left-0 h-8 w-[1px] bg-[#C9A84C]/50" />
        <span className="absolute bottom-0 right-0 w-8 h-[1px] bg-[#C9A84C]/50" />
        <span className="absolute bottom-0 right-0 h-8 w-[1px] bg-[#C9A84C]/50" />
      </div>

      {/* 3. Main Architectural Window Visual Canvas */}
      <div className="relative w-full h-full overflow-hidden bg-[#111111]">
        <AnimatePresence mode="wait">
          <motion.div
            key={collection.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            {!hasError ? (
              <img
                src={imgSrc}
                alt={collection.cover_image_alt || `${collection.name} Collection Room`}
                loading={isPriority ? 'eager' : 'lazy'}
                onError={() => {
                  setHasError(true)
                  setImgSrc(fallback)
                }}
                className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.04]"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1C1A16] via-[#111111] to-[#0A0A0A] flex items-center justify-center p-8">
                <span className="font-serif text-2xl text-[#9B958B] tracking-wide">
                  {collection.name}
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Ambient Dark Gradient Layering for High Contrast Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/50 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/70 via-transparent to-transparent pointer-events-none z-10" />
      </div>

      {/* 4. Overlay Content: Identity, Title, Description, and CTA */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-6 sm:p-8 lg:p-10 flex flex-col justify-end max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={collection.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="space-y-3"
          >
            {/* Spatial Tag */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold block">
                CURATED SPACE / {indexFormatted}
              </span>
              <span className="w-4 h-[1px] bg-[#C9A84C]/40" />
            </div>

            {/* Collection Title */}
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#F5F0E8] font-bold tracking-tight leading-[1.08]">
              {collection.name}
            </h3>

            {/* Room Description */}
            {collection.description && (
              <p className="text-xs sm:text-sm text-[#D1CCC2]/90 line-clamp-2 max-w-xl font-sans font-light leading-relaxed pt-1">
                {collection.description}
              </p>
            )}

            {/* Custom Architectural Link CTA */}
            <div className="pt-3">
              <Link
                to={`/collections/${collection.slug}`}
                aria-label={`Explore ${collection.name} collection`}
                className="group/cta inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] font-mono text-[#F5F0E8] hover:text-[#E8B84B] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C] transition-colors"
              >
                <span className="relative py-1">
                  Explore {collection.name}
                  {/* Expanding gold underline */}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#C9A84C] group-hover/cta:w-full transition-all duration-300 ease-out" />
                </span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  strokeWidth={2}
                  className="w-3.5 h-3.5 text-[#C9A84C] group-hover/cta:translate-x-1.5 transition-transform duration-300"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default RoomSlide
