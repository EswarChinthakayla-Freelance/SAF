import React from 'react'
import { Link } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'

export interface PublicGalleryHeroProps {
  totalCount?: number
  activeRoomLabel?: string
  className?: string
}

/**
 * PublicGalleryHero
 * Premium editorial header composition for "Spaces, Styled."
 * Features semantic breadcrumbs, Playfair Display typography, craft statement,
 * and live inspiration archive metrics.
 */
export const PublicGalleryHero: React.FC<PublicGalleryHeroProps> = ({
  totalCount,
  activeRoomLabel,
  className = '',
}) => {
  return (
    <header className={`space-y-8 select-none ${className}`}>
      {/* 1. Refined Semantic Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono tracking-wider">
        <Link
          to="/"
          className="text-[#7A746B] hover:text-[#C9A84C] transition-colors focus-visible:text-[#C9A84C] focus-visible:outline-none"
        >
          Home
        </Link>
        <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 text-[#3A3A3A]" aria-hidden="true" />
        <span className="text-[#C9A84C] font-semibold" aria-current="page">
          Gallery
        </span>
        {activeRoomLabel && activeRoomLabel !== 'All' && (
          <>
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 text-[#3A3A3A]" aria-hidden="true" />
            <span className="text-[#9B958B] truncate max-w-[150px]">{activeRoomLabel}</span>
          </>
        )}
      </nav>

      {/* 2. Editorial Title & Metric Composition */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold block">
              INSPIRATION
            </span>
            <span className="text-[#3A3A3A] font-mono text-xs">//</span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#7A746B]">
              SPATIAL ARCHIVE
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#F5F0E8] font-bold tracking-tight leading-[1.05]">
            Spaces, Styled.
          </h1>

          <p className="text-sm sm:text-base text-[#9B958B] leading-relaxed font-sans font-light max-w-2xl pt-1">
            Discover real-world architectural settings, room layouts, and refined living environments elevated by bespoke solid woodcraft.
          </p>
        </div>

        {/* 3. Right Status / Metric Plate */}
        <div className="shrink-0 p-4 bg-[#111111] border border-[#2A2A2A] space-y-1.5 self-start lg:self-end min-w-[200px]">
          <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-[#7A746B]">
            <span>ARCHIVE STATUS</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" aria-hidden="true" />
          </div>
          <div className="font-mono text-lg text-[#F5F0E8] font-semibold">
            {typeof totalCount === 'number' && totalCount > 0 ? (
              <span>{totalCount} Curated Frames</span>
            ) : (
              <span>Curated Interior Sets</span>
            )}
          </div>
          <div className="font-mono text-[10px] text-[#C9A84C] tracking-wider uppercase">
            5 Distinct Room Typologies
          </div>
        </div>
      </div>

      {/* 4. Architectural Divider Rule */}
      <div className="w-full h-px bg-[#2A2A2A]" aria-hidden="true" />
    </header>
  )
}

export default PublicGalleryHero
