import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import { ViewIcon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { getMediaUrl } from '@/lib/media'
import { getCollectionFallbackImage } from '@/lib/collectionFallback'
import { STORAGE_BUCKETS } from '@/lib/constants'
import type { GalleryItemWithProduct } from '@/types/app'

export interface CuratedLeadFrameProps {
  images: GalleryItemWithProduct[]
  roomSlug?: string
  className?: string
}

export const CuratedLeadFrame: React.FC<CuratedLeadFrameProps> = ({
  images,
  roomSlug,
  className = '',
}) => {
  const [leadError, setLeadError] = useState(false)
  const [supportError, setSupportError] = useState(false)

  if (images.length === 0) return null

  const leadImage = images[0]
  const supportingImage = images[1]
  const tertiaryImage = images[2]

  const leadFallback = getCollectionFallbackImage(
    leadImage.room_type || undefined,
    leadImage.alt_text || leadImage.room_type || undefined,
    0
  )
  const leadUrl = !leadError && leadImage.storage_path
    ? getMediaUrl(STORAGE_BUCKETS.GALLERY_IMAGES, leadImage.storage_path, 'gallery-lead')
    : leadFallback

  const frameQuery = roomSlug && roomSlug !== 'all' ? `?room=${roomSlug}` : ''
  const leadInspectUrl = `/gallery/frame/${leadImage.id}${frameQuery}`

  return (
    <section
      aria-label="Curated Lead Exhibition Frame"
      className={`w-full space-y-4 ${className}`}
    >
      {/* Editorial Eyebrow Bar */}
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-[#7A746B] border-b border-[#202020] pb-2.5">
        <span className="text-[#C9A84C] font-semibold">CURATED LEAD FRAME // 01</span>
        <span>{leadImage.room_type || 'FEATURED SPACE'}</span>
      </div>

      {/* Asymmetric Magazine Spread Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Dominant Hero Frame (Cols 1-7 or 1-8) */}
        <div className="lg:col-span-7 xl:col-span-8 relative bg-[#0E0E0E] border border-[#2A2A2A] overflow-hidden flex flex-col justify-between group">
          {/* Top Label */}
          <div className="px-4 py-2.5 bg-[#090909] border-b border-[#202020] flex items-center justify-between z-10 font-mono text-[10px] uppercase tracking-widest text-[#7A746B]">
            <span>LEAD EXHIBITION PLATE</span>
            <span className="text-[#C9A84C]">{leadImage.room_type || 'INTERIOR HARMONY'}</span>
          </div>

          {/* Main Visual Canvas */}
          <Link
            to={leadInspectUrl}
            aria-label={`Inspect ${leadImage.alt_text || 'Featured interior space'} full screen`}
            className="relative aspect-[16/10] sm:aspect-[16/9] bg-[#060606] flex items-center justify-center overflow-hidden cursor-zoom-in block"
          >
            <img
              src={leadUrl}
              alt={leadImage.alt_text || 'Featured interior space'}
              loading="eager"
              onError={() => setLeadError(true)}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

            {/* Hover Inspect Badge */}
            <div className="absolute bottom-4 right-4 bg-[#0A0A0A]/95 text-[#E8B84B] border border-[#C9A84C]/60 px-3.5 py-1.5 flex items-center gap-2 font-mono text-xs uppercase tracking-wider transition-all duration-300">
              <HugeiconsIcon icon={ViewIcon} className="w-4 h-4 text-[#C9A84C]" />
              <span>Inspect Full Screen</span>
            </div>
          </Link>

          {/* Lead Information & CTAs */}
          <div className="p-5 sm:p-6 bg-[#0A0A0A] border-t border-[#202020] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F0E8] leading-tight">
                {leadImage.alt_text || `${leadImage.room_type || 'Architectural'} Living Inspiration`}
              </h2>
              <p className="text-xs text-[#9B958B] font-sans font-light">
                Sculpted architectural atmosphere rendered with authentic timber craftsmanship.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {leadImage.products && (
                <Link
                  to={`/products/${leadImage.products.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C9A84C] hover:bg-[#E8B84B] text-[#0A0A0A] font-mono text-xs uppercase tracking-wider font-semibold transition-colors"
                >
                  <span>Explore Product</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Supporting Frames Column (Cols 8-12) */}
        {supportingImage && (
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 justify-between">
            {/* Supporting Frame 1 */}
            <div className="flex-1 bg-[#0E0E0E] border border-[#2A2A2A] overflow-hidden flex flex-col group">
              <div className="px-3.5 py-2 bg-[#090909] border-b border-[#202020] flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#7A746B]">
                <span className="text-[#C9A84C]">FRAME 02</span>
                <span>{supportingImage.room_type || 'STUDIO'}</span>
              </div>
              <Link
                to={`/gallery/frame/${supportingImage.id}${frameQuery}`}
                aria-label={`Inspect ${supportingImage.alt_text || 'Supporting space'}`}
                className="relative flex-1 aspect-[4/3] bg-[#060606] overflow-hidden cursor-zoom-in block"
              >
                <img
                  src={
                    !supportError && supportingImage.storage_path
                      ? getMediaUrl(STORAGE_BUCKETS.GALLERY_IMAGES, supportingImage.storage_path, 'gallery-grid')
                      : getCollectionFallbackImage(supportingImage.room_type || undefined, supportingImage.alt_text || undefined, 1)
                  }
                  alt={supportingImage.alt_text || 'Supporting interior space'}
                  loading="lazy"
                  onError={() => setSupportError(true)}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 right-3 bg-[#0A0A0A]/90 text-[#E8B84B] px-2 py-1 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider border border-[#2A2A2A]">
                  <HugeiconsIcon icon={ViewIcon} className="w-3 h-3 text-[#C9A84C]" />
                  <span>Inspect</span>
                </div>
              </Link>
            </div>

            {/* Supporting Frame 2 (if available) */}
            {tertiaryImage && (
              <div className="flex-1 bg-[#0E0E0E] border border-[#2A2A2A] overflow-hidden flex flex-col group">
                <div className="px-3.5 py-2 bg-[#090909] border-b border-[#202020] flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#7A746B]">
                  <span className="text-[#C9A84C]">FRAME 03</span>
                  <span>{tertiaryImage.room_type || 'STUDIO'}</span>
                </div>
                <Link
                  to={`/gallery/frame/${tertiaryImage.id}${frameQuery}`}
                  aria-label={`Inspect ${tertiaryImage.alt_text || 'Supporting space'}`}
                  className="relative flex-1 aspect-[4/3] bg-[#060606] overflow-hidden cursor-zoom-in block"
                >
                  <img
                    src={
                      tertiaryImage.storage_path
                        ? getMediaUrl(STORAGE_BUCKETS.GALLERY_IMAGES, tertiaryImage.storage_path, 'gallery-grid')
                        : getCollectionFallbackImage(tertiaryImage.room_type || undefined, tertiaryImage.alt_text || undefined, 2)
                    }
                    alt={tertiaryImage.alt_text || 'Supporting interior space'}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 right-3 bg-[#0A0A0A]/90 text-[#E8B84B] px-2 py-1 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider border border-[#2A2A2A]">
                    <HugeiconsIcon icon={ViewIcon} className="w-3 h-3 text-[#C9A84C]" />
                    <span>Inspect</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default CuratedLeadFrame
