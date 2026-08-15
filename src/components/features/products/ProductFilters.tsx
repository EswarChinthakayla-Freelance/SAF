import React, { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { GoldButton } from '@/components/brand/GoldButton'
import { STOCK_STATUS_LABELS, type StockStatus } from '@/lib/constants'
import type { CollectionRow, ProductFilters as ProductFilterType, TagRow } from '@/types/app'

export interface ProductFiltersProps {
  filters: ProductFilterType
  onChange: (newFilters: Partial<ProductFilterType>) => void
  onReset: () => void
  collections: CollectionRow[]
  tags?: TagRow[]
  isMobileOpen?: boolean
  onMobileOpenChange?: (open: boolean) => void
  className?: string
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onChange,
  onReset,
  collections,
  tags = [],
  isMobileOpen = false,
  onMobileOpenChange,
  className = '',
}) => {
  // Local draft state for mobile sheet
  const [draftFilters, setDraftFilters] = useState<ProductFilterType>(filters)

  // Sync draft filters whenever URL filters or mobile open status changes
  useEffect(() => {
    setDraftFilters(filters)
  }, [filters, isMobileOpen])

  // Active filter checks
  const hasActiveFilters = Boolean(
    filters.collection ||
    (filters.tags && filters.tags.length > 0) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.availability ||
    filters.q
  )

  const handleToggleTag = (tagSlug: string, isDraft = false) => {
    const currentTags = (isDraft ? draftFilters.tags : filters.tags) || []
    const updatedTags = currentTags.includes(tagSlug)
      ? currentTags.filter((t) => t !== tagSlug)
      : [...currentTags, tagSlug]

    if (isDraft) {
      setDraftFilters({ ...draftFilters, tags: updatedTags.length > 0 ? updatedTags : undefined })
    } else {
      onChange({ tags: updatedTags.length > 0 ? updatedTags : undefined })
    }
  }

  const handleApplyDraft = () => {
    onChange(draftFilters)
    onMobileOpenChange?.(false)
  }

  const handleResetDraft = () => {
    setDraftFilters({})
    onReset()
    onMobileOpenChange?.(false)
  }

  // Shared Filter Group UI (used in both desktop sidebar & mobile sheet)
  const renderFilterContent = (isDraft = false) => {
    const current = isDraft ? draftFilters : filters

    return (
      <div className="space-y-7 text-xs text-[#F5F0E8]">
        {/* 1. Collection Filter */}
        <div className="space-y-3">
          <label className="block text-[11px] uppercase font-mono text-[#9B958B] tracking-[0.16em] font-semibold">
            Collections
          </label>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                if (isDraft) {
                  setDraftFilters({ ...draftFilters, collection: undefined })
                } else {
                  onChange({ collection: undefined })
                }
              }}
              className={`w-full text-left px-3 py-2 rounded-none transition-all text-xs cursor-pointer ${!current.collection
                ? 'bg-[#C9A84C]/15 text-[#E8B84B] font-medium border border-[#C9A84C]/30'
                : 'text-[#9B958B] hover:text-[#F5F0E8] hover:bg-[#1A1816]'
                }`}
            >
              All Spaces & Rooms
            </button>
            {collections.map((col) => {
              const isSelected = current.collection === col.slug
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => {
                    if (isDraft) {
                      setDraftFilters({ ...draftFilters, collection: col.slug })
                    } else {
                      onChange({ collection: col.slug })
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-none transition-all text-xs cursor-pointer ${isSelected
                    ? 'bg-[#C9A84C]/15 text-[#E8B84B] font-medium border border-[#C9A84C]/30'
                    : 'text-[#9B958B] hover:text-[#F5F0E8] hover:bg-[#1A1816]'
                    }`}
                >
                  {col.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* 2. Tags / Hardwood & Style Filter */}
        {tags.length > 0 && (
          <div className="space-y-3 pt-5 border-t border-[#2A2A2A]">
            <label className="block text-[11px] uppercase font-mono text-[#9B958B] tracking-[0.16em] font-semibold">
              Materials & Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => {
                const isSelected = (current.tags || []).includes(tag.slug)
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleToggleTag(tag.slug, isDraft)}
                    className={`px-3 py-1.5 rounded-none text-xs font-mono transition-all cursor-pointer ${isSelected
                      ? 'bg-[#C9A84C]/20 border border-[#C9A84C] text-[#E8B84B] font-medium'
                      : 'bg-[#111111] border border-[#2A2A2A] text-[#9B958B] hover:text-[#F5F0E8] hover:border-[#3A3A3A]'
                      }`}
                  >
                    {isSelected ? '✓ ' : ''}
                    {tag.name}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* 3. Price Range (INR) */}
        <div className="space-y-3 pt-5 border-t border-[#2A2A2A]">
          <label className="block text-[11px] uppercase font-mono text-[#9B958B] tracking-[0.16em] font-semibold">
            Price Range (₹ INR)
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor={isDraft ? 'draft-min-price' : 'min-price'} className="sr-only">
                Minimum Price
              </label>
              <input
                id={isDraft ? 'draft-min-price' : 'min-price'}
                type="number"
                min="0"
                step="1000"
                placeholder="Min ₹"
                value={current.minPrice ?? ''}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : undefined
                  if (isDraft) {
                    setDraftFilters({ ...draftFilters, minPrice: val })
                  } else {
                    onChange({ minPrice: val })
                  }
                }}
                className="w-full bg-[#111111] border border-[#2A2A2A] rounded-none px-3 py-2 text-xs text-[#F5F0E8] font-mono placeholder:text-[#555047] focus:border-[#C9A84C] outline-none"
              />
            </div>
            <div>
              <label htmlFor={isDraft ? 'draft-max-price' : 'max-price'} className="sr-only">
                Maximum Price
              </label>
              <input
                id={isDraft ? 'draft-max-price' : 'max-price'}
                type="number"
                min="0"
                step="1000"
                placeholder="Max ₹"
                value={current.maxPrice ?? ''}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : undefined
                  if (isDraft) {
                    setDraftFilters({ ...draftFilters, maxPrice: val })
                  } else {
                    onChange({ maxPrice: val })
                  }
                }}
                className="w-full bg-[#111111] border border-[#2A2A2A] rounded-none px-3 py-2 text-xs text-[#F5F0E8] font-mono placeholder:text-[#555047] focus:border-[#C9A84C] outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4. Availability Status */}
        <div className="space-y-3 pt-5 border-t border-[#2A2A2A]">
          <label className="block text-[11px] uppercase font-mono text-[#9B958B] tracking-[0.16em] font-semibold">
            Availability
          </label>
          <div className="space-y-1.5">
            {(['in_stock', 'made_to_order', 'out_of_stock'] as StockStatus[]).map((status) => {
              const isSelected = current.availability === status
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    const newStatus = isSelected ? undefined : status
                    if (isDraft) {
                      setDraftFilters({ ...draftFilters, availability: newStatus })
                    } else {
                      onChange({ availability: newStatus })
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-none transition-all text-xs cursor-pointer flex items-center justify-between ${isSelected
                    ? 'bg-[#C9A84C]/15 text-[#E8B84B] font-medium border border-[#C9A84C]/30'
                    : 'text-[#9B958B] hover:text-[#F5F0E8] hover:bg-[#1A1816]'
                    }`}
                >
                  <span>{STOCK_STATUS_LABELS[status]}</span>
                  {isSelected && <span className="text-[#C9A84C] font-bold">✓</span>}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Sticky Filter Rail (≥ 1024px) */}
      <aside
        className={`hidden lg:block w-64 xl:w-72 shrink-0 self-start sticky top-28 bg-[#0D0C0B] border border-[#2A2A2A] rounded-none p-6 shadow-md max-h-[calc(100vh-140px)] overflow-y-auto ${className}`}
      >
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#2A2A2A]">
          <h2 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#F5F0E8]">
            Filter Catalogue
          </h2>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="text-[11px] text-[#C9A84C] hover:underline font-mono cursor-pointer transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {renderFilterContent(false)}
      </aside>

      {/* Mobile / Tablet Filter Sheet */}
      {onMobileOpenChange && (
        <Sheet open={isMobileOpen} onOpenChange={onMobileOpenChange}>
          <SheetContent
            side="left"
            className="w-full sm:max-w-md bg-[#0A0A0A] border-r border-[#2A2A2A] text-[#F5F0E8] p-6 flex flex-col justify-between overflow-y-auto"
          >
            <div>
              <SheetHeader className="pb-4 border-b border-[#2A2A2A]">
                <SheetTitle className="font-serif text-xl text-[#F5F0E8]">
                  Filter Catalogue
                </SheetTitle>
                <SheetDescription className="text-xs text-[#9B958B]">
                  Refine furniture pieces by room, materials, price, and availability.
                </SheetDescription>
              </SheetHeader>

              <div className="py-6">{renderFilterContent(true)}</div>
            </div>

            <SheetFooter className="pt-4 border-t border-[#2A2A2A] flex flex-row gap-3 sm:justify-end">
              <GoldButton
                variant="outline"
                size="default"
                onClick={handleResetDraft}
                className="w-1/2 sm:w-auto"
              >
                Reset
              </GoldButton>
              <GoldButton
                size="default"
                onClick={handleApplyDraft}
                className="w-1/2 sm:w-auto"
              >
                View Results
              </GoldButton>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}

export default ProductFilters
