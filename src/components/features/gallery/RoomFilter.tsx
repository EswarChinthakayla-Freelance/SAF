import React from 'react'
import { GALLERY_ROOM_FILTERS, type GalleryRoomSlug } from '@/lib/constants'

export interface RoomFilterProps {
  activeRoom: GalleryRoomSlug | string
  onSelectRoom: (roomSlug: GalleryRoomSlug) => void
  className?: string
}

export const RoomFilter: React.FC<RoomFilterProps> = ({
  activeRoom,
  onSelectRoom,
  className = '',
}) => {
  const normalizedActive = (activeRoom?.toLowerCase() || 'all') as GalleryRoomSlug

  return (
    <nav
      aria-label="Gallery space filters"
      className={`flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none snap-x ${className}`}
    >
      {GALLERY_ROOM_FILTERS.map((room) => {
        const isSelected = normalizedActive === room.slug

        return (
          <button
            key={room.slug}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-current={isSelected ? 'true' : undefined}
            aria-pressed={isSelected}
            onClick={() => onSelectRoom(room.slug)}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer shrink-0 snap-start focus-visible:ring-2 focus-visible:ring-[#C9A84C] outline-none ${
              isSelected
                ? 'bg-[#C9A84C]/20 border border-[#C9A84C] text-[#E8B84B] font-semibold ring-1 ring-[#C9A84C]/40 shadow-lg shadow-[#C9A84C]/10'
                : 'bg-[#111111] border border-[#2A2A2A] text-[#9B958B] hover:text-[#F5F0E8] hover:border-[#3A3A3A]'
            }`}
          >
            {room.label}
          </button>
        )
      })}
    </nav>
  )
}

export default RoomFilter
