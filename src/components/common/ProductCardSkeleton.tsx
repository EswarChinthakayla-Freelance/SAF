import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface ProductCardSkeletonProps {
  className?: string
}

/**
 * Proportional ProductCard skeleton matching the 4:5 image ratio and metadata layout
 * of the actual ProductCard component, preventing Cumulative Layout Shift (CLS).
 */
export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`group flex flex-col bg-[#111111] border border-[#2A2A2A] rounded-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* 4:5 Aspect Ratio Image Container */}
      <div className="relative aspect-[4/5] bg-[#171717] overflow-hidden">
        <Skeleton className="w-full h-full bg-[#1A1A1A] rounded-none animate-pulse" />
      </div>

      {/* Product Information Panel */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3 bg-[#111111]">
        <div className="space-y-2">
          {/* Collection / Category Eyebrow */}
          <Skeleton className="h-3 w-20 bg-[#1F1F1F] rounded-none" />

          {/* Product Name Title */}
          <Skeleton className="h-4 w-4/5 bg-[#262626] rounded-none" />
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-[#1F1F1F] flex items-center justify-between">
          <Skeleton className="h-4 w-24 bg-[#262626] rounded-none" />
          <Skeleton className="h-3 w-12 bg-[#1F1F1F] rounded-none" />
        </div>
      </div>
    </div>
  )
}

export default ProductCardSkeleton
