import React from 'react'
import { CuratedLeadFrame } from './CuratedLeadFrame'
import { CuratedFrameWall } from './CuratedFrameWall'
import { GalleryGridSkeleton } from '@/components/common/GalleryGridSkeleton'
import type { GalleryItemWithProduct } from '@/types/app'

export interface GalleryGridProps {
  images: GalleryItemWithProduct[]
  isLoading?: boolean
  roomSlug?: string
  onSelectImage?: (index: number) => void
  itemRefs?: React.MutableRefObject<(HTMLButtonElement | null)[]>
  className?: string
}

/**
 * GalleryGrid
 * Coordinates the Curated Lead Frame hero with the rhythmic Curated Frame Wall.
 */
export const GalleryGrid: React.FC<GalleryGridProps> = ({
  images,
  isLoading = false,
  roomSlug,
  className = '',
}) => {
  if (isLoading && images.length === 0) {
    return <GalleryGridSkeleton count={8} />
  }

  if (images.length === 0) {
    return null
  }

  // Lead Section: first 1–3 items (if we have >= 3 items, lead takes first 3, wall takes rest)
  const hasLeadSection = images.length >= 2
  const leadImages = hasLeadSection ? images.slice(0, 3) : images.slice(0, 1)
  const wallImages = hasLeadSection ? images.slice(3) : images.slice(1)

  return (
    <div className={`space-y-12 ${className}`}>
      {/* 1. Curated Lead Frame Magazine Spread */}
      <CuratedLeadFrame images={leadImages} roomSlug={roomSlug} />

      {/* 2. Remaining Frame Wall Collection */}
      {wallImages.length > 0 && (
        <CuratedFrameWall
          images={wallImages}
          roomSlug={roomSlug}
          startIndex={leadImages.length}
        />
      )}
    </div>
  )
}

export default GalleryGrid
