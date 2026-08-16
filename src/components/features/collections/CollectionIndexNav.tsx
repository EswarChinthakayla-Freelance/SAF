import React from 'react'
import type { CollectionRow } from '@/types/app'

export interface CollectionIndexNavProps {
  collections: CollectionRow[]
  activeSlug?: string
  className?: string
}

/**
 * CollectionIndexNav
 * Architectural index rail for "The Collection Atlas".
 * Desktop: Fine horizontal rail with indexed chapter labels.
 * Mobile: Horizontally scrollable touch-friendly index strip.
 */
export const CollectionIndexNav: React.FC<CollectionIndexNavProps> = ({
  collections,
  activeSlug,
  className = '',
}) => {
  if (!collections || collections.length <= 1) return null

  const handleScrollToChapter = (slug: string, e: React.MouseEvent) => {
    const targetElement = document.getElementById(`chapter-${slug}`)
    if (targetElement) {
      e.preventDefault()
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav
      aria-label="Collection atlas index"
      className={`border-y border-[#222222] bg-[#0A0A0A]/95 py-3 select-none ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop / Tablet Index Rail */}
        <div className="hidden sm:flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-xs">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold mr-2 shrink-0">
            ATLAS INDEX //
          </span>

          {collections.map((col, idx) => {
            const indexStr = String(idx + 1).padStart(2, '0')
            const isActive = activeSlug === col.slug

            return (
              <a
                key={col.id}
                href={`#chapter-${col.slug}`}
                onClick={(e) => handleScrollToChapter(col.slug, e)}
                className={`group inline-flex items-center gap-2 py-1.5 transition-colors cursor-pointer outline-none focus-visible:text-[#E8B84B] ${
                  isActive ? 'text-[#F5F0E8]' : 'text-[#8A847A] hover:text-[#F5F0E8]'
                }`}
              >
                <span className="text-[10px] text-[#C9A84C] font-semibold group-hover:text-[#E8B84B]">
                  {indexStr}
                </span>
                <span className="uppercase tracking-wider truncate max-w-[200px]">
                  {col.name}
                </span>
                {idx < collections.length - 1 && (
                  <span className="text-[#333333] ml-4 pointer-events-none" aria-hidden="true">
                    /
                  </span>
                )}
              </a>
            )
          })}
        </div>

        {/* Mobile Horizontally Scrollable Rail */}
        <div className="sm:hidden flex items-center gap-3 overflow-x-auto no-scrollbar py-1 text-xs font-mono">
          <span className="text-[9px] uppercase tracking-widest text-[#C9A84C] font-semibold shrink-0">
            INDEX:
          </span>

          {collections.map((col, idx) => {
            const indexStr = String(idx + 1).padStart(2, '0')
            return (
              <a
                key={col.id}
                href={`#chapter-${col.slug}`}
                onClick={(e) => handleScrollToChapter(col.slug, e)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#121212] border border-[#262626] text-[#D1CCC2] text-xs font-mono uppercase tracking-wider shrink-0 min-h-[44px]"
              >
                <span className="text-[#C9A84C] font-bold text-[10px]">{indexStr}</span>
                <span>{col.name}</span>
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default CollectionIndexNav
