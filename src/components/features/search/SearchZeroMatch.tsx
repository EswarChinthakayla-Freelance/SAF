import React from 'react'
import { Link } from 'react-router-dom'
import { GoldButton } from '@/components/brand/GoldButton'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon, HelpCircleIcon } from '@hugeicons/core-free-icons'

export interface SearchZeroMatchProps {
  query: string
  onClear: () => void
  className?: string
}

/**
 * Signature Gold Corner Register Mark
 */
const CornerRegisterMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none absolute z-20 ${className}`} aria-hidden="true">
    <div className="relative w-3.5 h-3.5">
      <span className="absolute top-0 left-0 w-2 h-[1px] bg-[#C9A84C]" />
      <span className="absolute top-0 left-0 w-[1px] h-2 bg-[#C9A84C]" />
      <span className="absolute bottom-0 right-0 w-2 h-[1px] bg-[#C9A84C]" />
      <span className="absolute bottom-0 right-0 w-[1px] h-2 bg-[#C9A84C]" />
    </div>
  </div>
)

/**
 * SearchZeroMatch — "The Zero Match Composition"
 * Architectural editorial recovery state for queries returning zero products,
 * providing actionable guidance and escape corridors to collections and custom commissions.
 */
export const SearchZeroMatch: React.FC<SearchZeroMatchProps> = ({
  query,
  onClear,
  className = '',
}) => {
  return (
    <section
      aria-label="No search results"
      className={`py-12 sm:py-16 space-y-10 max-w-4xl mx-auto select-none ${className}`}
    >
      {/* Zero Match Frame */}
      <div className="relative bg-[#0D0D0D] border border-[#242424] p-6 sm:p-10 space-y-8">
        <CornerRegisterMark className="top-2 left-2" />
        <CornerRegisterMark className="bottom-2 right-2" />

        {/* Header Plate */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#C9A84C]">
            <HugeiconsIcon icon={HelpCircleIcon} className="w-4 h-4" />
            <span>ARCHIVE SEARCH // ZERO MATCHES</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F5F0E8] font-bold leading-tight">
            No furniture found for <span className="text-[#E8B84B]">“{query}”</span>.
          </h2>

          <p className="text-xs sm:text-sm text-[#9B958B] leading-relaxed font-sans font-light max-w-2xl">
            Our atelier index could not find matching pieces with that term. Refine your query using our verified searchable dimensions below.
          </p>
        </div>

        {/* Truthful Guidance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#1F1F1F]">
          <div className="p-4 bg-[#121212] border border-[#1E1E1E] space-y-1.5">
            <span className="font-mono text-[10px] uppercase text-[#C9A84C] tracking-wider block">
              01 // CORE PIECES
            </span>
            <p className="text-xs text-[#D1CCC2] font-sans">
              Search by general item type such as <strong className="text-[#F5F0E8]">"Bed"</strong>, <strong className="text-[#F5F0E8]">"Dining Table"</strong>, or <strong className="text-[#F5F0E8]">"Fan"</strong>.
            </p>
          </div>

          <div className="p-4 bg-[#121212] border border-[#1E1E1E] space-y-1.5">
            <span className="font-mono text-[10px] uppercase text-[#C9A84C] tracking-wider block">
              02 // TIMBER SPECIES
            </span>
            <p className="text-xs text-[#D1CCC2] font-sans">
              Search by material such as <strong className="text-[#F5F0E8]">"Teak"</strong>, <strong className="text-[#F5F0E8]">"Rosewood"</strong>, or <strong className="text-[#F5F0E8]">"Burma"</strong>.
            </p>
          </div>

          <div className="p-4 bg-[#121212] border border-[#1E1E1E] space-y-1.5">
            <span className="font-mono text-[10px] uppercase text-[#C9A84C] tracking-wider block">
              03 // BROADER TERMS
            </span>
            <p className="text-xs text-[#D1CCC2] font-sans">
              Avoid long phrases or specific dimensions; single keywords yield the best catalogue results.
            </p>
          </div>
        </div>

        {/* Recovery Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#1F1F1F]">
          <GoldButton onClick={onClear} size="sm">
            Clear Search
          </GoldButton>

          <Link to="/products">
            <GoldButton
              variant="outline"
              size="sm"
              icon={<HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Browse Complete Catalogue
            </GoldButton>
          </Link>

          <Link to="/collections">
            <GoldButton
              variant="outline"
              size="sm"
              icon={<HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Explore Collections
            </GoldButton>
          </Link>

          <Link to="/contact">
            <GoldButton
              variant="ghost"
              size="sm"
              className="text-[#C9A84C] hover:text-[#E8B84B]"
            >
              Request Custom Quote &rarr;
            </GoldButton>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default SearchZeroMatch
