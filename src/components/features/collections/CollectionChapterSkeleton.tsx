import React from 'react'

/**
 * CollectionChapterSkeleton
 * Architectural skeleton matching alternating chapter geometry.
 */
export const CollectionChapterSkeleton: React.FC<{ isEven?: boolean }> = ({ isEven = true }) => {
  return (
    <div className="py-12 sm:py-16 lg:py-24 border-b border-[#1A1A1A] animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
        {/* Image Box Placeholder */}
        <div
          className={`w-full ${
            isEven ? 'lg:col-span-7 lg:order-1' : 'lg:col-span-7 lg:order-2'
          }`}
        >
          <div className="aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/10] bg-[#121212] border border-[#222222]" />
        </div>

        {/* Info Panel Placeholder */}
        <div
          className={`w-full space-y-5 ${
            isEven ? 'lg:col-span-5 lg:order-2' : 'lg:col-span-5 lg:order-1'
          }`}
        >
          <div className="h-3 w-32 bg-[#1A1816] rounded" />
          <div className="h-10 w-3/4 bg-[#1E1B18] rounded" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-[#161412] rounded" />
            <div className="h-4 w-5/6 bg-[#161412] rounded" />
          </div>
          <div className="h-5 w-40 bg-[#1E1B18] rounded pt-2" />
        </div>
      </div>
    </div>
  )
}

export default CollectionChapterSkeleton
