import React from 'react'
import { ProductCardSkeleton } from './ProductCardSkeleton'

interface ProductGridSkeletonProps {
  count?: number
  className?: string
}

/**
 * Responsive product grid skeleton matching the layout geometry of ProductGrid.
 */
export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
  count = 8,
  className = '',
}) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 ${className}`}
      aria-label="Loading products"
      role="status"
    >
      <span className="sr-only">Loading products...</span>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={`product-skeleton-${index}`} />
      ))}
    </div>
  )
}

export default ProductGridSkeleton
