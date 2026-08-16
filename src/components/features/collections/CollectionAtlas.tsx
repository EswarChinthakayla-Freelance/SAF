import React from 'react'
import { Link } from 'react-router-dom'
import { CollectionChapter } from './CollectionChapter'
import { CollectionChapterSkeleton } from './CollectionChapterSkeleton'
import { GoldButton } from '@/components/brand/GoldButton'
import type { CollectionRow } from '@/types/app'

export interface CollectionAtlasProps {
  collections?: CollectionRow[]
  isLoading?: boolean
  className?: string
}

/**
 * CollectionAtlas
 * Container component for "The Collection Atlas" spatial chapters.
 * Renders the chapters list with the architectural Collection Spine.
 */
export const CollectionAtlas: React.FC<CollectionAtlasProps> = ({
  collections = [],
  isLoading = false,
  className = '',
}) => {
  // Loading State
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <CollectionChapterSkeleton isEven={true} />
        <CollectionChapterSkeleton isEven={false} />
      </div>
    )
  }

  // Empty State
  if (!collections || collections.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-4 bg-[#0E0E0E] border border-[#222222] p-8 sm:p-10 select-none">
        <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold block">
          OUR COLLECTION
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#F5F0E8] font-bold">
          Our collections are being curated.
        </h3>
        <p className="text-xs sm:text-sm text-[#9B958B] leading-relaxed font-sans font-light">
          Our master artisans are documenting the latest architectural furniture series. Explore the complete furniture catalogue in the meantime.
        </p>
        <div className="pt-4">
          <Link to="/products">
            <GoldButton size="sm">Browse Furniture</GoldButton>
          </Link>
        </div>
      </div>
    )
  }

  // Sorted active collections
  const sortedCollections = [...collections].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div className={`relative ${className}`}>
      {/* The Architectural Collection Spine (Desktop Continuous Line) */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute left-1/2 top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-[#222222] to-transparent pointer-events-none -translate-x-1/2"
      />

      {/* Spatial Chapters Sequence */}
      <div className="space-y-4">
        {sortedCollections.map((collection, idx) => (
          <CollectionChapter
            key={collection.id}
            collection={collection}
            index={idx}
            totalCount={sortedCollections.length}
            nextCollection={sortedCollections[idx + 1]}
            priority={idx === 0}
          />
        ))}
      </div>
    </div>
  )
}

export default CollectionAtlas
