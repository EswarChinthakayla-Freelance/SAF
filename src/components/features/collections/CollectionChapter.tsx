import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getMediaUrl } from '@/lib/media'
import { getCollectionFallbackImage } from '@/lib/collectionFallback'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import type { CollectionRow } from '@/types/app'

export interface CollectionChapterProps {
  collection: CollectionRow
  index: number
  totalCount: number
  nextCollection?: CollectionRow
  priority?: boolean
  className?: string
}

/**
 * Signature Gold Corner Register Mark
 */
const CornerRegisterMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none absolute z-20 ${className}`} aria-hidden="true">
    <div className="relative w-4 h-4">
      <span className="absolute top-0 left-0 w-2 h-[1.5px] bg-[#C9A84C]" />
      <span className="absolute top-0 left-0 w-[1.5px] h-2 bg-[#C9A84C]" />
      <span className="absolute bottom-0 right-0 w-2 h-[1.5px] bg-[#C9A84C]" />
      <span className="absolute bottom-0 right-0 w-[1.5px] h-2 bg-[#C9A84C]" />
    </div>
  </div>
)

/**
 * CollectionChapter
 * Individual architectural chapter for "The Collection Atlas".
 * Features alternating desktop composition, large image stage, background index watermarks,
 * editorial typography, and next-chapter anticipation.
 */
export const CollectionChapter: React.FC<CollectionChapterProps> = ({
  collection,
  index,
  totalCount,
  nextCollection,
  priority = false,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const chapterNumber = String(index + 1).padStart(2, '0')
  const isEven = index % 2 === 0

  const fallbackImage = getCollectionFallbackImage(collection.slug, collection.name, index)
  const coverUrl = collection.cover_image_path
    ? getMediaUrl(STORAGE_BUCKETS.BRAND_ASSETS, collection.cover_image_path, 'collection-index-chapter')
    : fallbackImage

  const isLast = index === totalCount - 1

  return (
    <article
      id={`chapter-${collection.slug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative scroll-mt-32 py-12 sm:py-16 lg:py-24 border-b border-[#1A1A1A] last:border-b-0 ${className}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
        {/* 1. Image Stage */}
        <div
          className={`w-full ${
            isEven ? 'lg:col-span-7 lg:order-1' : 'lg:col-span-7 lg:order-2'
          }`}
        >
          <div className="relative group block overflow-hidden bg-[#0D0D0D] border border-[#222222] hover:border-[#C9A84C]/50 transition-all duration-500">
            {/* Subtle Gold Corner Register Marks */}
            <div
              className={`transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0 group-focus-within:opacity-100'
              }`}
            >
              <CornerRegisterMark className="top-3 left-3" />
              <CornerRegisterMark className="bottom-3 right-3" />
            </div>

            {/* Main Stage Image Link */}
            <Link
              to={`/collections/${collection.slug}`}
              aria-label={`Explore ${collection.name} collection`}
              className="block relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/10] overflow-hidden cursor-pointer"
            >
              {/* Ambient Blurred Background from the Cover Image */}
              {!imageError && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img
                    src={coverUrl}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover blur-3xl opacity-30 scale-125"
                  />
                </div>
              )}

              {!imageError ? (
                <img
                  src={coverUrl}
                  alt={collection.cover_image_alt || `${collection.name} Collection`}
                  loading={priority ? 'eager' : 'lazy'}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 relative z-10"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#141414] via-[#0D0D0D] to-[#141414]">
                  <span className="font-serif text-2xl text-[#9B958B] tracking-wide">
                    {collection.name}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#555047] mt-2">
                    Sri Anjaneya Furnitures
                  </span>
                </div>
              )}

              {/* Bottom Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none z-10" />

              {/* Hover Inspect Pill */}
              <div
                className={`absolute bottom-4 right-4 bg-[#0A0A0A]/95 text-[#E8B84B] border border-[#C9A84C]/50 px-3 py-1.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider transition-all duration-300 ${
                  isHovered
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-2 group-focus-within:opacity-100 group-focus-within:translate-y-0'
                }`}
              >
                <span>Enter Chapter</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-3 h-3" />
              </div>
            </Link>
          </div>
        </div>

        {/* 2. Editorial Information Panel */}
        <div
          className={`w-full relative space-y-6 ${
            isEven ? 'lg:col-span-5 lg:order-2' : 'lg:col-span-5 lg:order-1'
          }`}
        >
          {/* Subtle Background Watermark Number */}
          <div
            aria-hidden="true"
            className="absolute -top-10 -left-6 sm:-top-14 sm:-left-10 font-serif text-7xl sm:text-9xl text-[#181818] font-bold select-none pointer-events-none -z-10 opacity-70"
          >
            {chapterNumber}
          </div>

          {/* Chapter Metadata Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold">
                COLLECTION / {chapterNumber}
              </span>
              <span className="text-[#3A3A3A]">//</span>
              <span className="text-[10px] uppercase tracking-widest text-[#7A746B]">
                SPATIAL CHAPTER
              </span>
            </div>

            {/* Collection Heading Title */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F5F0E8] font-bold tracking-tight leading-tight group-hover:text-[#E8B84B] transition-colors">
              <Link
                to={`/collections/${collection.slug}`}
                className="hover:text-[#E8B84B] transition-colors focus-visible:text-[#E8B84B] outline-none"
              >
                {collection.name}
              </Link>
            </h2>
          </div>

          {/* Factual Collection Description from Database */}
          {collection.description && (
            <p className="text-sm sm:text-base text-[#9B958B] leading-relaxed font-sans font-light max-w-lg">
              {collection.description}
            </p>
          )}

          {/* Signature Chapter Action */}
          <div className="pt-2">
            <Link
              to={`/collections/${collection.slug}`}
              className="group/cta inline-flex items-center gap-3 text-xs uppercase font-mono tracking-[0.2em] text-[#F5F0E8] hover:text-[#E8B84B] transition-colors min-h-[44px]"
              aria-label={`Explore ${collection.name} collection`}
            >
              <span className="border-b border-[#C9A84C] pb-0.5 group-hover/cta:border-[#E8B84B] transition-colors">
                Explore {collection.name}
              </span>
              <span
                className="text-[#C9A84C] group-hover/cta:translate-x-1.5 transition-transform duration-300"
                aria-hidden="true"
              >
                &rarr;
              </span>
            </Link>
          </div>

          {/* Next Chapter Anticipation */}
          {!isLast && nextCollection && (
            <div className="pt-6 border-t border-[#1C1C1C] flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#666055]">
              <span>NEXT //</span>
              <span className="text-[#8A847A] truncate">
                0{index + 2} {nextCollection.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default CollectionChapter
