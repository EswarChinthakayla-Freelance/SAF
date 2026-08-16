import React, { useRef, useEffect } from 'react'
import { GALLERY_ROOM_FILTERS, type GalleryRoomSlug } from '@/lib/constants'

export interface GalleryFilterRailProps {
  activeRoom: GalleryRoomSlug
  onSelectRoom: (slug: GalleryRoomSlug) => void
  className?: string
}

/**
 * GalleryFilterRail
 * Professional URL-synced room category selector with horizontal touch scrolling,
 * prominent gold active indicators, and full keyboard accessibility.
 */
export const GalleryFilterRail: React.FC<GalleryFilterRailProps> = ({
  activeRoom,
  onSelectRoom,
  className = '',
}) => {
  const activeBtnRef = useRef<HTMLButtonElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Scroll active tab into view on mobile
  useEffect(() => {
    if (activeBtnRef.current && containerRef.current) {
      const container = containerRef.current
      const btn = activeBtnRef.current
      const btnLeft = btn.offsetLeft
      const btnWidth = btn.offsetWidth
      const containerWidth = container.clientWidth

      container.scrollTo({
        left: btnLeft - containerWidth / 2 + btnWidth / 2,
        behavior: 'smooth',
      })
    }
  }, [activeRoom])

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-x-auto no-scrollbar py-2 ${className}`}
    >
      <div
        role="tablist"
        aria-label="Filter inspiration gallery by room type"
        className="inline-flex items-center gap-2 p-1.5 bg-[#0E0E0E] border border-[#2A2A2A] rounded-none min-w-max"
      >
        {GALLERY_ROOM_FILTERS.map((filter) => {
          const isActive = activeRoom === filter.slug

          return (
            <button
              key={filter.slug}
              ref={isActive ? activeBtnRef : null}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelectRoom(filter.slug)}
              className={`min-h-[44px] px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer select-none rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C] relative ${
                isActive
                  ? 'bg-[#181818] text-[#F5F0E8] border border-[#C9A84C]/80 shadow-md'
                  : 'text-[#8A847A] hover:text-[#F5F0E8] hover:bg-[#141414] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" aria-hidden="true" />
                )}
                <span>{filter.label}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default GalleryFilterRail
