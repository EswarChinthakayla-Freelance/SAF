import React from 'react'
import { formatCurrency } from '@/utils/formatCurrency'
import { HugeiconsIcon } from '@hugeicons/react'
import { PackageIcon } from '@hugeicons/core-free-icons'
import type { ProductVariantRow } from '@/types/app'

export interface AdminProductVariantsProps {
  variants?: ProductVariantRow[]
  baseCurrency?: string
}

export const AdminProductVariants: React.FC<AdminProductVariantsProps> = ({
  variants = [],
  baseCurrency = 'INR',
}) => {
  const sortedVariants = [...variants].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  const renderStockBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-sans font-medium bg-[#0D1510] text-[#4ADE80] border border-[#166534]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            In Stock
          </span>
        )
      case 'made_to_order':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-sans font-medium bg-[#1C1708] text-[#FBBF24] border border-[#B45309]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            Made to Order
          </span>
        )
      case 'out_of_stock':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-sans font-medium bg-[#1A1111] text-[#F87171] border border-[#991B1B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            Out of Stock
          </span>
        )
    }
  }

  return (
    <section className="bg-[#141414] border border-[#242424] rounded-lg p-5 sm:p-6 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-sans font-semibold uppercase tracking-wider text-[#C9A84C] flex items-center gap-2">
          <HugeiconsIcon icon={PackageIcon} className="w-4 h-4" />
          <span>Configured Variants ({sortedVariants.length})</span>
        </h2>
      </div>

      {sortedVariants.length === 0 ? (
        <div className="py-6 text-center text-xs text-[#7A746B] italic bg-[#181818]/40 rounded border border-[#222222]">
          No specialized variants configured. The base product record is used.
        </div>
      ) : (
        <>
          {/* Desktop Table View (>= 768px) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="border-b border-[#262626] text-[#7A746B] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Variant</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Material</th>
                  <th className="py-2.5 px-3">Color</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3 text-right">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020] text-[#D1CCC2]">
                {sortedVariants.map((v) => (
                  <tr key={v.id} className="hover:bg-[#181818] transition-colors">
                    <td className="py-3 px-3 font-medium text-[#F5F0E8]">{v.label}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#9B958B]">{v.sku || '—'}</td>
                    <td className="py-3 px-3">{v.material || '—'}</td>
                    <td className="py-3 px-3">{v.color || '—'}</td>
                    <td className="py-3 px-3">{v.size_label || '—'}</td>
                    <td className="py-3 px-3 font-medium text-[#F5F0E8]">
                      {formatCurrency(v.price, baseCurrency)}
                    </td>
                    <td className="py-3 px-3 text-right">{renderStockBadge(v.stock_status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Variant Cards (< 768px) */}
          <div className="md:hidden space-y-2.5">
            {sortedVariants.map((v) => (
              <div
                key={v.id}
                className="bg-[#181818] border border-[#262626] rounded-md p-3.5 space-y-2 text-xs font-sans"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-[#F5F0E8] block">{v.label}</span>
                    {v.sku && (
                      <span className="font-mono text-[10px] text-[#8A847A] block">SKU: {v.sku}</span>
                    )}
                  </div>
                  {renderStockBadge(v.stock_status)}
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] text-[#A8A29E] pt-1">
                  {v.material && (
                    <div>
                      <span className="text-[#666158] block text-[9px] uppercase">Material</span>
                      <span className="truncate block">{v.material}</span>
                    </div>
                  )}
                  {v.color && (
                    <div>
                      <span className="text-[#666158] block text-[9px] uppercase">Color</span>
                      <span className="truncate block">{v.color}</span>
                    </div>
                  )}
                  {v.size_label && (
                    <div>
                      <span className="text-[#666158] block text-[9px] uppercase">Size</span>
                      <span className="truncate block">{v.size_label}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#242424] flex items-center justify-between text-xs">
                  <span className="text-[#7A746B]">Variant Price</span>
                  <span className="font-medium text-[#F5F0E8]">
                    {formatCurrency(v.price, baseCurrency)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default AdminProductVariants
