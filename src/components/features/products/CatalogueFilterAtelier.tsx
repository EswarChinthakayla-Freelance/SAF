import React from 'react'
import { STOCK_STATUS_LABELS, type StockStatus } from '@/lib/constants'
import type { CollectionRow, ProductFilters as ProductFilterType, TagRow } from '@/types/app'

export interface CatalogueFilterAtelierProps {
  filters: ProductFilterType
  onChange: (newFilters: Partial<ProductFilterType>) => void
  onReset: () => void
  collections: CollectionRow[]
  tags?: TagRow[]
  className?: string
}

/**
 * CatalogueFilterAtelier
 * Architectural open-air filter workspace for "The Furniture Index" desktop browsing.
 * Features an indexed collection directory, tagged material filters, numeric price bounds,
 * and stock availability controls.
 */
export const CatalogueFilterAtelier: React.FC<CatalogueFilterAtelierProps> = ({
  filters,
  onChange,
  onReset,
  collections,
  tags = [],
  className = '',
}) => {
  const hasActiveFilters = Boolean(
    filters.collection ||
    (filters.tags && filters.tags.length > 0) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.availability
  )

  const handleToggleTag = (tagSlug: string) => {
    const currentTags = filters.tags || []
    const updatedTags = currentTags.includes(tagSlug)
      ? currentTags.filter((t) => t !== tagSlug)
      : [...currentTags, tagSlug]

    onChange({ tags: updatedTags.length > 0 ? updatedTags : undefined })
  }

  return (
    <aside
      aria-label="Catalogue Filter Atelier"
      className={`w-full lg:w-72 xl:w-80 shrink-0 space-y-8 select-none ${className}`}
    >
      {/* 1. Atelier Header */}
      <div className="flex items-center justify-between border-b border-[#222222] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
            FILTER ATELIER
          </span>
          <span className="text-[#3A3A3A] font-mono text-xs">//</span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#7A746B]">
            INDEX
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-[10px] font-mono uppercase tracking-wider text-[#C9A84C] hover:text-[#E8B84B] cursor-pointer"
          >
            Reset All
          </button>
        )}
      </div>

      {/* 2. Collection Indexed Directory */}
      <div className="space-y-3">
        <div className="text-[11px] uppercase font-mono tracking-[0.18em] text-[#8A847A] font-semibold">
          Collections
        </div>
        <div role="radiogroup" aria-label="Filter by collection" className="space-y-1">
          {/* All Furniture */}
          <button
            type="button"
            role="radio"
            aria-checked={!filters.collection}
            onClick={() => onChange({ collection: undefined })}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono transition-all cursor-pointer rounded-none text-left ${
              !filters.collection
                ? 'bg-[#181818] text-[#F5F0E8] border-l-2 border-[#C9A84C] pl-3.5 font-semibold'
                : 'text-[#8A847A] hover:text-[#F5F0E8] hover:bg-[#121212] border-l-2 border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#555047]">00</span>
              <span>All Furniture</span>
            </div>
            {!filters.collection && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" aria-hidden="true" />
            )}
          </button>

          {/* Individual Collections */}
          {collections.map((col, idx) => {
            const isSelected = filters.collection === col.slug
            const indexStr = String(idx + 1).padStart(2, '0')

            return (
              <button
                key={col.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onChange({ collection: col.slug })}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono transition-all cursor-pointer rounded-none text-left ${
                  isSelected
                    ? 'bg-[#181818] text-[#F5F0E8] border-l-2 border-[#C9A84C] pl-3.5 font-semibold'
                    : 'text-[#8A847A] hover:text-[#F5F0E8] hover:bg-[#121212] border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="text-[10px] text-[#555047]">{indexStr}</span>
                  <span className="truncate">{col.name}</span>
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shrink-0" aria-hidden="true" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Materials & Tags Filter */}
      {tags.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-[#1C1C1C]">
          <div className="text-[11px] uppercase font-mono tracking-[0.18em] text-[#8A847A] font-semibold">
            Materials & Woodcraft
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const isSelected = (filters.tags || []).includes(tag.slug)
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleToggleTag(tag.slug)}
                  aria-pressed={isSelected}
                  className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer rounded-none ${
                    isSelected
                      ? 'bg-[#C9A84C] text-[#0A0A0A] font-semibold'
                      : 'bg-[#121212] text-[#8A847A] border border-[#242424] hover:border-[#3A3A3A] hover:text-[#F5F0E8]'
                  }`}
                >
                  {tag.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 4. Price Range Filter */}
      <div className="space-y-3 pt-2 border-t border-[#1C1C1C]">
        <div className="text-[11px] uppercase font-mono tracking-[0.18em] text-[#8A847A] font-semibold">
          Price Range (₹ INR)
        </div>
        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
          <div>
            <label htmlFor="atelier-min-price" className="text-[9px] uppercase tracking-widest text-[#555047] block mb-1">
              MIN
            </label>
            <input
              id="atelier-min-price"
              type="number"
              min="0"
              step="1000"
              placeholder="0"
              value={filters.minPrice ?? ''}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined
                onChange({ minPrice: val })
              }}
              className="w-full bg-[#121212] border border-[#242424] focus:border-[#C9A84C] px-2.5 py-1.5 text-xs text-[#F5F0E8] outline-none"
            />
          </div>

          <div>
            <label htmlFor="atelier-max-price" className="text-[9px] uppercase tracking-widest text-[#555047] block mb-1">
              MAX
            </label>
            <input
              id="atelier-max-price"
              type="number"
              min="0"
              step="1000"
              placeholder="Max"
              value={filters.maxPrice ?? ''}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined
                onChange({ maxPrice: val })
              }}
              className="w-full bg-[#121212] border border-[#242424] focus:border-[#C9A84C] px-2.5 py-1.5 text-xs text-[#F5F0E8] outline-none"
            />
          </div>
        </div>
      </div>

      {/* 5. Stock Status / Availability */}
      <div className="space-y-3 pt-2 border-t border-[#1C1C1C]">
        <div className="text-[11px] uppercase font-mono tracking-[0.18em] text-[#8A847A] font-semibold">
          Availability
        </div>
        <div className="space-y-1">
          {Object.entries(STOCK_STATUS_LABELS).map(([statusKey, label]) => {
            const isSelected = filters.availability === statusKey
            return (
              <button
                key={statusKey}
                type="button"
                onClick={() =>
                  onChange({
                    availability: isSelected ? undefined : (statusKey as StockStatus),
                  })
                }
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-mono transition-all cursor-pointer rounded-none text-left ${
                  isSelected
                    ? 'bg-[#181818] text-[#E8B84B] font-semibold'
                    : 'text-[#8A847A] hover:text-[#F5F0E8] hover:bg-[#121212]'
                }`}
              >
                <span>{label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" aria-hidden="true" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

export default CatalogueFilterAtelier
