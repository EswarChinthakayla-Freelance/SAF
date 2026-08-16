import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AdminProductsFilterSheet } from './AdminProductsFilterSheet'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Search01Icon,
  Cancel01Icon,
  FilterIcon,
  GridViewIcon,
  Menu01Icon,
} from '@hugeicons/core-free-icons'
import type { CollectionRow } from '@/types/app'

export type ViewMode = 'list' | 'grid'

export interface AdminProductsToolbarProps {
  searchQuery: string
  onSearchChange: (val: string) => void
  selectedCollectionId: string
  onCollectionChange: (val: string) => void
  selectedStatus: 'all' | 'published' | 'draft'
  onStatusChange: (val: 'all' | 'published' | 'draft') => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  collections?: CollectionRow[]
  onResetFilters: () => void
}

export const AdminProductsToolbar: React.FC<AdminProductsToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCollectionId,
  onCollectionChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  collections = [],
  onResetFilters,
}) => {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)

  // Compute active filters count (only collection and status, excluding search)
  const activeFiltersCount = (selectedCollectionId ? 1 : 0) + (selectedStatus !== 'all' ? 1 : 0)
  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedCollectionId || selectedStatus !== 'all'
  )

  const selectedCollectionName =
    collections.find((c) => c.id === selectedCollectionId)?.name || ''

  return (
    <div className="space-y-3">
      {/* Main Command Bar Container */}
      <div className="bg-[#111111] border border-[#242424] rounded-none p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
        {/* Left: Search Input */}
        <div className="relative flex-1 min-w-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A746B]">
            <HugeiconsIcon icon={Search01Icon} className="w-4 h-4" />
          </div>
          <input
            id="admin-products-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by product name or code…"
            aria-label="Search products"
            className="w-full bg-[#161616] border border-[#2A2A2A] hover:border-[#383838] focus:border-[#C9A84C] text-[#F5F0E8] placeholder:text-[#666158] text-xs sm:text-sm pl-9 pr-9 py-2 rounded-none outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7A746B] hover:text-[#F5F0E8] cursor-pointer"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right: Filters & View Switcher */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 shrink-0">
          {/* Desktop Collection Filter */}
          <div className="hidden lg:block min-w-[160px]">
            <Select
              items={{
                all: 'All Collections',
                ...collections.reduce((acc, col) => {
                  acc[col.id] = col.name
                  return acc
                }, {} as Record<string, string>),
              }}
              value={selectedCollectionId || 'all'}
              onValueChange={(val) => onCollectionChange(val === 'all' || !val ? '' : val)}
            >
              <SelectTrigger
                aria-label="Filter by collection"
                className="bg-[#161616] border-[#2A2A2A] text-[#F5F0E8] rounded-none font-sans text-xs h-9 px-3"
              >
                <SelectValue placeholder="All Collections" />
              </SelectTrigger>
              <SelectContent className="bg-[#141414] border-[#2A2A2A] text-[#F5F0E8] rounded-none shadow-xl z-50">
                <SelectGroup>
                  <SelectItem value="all">All Collections</SelectItem>
                  {collections.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Status Filter */}
          <div className="hidden lg:block min-w-[130px]">
            <Select
              items={{
                all: 'All Statuses',
                published: 'Published',
                draft: 'Draft',
              }}
              value={selectedStatus}
              onValueChange={(val) =>
                onStatusChange((val || 'all') as 'all' | 'published' | 'draft')
              }
            >
              <SelectTrigger
                aria-label="Filter by publication status"
                className="bg-[#161616] border-[#2A2A2A] text-[#F5F0E8] rounded-none font-sans text-xs h-9 px-3"
              >
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-[#141414] border-[#2A2A2A] text-[#F5F0E8] rounded-none shadow-xl z-50">
                <SelectGroup>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile/Tablet Filter Sheet Trigger Button */}
          <button
            type="button"
            onClick={() => setIsFilterSheetOpen(true)}
            className={`lg:hidden inline-flex items-center gap-1.5 px-3 py-2 text-xs font-sans font-medium rounded-none border transition-colors cursor-pointer ${activeFiltersCount > 0
              ? 'bg-[#181610] text-[#E8B84B] border-[#C9A84C]/40'
              : 'bg-[#161616] text-[#9B958B] hover:text-[#F5F0E8] border-[#2A2A2A]'
              }`}
          >
            <HugeiconsIcon icon={FilterIcon} className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#C9A84C] text-[#0A0A0A] font-bold text-[10px] flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* View Mode Toggle Group (List vs Grid) */}
          <div
            role="radiogroup"
            aria-label="Catalogue view switcher"
            className="flex items-center p-0.5 bg-[#161616] border border-[#2A2A2A] rounded-none"
          >
            <button
              type="button"
              role="radio"
              aria-checked={viewMode === 'list'}
              aria-label="List view"
              title="List view"
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded transition-all cursor-pointer ${viewMode === 'list'
                ? 'bg-[#222222] text-[#E8B84B] shadow-sm'
                : 'text-[#7A746B] hover:text-[#F5F0E8]'
                }`}
            >
              <HugeiconsIcon icon={Menu01Icon} className="w-4 h-4" />
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={viewMode === 'grid'}
              aria-label="Grid view"
              title="Grid view"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded transition-all cursor-pointer ${viewMode === 'grid'
                ? 'bg-[#222222] text-[#E8B84B] shadow-sm'
                : 'text-[#7A746B] hover:text-[#F5F0E8]'
                }`}
            >
              <HugeiconsIcon icon={GridViewIcon} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips & Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[#7A746B] font-sans text-[11px] uppercase tracking-wider">
            Active filters:
          </span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181818] border border-[#2A2A2A] text-[#F5F0E8]">
              <span>Search: &ldquo;{searchQuery}&rdquo;</span>
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Remove search filter"
                className="text-[#7A746B] hover:text-red-400 cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCollectionId && selectedCollectionName && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181818] border border-[#2A2A2A] text-[#F5F0E8]">
              <span>Collection: {selectedCollectionName}</span>
              <button
                type="button"
                onClick={() => onCollectionChange('')}
                aria-label="Remove collection filter"
                className="text-[#7A746B] hover:text-red-400 cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedStatus !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181818] border border-[#2A2A2A] text-[#F5F0E8]">
              <span>Status: {selectedStatus === 'published' ? 'Published' : 'Draft'}</span>
              <button
                type="button"
                onClick={() => onStatusChange('all')}
                aria-label="Remove status filter"
                className="text-[#7A746B] hover:text-red-400 cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-sans text-[#C9A84C] hover:text-[#E8B84B] underline transition-colors cursor-pointer ml-1"
          >
            Reset all
          </button>
        </div>
      )}

      {/* Mobile Filter Sheet Component */}
      <AdminProductsFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        collections={collections}
        selectedCollectionId={selectedCollectionId}
        selectedStatus={selectedStatus}
        onApplyFilters={({ collectionId, status }) => {
          onCollectionChange(collectionId)
          onStatusChange(status)
        }}
        onResetFilters={onResetFilters}
      />
    </div>
  )
}

export default AdminProductsToolbar
