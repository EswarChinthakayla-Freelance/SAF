import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { getMediaUrl } from '@/lib/media'
import { getCollectionFallbackImage } from '@/lib/collectionFallback'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowDown01Icon, ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import type { CollectionRow } from '@/types/app'

export interface CollectionCoverStageProps {
  collection: CollectionRow
  productCount: number
  onExplorePieces: () => void
  className?: string
}

/**
 * CollectionCoverStage — "The Collection Cover Canvas"
 * Full-bleed cinematic background cover with multi-layer protective gradients,
 * high-contrast navigation zones, and asymmetric editorial identity.
 */
export const CollectionCoverStage: React.FC<CollectionCoverStageProps> = ({
  collection,
  productCount,
  onExplorePieces,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const fallbackHero = getCollectionFallbackImage(collection.slug, collection.name)
  const coverImageUrl = !imgError && collection.cover_image_path
    ? getMediaUrl(STORAGE_BUCKETS.BRAND_ASSETS, collection.cover_image_path, 'hero') || fallbackHero
    : fallbackHero

  // Subtle scroll depth for background image (disabled under prefers-reduced-motion)
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 600], ['0%', '8%'])
  const bgScale = useTransform(scrollY, [0, 600], [1.03, 1.0])

  const pieceCountLabel = productCount === 1 ? '1 Piece in this collection' : `${productCount} Pieces in this collection`

  return (
    <section
      aria-label="Collection Cover Canvas"
      className={`relative w-full min-h-[82svh] sm:min-h-[86svh] lg:min-h-[90svh] flex flex-col justify-between overflow-hidden pt-24 sm:pt-28 pb-12 sm:pb-16 select-none border-b border-[#222222] ${className}`}
    >
      {/* ─── LAYER 1: Full-Bleed Background Media ─── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0A0A0A]">
        {!imgError ? (
          <motion.img
            src={coverImageUrl}
            alt={collection.cover_image_alt || `${collection.name} Collection`}
            onError={() => setImgError(true)}
            loading="eager"
            fetchPriority="high"
            style={
              shouldReduceMotion
                ? undefined
                : {
                    y: bgY,
                    scale: bgScale,
                  }
            }
            className="w-full h-full object-cover object-center sm:object-[center_30%] scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#181818] via-[#0E0E0E] to-[#0A0A0A] flex items-center justify-center">
            <span className="font-serif text-6xl text-[#222222] font-bold select-none opacity-40">
              {collection.name}
            </span>
          </div>
        )}
      </div>

      {/* ─── LAYER 2: Top Navbar & Breadcrumb Contrast Protection ─── */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/85 via-black/45 to-transparent pointer-events-none z-10"
      />

      {/* ─── LAYER 3: Localized Left Editorial Text Gradient ─── */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-full lg:w-3/4 xl:w-2/3 bg-gradient-to-r from-[#050505]/92 via-[#050505]/65 sm:via-[#050505]/45 to-transparent pointer-events-none z-10"
      />

      {/* ─── LAYER 4: Bottom Transition Gradient into Page Content ─── */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/85 sm:via-[#0A0A0A]/35 to-transparent pointer-events-none z-10"
      />

      {/* ─── LAYER 5: Soft Peripheral Vignette ─── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-radial-[circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%] pointer-events-none z-10"
      />

      {/* ─── TOP HEADER BAR: Breadcrumbs & Watermark Folio Marker ─── */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between gap-4">
        {/* Semantic Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono tracking-wider">
          <Link
            to="/"
            className="text-[#D1CCC2]/80 hover:text-[#C9A84C] transition-colors focus-visible:text-[#C9A84C] focus-visible:outline-none"
          >
            Home
          </Link>
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 text-[#8A847A]/60" aria-hidden="true" />
          <Link
            to="/collections"
            className="text-[#D1CCC2]/80 hover:text-[#C9A84C] transition-colors focus-visible:text-[#C9A84C] focus-visible:outline-none"
          >
            Collections
          </Link>
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 text-[#8A847A]/60" aria-hidden="true" />
          <span className="text-[#E8B84B] font-semibold capitalize" aria-current="page">
            {collection.name}
          </span>
        </nav>

        {/* Watermark Folio Mark (Desktop) */}
        <div
          aria-hidden="true"
          className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-[#0A0A0A]/80 border border-[#333333]/80 backdrop-blur-sm font-mono text-[9px] uppercase tracking-[0.25em] text-[#C9A84C]"
        >
          <span>ATELIER MONOGRAPH</span>
          <span className="text-[#555047]">//</span>
          <span className="text-[#D1CCC2]">SERIES</span>
        </div>
      </div>

      {/* ─── HERO EDITORIAL CONTENT: Asymmetric Lower-Left Composition ─── */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-auto pt-16">
        <div className="max-w-2xl lg:max-w-3xl space-y-6 sm:space-y-8">
          {/* Eyebrow with Folio Line */}
          <div className="flex items-center gap-3">
            <span className="w-8 sm:w-12 h-[1.5px] bg-[#C9A84C]" aria-hidden="true" />
            <span className="text-[11px] sm:text-xs uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
              CURATED COLLECTION
            </span>
          </div>

          {/* Monumental H1 Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-[#F5F0E8] font-bold tracking-tight leading-[1.04] drop-shadow-md">
            {collection.name}
          </h1>

          {/* Factual Collection Description */}
          {collection.description && (
            <p className="text-sm sm:text-base lg:text-lg text-[#E0DBD1] leading-relaxed font-sans font-light max-w-xl drop-shadow-sm">
              {collection.description}
            </p>
          )}

          {/* Collection Metadata Rail */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <div className="px-3.5 py-1.5 bg-[#0D0D0D]/90 border border-[#2A2A2A] backdrop-blur-sm font-mono text-xs text-[#D1CCC2] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" aria-hidden="true" />
              <span className="font-semibold text-[#F5F0E8]">{String(productCount).padStart(2, '0')}</span>
              <span className="text-[#8A847A] uppercase text-[10px] tracking-wider">
                {productCount === 1 ? 'Piece' : 'Pieces'} Documented
              </span>
            </div>

            <div className="hidden sm:block text-[11px] font-mono text-[#9B958B] uppercase tracking-widest">
              {pieceCountLabel}
            </div>
          </div>

          {/* Primary & Secondary Action Group */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onExplorePieces}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#C9A84C] hover:bg-[#E8B84B] text-[#0A0A0A] font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-lg hover:shadow-[#C9A84C]/20 cursor-pointer rounded-none min-h-[44px]"
              aria-label={`Explore products in the ${collection.name} collection`}
            >
              <span>Explore the Pieces</span>
              <HugeiconsIcon icon={ArrowDown01Icon} className="w-4 h-4" />
            </button>

            <Link
              to="/collections"
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-[#0D0D0D]/80 hover:bg-[#161616] border border-[#2A2A2A] hover:border-[#3A3A3A] text-[#D1CCC2] hover:text-[#F5F0E8] font-mono text-xs uppercase tracking-wider transition-colors backdrop-blur-sm min-h-[44px]"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5" />
              <span>All Collections</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CollectionCoverStage
