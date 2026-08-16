import React from 'react'
import type { CollectionRow } from '@/types/app'

interface RoomRailProps {
  collections: CollectionRow[]
  activeIndex: number
  onSelect: (index: number) => void
}

/**
 * RoomRail
 * Vertical architectural room index navigation rail.
 * Exposes accessible collection labels with signature gold active indicator line.
 */
export const RoomRail: React.FC<RoomRailProps> = ({
  collections,
  activeIndex,
  onSelect,
}) => {
  return (
    <nav
      aria-label="Spatial Room Index"
      className="flex flex-col space-y-4 select-none"
    >
      <div className="text-[10px] font-mono tracking-[0.25em] text-[#9B958B]/60 uppercase pb-2 border-b border-[#2A2A2A]/60">
        SPACES // {String(collections.length).padStart(2, '0')}
      </div>

      <ul className="flex flex-col space-y-3" role="tablist" aria-orientation="vertical">
        {collections.map((collection, idx) => {
          const isActive = activeIndex === idx
          const indexFormatted = String(idx + 1).padStart(2, '0')

          return (
            <li key={collection.id} role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Jump to ${collection.name} room`}
                onClick={() => onSelect(idx)}
                className={`group relative flex items-center gap-3 w-full text-left py-1.5 transition-all duration-300 outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C] rounded-none ${
                  isActive
                    ? 'text-[#F5F0E8] font-semibold'
                    : 'text-[#9B958B]/60 hover:text-[#D1CCC2]'
                }`}
              >
                {/* Active Gold Line Indicator */}
                <span
                  aria-hidden="true"
                  className={`w-3 h-[1.5px] transition-all duration-300 ${
                    isActive
                      ? 'bg-[#C9A84C] w-5'
                      : 'bg-transparent group-hover:bg-[#2A2A2A]'
                  }`}
                />

                {/* Index number */}
                <span
                  aria-hidden="true"
                  className={`text-[11px] font-mono tracking-wider transition-colors ${
                    isActive ? 'text-[#C9A84C]' : 'text-[#9B958B]/40 group-hover:text-[#9B958B]/70'
                  }`}
                >
                  {indexFormatted}
                </span>

                {/* Room Name */}
                <span
                  className={`font-serif text-sm tracking-wide transition-colors line-clamp-1 ${
                    isActive ? 'text-[#F5F0E8]' : 'text-[#9B958B]/70 group-hover:text-[#F5F0E8]'
                  }`}
                >
                  {collection.name}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default RoomRail
