import React from 'react'
import { ProductPlate } from './ProductPlate'
import { ProductCardSkeleton } from '@/components/common/ProductCardSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { GoldButton } from '@/components/brand/GoldButton'
import type { ProductListItem, ProductRow } from '@/types/app'

export interface ProductGridProps {
  products: (ProductListItem | ProductRow)[]
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  onRetry?: () => void
  onClearFilters?: () => void
  isFiltered?: boolean
  isFilterAtelierOpen?: boolean
  className?: string
}

/**
 * ProductGrid
 * Adaptive product field for "The Furniture Index".
 * Adjusts column density dynamically based on Filter Atelier visibility,
 * guaranteeing large, image-dominant product plates.
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  isError = false,
  error,
  onRetry,
  onClearFilters,
  isFiltered = false,
  isFilterAtelierOpen = false,
  className = '',
}) => {
  // Error State with Retry
  if (isError) {
    return (
      <div className="py-16 px-4 max-w-lg mx-auto text-center space-y-4 bg-[#0E0E0E] border border-[#222222] p-8">
        <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-800/40 flex items-center justify-center mx-auto text-red-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-serif font-semibold text-[#F5F0E8]">
          We Couldn't Load the Furniture Catalogue
        </h3>
        <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
          {error?.message || 'A network error occurred while retrieving catalogue pieces. Please try again.'}
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

  const gridColsClass = isFilterAtelierOpen
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 sm:gap-10'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10'

  // Loading Skeleton State matching exact 4:5 geometry
  if (isLoading && (!products || products.length === 0)) {
    return (
      <div className={`grid ${gridColsClass} ${className}`}>
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <ProductCardSkeleton key={`product-grid-skeleton-${idx}`} />
        ))}
      </div>
    )
  }

  // Empty State
  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center bg-[#0C0C0C] border border-[#1F1F1F] p-8 max-w-lg mx-auto">
        <EmptyState
          title={isFiltered ? 'No pieces match this selection.' : 'Our catalogue is being prepared.'}
          description={
            isFiltered
              ? 'Adjust your filters or search query to explore handcrafted solid wood pieces from our master archive.'
              : 'Our master craftsmen are curating the latest architectural furniture collections. Please check back shortly.'
          }
          action={
            isFiltered && onClearFilters ? (
              <GoldButton onClick={onClearFilters} size="sm" variant="outline">
                Clear Filters
              </GoldButton>
            ) : undefined
          }
        />
      </div>
    )
  }

  // Product Plates Grid
  return (
    <div className={`grid ${gridColsClass} ${className}`}>
      {products.map((product, idx) => (
        <ProductPlate
          key={product.id}
          product={product}
          index={idx}
          priority={idx < 2}
        />
      ))}
    </div>
  )
}

export default ProductGrid
