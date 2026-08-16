import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { STOCK_STATUS_LABELS, type StockStatus } from '@/lib/constants'
import { formatCurrency } from '@/utils/formatCurrency'
import type { CollectionRow, ProductFilters, TagRow } from '@/types/app'

export interface ActiveFilterRailProps {
  filters: ProductFilters
  collections?: CollectionRow[]
  tags?: TagRow[]
  onRemoveCollection?: () => void
  onRemoveTag?: (tagSlug: string) => void
  onRemovePrice?: () => void
  onRemoveAvailability?: () => void
  onRemoveSearch?: () => void
  onClearAll: () => void
  className?: string
}

export const ActiveFilterRail: React.FC<ActiveFilterRailProps> = ({
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
  const collectionName = filters.collection
    ? collections.find((c) => c.slug === filters.collection)?.name || filters.collection
    : null

  const hasPriceFilter = filters.minPrice !== undefined || filters.maxPrice !== undefined
  const priceLabel = hasPriceFilter
    ? filters.minPrice !== undefined && filters.maxPrice !== undefined
      ? `${formatCurrency(filters.minPrice)} – ${formatCurrency(filters.maxPrice)}`
      : filters.minPrice !== undefined
      ? `From ${formatCurrency(filters.minPrice)}`
      : `Up to ${formatCurrency(filters.maxPrice!)}`
    : null

  const availabilityLabel = filters.availability
    ? STOCK_STATUS_LABELS[filters.availability as StockStatus] || filters.availability
    : null

  const hasAnyActiveFilter = Boolean(
    collectionName ||
    (filters.tags && filters.tags.length > 0) ||
    hasPriceFilter ||
    availabilityLabel ||
    filters.q
  )

  if (!hasAnyActiveFilter) return null

  return (
    <div
      aria-label="Active catalogue filter indicators"
      className={`flex flex-wrap items-center gap-2 pt-1 pb-2 ${className}`}
    >
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A746B] mr-1">
        ACTIVE:
      </span>

      {/* Collection Chip */}
      {collectionName && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#141414] border border-[#2A2A2A] text-[#F5F0E8] text-xs font-mono">
          <span className="text-[10px] text-[#7A746B] uppercase">Collection:</span>
          <span>{collectionName}</span>
          <button
            type="button"
            onClick={onRemoveCollection}
            aria-label={`Remove ${collectionName} filter`}
            className="text-[#7A746B] hover:text-[#F5F0E8] p-0.5 ml-0.5 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Tag Chips */}
      {filters.tags &&
        filters.tags.map((tagSlug) => {
          const tagName = tags.find((t) => t.slug === tagSlug)?.name || tagSlug
          return (
            <span
              key={tagSlug}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#141414] border border-[#2A2A2A] text-[#F5F0E8] text-xs font-mono"
            >
              <span>{tagName}</span>
              <button
                type="button"
                onClick={() => onRemoveTag?.(tagSlug)}
                aria-label={`Remove ${tagName} tag filter`}
                className="text-[#7A746B] hover:text-[#F5F0E8] p-0.5 ml-0.5 cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="w-3 h-3" />
              </button>
            </span>
          )
        })}

      {/* Price Range Chip */}
      {priceLabel && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#141414] border border-[#2A2A2A] text-[#F5F0E8] text-xs font-mono">
          <span className="text-[10px] text-[#7A746B] uppercase">Price:</span>
          <span>{priceLabel}</span>
          <button
            type="button"
            onClick={onRemovePrice}
            aria-label="Remove price filter"
            className="text-[#7A746B] hover:text-[#F5F0E8] p-0.5 ml-0.5 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Availability Chip */}
      {availabilityLabel && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#141414] border border-[#2A2A2A] text-[#F5F0E8] text-xs font-mono">
          <span>{availabilityLabel}</span>
          <button
            type="button"
            onClick={onRemoveAvailability}
            aria-label={`Remove ${availabilityLabel} filter`}
            className="text-[#7A746B] hover:text-[#F5F0E8] p-0.5 ml-0.5 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Search Query Chip */}
      {filters.q && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#141414] border border-[#2A2A2A] text-[#F5F0E8] text-xs font-mono">
          <span className="text-[10px] text-[#7A746B] uppercase">Search:</span>
          <span className="italic">"{filters.q}"</span>
          <button
            type="button"
            onClick={onRemoveSearch}
            aria-label="Remove search query"
            className="text-[#7A746B] hover:text-[#F5F0E8] p-0.5 ml-0.5 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Clear All Button */}
      <button
        type="button"
        onClick={onClearAll}
        className="text-[10px] font-mono uppercase tracking-widest text-[#C9A84C] hover:text-[#E8B84B] px-2 py-1 underline underline-offset-4 cursor-pointer"
      >
        Clear All
      </button>
    </div>
  )
}

export default ActiveFilterRail
