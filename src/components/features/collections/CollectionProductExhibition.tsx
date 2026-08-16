import React from 'react'
import { Link } from 'react-router-dom'
import { SinglePieceFeature } from './SinglePieceFeature'
import { ProductPlate } from '@/components/features/products/ProductPlate'
import { ProductCardSkeleton } from '@/components/common/ProductCardSkeleton'
import { ProductPagination } from '@/components/features/products/ProductPagination'
import { GoldButton } from '@/components/brand/GoldButton'
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
import { HugeiconsIcon } from '@hugeicons/react'
import { Sorting05Icon } from '@hugeicons/core-free-icons'
import type { CollectionRow, ProductListItem, ProductRow } from '@/types/app'

export interface CollectionProductExhibitionProps {
  collection: CollectionRow
  products: (ProductListItem | ProductRow)[]
  totalCount: number
  totalPages: number
  currentPage: number
  sort?: string
  onSortChange: (sort: SortOption) => void
  onPageChange: (page: number) => void
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  onRetry?: () => void
  className?: string
}

/**
 * CollectionProductExhibition
 * Architectural exhibition area for products in a collection.
 * Intelligently adapts layout between Single-Piece Feature mode, Two-Piece mode,
 * and Multi-Piece Product Plate grid.
 */
export const CollectionProductExhibition: React.FC<CollectionProductExhibitionProps> = ({
  collection,
  products = [],
  totalCount,
  totalPages,
  currentPage,
  sort = 'curated',
  onSortChange,
  onPageChange,
  isLoading = false,
  isError = false,
  error,
  onRetry,
  className = '',
}) => {
  const currentSort = normalizeSortOption(sort)

  // Localized Error State
  if (isError) {
    return (
      <div className="py-16 px-4 max-w-lg mx-auto text-center space-y-4 bg-[#0E0E0E] border border-[#222222] p-8">
        <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-800/40 flex items-center justify-center mx-auto text-red-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-serif font-semibold text-[#F5F0E8]">
          We Couldn't Load the Pieces in This Collection
        </h3>
        <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
          {error?.message || 'A network error occurred while retrieving products. Please try again.'}
        </p>
        {onRetry && (
          <div className="pt-2">
            <GoldButton onClick={onRetry} size="sm">
              Try Again
            </GoldButton>
          </div>
        )}
      </div>
    )
  }

  return (
    <section
      id="collection-pieces"
      aria-label={`${collection.name} Pieces Exhibition`}
      className={`space-y-8 scroll-mt-28 ${className}`}
    >
      {/* 1. Asymmetric Exhibition Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#222222] pb-4 select-none">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold">
              THE PIECES
            </span>
            <span className="text-[#3A3A3A]">//</span>
            <span className="text-[10px] uppercase tracking-widest text-[#7A746B]">
              COLLECTION ARCHIVE
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#F5F0E8] tracking-tight">
            The {collection.name} Collection
          </h2>
        </div>

        {/* Right: Piece Count & Sort Selector */}
        <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-end shrink-0">
          <div className="font-mono text-xs text-[#8A847A] uppercase tracking-wider">
            <span className="font-bold text-[#F5F0E8] text-sm">
              {String(totalCount).padStart(2, '0')}
            </span>{' '}
            <span>{totalCount === 1 ? 'Piece' : 'Pieces'}</span>
          </div>

          {/* Sort Selector (Shown when >= 2 products exist) */}
          {totalCount > 1 && (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase font-mono tracking-widest text-[#7A746B]">
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
                  aria-label="Sort collection products"
                  className="bg-[#111111] border-[#262626] hover:border-[#3A3A3A] text-[#F5F0E8] rounded-none font-mono text-xs focus-visible:border-[#C9A84C] h-9 px-3 min-w-[150px] cursor-pointer"
                >
                  <SelectValue placeholder="Sort Pieces" />
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
          )}
        </div>
      </div>

      {/* 2. Loading Skeleton State */}
      {isLoading && (!products || products.length === 0) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((idx) => (
            <ProductCardSkeleton key={`col-detail-skeleton-${idx}`} />
          ))}
        </div>
      ) : products.length === 0 ? (
        /* 3. Empty State */
        <div className="py-20 text-center max-w-md mx-auto space-y-4 bg-[#0E0E0E] border border-[#1F1F1F] p-8">
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold block">
            ATELIER COMMISSION
          </span>
          <h3 className="font-serif text-2xl text-[#F5F0E8] font-bold">
            No pieces are currently published in this collection.
          </h3>
          <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
            Our craftsmen are handcrafting new solid wood suites for this series. Explore our other collections or browse the full catalogue.
          </p>
          <div className="pt-3 flex items-center justify-center gap-3">
            <Link to="/products">
              <GoldButton size="sm">Browse Full Catalogue</GoldButton>
            </Link>
            <Link to="/collections">
              <GoldButton variant="outline" size="sm">All Collections</GoldButton>
            </Link>
          </div>
        </div>
      ) : products.length === 1 ? (
        /* 4. Adaptive Mode A: Single-Piece Feature Mode (CRITICAL) */
        <SinglePieceFeature
          product={products[0]}
          collectionName={collection.name}
        />
      ) : products.length === 2 ? (
        /* 5. Adaptive Mode B: Two Large Product Plates */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
          {products.map((prod, idx) => (
            <ProductPlate
              key={prod.id}
              product={prod}
              index={idx}
              priority={true}
            />
          ))}
        </div>
      ) : (
        /* 6. Adaptive Mode C: Three+ Product Plate Grid */
        <div className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {products.map((prod, idx) => (
              <ProductPlate
                key={prod.id}
                product={prod}
                index={idx}
                priority={idx < 2}
              />
            ))}
          </div>

          {/* Monograph Pagination */}
          {totalPages > 1 && (
            <ProductPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </div>
      )}
    </section>
  )
}

export default CollectionProductExhibition
