import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import { ViewIcon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { getMediaUrl } from '@/lib/media'
import { getCollectionFallbackImage } from '@/lib/collectionFallback'
import { STORAGE_BUCKETS } from '@/lib/constants'
import type { GalleryItemWithProduct } from '@/types/app'

export interface GalleryFrameProps {
  image: GalleryItemWithProduct
  index: number
  roomSlug?: string
  aspectRatioClass?: string
  priority?: boolean
  className?: string
  showProductLink?: boolean
}

/**
 * Signature Gold Frame Register Mark
 * 4 subtle L-brackets in corners indicating handcrafted curation.
 */
const GoldFrameRegister: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none absolute z-20 ${className}`} aria-hidden="true">
    <div className="relative w-5 h-5">
      <span className="absolute top-0 left-0 w-2 h-[1.5px] bg-[#C9A84C]" />
      <span className="absolute top-0 left-0 w-[1.5px] h-2 bg-[#C9A84C]" />
      <span className="absolute bottom-0 right-0 w-2 h-[1.5px] bg-[#C9A84C]" />
      <span className="absolute bottom-0 right-0 w-[1.5px] h-2 bg-[#C9A84C]" />
    </div>
  </div>
)

/**
 * GalleryFrame
 * Architectural framed visual plate for "Spaces, Styled."
 * Features subtle frame borders, Gold Frame Register Mark, room identity,
 * linked product badges, and semantic inspection navigation.
 */
export const GalleryFrame: React.FC<GalleryFrameProps> = ({
  image,
  index,
  roomSlug,
  aspectRatioClass = 'aspect-[4/3]',
  priority = false,
  className = '',
  showProductLink = true,
}) => {
  const [hasError, setHasError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const fallbackUrl = getCollectionFallbackImage(
    image.room_type || undefined,
    image.alt_text || image.room_type || undefined,
    index
  )

  const imageUrl = !hasError && image.storage_path
    ? getMediaUrl(STORAGE_BUCKETS.GALLERY_IMAGES, image.storage_path, 'gallery-grid')
    : fallbackUrl

  const altText = image.alt_text || `${image.room_type || 'Curated space'} inspiration scene`
  const frameQuery = roomSlug && roomSlug !== 'all' ? `?room=${roomSlug}` : ''
  const inspectUrl = `/gallery/frame/${image.id}${frameQuery}`

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative bg-[#0E0E0E] border border-[#222222] hover:border-[#C9A84C]/60 transition-all duration-300 flex flex-col overflow-hidden ${className}`}
    >
      {/* 1. Subtle Plate Watermark Bar */}
      <div className="px-3.5 py-2 bg-[#090909] border-b border-[#202020] flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#7A746B]">
          <span className="text-[#C9A84C] font-semibold">FRAME 0{index + 1}</span>
          <span className="text-[#3A3A3A]">//</span>
          <span className="text-[#9B958B] truncate max-w-[120px]">
            {image.room_type || 'STUDIO'}
          </span>
        </div>
        {image.products && (
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#C9A84C] bg-[#161616] px-1.5 py-0.5 border border-[#2A2A2A]">
            Product Linked
          </span>
        )}
      </div>

      {/* 2. Visual Frame Canvas */}
      <Link
        to={inspectUrl}
        aria-label={`Inspect ${altText} in full screen`}
        className={`relative w-full ${aspectRatioClass} bg-[#060606] flex items-center justify-center overflow-hidden cursor-zoom-in block`}
      >
        {/* Signature Gold Frame Register on Hover / Focus */}
        <div
          className={`transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 group-focus-within:opacity-100'
          }`}
        >
          <GoldFrameRegister className="top-2.5 right-2.5" />
          <GoldFrameRegister className="bottom-2.5 left-2.5" />
        </div>

        {/* High-Resolution Media */}
        <img
          src={imageUrl}
          alt={altText}
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Subtle Lower Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

        {/* Hover Inspect Affordance Badge */}
        <div
          className={`absolute bottom-3 right-3 bg-[#0A0A0A]/95 text-[#E8B84B] border border-[#C9A84C]/50 px-2.5 py-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider transition-all duration-300 ${
            isHovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 group-focus-within:opacity-100 group-focus-within:translate-y-0'
          }`}
        >
          <HugeiconsIcon icon={ViewIcon} className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span>Inspect Frame</span>
        </div>
      </Link>

      {/* 3. Optional Linked Product Footer */}
      {showProductLink && image.products && (
        <div className="p-3 bg-[#0A0A0A] border-t border-[#1C1C1C] flex items-center justify-between text-xs">
          <div className="truncate mr-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#7A746B] block">
              Featured Creation
            </span>
            <span className="font-serif text-xs font-semibold text-[#F5F0E8] truncate block">
              {image.products.name}
            </span>
          </div>
          <Link
            to={`/products/${image.products.slug}`}
            className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[#C9A84C] hover:text-[#E8B84B] font-semibold shrink-0"
          >
            <span>Explore</span>
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  )
}

export default GalleryFrame
