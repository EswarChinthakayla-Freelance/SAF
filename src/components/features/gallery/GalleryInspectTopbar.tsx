import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowLeft02Icon,
  InformationCircleIcon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { GalleryShareAction } from './GalleryShareAction'
import type { GalleryItemWithProduct } from '@/types/app'

export interface GalleryInspectTopbarProps {
  image: GalleryItemWithProduct
  currentIndex: number
  totalCount: number
  roomSlug?: string
  isInfoOpen: boolean
  onToggleInfo: () => void
  activeImageUrl?: string | null
  className?: string
}

export const GalleryInspectTopbar: React.FC<GalleryInspectTopbarProps> = ({
  image,
  currentIndex,
  totalCount,
  roomSlug,
  isInfoOpen,
  onToggleInfo,
  activeImageUrl,
  className = '',
}) => {
  const navigate = useNavigate()
  const galleryBackUrl = roomSlug && roomSlug !== 'all' ? `/gallery?room=${roomSlug}` : '/gallery'
  const currentFormatted = String(currentIndex + 1).padStart(2, '0')
  const totalFormatted = String(Math.max(1, totalCount)).padStart(2, '0')
  const title = image.alt_text || `${image.room_type || 'Curated Space'} Frame`

  return (
    <header
      className={`h-14 shrink-0 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#2A2A2A] px-3 sm:px-6 flex items-center justify-between z-20 select-none ${className}`}
    >
      {/* Left: Back Link & Frame Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 max-w-[55%] sm:max-w-[65%]">
        <Link
          to={galleryBackUrl}
          className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#9B958B] hover:text-[#E8B84B] transition-colors shrink-0"
          aria-label="Return to Inspiration Gallery"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} className="w-4 h-4" />
          <span className="hidden sm:inline">Gallery</span>
        </Link>
        <span className="text-[#3A3A3A] hidden sm:inline">/</span>
        <h1 className="text-xs sm:text-sm font-serif font-semibold text-[#F5F0E8] truncate">
          {title}
        </h1>
        {image.room_type && (
          <span className="hidden md:inline text-[10px] uppercase font-mono tracking-widest text-[#C9A84C] bg-[#171717] px-2 py-0.5 border border-[#2A2A2A] shrink-0">
            {image.room_type}
          </span>
        )}
      </div>

      {/* Center: Frame Sequence Counter */}
      <div
        role="status"
        aria-live="polite"
        className="font-mono text-[11px] sm:text-xs text-[#C9A84C] font-semibold tracking-widest px-2 sm:px-3 py-0.5 sm:py-1 bg-[#141414] border border-[#2A2A2A] rounded-none shrink-0"
      >
        {currentFormatted} / {totalFormatted}
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Progressive Web Share */}
        <GalleryShareAction
          imageTitle={title}
          imageId={image.id}
          roomSlug={roomSlug}
          imageUrl={activeImageUrl}
          variant="ghost"
          size="sm"
          className="h-8 w-8 hover:bg-[#1E1E1E] text-[#D1CCC2] hover:text-[#C9A84C] rounded-none cursor-pointer"
        />

        {/* Info Drawer Toggle */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleInfo}
          aria-label="Toggle frame specifications drawer"
          aria-expanded={isInfoOpen}
          aria-controls="gallery-info-sheet"
          className={`h-8 w-8 hover:bg-[#1E1E1E] rounded-none cursor-pointer ${
            isInfoOpen ? 'text-[#C9A84C] bg-[#1E1E1E]' : 'text-[#D1CCC2]'
          }`}
        >
          <HugeiconsIcon icon={InformationCircleIcon} className="w-4 h-4" />
        </Button>

        {/* Exit / Close */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => navigate(galleryBackUrl)}
          aria-label="Close inspection and return to gallery"
          className="h-8 w-8 hover:bg-[#1E1E1E] text-[#D1CCC2] hover:text-red-400 rounded-none cursor-pointer ml-1"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}

export default GalleryInspectTopbar
