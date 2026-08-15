import React from 'react'
import { STOCK_STATUS_LABELS, type StockStatus } from '@/lib/constants'
import { formatCurrency } from '@/utils/formatCurrency'
import type { CollectionRow, ProductFilters, TagRow } from '@/types/app'

export interface ActiveProductFiltersProps {
  filters: ProductFilters
  collections?: CollectionRow[]
  tags?: TagRow[]
  onRemoveCollection: () => void
  onRemoveTag: (tagSlug: string) => void
  onRemovePrice: () => void
  onRemoveAvailability: () => void
  onRemoveSearch: () => void
  onClearAll: () => void
  className?: string
}

export const ActiveProductFilters: React.FC<ActiveProductFiltersProps> = ({
  filters,
  collections = [],
  tags = [],
  onRemoveCollection,
  onRemoveTag,
  onRemovePrice,
  onRemoveAvailability,
  onRemoveSearch,
  onClearAll,
  className = '',
}) => {
  const activeChips: { id: string; label: string; onRemove: () => void; accessibleName: string }[] = []

  // Collection chip
  if (filters.collection) {
    const col = collections.find((c) => c.slug === filters.collection)
    const colName = col ? col.name : filters.collection
    activeChips.push({
      id: `col-${filters.collection}`,
      label: `Room: ${colName}`,
      onRemove: onRemoveCollection,
      accessibleName: `Remove ${colName} filter`,
    })
  }

  // Tags chips
  if (filters.tags && filters.tags.length > 0) {
    filters.tags.forEach((tagSlug) => {
      const tagObj = tags.find((t) => t.slug === tagSlug)
      const tagName = tagObj ? tagObj.name : tagSlug
      activeChips.push({
        id: `tag-${tagSlug}`,
        label: tagName,
        onRemove: () => onRemoveTag(tagSlug),
        accessibleName: `Remove ${tagName} filter`,
      })
    })
  }

  // Price range chip
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    let priceLabel = ''
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      priceLabel = `${formatCurrency(filters.minPrice)} – ${formatCurrency(filters.maxPrice)}`
    } else if (filters.minPrice !== undefined) {
      priceLabel = `Above ${formatCurrency(filters.minPrice)}`
    } else if (filters.maxPrice !== undefined) {
      priceLabel = `Up to ${formatCurrency(filters.maxPrice)}`
    }

    activeChips.push({
      id: 'price-range',
      label: priceLabel,
      onRemove: onRemovePrice,
      accessibleName: 'Remove price range filter',
    })
  }

  // Availability chip
  if (filters.availability) {
    const availLabel = STOCK_STATUS_LABELS[filters.availability as StockStatus] || filters.availability
    activeChips.push({
      id: `avail-${filters.availability}`,
      label: availLabel,
      onRemove: onRemoveAvailability,
      accessibleName: `Remove ${availLabel} filter`,
    })
  }

  // Search query chip
  if (filters.q) {
    activeChips.push({
      id: `search-${filters.q}`,
      label: `"${filters.q}"`,
      onRemove: onRemoveSearch,
      accessibleName: `Remove search query "${filters.q}"`,
    })
  }

  if (activeChips.length === 0) return null

  return (
    <div className={`flex flex-wrap items-center gap-2 py-2 ${className}`}>
      <span className="text-[11px] font-mono text-[#7A746B] uppercase tracking-wider mr-1">
        Active Filters:
      </span>

      {activeChips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1816] border border-[#2A2A2A] text-xs font-mono text-[#E8B84B] shadow-sm"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={chip.accessibleName}
            className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[#9B958B] hover:text-[#F5F0E8] hover:bg-[#2A2A2A] transition-colors cursor-pointer"
          >
            ×
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="text-xs text-[#C9A84C] hover:underline font-mono ml-2 cursor-pointer transition-colors"
      >
        Clear all
      </button>
    </div>
  )
}

export default ActiveProductFilters
