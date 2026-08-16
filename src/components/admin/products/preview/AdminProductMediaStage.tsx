import React, { useState, useMemo } from 'react'
import { getMediaUrl } from '@/lib/media'
import { HugeiconsIcon } from '@hugeicons/react'
import { Image01Icon, StarIcon } from '@hugeicons/core-free-icons'
import type { ProductWithRelations, ProductImageRow } from '@/types/app'

export interface AdminProductMediaStageProps {
  product: ProductWithRelations
}

export const AdminProductMediaStage: React.FC<AdminProductMediaStageProps> = ({ product }) => {
  // Ordered images with cover image priority
  const images = useMemo<ProductImageRow[]>(() => {
    if (product.product_images && product.product_images.length > 0) {
      return [...product.product_images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    }
    if (product.cover_image_path) {
      return [
        {
          id: `cover-${product.id}`,
          product_id: product.id,
          storage_path: product.cover_image_path,
          alt_text: product.name,
          sort_order: 0,
          is_cover: true,
          created_at: product.created_at,
        },
      ]
    }
    return []
  }, [product.product_images, product.cover_image_path, product.id, product.name, product.created_at])

  const initialIndex = useMemo(() => {
    const coverIdx = images.findIndex((img) => img.is_cover)
    return coverIdx >= 0 ? coverIdx : 0
  }, [images])

  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const activeImage = images[activeIndex] || images[0]

  return (
    <div className="space-y-3">
      {/* Primary Stage */}
      <div className="relative aspect-[4/3] w-full rounded-lg bg-[#121212] border border-[#242424] overflow-hidden flex items-center justify-center group shadow-lg">
        {activeImage?.storage_path ? (
          <img
            src={getMediaUrl('product-images', activeImage.storage_path, 'detail')}
            alt={activeImage.alt_text || product.name}
            className="w-full h-full object-contain p-2 md:p-4 transition-transform duration-300 group-hover:scale-[1.02]"
            loading="eager"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 text-[#666158]">
            <HugeiconsIcon icon={Image01Icon} className="w-10 h-10 stroke-1 text-[#4A4A4A]" />
            <p className="text-xs font-sans text-[#8A847A]">No product imagery uploaded</p>
          </div>
        )}

        {/* Cover Badge on Stage */}
        {activeImage?.is_cover && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0A0A0A]/85 backdrop-blur-md border border-[#C9A84C]/40 text-[10px] font-mono font-medium text-[#E8B84B] shadow-md">
            <HugeiconsIcon icon={StarIcon} className="w-2.5 h-2.5 text-[#C9A84C]" />
            <span>Catalogue Cover</span>
          </div>
        )}

        {/* Image Counter Badge */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-[#0A0A0A]/80 backdrop-blur-md border border-[#2E2E2E] text-[10px] font-mono text-[#A8A29E]">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation Rail */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, idx) => {
            const isSelected = idx === activeIndex
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View image ${idx + 1} of ${images.length}: ${img.alt_text || product.name}`}
                className={`relative shrink-0 w-16 h-16 sm:w-18 sm:h-18 rounded-md bg-[#141414] border overflow-hidden transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] ${
                  isSelected
                    ? 'border-[#C9A84C] ring-1 ring-[#C9A84C] shadow-md'
                    : 'border-[#262626] hover:border-[#3E3E3E] opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={getMediaUrl('product-images', img.storage_path, 'thumbnail')}
                  alt={img.alt_text || `${product.name} thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain p-1"
                  loading="lazy"
                />
                {img.is_cover && (
                  <span className="absolute bottom-0 inset-x-0 bg-[#C9A84C] text-[#0A0A0A] text-[8px] font-mono font-bold text-center leading-3">
                    COVER
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminProductMediaStage
