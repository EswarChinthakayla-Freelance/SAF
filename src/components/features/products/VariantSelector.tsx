import React from 'react'
import { formatCurrency } from '@/utils/formatCurrency'
import { STOCK_STATUS_LABELS, type StockStatus } from '@/lib/constants'
import type { ProductVariantRow } from '@/types/app'

export interface VariantSelectorProps {
  variants?: ProductVariantRow[]
  selectedVariant: ProductVariantRow | null
  onSelectVariant: (variant: ProductVariantRow) => void
  basePrice: number
  currency?: string
  className?: string
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants = [],
  selectedVariant,
  onSelectVariant,
  basePrice,
  currency = 'INR',
  className = '',
}) => {
  if (!variants || variants.length === 0) return null

  // Sort variants deterministically by sort_order
  const sortedVariants = [...variants].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  return (
    <fieldset className={`space-y-3 ${className}`}>
      <legend className="text-xs uppercase font-mono tracking-[0.18em] text-[#9B958B] font-semibold">
        Configurations & Materials
      </legend>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Product configurations">
        {sortedVariants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id
          const variantPrice = variant.price ?? basePrice
          const isOutOfStock = variant.stock_status === 'out_of_stock'

          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-pressed={isSelected}
              disabled={isOutOfStock}
              onClick={() => onSelectVariant(variant)}
              className={`p-3.5 rounded-none border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${isSelected
                ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#F5F0E8] shadow-md shadow-[#C9A84C]/10 ring-1 ring-[#C9A84C]/40'
                : 'border-[#2A2A2A] bg-[#111111] text-[#9B958B] hover:border-[#3A3A3A] hover:text-[#F5F0E8]'
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-semibold text-[#F5F0E8]">{variant.label}</span>
                {variant.stock_status && (
                  <span
                    className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-none ${variant.stock_status === 'in_stock'
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                      : variant.stock_status === 'made_to_order'
                        ? 'bg-[#C9A84C]/20 text-[#E8B84B] border border-[#C9A84C]/40'
                        : 'bg-red-950/60 text-red-400 border border-red-800/40'
                      }`}
                  >
                    {STOCK_STATUS_LABELS[variant.stock_status as StockStatus]}
                  </span>
                )}
              </div>

              {/* Structured attributes: Material, Finish/Color, Dimensions/Size */}
              <div className="text-[11px] text-[#7A746B] space-y-0.5 font-sans">
                {variant.material && (
                  <div>
                    Material: <span className="text-[#D1CCC2] font-medium">{variant.material}</span>
                  </div>
                )}
                {variant.color && (
                  <div>
                    Finish: <span className="text-[#D1CCC2] font-medium">{variant.color}</span>
                  </div>
                )}
                {variant.size_label && (
                  <div>
                    Size: <span className="text-[#D1CCC2] font-medium">{variant.size_label}</span>
                  </div>
                )}
              </div>

              <div className="text-xs font-serif font-bold text-[#E8B84B] pt-1.5 border-t border-[#2A2A2A]/60 flex items-center justify-between">
                <span>{formatCurrency(variantPrice, currency)}</span>
                {isSelected && <span className="text-[10px] text-[#C9A84C] font-mono">Selected ✓</span>}
              </div>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export default VariantSelector
