import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface GalleryGridSkeletonProps {
  count?: number
  className?: string
}

/**
 * Editorial gallery skeleton matching the responsive grid and alternating
 * aspect ratio rhythm of GalleryGrid.
 */
export const GalleryGridSkeleton: React.FC<GalleryGridSkeletonProps> = ({
  count = 8,
  className = '',
}) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 ${className}`}
      aria-label="Loading inspiration gallery"
      role="status"
    >
      <span className="sr-only">Loading inspiration gallery visuals...</span>
      {Array.from({ length: count }).map((_, idx) => {
        const isTaller = idx % 3 === 0
        return (
          <div
            key={`gallery-skeleton-${idx}`}
            className={`rounded-none bg-[#111111] border border-[#2A2A2A] overflow-hidden ${
              isTaller ? 'aspect-[3/4]' : 'aspect-[4/5]'
            }`}
          >
            <Skeleton className="w-full h-full bg-[#1A1A1A] rounded-none animate-pulse" />
          </div>
        )
      })}
    </div>
  )
}

export default GalleryGridSkeleton
