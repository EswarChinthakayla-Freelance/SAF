import React from 'react'
import type { ProductDetail } from '@/types/app'

export interface ProductSpecificationsProps {
  product: ProductDetail
  className?: string
}

export const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({
  product,
  className = '',
}) => {
  // Format dimensions JSONB safely
  const formatDimensions = () => {
    if (!product.dimensions || typeof product.dimensions !== 'object') return null
    const dims = product.dimensions as Record<string, unknown>
    const length = dims.length || dims.l
    const width = dims.width || dims.w
    const height = dims.height || dims.h
    const unit = (dims.unit as string) || 'cm'

    if (!length && !width && !height) return null

    const parts = [
      length ? `Length: ${length} ${unit}` : null,
      width ? `Width: ${width} ${unit}` : null,
      height ? `Height: ${height} ${unit}` : null,
    ].filter(Boolean)

    return parts.length > 0 ? parts.join('  ·  ') : null
  }

  const dimensionsStr = formatDimensions()
  const materialsList = product.materials && product.materials.length > 0 ? product.materials : null

  return (
    <div className={`space-y-12 ${className}`}>
      {/* 1. Full Editorial Description */}
      {product.description && (
        <section className="space-y-4 max-w-3xl" aria-labelledby="about-piece-heading">
          <h2 id="about-piece-heading" className="text-xl sm:text-2xl font-serif font-bold text-[#F5F0E8]">
            About this Piece
          </h2>
          <div className="text-xs sm:text-sm text-[#D1CCC2]/90 font-sans leading-relaxed space-y-4 font-light whitespace-pre-line">
            {product.description}
          </div>
        </section>
      )}

      {/* 2. Structured Specifications Grid */}
      <section className="space-y-6 pt-8 border-t border-[#2A2A2A]" aria-labelledby="specifications-heading">
        <h2 id="specifications-heading" className="text-xl sm:text-2xl font-serif font-bold text-[#F5F0E8]">
          Craft Specifications & Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Dimensions */}
          {dimensionsStr && (
            <div className="p-5 rounded-none bg-[#111111] border border-[#2A2A2A] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#C9A84C] font-semibold tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>Dimensions</span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-[#F5F0E8]">{dimensionsStr}</p>
            </div>
          )}

          {/* Hardwood & Materials */}
          {materialsList && (
            <div className="p-5 rounded-none bg-[#111111] border border-[#2A2A2A] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#C9A84C] font-semibold tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span>Materials & Finishes</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {materialsList.map((mat, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-none bg-[#1A1816] border border-[#2A2A2A] text-xs font-mono text-[#E8B84B]"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Care Instructions */}
          {product.care_instructions && (
            <div className="p-5 rounded-none bg-[#111111] border border-[#2A2A2A] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#C9A84C] font-semibold tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Care & Maintenance</span>
              </div>
              <p className="text-xs sm:text-sm text-[#D1CCC2]/90 leading-relaxed font-sans font-light whitespace-pre-line">
                {product.care_instructions}
              </p>
            </div>
          )}

          {/* Warranty Info */}
          {product.warranty_info && (
            <div className="p-5 rounded-none bg-[#111111] border border-[#2A2A2A] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#C9A84C] font-semibold tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Warranty & Quality Guarantee</span>
              </div>
              <p className="text-xs sm:text-sm text-[#D1CCC2]/90 leading-relaxed font-sans font-light">
                {product.warranty_info}
              </p>
            </div>
          )}

          {/* Delivery Information */}
          {product.delivery_info && (
            <div className="p-5 rounded-none bg-[#111111] border border-[#2A2A2A] space-y-2 md:col-span-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#C9A84C] font-semibold tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                <span>White-Glove Delivery & Installation</span>
              </div>
              <p className="text-xs sm:text-sm text-[#D1CCC2]/90 leading-relaxed font-sans font-light">
                {product.delivery_info}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ProductSpecifications
