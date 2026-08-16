import React, { useState, useEffect, useRef } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Search01Icon,
  FilterIcon,
  Cancel01Icon,
  Sorting05Icon,
} from '@hugeicons/core-free-icons'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { SORT_OPTIONS, type SortOption } from '@/lib/constants'
import { normalizeSortOption } from '@/utils/productFilters'

export interface CatalogueCommandBarProps {
  totalCount: number
  sort?: string
  onSortChange: (sort: SortOption) => void
  isFilterAtelierOpen: boolean
  onToggleFilterAtelier: () => void
  onOpenMobileFilters: () => void
  activeFilterCount: number
  searchQuery?: string
  onSearchChange?: (query: string) => void
  className?: string
}

/**
 * CatalogueCommandBar
 * Signature sticky control bar for "The Furniture Index".
 * Unifies Result Counter, Desktop Filter Atelier Toggle, Mobile Sheet Trigger,
 * Debounced Search Field, and Architectural Sort Control.
 */
export const CatalogueCommandBar: React.FC<CatalogueCommandBarProps> = ({
  totalCount,
  sort = 'curated',
  onSortChange,
  isFilterAtelierOpen,
  onToggleFilterAtelier,
  onOpenMobileFilters,
  activeFilterCount,
  searchQuery = '',
  onSearchChange,
  className = '',
}) => {
  const currentSort = normalizeSortOption(sort)
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Synchronize local search state with prop when URL changes externally
  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  // Debounced search handler (~300ms)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setLocalSearch(val)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearchChange?.(val.trim())
    }, 300)
  }

  // Clear search input and keep focus
  const handleClearSearch = () => {
    setLocalSearch('')
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    onSearchChange?.('')
    inputRef.current?.focus()
  }

  return (
    <section
      aria-label="Catalogue Command Bar"
      className={`sticky top-16 sm:top-20 z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-y border-[#222222] py-3 select-none ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
          {/* 1. Left: Result Count & Filter Atelier Toggle */}
          <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4 shrink-0">
            {/* Desktop Filter Atelier Toggle (>= 1024px) */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onToggleFilterAtelier}
              aria-expanded={isFilterAtelierOpen}
              aria-label="Toggle catalogue filters panel"
              className={`hidden lg:inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider h-9 px-3.5 rounded-none transition-all cursor-pointer ${
                isFilterAtelierOpen || activeFilterCount > 0
                  ? 'bg-[#181818] border-[#C9A84C] text-[#F5F0E8]'
                  : 'bg-[#111111] border-[#2A2A2A] text-[#8A847A] hover:text-[#F5F0E8] hover:border-[#3A3A3A]'
              }`}
            >
              <HugeiconsIcon icon={FilterIcon} className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>{isFilterAtelierOpen ? 'Hide Filters' : 'Filter Catalogue'}</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#C9A84C] text-[#0A0A0A] text-[10px] font-bold flex items-center justify-center font-mono ml-1">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* Mobile Filter Sheet Trigger (< 1024px) */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenMobileFilters}
              aria-label="Open filter options sheet"
              className="lg:hidden inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider h-10 px-3.5 rounded-none bg-[#111111] border-[#2A2A2A] text-[#F5F0E8] hover:border-[#C9A84C] cursor-pointer"
            >
              <HugeiconsIcon icon={FilterIcon} className="w-4 h-4 text-[#C9A84C]" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#C9A84C] text-[#0A0A0A] text-[10px] font-bold flex items-center justify-center font-mono">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* Architectural Result Counter */}
            <div className="font-mono text-xs text-[#8A847A] uppercase tracking-wider flex items-center gap-1.5">
              <span className="font-bold text-[#F5F0E8] text-sm">
                {String(totalCount).padStart(2, '0')}
              </span>
              <span className="text-[#555047]">//</span>
              <span>{totalCount === 1 ? 'Piece Available' : 'Pieces Available'}</span>
            </div>
          </div>

          {/* 2. Center: Integrated Search Field */}
          <div className="flex-1 max-w-full md:max-w-md relative">
            <div className="relative flex items-center">
              <HugeiconsIcon
                icon={Search01Icon}
                className="w-4 h-4 text-[#7A746B] absolute left-3 pointer-events-none"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                type="text"
                value={localSearch}
                onChange={handleInputChange}
                placeholder="Search furniture by name, material, or detail..."
                aria-label="Search furniture pieces"
                className="w-full bg-[#111111] border border-[#262626] focus:border-[#C9A84C] text-[#F5F0E8] placeholder:text-[#666055] text-xs font-sans pl-9 pr-8 py-2 rounded-none outline-none transition-colors"
              />
              {localSearch.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search input"
                  className="absolute right-2.5 text-[#7A746B] hover:text-[#F5F0E8] p-0.5 cursor-pointer"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 3. Right: Sort Selector */}
          <div className="flex items-center gap-2 justify-end shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-mono tracking-widest text-[#7A746B]">
              <HugeiconsIcon icon={Sorting05Icon} className="w-3 h-3 text-[#C9A84C]" />
              <span>SORT</span>
            </span>

            <Select
              items={SORT_OPTIONS.reduce((acc, opt) => {
                acc[opt.value] = opt.label
                return acc
              }, {} as Record<string, string>)}
              value={currentSort}
              onValueChange={(val) => {
                if (val) onSortChange(val as SortOption)
              }}
            >
              <SelectTrigger
                aria-label="Sort furniture catalogue"
                className="bg-[#111111] border-[#262626] hover:border-[#3A3A3A] text-[#F5F0E8] rounded-none font-mono text-xs focus-visible:border-[#C9A84C] h-9 px-3 min-w-[160px] cursor-pointer"
              >
                <SelectValue placeholder="Sort Catalogue" />
              </SelectTrigger>
              <SelectContent className="bg-[#111111] border-[#2A2A2A] text-[#F5F0E8] rounded-none shadow-2xl z-50">
                <SelectGroup>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-xs font-mono focus:bg-[#C9A84C]/20 focus:text-[#E8B84B] cursor-pointer py-2"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CatalogueCommandBar
