import React from 'react'
import { Link } from 'react-router-dom'
import { getMediaUrl } from '@/lib/media'
import { getCollectionFallbackImage } from '@/lib/collectionFallback'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import type { CollectionRow } from '@/types/app'

export interface NextCollectionChapterProps {
  nextCollection?: CollectionRow
  className?: string
}

/**
 * NextCollectionChapter
 * Architectural bridge to the subsequent collection monograph.
 */
export const NextCollectionChapter: React.FC<NextCollectionChapterProps> = ({
  nextCollection,
  className = '',
}) => {
  if (!nextCollection) {
    return (
      <section
        aria-label="Explore All Collections"
        className={`mt-16 sm:mt-24 p-8 sm:p-12 bg-[#0C0C0C] border border-[#222222] flex flex-col md:flex-row items-center justify-between gap-6 select-none ${className}`}
      >
        <div className="space-y-1.5 text-center md:text-left">
          <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
            THE COLLECTION ATLAS
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F0E8]">
            Explore All Spatial Collections
          </h3>
          <p className="text-xs sm:text-sm text-[#8A847A] font-sans font-light">
            Discover our complete family of architectural solid wood series.
          </p>
        </div>

        <Link
          to="/collections"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#121212] border border-[#C9A84C]/50 hover:border-[#C9A84C] text-[#F5F0E8] font-mono text-xs uppercase tracking-wider font-semibold transition-colors shrink-0"
        >
          <span>View Collection Atlas</span>
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 text-[#C9A84C]" />
        </Link>
      </section>
    )
  }

  const fallbackHero = getCollectionFallbackImage(nextCollection.slug, nextCollection.name)
  const coverUrl = nextCollection.cover_image_path
    ? getMediaUrl(STORAGE_BUCKETS.BRAND_ASSETS, nextCollection.cover_image_path, 'collection-index-chapter') || fallbackHero
    : fallbackHero

  return (
    <section
      aria-label="Next Collection Chapter"
      className={`mt-16 sm:mt-24 bg-[#0B0B0B] border border-[#222222] hover:border-[#C9A84C]/40 transition-all duration-300 select-none ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
        {/* 1. Left (Cols 1-7): Next Chapter Description & Action */}
        <div className="md:col-span-7 p-6 sm:p-10 lg:p-12 space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold">
              NEXT CHAPTER
            </span>
            <span className="text-[#3A3A3A]">//</span>
            <span className="text-[10px] uppercase tracking-widest text-[#7A746B]">
              SPATIAL MONOGRAPH
            </span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5F0E8]">
            <Link
              to={`/collections/${nextCollection.slug}`}
              className="hover:text-[#E8B84B] transition-colors"
            >
              {nextCollection.name}
            </Link>
          </h3>

          {nextCollection.description && (
            <p className="text-xs sm:text-sm text-[#8A847A] font-sans font-light leading-relaxed max-w-lg">
              {nextCollection.description}
            </p>
          )}

          <div className="pt-2">
            <Link
              to={`/collections/${nextCollection.slug}`}
              className="group inline-flex items-center gap-2 text-xs uppercase font-mono tracking-[0.2em] text-[#F5F0E8] hover:text-[#E8B84B] transition-colors"
              aria-label={`Explore next collection: ${nextCollection.name}`}
            >
              <span className="border-b border-[#C9A84C] pb-0.5 group-hover:border-[#E8B84B] transition-colors">
                Explore {nextCollection.name} Monograph
              </span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="w-4 h-4 text-[#C9A84C] group-hover:translate-x-1.5 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>

        {/* 2. Right (Cols 8-12): Next Chapter Image Preview */}
        <div className="md:col-span-5 relative overflow-hidden h-48 sm:h-64 md:h-full min-h-[220px] bg-[#0E0D0B] border-t md:border-t-0 md:border-l border-[#222222]">
          <Link
            to={`/collections/${nextCollection.slug}`}
            aria-label={`Open ${nextCollection.name} collection`}
            className="block w-full h-full cursor-pointer"
          >
            <img
              src={coverUrl}
              alt={nextCollection.cover_image_alt || `${nextCollection.name} Collection`}
              loading="lazy"
              className="w-full h-full object-contain p-4 transition-transform duration-700 ease-out hover:scale-105"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NextCollectionChapter
