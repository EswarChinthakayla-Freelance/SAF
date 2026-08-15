import React, { useState } from 'react'
import { getMediaUrl } from '@/lib/media'
import type { GalleryItemWithProduct } from '@/types/app'

export interface GalleryGridProps {
  images: GalleryItemWithProduct[]
  isLoading?: boolean
  onSelectImage: (index: number) => void
  itemRefs?: React.MutableRefObject<(HTMLButtonElement | null)[]>
  className?: string
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  images = [],
  isLoading = false,
  onSelectImage,
  itemRefs,
  className = '',
}) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})

  // Initial Loading Skeletons
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 ${className}`}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => {
          // Varied aspect ratio skeletons for editorial rhythm
          const isTaller = idx % 3 === 0
          return (
            <div
              key={idx}
              className={`rounded-none bg-[#111111] border border-[#2A2A2A] animate-pulse ${isTaller ? 'aspect-[3/4]' : 'aspect-[4/5]'
                }`}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 ${className}`}
      role="region"
      aria-label="Inspiration gallery images"
    >
      {images.map((item, idx) => {
        const imageUrl = getMediaUrl('gallery-images', item.storage_path, 'card')
        const isFailed = failedImages[item.id]
        const hasLinkedProduct = Boolean(item.products && item.products.is_published)

        return (
          <button
            key={item.id}
            type="button"
            ref={(el) => {
              if (itemRefs && itemRefs.current) {
                itemRefs.current[idx] = el
              }
            }}
            onClick={() => onSelectImage(idx)}
            aria-label={`View ${item.alt_text || item.room_type || 'inspiration'} image ${idx + 1}`}
            className="group relative rounded-none overflow-hidden bg-[#111111] border border-[#2A2A2A] cursor-pointer aspect-[4/5] shadow-lg transition-all duration-500 hover:border-[#C9A84C]/50 hover:shadow-2xl hover:shadow-[#C9A84C]/5 text-left focus-visible:ring-2 focus-visible:ring-[#C9A84C] outline-none"
          >
            {/* Gallery Image */}
            {!isFailed && item.storage_path ? (
              <img
                src={imageUrl}
                alt={item.alt_text || `Inspiration piece ${idx + 1}`}
                loading="lazy"
                onError={() => setFailedImages((prev) => ({ ...prev, [item.id]: true }))}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#151412] text-[#7A746B]">
                <span className="font-serif text-base text-[#9B958B]">Sri Anjaneya</span>
                <span className="text-[10px] font-mono uppercase tracking-widest mt-1 text-[#555047]">
                  {item.room_type || 'Inspiration'}
                </span>
              </div>
            )}

            {/* Gradient Overlay & Room Details */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 sm:p-6 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                {item.room_type && (
                  <span className="text-[10px] uppercase font-mono text-[#C9A84C] tracking-[0.2em] font-semibold">
                    {item.room_type}
                  </span>
                )}
                {hasLinkedProduct && (
                  <span className="text-[9px] font-mono uppercase bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#E8B84B] px-2 py-0.5 rounded-none">
                    Featured Piece
                  </span>
                )}
              </div>

              {item.alt_text && (
                <h3 className="font-serif text-sm sm:text-base text-[#F5F0E8] font-medium line-clamp-1 group-hover:text-[#E8B84B] transition-colors">
                  {item.alt_text}
                </h3>
              )}
            </div>

            {/* Subtle Zoom Affordance Icon on Hover */}
            <div className="absolute top-4 right-4 p-2 rounded-none bg-[#0A0A0A]/70 backdrop-blur-md border border-[#2A2A2A] text-[#F5F0E8] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default GalleryGrid
