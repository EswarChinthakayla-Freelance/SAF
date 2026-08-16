import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  ViewIcon,
} from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { PriceTag } from '@/components/brand/PriceTag'
import { getMediaUrl } from '@/lib/media'
import { getCollectionFallbackImage } from '@/lib/collectionFallback'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'
import type { ProductListItem } from '@/types/app'

export interface FeaturedCreationStageProps {
  products: ProductListItem[]
  activeIndex: number
  onSelectIndex: (index: number) => void
  onPrev: () => void
  onNext: () => void
}

/**
 * GoldRegisterMark
 * Signature decorative architectural registration mark (4 L-bracket corners & node).
 * Signifies curated precision and craftsmanship.
 */
const GoldRegisterMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    aria-hidden="true"
    className={`absolute pointer-events-none w-7 h-7 flex items-center justify-center ${className}`}
  >
    {/* Corner L-Brackets */}
    <span className="absolute top-0 left-0 w-2.5 h-[1.5px] bg-[#C9A84C]" />
    <span className="absolute top-0 left-0 w-[1.5px] h-2.5 bg-[#C9A84C]" />
    <span className="absolute top-0 right-0 w-2.5 h-[1.5px] bg-[#C9A84C]" />
    <span className="absolute top-0 right-0 w-[1.5px] h-2.5 bg-[#C9A84C]" />
    <span className="absolute bottom-0 left-0 w-2.5 h-[1.5px] bg-[#C9A84C]" />
    <span className="absolute bottom-0 left-0 w-[1.5px] h-2.5 bg-[#C9A84C]" />
    <span className="absolute bottom-0 right-0 w-2.5 h-[1.5px] bg-[#C9A84C]" />
    <span className="absolute bottom-0 right-0 w-[1.5px] h-2.5 bg-[#C9A84C]" />
    {/* Center Node */}
    <span className="w-1 h-1 bg-[#C9A84C] rounded-full shadow-[0_0_6px_#C9A84C]" />
  </div>
)

/**
 * FeaturedCreationStage
 * Desktop & Mobile Exhibition Stage showcasing one dominant product at a time
 * with next-piece anticipation, architectural numbering, and direct visual inspection link.
 */
export const FeaturedCreationStage: React.FC<FeaturedCreationStageProps> = ({
  products,
  activeIndex,
  onSelectIndex,
  onPrev,
  onNext,
}) => {
  const shouldReduceMotion = useReducedMotionPreference()
  const activeProduct = products[activeIndex] || products[0]
  const count = products.length
  const nextIndex = (activeIndex + 1) % count
  const nextProduct = products[nextIndex]

  const activeFallback = getCollectionFallbackImage(
    activeProduct.collections?.slug,
    activeProduct.collections?.name,
    activeIndex
  )
  const activeImageUrl = activeProduct.cover_image_path
    ? getMediaUrl(
        STORAGE_BUCKETS.PRODUCT_IMAGES,
        activeProduct.cover_image_path,
        'featured-stage'
      )
    : activeFallback

  const nextFallback = getCollectionFallbackImage(
    nextProduct.collections?.slug,
    nextProduct.collections?.name,
    nextIndex
  )
  const nextImageUrl = nextProduct.cover_image_path
    ? getMediaUrl(
        STORAGE_BUCKETS.PRODUCT_IMAGES,
        nextProduct.cover_image_path,
        'featured-preview'
      )
    : nextFallback

  const [hasActiveImageError, setHasActiveImageError] = useState(false)
  const [hasHoveredStage, setHasHoveredStage] = useState(false)

  // Reset image error state on active change
  useEffect(() => {
    setHasActiveImageError(false)
  }, [activeProduct.id])

  const mobileScrollRef = useRef<HTMLDivElement>(null)

  // Sync mobile scroll position
  const handleMobileScroll = useCallback(() => {
    if (!mobileScrollRef.current) return
    const { scrollLeft, clientWidth } = mobileScrollRef.current
    if (clientWidth === 0) return
    const newIdx = Math.round(scrollLeft / (clientWidth * 0.88))
    const clamped = Math.max(0, Math.min(count - 1, newIdx))
    if (clamped !== activeIndex) {
      onSelectIndex(clamped)
    }
  }, [count, activeIndex, onSelectIndex])

  const currentFormatted = String(activeIndex + 1).padStart(2, '0')
  const totalFormatted = String(count).padStart(2, '0')

  return (
    <div className="w-full">
      {/* ========================================================================= */}
      {/* 1. DESKTOP EXHIBITION STAGE (>= 1024px)                                   */}
      {/* ========================================================================= */}
      <div className="hidden lg:grid grid-cols-12 gap-8 items-center min-h-[68vh] relative">
        {/* A. Left Product Index Rail (Cols 1-2) */}
        {count > 1 && (
          <div
            role="tablist"
            aria-label="Featured creations index"
            className="col-span-1 flex flex-col justify-center space-y-4"
          >
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#7A746B] font-semibold block mb-2">
              Index
            </span>
            {products.map((p, idx) => {
              const isSelected = idx === activeIndex
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`View featured product ${idx + 1}: ${p.name}`}
                  onClick={() => onSelectIndex(idx)}
                  className={`group text-left transition-all duration-200 cursor-pointer flex items-center gap-2 py-1 ${
                    isSelected ? 'text-[#E8B84B]' : 'text-[#7A746B] hover:text-[#D1CCC2]'
                  }`}
                >
                  <span
                    className={`h-[1.5px] transition-all duration-300 ${
                      isSelected ? 'w-6 bg-[#C9A84C]' : 'w-2 bg-[#2A2A2A] group-hover:w-4 group-hover:bg-[#555047]'
                    }`}
                  />
                  <span className="font-mono text-xs tracking-wider">
                    0{idx + 1}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* B. Center Monumental Exhibition Plate (Cols 2-8 or 1-8) */}
        <div className={`${count > 1 ? 'col-span-7' : 'col-span-8'} relative flex flex-col justify-center`}>
          <div
            onMouseEnter={() => setHasHoveredStage(true)}
            onMouseLeave={() => setHasHoveredStage(false)}
            className="relative w-full h-[62vh] max-h-[640px] bg-[#0E0E0E] border border-[#2A2A2A] overflow-hidden group transition-colors duration-300 hover:border-[#C9A84C]/60"
          >
            {/* Museum Plate Topbar Annotation */}
            <div className="absolute top-0 left-0 right-0 px-5 py-3.5 bg-gradient-to-b from-[#080808]/90 via-[#080808]/40 to-transparent flex items-center justify-between z-20 pointer-events-none">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold">
                  PLATE {currentFormatted}
                </span>
                <span className="text-[#3A3A3A] font-mono text-[10px]">//</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#9B958B]">
                  {activeProduct.collections?.name || 'STUDIO MASTERWORK'}
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7A746B] hidden sm:inline">
                SRI ANJANEYA FURNITURES
              </span>
            </div>

            {/* Signature Gold Register Mark */}
            <GoldRegisterMark className="top-4 right-4 z-20" />

            {/* Active Product Image Plate with Gallery-Plate Shift */}
            <Link
              to={`/products/${activeProduct.slug}/view`}
              aria-label={`Open full image viewer for ${activeProduct.name}`}
              className="relative w-full h-full flex items-center justify-center p-8 bg-white cursor-zoom-in group/canvas block"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProduct.id}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.985, x: 20 }
                  }
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.985, x: -20 }
                  }
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full flex items-center justify-center"
                >
                  {hasActiveImageError || !activeImageUrl ? (
                    <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
                      <div className="w-12 h-12 border border-[#2A2A2A] bg-[#141414] text-[#C9A84C] font-serif flex items-center justify-center">
                        SAF
                      </div>
                      <span className="text-xs font-serif text-[#7A746B]">
                        Creation Image Pending
                      </span>
                    </div>
                  ) : (
                    <img
                      src={activeImageUrl}
                      alt={activeProduct.name}
                      onError={() => setHasActiveImageError(true)}
                      className="max-h-[50vh] max-w-full object-contain mx-auto transition-transform duration-500 group-hover/canvas:scale-[1.02]"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Hover Visual View Affordance */}
              <div
                className={`absolute bottom-4 right-4 z-20 bg-[#0A0A0A]/95 text-[#F5F0E8] border border-[#C9A84C]/50 px-3 py-1.5 flex items-center gap-2 transition-all duration-300 ${
                  hasHoveredStage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <HugeiconsIcon icon={ViewIcon} className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#E8B84B] font-semibold">
                  Inspect Creation
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* C. Right Product Information & Controls Column (Cols 9-12 or 9-12) */}
        <div className={`${count > 1 ? 'col-span-4' : 'col-span-4'} flex flex-col justify-between pl-4 space-y-8`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="space-y-6"
            >
              {/* Collection Eyebrow */}
              {activeProduct.collections?.name && (
                <div className="space-y-1">
                  <span className="text-[11px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold block">
                    {activeProduct.collections.name}
                  </span>
                </div>
              )}

              {/* Product Title */}
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F5F0E8] tracking-tight leading-[1.08]">
                {activeProduct.name}
              </h3>

              {/* Refined Price Tag without yellow badge */}
              <div className="pt-1">
                <PriceTag
                  price={activeProduct.price}
                  comparePrice={activeProduct.compare_price}
                  currency={activeProduct.currency}
                  size="lg"
                  className="font-mono"
                />
              </div>

              {/* Short Statement */}
              {activeProduct.short_desc && (
                <p className="text-sm text-[#9B958B] leading-relaxed font-sans font-light line-clamp-3">
                  {activeProduct.short_desc}
                </p>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={`/products/${activeProduct.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C9A84C] hover:bg-[#E8B84B] active:bg-[#B8973B] text-[#0A0A0A] font-mono text-xs uppercase tracking-widest font-semibold transition-colors shadow-sm"
                >
                  <span>Explore Product</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                </Link>

                <Link
                  to={`/products/${activeProduct.slug}/view`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#171717] hover:bg-[#222222] text-[#D1CCC2] hover:text-[#C9A84C] border border-[#2A2A2A] font-mono text-xs uppercase tracking-widest transition-colors"
                >
                  <HugeiconsIcon icon={ViewIcon} className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>Inspect</span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* D. Next Creation Preview Slice & Navigation Controls */}
          {count > 1 && (
            <div className="pt-6 border-t border-[#2A2A2A] space-y-4">
              <div className="flex items-center justify-between">
                {/* Next Creation Teaser */}
                <button
                  type="button"
                  onClick={onNext}
                  className="flex items-center gap-3 group text-left cursor-pointer"
                  aria-label={`Advance to next creation: ${nextProduct.name}`}
                >
                  <div className="w-14 h-14 bg-white border border-[#2A2A2A] group-hover:border-[#C9A84C] p-1 overflow-hidden shrink-0 transition-colors">
                    <img
                      src={nextImageUrl}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#7A746B] block">
                      Next Creation
                    </span>
                    <span className="text-xs font-serif text-[#D1CCC2] group-hover:text-[#E8B84B] transition-colors line-clamp-1">
                      {nextProduct.name}
                    </span>
                  </div>
                </button>

                {/* Previous / Next Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onPrev}
                    aria-label="Previous creation"
                    className="h-9 w-9 rounded-none bg-[#111111] border-[#2A2A2A] text-[#D1CCC2] hover:text-[#C9A84C] hover:border-[#C9A84C] cursor-pointer"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onNext}
                    aria-label="Next creation"
                    className="h-9 w-9 rounded-none bg-[#111111] border-[#2A2A2A] text-[#D1CCC2] hover:text-[#C9A84C] hover:border-[#C9A84C] cursor-pointer"
                  >
                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE & TABLET NATIVE HORIZONTAL EXHIBITION STRIP (< 1024px)          */}
      {/* ========================================================================= */}
      <div className="block lg:hidden space-y-6">
        {/* Horizontal Native Snap Strip */}
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="flex gap-4 overflow-x-auto px-4 sm:px-6 scroll-smooth snap-x snap-mandatory no-scrollbar"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {products.map((product, idx) => {
            const fallbackImg = getCollectionFallbackImage(
              product.collections?.slug,
              product.collections?.name,
              idx
            )
            const imgUrl = product.cover_image_path
              ? getMediaUrl(
                  STORAGE_BUCKETS.PRODUCT_IMAGES,
                  product.cover_image_path,
                  'featured-stage'
                )
              : fallbackImg

            return (
              <div
                key={product.id}
                className="w-[88vw] sm:w-[72vw] shrink-0 snap-start bg-[#0E0E0E] border border-[#2A2A2A] overflow-hidden flex flex-col"
              >
                {/* Mobile Display Plate Header */}
                <div className="px-4 py-2.5 bg-[#080808] border-b border-[#2A2A2A] flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#C9A84C] font-semibold">
                    PLATE 0{idx + 1}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#7A746B] truncate max-w-[140px]">
                    {product.collections?.name || 'STUDIO PIECE'}
                  </span>
                </div>

                {/* Mobile Image Plate */}
                <Link
                  to={`/products/${product.slug}/view`}
                  aria-label={`Open full image viewer for ${product.name}`}
                  className="relative aspect-[4/3] bg-white flex items-center justify-center p-4"
                >
                  <GoldRegisterMark className="top-2 right-2" />
                  <img
                    src={imgUrl}
                    alt={product.name}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute bottom-2 right-2 bg-[#0A0A0A]/90 text-[#E8B84B] px-2 py-1 flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider border border-[#2A2A2A]">
                    <HugeiconsIcon icon={ViewIcon} className="w-3 h-3 text-[#C9A84C]" />
                    <span>Inspect</span>
                  </div>
                </Link>

                {/* Mobile Information Stack */}
                <div className="p-5 space-y-3 bg-[#0A0A0A] flex-1 flex flex-col justify-between border-t border-[#2A2A2A]">
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-serif font-bold text-[#F5F0E8]">
                      {product.name}
                    </h3>
                    <div className="pt-0.5">
                      <PriceTag
                        price={product.price}
                        comparePrice={product.compare_price}
                        currency={product.currency}
                        size="default"
                        className="font-mono"
                      />
                    </div>
                    {product.short_desc && (
                      <p className="text-xs text-[#9B958B] line-clamp-2 font-sans font-light leading-relaxed">
                        {product.short_desc}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 flex items-center gap-2">
                    <Link
                      to={`/products/${product.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-[#C9A84C] hover:bg-[#E8B84B] text-[#0A0A0A] font-mono text-xs uppercase tracking-wider font-semibold"
                    >
                      <span>Explore</span>
                      <HugeiconsIcon icon={ArrowRight02Icon} className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/products/${product.slug}/view`}
                      className="px-3.5 py-2.5 bg-[#171717] hover:bg-[#222222] text-[#D1CCC2] border border-[#2A2A2A] font-mono text-xs uppercase"
                      aria-label={`Inspect ${product.name}`}
                    >
                      <HugeiconsIcon icon={ViewIcon} className="w-4 h-4 text-[#C9A84C]" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile Counter & Nav Controls */}
        {count > 1 && (
          <div className="flex items-center justify-between px-4 sm:px-6">
            <span className="font-mono text-xs text-[#C9A84C] tracking-widest font-semibold">
              {currentFormatted} / {totalFormatted}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onPrev}
                disabled={activeIndex === 0}
                aria-label="Previous creation"
                className="h-8 w-8 rounded-none bg-[#111111] border-[#2A2A2A] text-[#D1CCC2] disabled:opacity-30 cursor-pointer"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onNext}
                disabled={activeIndex === count - 1}
                aria-label="Next creation"
                className="h-8 w-8 rounded-none bg-[#111111] border-[#2A2A2A] text-[#D1CCC2] disabled:opacity-30 cursor-pointer"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeaturedCreationStage
