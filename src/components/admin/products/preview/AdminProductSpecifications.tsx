import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  RulerIcon,
  Layers01Icon,
  Shield01Icon,
  DeliveryTruck01Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons'
import type { ProductWithRelations } from '@/types/app'

export interface AdminProductSpecificationsProps {
  product: ProductWithRelations
}

export const AdminProductSpecifications: React.FC<AdminProductSpecificationsProps> = ({
  product,
}) => {
  // Parse dimensions from JSONB safely
  const rawDims =
    product.dimensions && typeof product.dimensions === 'object'
      ? (product.dimensions as Record<string, unknown>)
      : {}

  const length = Number(rawDims.length) || Number(rawDims.depth) || 0
  const width = Number(rawDims.width) || 0
  const height = Number(rawDims.height) || 0
  const unit = String(rawDims.unit || 'inches')

  const hasDimensions = length > 0 || width > 0 || height > 0
  const materials = Array.isArray(product.materials) ? product.materials : []

  return (
    <div className="space-y-6">
      {/* Product Description */}
      {product.description && (
        <section className="bg-[#141414] border border-[#242424] rounded-none p-5 sm:p-6 space-y-3 shadow-lg">
          <h2 className="text-sm font-sans font-semibold uppercase tracking-wider text-[#C9A84C] flex items-center gap-2">
            <span>Description & Editorial Notes</span>
          </h2>
          <div className="prose prose-invert prose-xs text-[#D1CCC2] leading-relaxed whitespace-pre-line font-sans">
            {product.description}
          </div>
        </section>
      )}

      {/* Structured Specifications Grid */}
      <section className="bg-[#141414] border border-[#242424] rounded-none p-5 sm:p-6 space-y-5 shadow-lg">
        <h2 className="text-sm font-sans font-semibold uppercase tracking-wider text-[#C9A84C]">
          Technical Specifications & Craftsmanship
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dimensions */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-medium text-[#F5F0E8]">
              <HugeiconsIcon icon={RulerIcon} className="w-4 h-4 text-[#C9A84C]" />
              <span>Architectural Dimensions</span>
            </div>

            {hasDimensions ? (
              <div className="grid grid-cols-3 gap-2 text-xs font-sans">
                {width > 0 && (
                  <div className="bg-[#181818] border border-[#282828] p-2.5 rounded text-center">
                    <span className="text-[10px] text-[#7A746B] uppercase block">Width</span>
                    <span className="font-mono text-sm text-[#F5F0E8] font-medium">
                      {width} <span className="text-[10px] text-[#8A847A]">{unit}</span>
                    </span>
                  </div>
                )}
                {length > 0 && (
                  <div className="bg-[#181818] border border-[#282828] p-2.5 rounded text-center">
                    <span className="text-[10px] text-[#7A746B] uppercase block">Depth / Length</span>
                    <span className="font-mono text-sm text-[#F5F0E8] font-medium">
                      {length} <span className="text-[10px] text-[#8A847A]">{unit}</span>
                    </span>
                  </div>
                )}
                {height > 0 && (
                  <div className="bg-[#181818] border border-[#282828] p-2.5 rounded text-center">
                    <span className="text-[10px] text-[#7A746B] uppercase block">Height</span>
                    <span className="font-mono text-sm text-[#F5F0E8] font-medium">
                      {height} <span className="text-[10px] text-[#8A847A]">{unit}</span>
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#666158] italic">No dimension metrics configured.</p>
            )}
          </div>

          {/* Materials & Timber */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-medium text-[#F5F0E8]">
              <HugeiconsIcon icon={Layers01Icon} className="w-4 h-4 text-[#C9A84C]" />
              <span>Materials & Timber Species</span>
            </div>

            {materials.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {materials.map((mat) => (
                  <span
                    key={mat}
                    className="inline-flex items-center px-2.5 py-1 rounded bg-[#1A1A1A] border border-[#2E2E2E] text-xs font-sans text-[#E8B84B]"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#666158] italic">No specific materials assigned.</p>
            )}
          </div>
        </div>

        {/* Extended Notes: Care, Warranty, Delivery */}
        {(product.care_instructions || product.warranty_info || product.delivery_info) && (
          <div className="pt-4 border-t border-[#222222] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            {product.care_instructions && (
              <div className="space-y-1.5 bg-[#181818]/60 p-3.5 rounded border border-[#262626]">
                <div className="flex items-center gap-1.5 text-[#C9A84C] font-medium">
                  <HugeiconsIcon icon={SparklesIcon} className="w-3.5 h-3.5" />
                  <span>Care & Maintenance</span>
                </div>
                <p className="text-[#A8A29E] leading-relaxed whitespace-pre-line">
                  {product.care_instructions}
                </p>
              </div>
            )}

            {product.warranty_info && (
              <div className="space-y-1.5 bg-[#181818]/60 p-3.5 rounded border border-[#262626]">
                <div className="flex items-center gap-1.5 text-[#C9A84C] font-medium">
                  <HugeiconsIcon icon={Shield01Icon} className="w-3.5 h-3.5" />
                  <span>Warranty Assurance</span>
                </div>
                <p className="text-[#A8A29E] leading-relaxed whitespace-pre-line">
                  {product.warranty_info}
                </p>
              </div>
            )}

            {product.delivery_info && (
              <div className="space-y-1.5 bg-[#181818]/60 p-3.5 rounded border border-[#262626]">
                <div className="flex items-center gap-1.5 text-[#C9A84C] font-medium">
                  <HugeiconsIcon icon={DeliveryTruck01Icon} className="w-3.5 h-3.5" />
                  <span>Logistics & Delivery</span>
                </div>
                <p className="text-[#A8A29E] leading-relaxed whitespace-pre-line">
                  {product.delivery_info}
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminProductSpecifications
