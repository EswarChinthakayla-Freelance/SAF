import React from 'react'
import { getMediaUrl } from '@/lib/media'
import { getCollectionFallbackImage } from '@/lib/collectionFallback'
import { STORAGE_BUCKETS } from '@/lib/constants'
import type { ProductImageRow } from '@/types/app'

export interface ViewerThumbnailRailProps {
  images: ProductImageRow[]
  selectedIndex: number
  onSelectIndex: (index: number) => void
  productName: string
  collectionSlug?: string
  orientation?: 'vertical' | 'horizontal'
  className?: string
}

/**
 * ViewerThumbnailRail
 * Accessible thumbnail navigation displaying optimized small media transforms.
 * Supports vertical layout on desktop workstations and horizontal scroll on mobile.
 */
export const ViewerThumbnailRail: React.FC<ViewerThumbnailRailProps> = ({
  images,
  selectedIndex,
  onSelectIndex,
  productName,
  collectionSlug,
  orientation = 'vertical',
  className = '',
}) => {
  if (!images || images.length <= 1) {
    return null
  }

  const isVertical = orientation === 'vertical'

  return (
    <div
      role="tablist"
      aria-label={`${productName} image thumbnails`}
      className={
        isVertical
          ? `flex flex-col gap-3 max-h-[70vh] overflow-y-auto no-scrollbar py-2 pr-1 ${className}`
          : `flex flex-row gap-2 overflow-x-auto no-scrollbar py-2 px-4 ${className}`
      }
    >
      {images.map((img, idx) => {
        const isSelected = idx === selectedIndex
        const fallbackThumb = getCollectionFallbackImage(collectionSlug, productName, idx)
        const thumbUrl = img.storage_path
          ? getMediaUrl(STORAGE_BUCKETS.PRODUCT_IMAGES, img.storage_path, 'viewer-thumbnail')
          : fallbackThumb
        const altText = img.alt_text || `${productName} — view ${idx + 1}`

        return (
          <button
            key={img.id || idx}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-label={`View image ${idx + 1} of ${images.length}: ${altText}`}
            onClick={() => onSelectIndex(idx)}
            className={`relative group shrink-0 transition-all duration-200 cursor-pointer overflow-hidden border ${
              isVertical ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-14 h-14'
            } ${
              isSelected
                ? 'border-[#C9A84C] ring-1 ring-[#C9A84C]/60 shadow-lg'
                : 'border-[#2A2A2A] hover:border-[#555047] opacity-60 hover:opacity-100'
            } bg-white`}
          >
            <img
              src={thumbUrl}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="w-full h-full object-contain p-1"
            />
            {/* Active Plate Indicator */}
            {isSelected && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
            )}
            <span className="absolute bottom-0 left-0 right-0 bg-[#0A0A0A]/80 font-mono text-[9px] text-[#C9A84C] text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              0{idx + 1}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default ViewerThumbnailRail
