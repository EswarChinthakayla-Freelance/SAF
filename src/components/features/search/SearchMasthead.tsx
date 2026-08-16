import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon, Search01Icon } from '@hugeicons/core-free-icons'

export interface SearchMastheadProps {
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
 * SearchMasthead — "The Discovery Masthead"
 * 12-column asymmetric masthead providing clear architectural context and
 * truthful search scope guidance.
 */
export const SearchMasthead: React.FC<SearchMastheadProps> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <header className={`space-y-6 sm:space-y-8 select-none ${className}`}>
      {/* 1. Breadcrumb & Studio Sector Label */}
      <div className="flex items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono tracking-wider">
          <Link
            to="/"
            className="text-[#7A746B] hover:text-[#C9A84C] transition-colors focus-visible:text-[#C9A84C] focus-visible:outline-none"
          >
            Home
          </Link>
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 text-[#3A3A3A]" aria-hidden="true" />
          <span className="text-[#C9A84C] font-semibold" aria-current="page">
            Search
          </span>
        </nav>

        <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
          <HugeiconsIcon icon={Search01Icon} className="w-3 h-3 text-[#C9A84C]" aria-hidden="true" />
          <span>INDEX // DISCOVERY DESK</span>
        </div>
      </div>

      {/* 2. Asymmetric 12-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
        {/* Left Column (Cols 1-7): Editorial Titles & Scope */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          {/* Eyebrow with Folio Line */}
          <div className="flex items-center gap-3">
            <span className="w-8 sm:w-12 h-[1.5px] bg-[#C9A84C]" aria-hidden="true" />
            <span className="text-[11px] sm:text-xs uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
              DISCOVERY
            </span>
          </div>

          {/* Monumental Editorial H1 */}
          <motion.h1
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#F5F0E8] font-bold tracking-tight leading-[1.08]"
          >
            Find Your Furniture
          </motion.h1>

          {/* Truthful Scope Guidance Copy */}
          <motion.p
            initial={shouldReduceMotion ? undefined : { opacity: 0 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="text-xs sm:text-sm md:text-base text-[#9B958B] leading-relaxed font-sans font-light max-w-xl"
          >
            Search the public catalogue by furniture piece name, timber material (Teak, Rosewood), or descriptive craft details.
          </motion.p>
        </div>

        {/* Right Column (Cols 8-12): Technical Search Scope Context Panel (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-5">
          <div className="relative bg-[#0D0D0D] border border-[#222222] p-4 xl:p-5">
            <CornerRegisterMark className="top-1.5 left-1.5" />
            <CornerRegisterMark className="bottom-1.5 right-1.5" />

            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-2 font-mono text-[9px] uppercase tracking-widest text-[#7A746B]">
                <span className="text-[#C9A84C]">SEARCHABLE DIMENSIONS</span>
                <span>FTS INDEX</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#C9A84C] font-bold shrink-0">01</span>
                  <div className="text-[#D1CCC2]">
                    <span className="text-[#F5F0E8] font-medium">PIECE TITLES</span>
                    <p className="text-[11px] text-[#7A746B] font-sans font-light">Bed, Dining Table, Lounger, Credenza, Fan</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#C9A84C] font-bold shrink-0">02</span>
                  <div className="text-[#D1CCC2]">
                    <span className="text-[#F5F0E8] font-medium">TIMBERS & MATERIALS</span>
                    <p className="text-[11px] text-[#7A746B] font-sans font-light">Solid Teak, Burma Teak, Indian Rosewood, Linen</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#C9A84C] font-bold shrink-0">03</span>
                  <div className="text-[#D1CCC2]">
                    <span className="text-[#F5F0E8] font-medium">CRAFT & FORM</span>
                    <p className="text-[11px] text-[#7A746B] font-sans font-light">Live-Edge, Mortise Joinery, Sculpted Settee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default SearchMasthead
