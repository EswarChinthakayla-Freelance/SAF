import React from 'react'
import { AdminGalleryTile } from './AdminGalleryTile'
import { GoldButton } from '@/components/brand/GoldButton'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Image01Icon,
  FilterIcon,
  AlertCircleIcon,
  ImageAdd01Icon,
  ReloadIcon,
} from '@hugeicons/core-free-icons'
import type { AdminGalleryItem } from '@/types/app'

export interface AdminGalleryGridProps {
  images: AdminGalleryItem[]
  isLoading: boolean
  isError: boolean
  error?: Error | null
  onRefetch: () => void
  isFiltered: boolean
  onResetFilters: () => void
  onOpenUpload: () => void
  onEditMetadata: (image: AdminGalleryItem) => void
  onToggleActive: (image: AdminGalleryItem) => void
  onDelete: (image: AdminGalleryItem) => void
}

export const AdminGalleryGrid: React.FC<AdminGalleryGridProps> = ({
  images,
  isLoading,
  isError,
  error,
  onRefetch,
  isFiltered,
  onResetFilters,
  onOpenUpload,
  onEditMetadata,
  onToggleActive,
  onDelete,
}) => {
  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div
        aria-label="Loading gallery images"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
      >
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-[#141414] border border-[#242424] rounded-none overflow-hidden space-y-3 p-3 animate-pulse"
          >
            <div className="aspect-[4/3] bg-[#1C1C1C] rounded-none" />
            <div className="space-y-2 pt-1">
              <div className="h-4 bg-[#1F1F1F] rounded w-3/4" />
              <div className="h-3 bg-[#1A1A1A] rounded w-1/2" />
            </div>
            <div className="h-4 bg-[#1F1F1F] rounded w-1/3 pt-2" />
          </div>
        ))}
      </div>
    )
  }

  // 2. Localized Error State
  if (isError) {
    return (
      <div className="bg-[#141414] border border-[#2E2020] rounded-none p-8 sm:p-12 text-center space-y-4 shadow-lg">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-950/50 border border-red-800/40 text-red-400">
          <HugeiconsIcon icon={AlertCircleIcon} className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h2 className="text-base font-sans font-semibold text-[#F5F0E8]">
            We couldn't load the gallery
          </h2>
          <p className="text-xs font-sans text-[#A8A29E]">
            {error?.message || 'A network or database issue prevented loading gallery records.'}
          </p>
        </div>
        <Button
          type="button"
          onClick={onRefetch}
          variant="outline"
          className="h-9 px-4 text-xs font-sans bg-[#1C1C1C] border-[#2E2E2E] text-[#F5F0E8] hover:bg-[#262626]"
        >
          <HugeiconsIcon icon={ReloadIcon} className="w-3.5 h-3.5 mr-1.5" />
          <span>Try Again</span>
        </Button>
      </div>
    )
  }

  // 3. Filter Empty State
  if (images.length === 0 && isFiltered) {
    return (
      <div className="bg-[#141414] border border-[#242424] rounded-none p-8 sm:p-12 text-center space-y-4 shadow-lg">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#2E2E2E] text-[#C9A84C]">
          <HugeiconsIcon icon={FilterIcon} className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h2 className="text-base font-sans font-semibold text-[#F5F0E8]">
            No images match these filters
          </h2>
          <p className="text-xs font-sans text-[#8A847A]">
            Try adjusting your search keyword, room space or visibility settings to find inspiration photos.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={onResetFilters}
            className="h-9 px-4 text-xs font-sans bg-[#1C1C1C] border-[#2E2E2E] text-[#F5F0E8] hover:bg-[#262626]"
          >
            Reset Filters
          </Button>
          <GoldButton type="button" size="sm" onClick={onOpenUpload} className="h-9 text-xs">
            <HugeiconsIcon icon={ImageAdd01Icon} className="w-3.5 h-3.5 mr-1.5" />
            <span>Upload Images</span>
          </GoldButton>
        </div>
      </div>
    )
  }

  // 4. Global Empty State (Zero Gallery Images)
  if (images.length === 0) {
    return (
      <div className="bg-[#141414] border border-[#242424] rounded-none p-10 sm:p-16 text-center space-y-4 shadow-lg">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#181818] border border-[#282828] text-[#C9A84C]">
          <HugeiconsIcon icon={Image01Icon} className="w-7 h-7" />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h2 className="text-lg font-sans font-semibold text-[#F5F0E8]">
            No gallery images yet
          </h2>
          <p className="text-xs font-sans text-[#8A847A] leading-relaxed">
            Upload high-resolution photography of bespoke residential interiors, architectural timber mandirs and suites to build the inspiration gallery.
          </p>
        </div>
        <GoldButton
          type="button"
          size="sm"
          onClick={onOpenUpload}
          className="h-9 px-4 text-xs uppercase tracking-wider font-semibold"
        >
          <HugeiconsIcon icon={ImageAdd01Icon} className="w-3.5 h-3.5 mr-1.5" />
          <span>Upload Images</span>
        </GoldButton>
      </div>
    )
  }

  // 5. Rendered Media Grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {images.map((image) => (
        <AdminGalleryTile
          key={image.id}
          image={image}
          onEditMetadata={onEditMetadata}
          onToggleActive={onToggleActive}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
