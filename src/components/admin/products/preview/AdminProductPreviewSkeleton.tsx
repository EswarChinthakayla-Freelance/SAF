import React from 'react'

export const AdminProductPreviewSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading product preview...">
      {/* Header Skeleton */}
      <div className="space-y-3 pb-4 border-b border-[#242424]">
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 bg-[#1A1A1A] rounded" />
          <div className="h-5 w-28 bg-[#1A1A1A] rounded" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 sm:w-80 bg-[#1A1A1A] rounded" />
            <div className="h-4 w-40 bg-[#1A1A1A] rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-28 bg-[#1A1A1A] rounded" />
            <div className="h-9 w-32 bg-[#1A1A1A] rounded" />
          </div>
        </div>
      </div>

      {/* Main Upper Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Media Stage Skeleton */}
        <div className="lg:col-span-7 space-y-3">
          <div className="aspect-[4/3] w-full bg-[#161616] rounded-none border border-[#242424]" />
          <div className="flex gap-2">
            <div className="w-16 h-16 bg-[#161616] rounded border border-[#242424]" />
            <div className="w-16 h-16 bg-[#161616] rounded border border-[#242424]" />
            <div className="w-16 h-16 bg-[#161616] rounded border border-[#242424]" />
          </div>
        </div>

        {/* Right: Record Summary Skeleton */}
        <div className="lg:col-span-5">
          <div className="h-72 bg-[#161616] rounded-none border border-[#242424] p-6 space-y-4">
            <div className="h-8 w-40 bg-[#222222] rounded" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-[#222222] rounded" />
              <div className="h-10 bg-[#222222] rounded" />
            </div>
            <div className="h-16 bg-[#222222] rounded" />
          </div>
        </div>
      </div>

      {/* Lower Details Skeleton */}
      <div className="space-y-6">
        <div className="h-40 bg-[#161616] rounded-none border border-[#242424] p-6 space-y-3">
          <div className="h-4 w-48 bg-[#222222] rounded" />
          <div className="h-4 w-full bg-[#222222] rounded" />
          <div className="h-4 w-3/4 bg-[#222222] rounded" />
        </div>
        <div className="h-48 bg-[#161616] rounded-none border border-[#242424] p-6" />
      </div>
    </div>
  )
}

export default AdminProductPreviewSkeleton
