import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PriceTag } from '@/components/brand/PriceTag'
import { getMediaUrl } from '@/lib/media'
import type { ProductListItem, ProductRow } from '@/types/app'

interface ProductCardProps {
  product: ProductListItem | ProductRow
  className?: string
  priority?: boolean
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = '',
  priority = false,
}) => {
  const [imageError, setImageError] = useState(false)
  const imageUrl = product.cover_image_path
    ? getMediaUrl('product-images', product.cover_image_path, 'card')
    : null

  // Extract collection name from relation if present
  const collectionName =
    'collections' in product && product.collections
      ? product.collections.name
      : null

  const hasDiscount = Boolean(
    product.compare_price && product.compare_price > product.price
  )

  return (
    <Link
      to={`/products/${product.slug}`}
      className={`group block bg-[#111111] border border-[#2A2A2A] rounded-none overflow-hidden transition-all duration-300 hover:border-[#C9A84C]/50 hover:shadow-xl ${className}`}
    >
      {/* 4:5 Aspect Ratio Dominant Image Box */}
      <div className="relative aspect-[4/5] bg-[#0E0D0B] overflow-hidden">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#151412] text-[#7A746B]">
            <span className="font-serif text-sm tracking-wide text-[#9B958B]">
              Sri Anjaneya Furnitures
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest mt-1 text-[#555047]">
              Bespoke Woodcraft
            </span>
          </div>
        )}

        {/* Subtle Dark Gradient Overlay on Image Bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Compare Price / Special Badge (if meaningfully higher) */}
        {hasDiscount && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-none bg-[#C9A84C]/90 text-[#0A0A0A] text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
            Curated Price
          </span>
        )}
      </div>

      {/* Product Information Body */}
      <div className="p-5 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          {collectionName && (
            <span className="text-[10px] uppercase font-mono tracking-[0.18em] text-[#C9A84C] font-semibold block">
              {collectionName}
            </span>
          )}
          <h3 className="font-serif text-base sm:text-lg text-[#F5F0E8] font-medium leading-snug group-hover:text-[#E8B84B] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Price & Action Link */}
        <div className="pt-2 border-t border-[#2A2A2A]/70 flex items-center justify-between">
          <PriceTag
            price={product.price}
            comparePrice={product.compare_price}
            currency={product.currency}
          />
          <span className="text-[11px] uppercase tracking-[0.14em] font-sans font-medium text-[#9B958B] group-hover:text-[#E8B84B] group-hover:translate-x-0.5 transition-all flex items-center gap-1">
            <span>View Piece</span>
            <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
