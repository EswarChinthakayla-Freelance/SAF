import React from 'react'
import { Link } from 'react-router-dom'
import { GoldButton } from '@/components/brand/GoldButton'

export interface CollectionsClosingCTAProps {
  className?: string
}

/**
 * CollectionsClosingCTA
 * Full-width architectural bridge section at the conclusion of The Collection Atlas.
 */
export const CollectionsClosingCTA: React.FC<CollectionsClosingCTAProps> = ({
  className = '',
}) => {
  return (
    <section
      aria-label="Catalogue Bridge Call to Action"
      className={`relative mt-16 sm:mt-24 p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#0A0A0A] border border-[#222222] select-none ${className}`}
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="space-y-3">
          <div className="flex items-center justify-center md:justify-start gap-2 font-mono text-xs">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold">
              THE COMPLETE INDEX
            </span>
            <span className="text-[#3A3A3A]">//</span>
            <span className="text-[10px] uppercase tracking-widest text-[#7A746B]">
              ARCHIVE
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#F5F0E8] leading-tight">
            Explore every piece in our catalogue.
          </h2>

          <p className="text-xs sm:text-sm text-[#9B958B] font-sans font-light max-w-xl">
            Discover individual handcrafted pieces across all categories, materials, and bespoke dimensions.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
          <Link to="/products">
            <GoldButton size="lg" className="text-xs uppercase font-mono tracking-wider">
              View Furniture Catalogue
            </GoldButton>
          </Link>
          <Link to="/contact">
            <GoldButton variant="outline" size="lg" className="text-xs uppercase font-mono tracking-wider">
              Request Custom Quote
            </GoldButton>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CollectionsClosingCTA
