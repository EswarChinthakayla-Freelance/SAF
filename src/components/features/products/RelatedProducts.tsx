import React from 'react'
import { ProductCard } from './ProductCard'
import { useRelatedProducts } from '@/hooks/queries/useProducts'

export interface RelatedProductsProps {
  collectionId?: string | null
  currentProductId: string
  collectionName?: string
  className?: string
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  collectionId,
  currentProductId,
  collectionName,
  className = '',
}) => {
  const { data: relatedProducts = [], isLoading } = useRelatedProducts(
    collectionId,
    currentProductId,
    3
  )

  if (isLoading) {
    return (
      <div className={`space-y-6 pt-12 border-t border-[#2A2A2A] ${className}`}>
        <div className="h-6 w-48 bg-[#1A1816] rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="bg-[#111111] border border-[#2A2A2A] rounded-none aspect-[4/5] animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (relatedProducts.length === 0) return null

  return (
    <section
      className={`space-y-8 pt-12 border-t border-[#2A2A2A] ${className}`}
      aria-labelledby="related-pieces-heading"
    >
      <div className="space-y-1">
        <span className="text-[10px] sm:text-xs uppercase font-mono tracking-[0.2em] text-[#C9A84C] font-semibold">
          {collectionName ? `More from ${collectionName}` : 'Complementary Pieces'}
        </span>
        <h2 id="related-pieces-heading" className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F0E8]">
          You May Also Admire
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default RelatedProducts
