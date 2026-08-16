import React, { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { CatalogueFilterAtelier } from './CatalogueFilterAtelier'
import { STOCK_STATUS_LABELS, type StockStatus } from '@/lib/constants'
import type { CollectionRow, ProductFilters as ProductFilterType, TagRow } from '@/types/app'

export interface ProductFiltersProps {
  filters: ProductFilterType
  onChange: (newFilters: Partial<ProductFilterType>) => void
  onReset: () => void
  collections: CollectionRow[]
  tags?: TagRow[]
  isDesktopOpen?: boolean
  isMobileOpen?: boolean
  onMobileOpenChange?: (open: boolean) => void
  className?: string
}

/**
 * ProductFilters
 * Coordinates the Desktop Filter Atelier workspace and the Mobile Staged Filter Sheet.
 */
export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onChange,
  onReset,
  collections,
  tags = [],
  isDesktopOpen = false,
  isMobileOpen = false,
  onMobileOpenChange,
  className = '',
}) => {
  // Local staged draft state for mobile sheet
  const [draftFilters, setDraftFilters] = useState<ProductFilterType>(filters)

  // Synchronize draft filters with active filters when sheet opens
  useEffect(() => {
    if (isMobileOpen) {
      setDraftFilters(filters)
    }
  }, [filters, isMobileOpen])

  const handleToggleDraftTag = (tagSlug: string) => {
    const currentTags = draftFilters.tags || []
    const updatedTags = currentTags.includes(tagSlug)
      ? currentTags.filter((t) => t !== tagSlug)
      : [...currentTags, tagSlug]

    setDraftFilters({ ...draftFilters, tags: updatedTags.length > 0 ? updatedTags : undefined })
  }

  const handleApplyMobile = () => {
    onChange(draftFilters)
    onMobileOpenChange?.(false)
  }

  const handleResetMobile = () => {
    setDraftFilters({})
    onReset()
    onMobileOpenChange?.(false)
  }

  return (
    <>
      {/* 1. Desktop Filter Atelier (Mounted conditionally when open) */}
      {isDesktopOpen && (
        <div className={`hidden lg:block ${className}`}>
          <CatalogueFilterAtelier
            filters={filters}
            onChange={onChange}
            onReset={onReset}
            collections={collections}
            tags={tags}
          />
        </div>
      )}

      {/* 2. Mobile / Tablet Staged Filter Sheet */}
      <Sheet open={isMobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md bg-[#0C0C0C] border-l border-[#222222] text-[#F5F0E8] p-6 flex flex-col justify-between overflow-y-auto"
        >
          <div className="space-y-6 overflow-y-auto pr-1">
            <SheetHeader className="text-left border-b border-[#222222] pb-4">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
                OUR COLLECTION
              </span>
              <SheetTitle className="font-serif text-2xl text-[#F5F0E8] font-bold">
                Filter Catalogue
              </SheetTitle>
              <SheetDescription className="text-xs text-[#8A847A] font-sans font-light">
                Narrow down handcrafted furniture by collection, materials, price, and availability.
              </SheetDescription>
            </SheetHeader>

            {/* A. Collections */}
            <div className="space-y-3">
              <div className="text-[11px] uppercase font-mono tracking-widest text-[#8A847A] font-semibold">
                Collections
              </div>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setDraftFilters({ ...draftFilters, collection: undefined })}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono transition-all rounded-none text-left cursor-pointer ${
                    !draftFilters.collection
                      ? 'bg-[#181818] text-[#E8B84B] border-l-2 border-[#C9A84C] font-semibold'
                      : 'text-[#8A847A] hover:bg-[#141414] hover:text-[#F5F0E8]'
                  }`}
                >
                  <span>All Furniture</span>
                  {!draftFilters.collection && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                  )}
                </button>

                {collections.map((col) => {
                  const isSelected = draftFilters.collection === col.slug
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setDraftFilters({ ...draftFilters, collection: col.slug })}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono transition-all rounded-none text-left cursor-pointer ${
                        isSelected
                          ? 'bg-[#181818] text-[#E8B84B] border-l-2 border-[#C9A84C] font-semibold'
                          : 'text-[#8A847A] hover:bg-[#141414] hover:text-[#F5F0E8]'
                      }`}
                    >
                      <span className="truncate pr-2">{col.name}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* B. Materials & Tags */}
            {tags.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-[#1F1F1F]">
                <div className="text-[11px] uppercase font-mono tracking-widest text-[#8A847A] font-semibold">
                  Materials & Tags
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => {
                    const isSelected = (draftFilters.tags || []).includes(tag.slug)
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleToggleDraftTag(tag.slug)}
                        className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all rounded-none cursor-pointer ${
                          isSelected
                            ? 'bg-[#C9A84C] text-[#0A0A0A] font-semibold'
                            : 'bg-[#141414] text-[#8A847A] border border-[#262626] hover:text-[#F5F0E8]'
                        }`}
                      >
                        {tag.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* C. Price Range */}
            <div className="space-y-3 pt-3 border-t border-[#1F1F1F]">
              <div className="text-[11px] uppercase font-mono tracking-widest text-[#8A847A] font-semibold">
                Price Range (₹ INR)
              </div>
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div>
                  <label htmlFor="mobile-min-price" className="text-[9px] uppercase tracking-widest text-[#555047] block mb-1">
                    MIN
                  </label>
                  <input
                    id="mobile-min-price"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="0"
                    value={draftFilters.minPrice ?? ''}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : undefined
                      setDraftFilters({ ...draftFilters, minPrice: val })
                    }}
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#C9A84C] px-3 py-2 text-xs text-[#F5F0E8] outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="mobile-max-price" className="text-[9px] uppercase tracking-widest text-[#555047] block mb-1">
                    MAX
                  </label>
                  <input
                    id="mobile-max-price"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="Max"
                    value={draftFilters.maxPrice ?? ''}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : undefined
                      setDraftFilters({ ...draftFilters, maxPrice: val })
                    }}
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#C9A84C] px-3 py-2 text-xs text-[#F5F0E8] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* D. Availability */}
            <div className="space-y-3 pt-3 border-t border-[#1F1F1F]">
              <div className="text-[11px] uppercase font-mono tracking-widest text-[#8A847A] font-semibold">
                Availability
              </div>
              <div className="space-y-1">
                {Object.entries(STOCK_STATUS_LABELS).map(([statusKey, label]) => {
                  const isSelected = draftFilters.availability === statusKey
                  return (
                    <button
                      key={statusKey}
                      type="button"
                      onClick={() =>
                        setDraftFilters({
                          ...draftFilters,
                          availability: isSelected ? undefined : (statusKey as StockStatus),
                        })
                      }
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-mono transition-all rounded-none text-left cursor-pointer ${
                        isSelected
                          ? 'bg-[#181818] text-[#E8B84B] font-semibold'
                          : 'text-[#8A847A] hover:bg-[#141414] hover:text-[#F5F0E8]'
                      }`}
                    >
                      <span>{label}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sheet Actions Footer */}
          <SheetFooter className="flex-col sm:flex-row gap-3 pt-4 border-t border-[#222222] mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetMobile}
              className="w-full sm:w-1/2 rounded-none font-mono text-xs uppercase tracking-wider h-11 bg-[#141414] border-[#2A2A2A] text-[#9B958B] hover:text-[#F5F0E8] cursor-pointer"
            >
              Reset All
            </Button>
            <Button
              type="button"
              onClick={handleApplyMobile}
              className="w-full sm:w-1/2 rounded-none font-mono text-xs uppercase tracking-wider h-11 bg-[#C9A84C] hover:bg-[#E8B84B] text-[#0A0A0A] font-semibold cursor-pointer"
            >
              View Results
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default ProductFilters
