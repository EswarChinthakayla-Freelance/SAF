import React from 'react'

/**
 * CollectionDetailSkeleton
 * Geometric skeleton placeholder matching the full-bleed Collection Cover Canvas.
 */
export const CollectionDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] animate-pulse select-none pb-24">
      {/* Full-Bleed Hero Skeleton */}
      <div className="relative w-full h-[85svh] bg-[#111111] border-b border-[#222222] flex flex-col justify-between pt-24 sm:pt-28 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="h-4 w-48 bg-[#1E1B18] rounded" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
          <div className="h-3 w-32 bg-[#1A1816] rounded" />
          <div className="h-16 w-3/4 max-w-lg bg-[#1E1B18] rounded" />
          <div className="space-y-2 max-w-md">
            <div className="h-4 w-full bg-[#161412] rounded" />
            <div className="h-4 w-5/6 bg-[#161412] rounded" />
          </div>
          <div className="flex gap-4 pt-2">
            <div className="h-12 w-48 bg-[#24201C] rounded" />
            <div className="h-12 w-36 bg-[#161412] rounded" />
          </div>
        </div>
      </div>

      {/* Dossier Skeleton */}
      <div className="h-20 bg-[#0E0E0E] border-b border-[#1F1F1F]" />

      {/* Product Exhibition Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
        <div className="h-8 w-64 bg-[#1A1816] rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[4/5] bg-[#111111] border border-[#222222]" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CollectionDetailSkeleton
