import React from 'react'

export const GalleryInspectorSkeleton: React.FC = () => {
  return (
    <div
      aria-label="Loading gallery image preview"
      className="space-y-4 max-w-7xl mx-auto animate-pulse font-sans"
    >
      {/* Topbar Skeleton */}
      <div className="h-14 bg-[#141414] border border-[#242424] rounded-none p-4 flex items-center justify-between">
        <div className="h-5 bg-[#1F1F1F] rounded w-32" />
        <div className="h-5 bg-[#1F1F1F] rounded w-24" />
        <div className="h-8 bg-[#1F1F1F] rounded w-28" />
      </div>

      {/* Main Workspace Split */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Canvas Skeleton */}
        <div className="flex-1 w-full aspect-[4/3] lg:aspect-[16/10] bg-[#0A0A0A] border border-[#222222] rounded-none min-h-[460px]" />

        {/* Metadata Panel Skeleton */}
        <div className="w-full lg:w-80 xl:w-96 space-y-4 shrink-0">
          <div className="h-44 bg-[#141414] border border-[#242424] rounded-none p-5 space-y-3">
            <div className="h-4 bg-[#1F1F1F] rounded w-1/3" />
            <div className="h-10 bg-[#1A1A1A] rounded" />
            <div className="h-12 bg-[#1A1A1A] rounded" />
          </div>

          <div className="h-32 bg-[#141414] border border-[#242424] rounded-none p-5 space-y-3">
            <div className="h-4 bg-[#1F1F1F] rounded w-1/2" />
            <div className="h-12 bg-[#1A1A1A] rounded" />
          </div>

          <div className="h-40 bg-[#141414] border border-[#242424] rounded-none p-5 space-y-2">
            <div className="h-4 bg-[#1F1F1F] rounded w-2/3" />
            <div className="h-6 bg-[#1A1A1A] rounded" />
            <div className="h-6 bg-[#1A1A1A] rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
