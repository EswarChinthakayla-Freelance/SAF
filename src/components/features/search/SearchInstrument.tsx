import React, { useState, forwardRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon, Cancel01Icon } from '@hugeicons/core-free-icons'

export interface SearchInstrumentProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  onSubmit?: () => void
  statusText?: string
  isSearching?: boolean
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
 * SearchInstrument — "The Search Instrument"
 * Prominent architectural search control with semantic input, gold aperture rule,
 * clear action, keyboard shortcut hint, and real-time status indicator.
 */
export const SearchInstrument = forwardRef<HTMLInputElement, SearchInstrumentProps>(
  (
    {
      value,
      onChange,
      onClear,
      onSubmit,
      statusText = 'READY',
      isSearching = false,
      className = '',
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const shouldReduceMotion = useReducedMotion()

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        onSubmit?.()
      }
    }

    return (
      <div className={`relative w-full select-none ${className}`}>
        {/* The Instrument Housing */}
        <div
          role="search"
          aria-label="Catalogue search form"
          className={`relative bg-[#0E0E0E] border transition-colors duration-200 ${
            isFocused
              ? 'border-[#C9A84C]/80 bg-[#121212]'
              : 'border-[#262626] hover:border-[#383838]'
          }`}
        >
          {/* Subtle Corner Register Marks */}
          <CornerRegisterMark className="top-1 left-1" />
          <CornerRegisterMark className="bottom-1 right-1" />

          <div className="flex items-center h-16 sm:h-20 lg:h-[84px] px-4 sm:px-6 gap-3 sm:gap-4">
            {/* Search Icon */}
            <div
              className={`shrink-0 transition-colors ${
                isFocused ? 'text-[#C9A84C]' : 'text-[#7A746B]'
              }`}
              aria-hidden="true"
            >
              <HugeiconsIcon icon={Search01Icon} className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            {/* Semantic Input */}
            <div className="relative flex-1 h-full flex items-center">
              <label htmlFor="catalogue-search-input" className="sr-only">
                Search furniture catalogue
              </label>
              <input
                id="catalogue-search-input"
                ref={ref}
                type="search"
                role="searchbox"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search furniture, materials or details…"
                autoComplete="off"
                spellCheck="false"
                className="w-full bg-transparent text-[#F5F0E8] placeholder-[#5A554D] text-base sm:text-xl lg:text-2xl font-sans font-light tracking-wide outline-none focus:outline-none focus:ring-0 border-none px-0"
              />
            </div>

            {/* Right-Side Actions & Status Indicators */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Clear Action Button */}
              {value.length > 0 && (
                <button
                  type="button"
                  onClick={onClear}
                  aria-label="Clear search query"
                  className="p-1.5 sm:p-2 text-[#7A746B] hover:text-[#F5F0E8] hover:bg-[#1C1C1C] transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C]"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}

              {/* Keyboard Enter Hint (Desktop Only) */}
              <div
                className="hidden sm:flex items-center gap-1 px-2 py-1 bg-[#181818] border border-[#2A2A2A] font-mono text-[9px] uppercase tracking-widest text-[#7A746B]"
                aria-hidden="true"
              >
                <span>ENTER</span>
                <span className="text-[#C9A84C]">↵</span>
              </div>

              {/* Status Badge */}
              <div
                aria-live="polite"
                className={`px-2 sm:px-2.5 py-1 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold border transition-all ${
                  isSearching
                    ? 'bg-[#C9A84C]/10 border-[#C9A84C]/50 text-[#C9A84C] animate-pulse'
                    : isFocused
                    ? 'bg-[#181818] border-[#333333] text-[#D1CCC2]'
                    : 'bg-[#141414] border-[#222222] text-[#7A746B]'
                }`}
              >
                {statusText}
              </div>
            </div>
          </div>

          {/* The Search Aperture Bottom Rule */}
          <div className="relative h-[2px] w-full bg-[#1C1C1C] overflow-hidden">
            <motion.div
              initial={false}
              animate={{
                width: isFocused || value.length > 0 ? '100%' : '0%',
                opacity: isFocused || value.length > 0 ? 1 : 0,
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.25, ease: 'easeOut' }
              }
              className="h-full bg-gradient-to-r from-[#C9A84C] via-[#E8B84B] to-[#C9A84C]"
            />
          </div>
        </div>
      </div>
    )
  }
)

SearchInstrument.displayName = 'SearchInstrument'

export default SearchInstrument
