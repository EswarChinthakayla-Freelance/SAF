import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PriceTag } from '@/components/brand/PriceTag'
import { getMediaUrl } from '@/lib/media'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon, ViewIcon } from '@hugeicons/core-free-icons'
import type { ProductListItem, ProductRow } from '@/types/app'

export interface SinglePieceFeatureProps {
  product: ProductListItem | ProductRow
  collectionName?: string
  className?: string
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
 * SinglePieceFeature
 * Monumental exhibition stage for single-product collections.
 * Elevates the sole piece into an intentional architectural centerpiece rather than
 * floating one small card in an empty 3-column grid.
 */
export const SinglePieceFeature: React.FC<SinglePieceFeatureProps> = ({
  product,
  collectionName,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const imageUrl = product.cover_image_path
    ? getMediaUrl(STORAGE_BUCKETS.PRODUCT_IMAGES, product.cover_image_path, 'detail')
    : null

  const materials = Array.isArray(product.materials) ? product.materials : []

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center bg-[#0B0B0B] border border-[#1F1F1F] p-6 sm:p-10 lg:p-12 hover:border-[#C9A84C]/50 transition-all duration-300 ${className}`}
    >
      {/* 1. Left (Cols 1-7): Monumental Exhibition Stage */}
      <div className="lg:col-span-7 relative">
        <Link
          to={`/products/${product.slug}`}
          aria-label={`Explore ${product.name} details`}
          className="relative block aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/10] bg-[#0E0D0B] overflow-hidden cursor-pointer"
        >
          {/* Gold Register Marks */}
          <div
            className={`transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
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
              loading="eager"
              onError={() => setImageError(true)}
              className="w-full h-full object-contain p-4 sm:p-8 transition-transform duration-700 ease-out hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#141414] text-[#7A746B]">
              <span className="font-serif text-2xl text-[#9B958B]">Sri Anjaneya Furnitures</span>
              <span className="text-[10px] font-mono uppercase tracking-widest mt-1 text-[#555047]">
                Master Woodcraft
              </span>
            </div>
          )}

          {/* Bottom Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 hover:opacity-60 transition-opacity duration-300 pointer-events-none" />
        </Link>
      </div>

      {/* 2. Right (Cols 8-12): Piece Metadata & Acquisition Controls */}
      <div className="lg:col-span-5 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold">
              FEATURED PIECE
            </span>
            <span className="text-[#3A3A3A]">//</span>
            <span className="text-[10px] uppercase tracking-widest text-[#7A746B]">
              {product.product_code || collectionName || 'ATELIER WORK'}
            </span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-serif text-[#F5F0E8] font-bold tracking-tight leading-snug">
            <Link
              to={`/products/${product.slug}`}
              className="hover:text-[#E8B84B] transition-colors"
            >
              {product.name}
            </Link>
          </h3>
        </div>

        {/* Price Tag */}
        <div className="pt-1">
          <PriceTag
            price={product.price}
            comparePrice={product.compare_price}
            currency={product.currency}
          />
        </div>

        {/* Short Description */}
        {(product.short_desc || product.description) && (
          <p className="text-sm text-[#9B958B] leading-relaxed font-sans font-light max-w-md">
            {product.short_desc || product.description}
          </p>
        )}

        {/* Materials Badges */}
        {materials.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[#1C1C1C]">
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#7A746B]">
              PRIMARY MATERIALS
            </div>
            <div className="flex flex-wrap gap-1.5">
              {materials.map((mat, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-[#141414] border border-[#242424] text-[#D1CCC2] text-xs font-mono"
                >
                  {mat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-3">
          <Link
            to={`/products/${product.slug}`}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#C9A84C] hover:bg-[#E8B84B] text-[#0A0A0A] font-mono text-xs uppercase tracking-wider font-semibold transition-colors rounded-none"
          >
            <span>Explore Piece Details</span>
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
          </Link>

          <Link
            to={`/products/${product.slug}/view`}
            className="inline-flex items-center gap-1.5 px-4 py-3 bg-[#141414] border border-[#262626] hover:border-[#3A3A3A] text-[#8A847A] hover:text-[#F5F0E8] font-mono text-xs uppercase tracking-wider transition-colors"
          >
            <HugeiconsIcon icon={ViewIcon} className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Inspect Studio Images</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

export default SinglePieceFeature
