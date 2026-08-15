import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SORT_OPTIONS, type SortOption } from '@/lib/constants'
import { normalizeSortOption } from '@/utils/productFilters'

export interface ProductsToolbarProps {
  totalCount: number
  sort?: string
  onSortChange: (sort: SortOption) => void
  onOpenMobileFilters: () => void
  activeFilterCount: number
  searchQuery?: string
  onSearchChange?: (query: string) => void
  className?: string
}

export const ProductsToolbar: React.FC<ProductsToolbarProps> = ({
  totalCount,
  sort = 'curated',
  onSortChange,
  onOpenMobileFilters,
  activeFilterCount,
  searchQuery = '',
  onSearchChange,
  className = '',
}) => {
  const currentSort = normalizeSortOption(sort)

  return (
    <div
      className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-3 border-b border-[#2A2A2A] ${className}`}
    >
      {/* Left: Result Summary & Mobile Filter Trigger */}
      <div className="flex items-center justify-between sm:justify-start gap-4">
        {/* Mobile Filter Sheet Trigger (Visible only on < 1024px) */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-none bg-[#111111] border border-[#2A2A2A] text-xs font-mono text-[#F5F0E8] hover:border-[#C9A84C]/60 transition-colors cursor-pointer"
          aria-label="Open filter options"
        >
          <svg className="w-4 h-4 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#C9A84C] text-[#0A0A0A] text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Result Count */}
        <div className="text-xs font-mono text-[#9B958B]">
          <span className="font-bold text-[#F5F0E8]">{totalCount}</span> {totalCount === 1 ? 'piece' : 'pieces'} available
        </div>
      </div>

      {/* Right: Search + Shadcn Select Sort Dropdown */}
      <div className="flex items-center gap-3 justify-between sm:justify-end">
        {/* Search Input (if handler provided) */}
        {onSearchChange && (
          <div className="relative flex-1 sm:w-48">
            <input
              type="text"
              placeholder="Search pieces..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#111111] border border-[#2A2A2A] rounded-none px-3 py-1.5 text-xs text-[#F5F0E8] placeholder:text-[#7A746B] focus:border-[#C9A84C] outline-none font-sans"
            />
          </div>
        )}

        {/* Shadcn Select Sort Control */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden md:inline-block text-[11px] uppercase font-mono text-[#7A746B]">
            Sort:
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
              aria-label="Sort catalogue"
              className="bg-[#111111] border-[#2A2A2A] text-[#F5F0E8] rounded-none font-mono text-xs focus-visible:border-[#C9A84C] h-9 px-3 min-w-[170px]"
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
  )
}

export default ProductsToolbar
