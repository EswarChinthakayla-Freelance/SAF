import React, { useState, useEffect, useRef } from 'react'
import { getMediaUrl } from '@/lib/media'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import type { ProductImageRow } from '@/types/app'

export interface ProductImageGalleryProps {
  images?: ProductImageRow[]
  productName: string
  className?: string
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images = [],
  productName,
  className = '',
}) => {
  // Sort images by sort_order
  const sortedImages = [...images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  // Find cover image or default to first image
  const initialIndex = sortedImages.findIndex((img) => img.is_cover)
  const [selectedIndex, setSelectedIndex] = useState(initialIndex >= 0 ? initialIndex : 0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const thumbnailRailRef = useRef<HTMLDivElement>(null)

  // Reset selected index if images change
  useEffect(() => {
    const coverIdx = sortedImages.findIndex((img) => img.is_cover)
    setSelectedIndex(coverIdx >= 0 ? coverIdx : 0)
  }, [sortedImages])

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailRailRef.current) {
      const activeBtn = thumbnailRailRef.current.children[selectedIndex] as HTMLElement
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [selectedIndex])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev + 1) % sortedImages.length)
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, sortedImages.length])

  // Handle missing or zero images
  if (sortedImages.length === 0) {
    return (
      <div
        className={`aspect-[4/5] bg-[#111111] border border-[#2A2A2A] rounded-none flex flex-col items-center justify-center p-8 text-center text-[#7A746B] ${className}`}
      >
        <span className="font-serif text-lg tracking-wide text-[#9B958B]">
          Sri Anjaneya Furnitures
        </span>
        <span className="text-xs font-mono uppercase tracking-widest mt-2 text-[#555047]">
          Bespoke Craftsmanship
        </span>
      </div>
    )
  }

  const activeImage = sortedImages[selectedIndex] || sortedImages[0]
  const activeImageUrl = getMediaUrl('product-images', activeImage.storage_path, 'detail')
  const lightboxImageUrl = getMediaUrl('product-images', activeImage.storage_path, 'hero')

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Dominant Image Stage */}
      <div className="relative aspect-[4/5] bg-[#0E0D0B] border border-[#2A2A2A] rounded-none overflow-hidden shadow-2xl group">
        {!imageErrors[activeImage.id] ? (
          <img
            src={activeImageUrl}
            alt={activeImage.alt_text || `${productName} view ${selectedIndex + 1}`}
            loading={selectedIndex === 0 ? 'eager' : 'lazy'}
            fetchPriority={selectedIndex === 0 ? 'high' : 'auto'}
            onError={() => setImageErrors((prev) => ({ ...prev, [activeImage.id]: true }))}
            className="w-full h-full object-cover object-center cursor-zoom-in transition-transform duration-700 ease-out group-hover:scale-105"
            onClick={() => setIsLightboxOpen(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-[#7A746B] bg-[#151412]">
            <span className="font-serif text-base text-[#9B958B]">Sri Anjaneya Furnitures</span>
            <span className="text-xs font-mono uppercase tracking-wider mt-1 text-[#555047]">
              Image Unavailable
            </span>
          </div>
        )}

        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 via-transparent to-transparent pointer-events-none" />

        {/* Click to Zoom Hint Button */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          aria-label="Open fullscreen gallery lightbox"
          className="absolute bottom-4 right-4 p-2.5 rounded-none bg-[#0A0A0A]/80 backdrop-blur-md border border-[#2A2A2A] text-[#F5F0E8] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors cursor-pointer shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
        </button>
      </div>

      {/* Ordered Thumbnail Rail (Desktop & Mobile) */}
      {sortedImages.length > 1 && (
        <div
          ref={thumbnailRailRef}
          className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none snap-x"
          role="tablist"
          aria-label={`${productName} image thumbnails`}
        >
          {sortedImages.map((img, idx) => {
            const isSelected = selectedIndex === idx
            const thumbUrl = getMediaUrl('product-images', img.storage_path, 'thumbnail')

            return (
              <button
                key={img.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-current={isSelected ? 'true' : undefined}
                aria-label={`View ${productName} image ${idx + 1}`}
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-none overflow-hidden border-2 shrink-0 transition-all duration-300 cursor-pointer snap-start ${isSelected
                  ? 'border-[#C9A84C] ring-2 ring-[#C9A84C]/30 shadow-lg shadow-[#C9A84C]/10 scale-100 opacity-100'
                  : 'border-[#2A2A2A] opacity-60 hover:opacity-100 hover:border-[#4A4A4A]'
                  }`}
              >
                {!imageErrors[img.id] ? (
                  <img
                    src={thumbUrl}
                    alt={img.alt_text || `${productName} thumbnail ${idx + 1}`}
                    loading="lazy"
                    onError={() => setImageErrors((prev) => ({ ...prev, [img.id]: true }))}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#151412] flex items-center justify-center text-[10px] text-[#7A746B] font-mono">
                    SAF
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Lightbox / Zoom Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-5xl w-full bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] p-4 sm:p-8 flex flex-col items-center justify-center shadow-2xl">
          <DialogTitle className="sr-only">{productName} Image Lightbox</DialogTitle>
          <DialogDescription className="sr-only">
            High-resolution view of {productName} woodcraft and detailing.
          </DialogDescription>

          <div className="relative w-full max-h-[80vh] flex items-center justify-center overflow-hidden">
            <img
              src={lightboxImageUrl}
              alt={activeImage.alt_text || productName}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-none shadow-2xl"
            />

            {/* Previous Button */}
            {sortedImages.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setSelectedIndex(
                    (prev) => (prev - 1 + sortedImages.length) % sortedImages.length
                  )
                }
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#0A0A0A]/80 border border-[#2A2A2A] text-[#F5F0E8] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors cursor-pointer"
              >
                &larr;
              </button>
            )}

            {/* Next Button */}
            {sortedImages.length > 1 && (
              <button
                type="button"
                onClick={() => setSelectedIndex((prev) => (prev + 1) % sortedImages.length)}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#0A0A0A]/80 border border-[#2A2A2A] text-[#F5F0E8] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors cursor-pointer"
              >
                &rarr;
              </button>
            )}
          </div>

          <div className="pt-4 text-xs font-mono text-[#9B958B] flex items-center justify-between w-full border-t border-[#2A2A2A]/60 mt-4">
            <span>{productName}</span>
            <span>
              {selectedIndex + 1} / {sortedImages.length}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProductImageGallery
