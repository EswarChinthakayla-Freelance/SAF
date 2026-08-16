import React from 'react'
import { Link } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import type { GalleryItemWithProduct } from '@/types/app'

export interface GalleryInspectInfoProps {
  image: GalleryItemWithProduct
  isOpen: boolean
  onClose: () => void
  className?: string
}

export const GalleryInspectInfo: React.FC<GalleryInspectInfoProps> = ({
  image,
  isOpen,
  onClose,
  className = '',
}) => {
  if (!isOpen) return null

  const title = image.alt_text || `${image.room_type || 'Curated Space'} Frame`

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Container (Mobile Bottom Sheet / Desktop Right Slide-Over) */}
      <aside
        id="gallery-info-sheet"
        aria-label="Inspiration frame specifications preview"
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[82vh] lg:max-h-none lg:inset-y-0 lg:left-auto lg:right-0 lg:w-96 bg-[#0E0E0E]/98 backdrop-blur-2xl border-t lg:border-t-0 lg:border-l border-[#2A2A2A] p-5 sm:p-6 rounded-t-2xl lg:rounded-none flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-bottom lg:slide-in-from-right duration-200 select-none ${className}`}
      >
        {/* Mobile Drag Pill */}
        <div className="w-10 h-1 bg-[#3A3A3A] rounded-full mx-auto mb-3 lg:hidden shrink-0" />

        <div className="flex-1 overflow-y-auto space-y-6 pr-1 no-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#C9A84C] font-semibold">
              Frame Details
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-[#7A746B] hover:text-[#F5F0E8] font-mono cursor-pointer px-2 py-1 hover:bg-[#1A1A1A]"
            >
              ✕ Close
            </button>
          </div>

          {/* Title & Room Typology */}
          <div className="space-y-1.5">
            {image.room_type && (
              <span className="text-[11px] uppercase font-mono tracking-widest text-[#C9A84C]">
                {image.room_type}
              </span>
            )}
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F0E8] leading-tight">
              {title}
            </h2>
          </div>

          {/* Spatial Architecture Statement */}
          <div className="space-y-2 p-3.5 bg-[#141414] border border-[#222222]">
            <div className="text-[10px] uppercase font-mono text-[#7A746B] tracking-wider">
              Spatial Concept
            </div>
            <p className="text-xs text-[#D1CCC2] leading-relaxed font-sans font-light">
              Real-world residential setting photographed to showcase natural wood movement, light interplay, and joinery harmony.
            </p>
          </div>

          {/* Linked Product Bridge */}
          {image.products && (
            <div className="space-y-3 p-4 bg-[#141414] border border-[#C9A84C]/40">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]">
                <span>Featured Furniture</span>
                <span>Inspiration Link</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-semibold text-[#F5F0E8]">
                  {image.products.name}
                </h3>
                <p className="text-[11px] text-[#9B958B] font-sans font-light">
                  Handcrafted solid timber creation custom configured for this space.
                </p>
              </div>
              <Link
                to={`/products/${image.products.slug}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#C9A84C] hover:bg-[#E8B84B] text-[#0A0A0A] font-mono text-xs uppercase tracking-widest font-semibold transition-colors"
              >
                <span>Explore Related Product</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Action Bottom Link */}
        <div className="pt-4 mt-4 border-t border-[#2A2A2A] shrink-0">
          <Link
            to="/gallery"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#181818] hover:bg-[#222222] border border-[#333333] text-[#F5F0E8] font-mono text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            <span>Back to Complete Gallery</span>
          </Link>
        </div>
      </aside>
    </>
  )
}

export default GalleryInspectInfo
