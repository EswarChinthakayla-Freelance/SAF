import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PriceTag } from '@/components/brand/PriceTag'
import { getMediaUrl } from '@/lib/media'
import { STORAGE_BUCKETS } from '@/lib/constants'
import type { ProductListItem, ProductRow } from '@/types/app'

export interface ProductPlateProps {
  product: ProductListItem | ProductRow
  index?: number
  className?: string
  priority?: boolean
}

/**
 * Signature Gold Corner Register Mark
 */
const CornerRegisterMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none absolute z-20 ${className}`} aria-hidden="true">
    <div className="relative w-4 h-4">
      <span className="absolute top-0 left-0 w-2 h-[1.5px] bg-[#C9A84C]" />
      <span className="absolute top-0 left-0 w-[1.5px] h-2 bg-[#C9A84C]" />
      <span className="absolute bottom-0 right-0 w-2 h-[1.5px] bg-[#C9A84C]" />
      <span className="absolute bottom-0 right-0 w-[1.5px] h-2 bg-[#C9A84C]" />
    </div>
  </div>
)

/**
 * ProductPlate
 * Architectural furniture plate for "The Furniture Index".
 * Features large 4:5 photography, plate numbering index, Playfair serif typography,
 * collection metadata, and refined INR pricing (no promotional badges).
 */
export const ProductPlate: React.FC<ProductPlateProps> = ({
  product,
  index = 0,
  className = '',
  priority = false,
}) => {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const imageUrl = product.cover_image_path
    ? getMediaUrl(STORAGE_BUCKETS.PRODUCT_IMAGES, product.cover_image_path, 'card')
    : null

  const collectionName =
    'collections' in product && product.collections
      ? product.collections.name
      : null

  const plateNumber = String(index + 1).padStart(3, '0')

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex flex-col bg-[#0B0B0B] border border-[#1F1F1F] hover:border-[#C9A84C]/50 transition-all duration-300 ${className}`}
    >
      {/* 1. Plate Watermark Header */}
      <div className="px-4 py-2.5 bg-[#080808] border-b border-[#1A1A1A] flex items-center justify-between z-10 select-none">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#7A746B]">
          <span className="text-[#C9A84C] font-semibold">PLATE {plateNumber}</span>
          <span className="text-[#2E2E2E]">//</span>
          <span className="text-[#9B958B] truncate max-w-[140px]">
            {collectionName || 'ATELIER CREATION'}
          </span>
        </div>

        <span className="text-[10px] font-mono uppercase tracking-wider text-[#555047] group-hover:text-[#C9A84C] transition-colors">
          SAF ARCHIVE
        </span>
      </div>

      {/* 2. Visual Canvas Area (4:5 Ratio) */}
      <Link
        to={`/products/${product.slug}`}
        aria-label={`Explore ${product.name} details`}
        className="relative aspect-[4/5] bg-[#0E0D0B] overflow-hidden flex items-center justify-center cursor-pointer block"
      >
        {/* Subtle Gold Corner Register Marks on Hover / Focus */}
        <div
          className={`transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 group-focus-within:opacity-100'
          }`}
        >
          <CornerRegisterMark className="top-3 left-3" />
          <CornerRegisterMark className="bottom-3 right-3" />
        </div>

        {/* High-Resolution Media */}
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain p-4 sm:p-6 transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#111111] text-[#7A746B] select-none">
            <span className="font-serif text-sm tracking-wide text-[#9B958B]">
              Sri Anjaneya Furnitures
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest mt-1 text-[#555047]">
              Bespoke Woodcraft
            </span>
          </div>
        )}

        {/* Bottom Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-300 pointer-events-none" />

        {/* Hover Inspect Indicator */}
        <div
          className={`absolute bottom-3 right-3 bg-[#0A0A0A]/95 text-[#E8B84B] border border-[#C9A84C]/50 px-2.5 py-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider transition-all duration-300 ${
            isHovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 group-focus-within:opacity-100 group-focus-within:translate-y-0'
          }`}
        >
          <span>View Piece &rarr;</span>
        </div>
      </Link>

      {/* 3. Product Plate Typography & Price Body */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-4 bg-[#0A0A0A]">
        <div className="space-y-1.5">
          {collectionName && (
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#C9A84C] font-semibold block">
              {collectionName}
            </span>
          )}
          <h3 className="font-serif text-lg sm:text-xl text-[#F5F0E8] font-semibold leading-snug group-hover:text-[#E8B84B] transition-colors line-clamp-2">
            <Link to={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
        </div>

        {/* Price Tag & Exploration Link */}
        <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between">
          <PriceTag
            price={product.price}
            comparePrice={product.compare_price}
            currency={product.currency}
          />
          <Link
            to={`/products/${product.slug}`}
            className="text-[10px] uppercase tracking-widest font-mono text-[#8A847A] group-hover:text-[#E8B84B] transition-colors flex items-center gap-1 shrink-0"
          >
            <span>Details</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

export default ProductPlate
