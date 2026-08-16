import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Search01Icon,
  Cancel01Icon,
  LayoutGridIcon,
  Menu01Icon,
  Sorting05Icon,
} from '@hugeicons/core-free-icons'

export type ViewMode = 'list' | 'board'

export interface AdminCollectionsToolbarProps {
  searchQuery: string
  onSearchChange: (val: string) => void
  selectedVisibility: 'all' | 'active' | 'inactive'
  onVisibilityChange: (val: 'all' | 'active' | 'inactive') => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  isReorderMode: boolean
  onToggleReorderMode: () => void
  onResetFilters: () => void
}

export const AdminCollectionsToolbar: React.FC<AdminCollectionsToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedVisibility,
  onVisibilityChange,
  viewMode,
  onViewModeChange,
  isReorderMode,
  onToggleReorderMode,
  onResetFilters,
}) => {
  const hasActiveFilters = searchQuery.trim().length > 0 || selectedVisibility !== 'all'

  return (
    <div className="space-y-3 font-sans">
      {/* Primary Toolbar Bar */}
      <div className="bg-[#111111] border border-[#242424] rounded-lg p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
        {/* Left: Search Input */}
        <div className="relative flex-1 min-w-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A746B]">
            <HugeiconsIcon icon={Search01Icon} className="w-4 h-4" />
          </div>
          <input
            id="admin-collections-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search collections…"
            aria-label="Search collections"
            disabled={isReorderMode}
            className="w-full h-9 bg-[#161616] border border-[#2A2A2A] hover:border-[#383838] focus:border-[#C9A84C] disabled:opacity-50 disabled:cursor-not-allowed text-[#F5F0E8] placeholder:text-[#666158] text-xs sm:text-sm pl-9 pr-9 rounded-md outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7A746B] hover:text-[#F5F0E8] transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Filter Controls & View Switcher */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 shrink-0">
          {/* Visibility Filter Dropdown */}
          <div className="min-w-[140px]">
            <Select
              value={selectedVisibility}
              onValueChange={(v) => onVisibilityChange(v as 'all' | 'active' | 'inactive')}
              disabled={isReorderMode}
            >
              <SelectTrigger
                aria-label="Filter by visibility"
                className="w-full bg-[#161616] border-[#2A2A2A] text-[#F5F0E8] text-xs h-9"
              >
                <SelectValue placeholder="All visibility" />
              </SelectTrigger>
              <SelectContent className="bg-[#141414] border-[#2A2A2A] text-[#F5F0E8]">
                <SelectItem value="all">All visibility</SelectItem>
                <SelectItem value="active">Active only</SelectItem>
                <SelectItem value="inactive">Inactive only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reorder Mode Button */}
          <button
            type="button"
            onClick={onToggleReorderMode}
            aria-label={isReorderMode ? 'Exit reorder mode' : 'Reorder collections'}
            title={isReorderMode ? 'Exit reorder mode' : 'Reorder collections'}
            className={`inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
              isReorderMode
                ? 'bg-[#C9A84C] text-[#0A0A0A] border-[#C9A84C] font-semibold'
                : 'bg-[#161616] text-[#9B958B] hover:text-[#F5F0E8] border-[#2A2A2A] hover:bg-[#1E1E1E]'
            }`}
          >
            <HugeiconsIcon icon={Sorting05Icon} className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isReorderMode ? 'Reordering' : 'Reorder'}
            </span>
          </button>

          {/* View Mode Toggle Group (List vs Board) */}
          <div
            role="radiogroup"
            aria-label="Collection view switcher"
            className="flex items-center h-9 p-0.5 bg-[#161616] border border-[#2A2A2A] rounded-md"
          >
            <button
              type="button"
              role="radio"
              aria-checked={viewMode === 'list'}
              aria-label="List view"
              title="List view"
              disabled={isReorderMode}
              onClick={() => onViewModeChange('list')}
              className={`h-full px-2.5 rounded flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                viewMode === 'list'
                  ? 'bg-[#222222] text-[#E8B84B] shadow-sm'
                  : 'text-[#7A746B] hover:text-[#F5F0E8]'
              }`}
            >
              <HugeiconsIcon icon={Menu01Icon} className="w-4 h-4" />
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={viewMode === 'board'}
              aria-label="Collection board view"
              title="Collection board view"
              disabled={isReorderMode}
              onClick={() => onViewModeChange('board')}
              className={`h-full px-2.5 rounded flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                viewMode === 'board'
                  ? 'bg-[#222222] text-[#E8B84B] shadow-sm'
                  : 'text-[#7A746B] hover:text-[#F5F0E8]'
              }`}
            >
              <HugeiconsIcon icon={LayoutGridIcon} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips & Summary */}
      {hasActiveFilters && !isReorderMode && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[#7A746B]">Active filters:</span>

          {searchQuery.trim() && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F0E8]">
              <span>Search: &ldquo;{searchQuery}&rdquo;</span>
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="text-[#8A847A] hover:text-[#F5F0E8]"
                aria-label="Remove search filter"
              >
                ✕
              </button>
            </span>
          )}

          {selectedVisibility !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F0E8]">
              <span>Visibility: {selectedVisibility === 'active' ? 'Active' : 'Inactive'}</span>
              <button
                type="button"
                onClick={() => onVisibilityChange('all')}
                className="text-[#8A847A] hover:text-[#F5F0E8]"
                aria-label="Remove visibility filter"
              >
                ✕
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onResetFilters}
            className="text-[#C9A84C] hover:text-[#E8B84B] underline ml-1 cursor-pointer font-medium"
          >
            Reset all
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminCollectionsToolbar
