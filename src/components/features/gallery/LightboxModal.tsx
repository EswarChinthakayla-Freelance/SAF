import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { GoldButton } from '@/components/brand/GoldButton'
import { getMediaUrl } from '@/lib/media'
import type { GalleryItemWithProduct } from '@/types/app'

export interface LightboxModalProps {
  images: GalleryItemWithProduct[]
  selectedIndex: number | null
  onClose: () => void
  onSelectIndex: (index: number) => void
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  images = [],
  selectedIndex,
  onClose,
  onSelectIndex,
}) => {
  const isOpen = selectedIndex !== null && selectedIndex >= 0 && selectedIndex < images.length
  const touchStartXRef = useRef<number | null>(null)
  const [imageError, setImageError] = useState(false)

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isOpen || selectedIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        onSelectIndex((selectedIndex + 1) % images.length)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onSelectIndex((selectedIndex - 1 + images.length) % images.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, images.length, onSelectIndex])

  // Reset image error on slide change
  useEffect(() => {
    setImageError(false)
  }, [selectedIndex])

  if (!isOpen || selectedIndex === null) return null

  const current = images[selectedIndex]
  const imageUrl = getMediaUrl('gallery-images', current.storage_path, 'hero')
  const linkedProduct = current.products && current.products.is_published ? current.products : null

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartXRef.current - touchEndX

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe Left -> Next
        onSelectIndex((selectedIndex + 1) % images.length)
      } else {
        // Swipe Right -> Previous
        onSelectIndex((selectedIndex - 1 + images.length) % images.length)
      }
    }
    touchStartXRef.current = null
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-6xl w-full bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] p-4 sm:p-8 flex flex-col items-center justify-center shadow-2xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <DialogTitle className="sr-only">
          {current.alt_text || `Inspiration Gallery Image ${selectedIndex + 1}`}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Detailed architectural and furniture inspiration photograph from Sri Anjaneya Furnitures.
        </DialogDescription>

        {/* Main Image Stage */}
        <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden">
          {!imageError ? (
            <img
              src={imageUrl}
              alt={current.alt_text || 'Inspiration photograph'}
              onError={() => setImageError(true)}
              className="max-h-[68vh] w-auto max-w-full object-contain rounded-none shadow-2xl transition-opacity duration-300"
            />
          ) : (
            <div className="w-full h-80 flex flex-col items-center justify-center p-8 text-center text-[#7A746B] bg-[#151412] rounded-none">
              <span className="font-serif text-lg text-[#9B958B]">Sri Anjaneya Furnitures</span>
              <span className="text-xs font-mono uppercase tracking-wider mt-1 text-[#555047]">
                Image Unavailable
              </span>
            </div>
          )}

          {/* Previous Button (Left) */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={() => onSelectIndex((selectedIndex - 1 + images.length) % images.length)}
              aria-label="View previous image"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#0A0A0A]/85 backdrop-blur-md border border-[#2A2A2A] text-[#F5F0E8] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors cursor-pointer flex items-center justify-center shadow-lg focus-visible:ring-2 focus-visible:ring-[#C9A84C] outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next Button (Right) */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={() => onSelectIndex((selectedIndex + 1) % images.length)}
              aria-label="View next image"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#0A0A0A]/85 backdrop-blur-md border border-[#2A2A2A] text-[#F5F0E8] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors cursor-pointer flex items-center justify-center shadow-lg focus-visible:ring-2 focus-visible:ring-[#C9A84C] outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Caption, Counter, and Linked Product Section */}
        <div className="w-full pt-4 mt-3 border-t border-[#2A2A2A]/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-0.5">
            {current.room_type && (
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#C9A84C] font-semibold block">
                {current.room_type}
              </span>
            )}
            {current.alt_text && (
              <h4 className="font-serif text-sm sm:text-base text-[#F5F0E8] font-medium">
                {current.alt_text}
              </h4>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Linked Product CTA */}
            {linkedProduct && (
              <Link to={`/products/${linkedProduct.slug}`} onClick={onClose}>
                <GoldButton size="sm" className="text-xs uppercase tracking-wider">
                  Explore {linkedProduct.name}
                </GoldButton>
              </Link>
            )}

            {/* Position Counter */}
            <span className="text-xs font-mono text-[#9B958B] shrink-0">
              {selectedIndex + 1} of {images.length}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LightboxModal
