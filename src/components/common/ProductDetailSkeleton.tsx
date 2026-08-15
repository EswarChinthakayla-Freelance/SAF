import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Product detail page skeleton matching the 2-column layout geometry of ProductDetailPage.
 */
export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 animate-pulse" aria-label="Loading product specifications" role="status">
      <span className="sr-only">Loading product specifications...</span>

      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16 bg-[#1A1816] rounded-none" />
        <span className="text-[#3A3A3A]">/</span>
        <Skeleton className="h-4 w-24 bg-[#1A1816] rounded-none" />
        <span className="text-[#3A3A3A]">/</span>
        <Skeleton className="h-4 w-36 bg-[#1A1816] rounded-none" />
      </div>

      {/* Main 2-Column Presentation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Gallery & Thumbnails (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/5] w-full bg-[#111111] border border-[#2A2A2A] rounded-none overflow-hidden">
            <Skeleton className="w-full h-full bg-[#171717] rounded-none" />
          </div>
          {/* Thumbnail Strip */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="aspect-square bg-[#111111] border border-[#2A2A2A] rounded-none">
                <Skeleton className="w-full h-full bg-[#171717] rounded-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Information & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          {/* Collection & SKU */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-28 bg-[#1F1F1F] rounded-none" />
            <Skeleton className="h-8 sm:h-10 w-4/5 bg-[#262626] rounded-none" />
            <Skeleton className="h-3 w-20 bg-[#1A1816] rounded-none" />
          </div>

          {/* Price Block */}
          <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-none space-y-2">
            <Skeleton className="h-6 w-32 bg-[#2A2A2A] rounded-none" />
            <Skeleton className="h-3 w-40 bg-[#1F1F1F] rounded-none" />
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-[#1A1816] rounded-none" />
            <Skeleton className="h-4 w-5/6 bg-[#1A1816] rounded-none" />
            <Skeleton className="h-4 w-3/4 bg-[#1A1816] rounded-none" />
          </div>

          {/* Variant Selector Blocks */}
          <div className="space-y-3">
            <Skeleton className="h-3 w-24 bg-[#1F1F1F] rounded-none" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 bg-[#171717] border border-[#2A2A2A] rounded-none" />
              <Skeleton className="h-10 w-24 bg-[#171717] border border-[#2A2A2A] rounded-none" />
            </div>
          </div>

          {/* Primary Actions */}
          <div className="space-y-3 pt-2">
            <Skeleton className="h-12 w-full bg-[#C9A84C]/25 rounded-none" />
            <Skeleton className="h-10 w-full bg-[#171717] border border-[#2A2A2A] rounded-none" />
          </div>

          {/* Specifications Accordions */}
          <div className="border-t border-[#2A2A2A] pt-4 space-y-3">
            <Skeleton className="h-10 w-full bg-[#111111] border border-[#2A2A2A] rounded-none" />
            <Skeleton className="h-10 w-full bg-[#111111] border border-[#2A2A2A] rounded-none" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailSkeleton
