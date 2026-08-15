import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { STOCK_STATUSES, STOCK_STATUS_LABELS, type StockStatus } from '@/lib/constants'
import type { ProductVariantRow } from '@/types/app'

export interface VariantDraft extends Partial<ProductVariantRow> {
  tempId?: string
}

export interface VariantsSectionProps {
  variants: VariantDraft[]
  onChange: (variants: VariantDraft[]) => void
  basePrice: number
}

export const VariantsSection: React.FC<VariantsSectionProps> = ({
  variants,
  onChange,
  basePrice,
}) => {
  const handleAddVariant = () => {
    const newVariant: VariantDraft = {
      tempId: `temp-${Date.now()}`,
      label: `Variant ${variants.length + 1}`,
      sku: '',
      material: '',
      color: '',
      size_label: '',
      price: basePrice,
      compare_price: null,
      stock_status: 'in_stock',
      sort_order: variants.length,
    }
    onChange([...variants, newVariant])
  }

  const handleUpdateVariant = (index: number, updates: Partial<VariantDraft>) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], ...updates }
    onChange(updated)
  }

  const handleDeleteVariant = (index: number) => {
    onChange(variants.filter((_, idx) => idx !== index))
  }

  return (
    <div className="bg-[#111111] border border-[#2A2A2A] rounded-none p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-base font-serif font-semibold text-[#F5F0E8]">Product Variants</h3>
          <p className="text-xs text-[#9B958B]">
            Configure structured combinations for materials, custom sizes, wood finishes, and price adjustments.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddVariant}
          className="px-4 py-2 bg-[#171717] hover:bg-[#222222] text-[#C9A84C] border border-[#2A2A2A] rounded-none text-xs font-mono font-medium cursor-pointer shrink-0"
        >
          + Add Variant
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-[#2A2A2A] rounded-none p-6 text-xs text-[#9B958B]">
          No custom variants defined. The base product details and price will be used.
        </div>
      ) : (
        <div className="space-y-4">
          {variants.map((v, idx) => (
            <div
              key={v.id || v.tempId || idx}
              className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-none p-4 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2">
                <span className="text-xs font-serif font-medium text-[#C9A84C]">
                  #{idx + 1} — {v.label || 'Unnamed Variant'}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteVariant(idx)}
                  className="text-xs text-red-400 hover:underline font-mono cursor-pointer"
                >
                  Delete Variant
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Variant Label */}
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#7A746B] mb-1">
                    Label / Title <span className="text-[#C9A84C]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={v.label || ''}
                    onChange={(e) => handleUpdateVariant(idx, { label: e.target.value })}
                    placeholder="e.g. Standard Honey Teak"
                    className="w-full bg-[#111111] border border-[#2A2A2A] rounded-none h-9 px-3 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#7A746B] mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={v.sku || ''}
                    onChange={(e) => handleUpdateVariant(idx, { sku: e.target.value })}
                    placeholder="SAF-VAR-01"
                    className="w-full bg-[#111111] border border-[#2A2A2A] rounded-none h-9 px-3 text-xs text-[#F5F0E8] font-mono focus:border-[#C9A84C] outline-none"
                  />
                </div>

                {/* Stock Status */}
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#7A746B] mb-1">
                    Availability Status
                  </label>
                  <Select
                    items={STOCK_STATUS_LABELS}
                    value={v.stock_status || 'in_stock'}
                    onValueChange={(val) =>
                      handleUpdateVariant(idx, {
                        stock_status: (val || 'in_stock') as StockStatus,
                      })
                    }
                  >
                    <SelectTrigger className="w-full bg-[#111111] border-[#2A2A2A] text-[#F5F0E8] rounded-none h-9 px-3 text-xs font-mono">
                      <SelectValue placeholder="Availability Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111111] border-[#2A2A2A] text-[#F5F0E8] rounded-none shadow-2xl z-50">
                      <SelectGroup>
                        {STOCK_STATUSES.map((st) => (
                          <SelectItem key={st} value={st}>
                            {STOCK_STATUS_LABELS[st]}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Material */}
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#7A746B] mb-1">
                    Material Specification
                  </label>
                  <input
                    type="text"
                    value={v.material || ''}
                    onChange={(e) => handleUpdateVariant(idx, { material: e.target.value })}
                    placeholder="e.g. Burma Teak"
                    className="w-full bg-[#111111] border border-[#2A2A2A] rounded-none h-9 px-3 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
                  />
                </div>

                {/* Finish / Color */}
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#7A746B] mb-1">
                    Finish / Color
                  </label>
                  <input
                    type="text"
                    value={v.color || ''}
                    onChange={(e) => handleUpdateVariant(idx, { color: e.target.value })}
                    placeholder="e.g. Natural Matte Oil"
                    className="w-full bg-[#111111] border border-[#2A2A2A] rounded-none h-9 px-3 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
                  />
                </div>

                {/* Size Label */}
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#7A746B] mb-1">
                    Size / Dimension Label
                  </label>
                  <input
                    type="text"
                    value={v.size_label || ''}
                    onChange={(e) => handleUpdateVariant(idx, { size_label: e.target.value })}
                    placeholder='e.g. 72" x 36"'
                    className="w-full bg-[#111111] border border-[#2A2A2A] rounded-none h-9 px-3 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
                  />
                </div>

                {/* Price Override */}
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#7A746B] mb-1">
                    Price Override (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={v.price === undefined || v.price === null ? basePrice : v.price}
                    onChange={(e) =>
                      handleUpdateVariant(idx, {
                        price: e.target.value ? Number(e.target.value) : basePrice,
                      })
                    }
                    className="w-full bg-[#111111] border border-[#2A2A2A] rounded-none h-9 px-3 text-xs text-[#F5F0E8] font-mono focus:border-[#C9A84C] outline-none"
                  />
                </div>

                {/* Compare Price */}
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#7A746B] mb-1">
                    Compare Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={v.compare_price || ''}
                    onChange={(e) =>
                      handleUpdateVariant(idx, {
                        compare_price: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="Optional"
                    className="w-full bg-[#111111] border border-[#2A2A2A] rounded-none h-9 px-3 text-xs text-[#F5F0E8] font-mono focus:border-[#C9A84C] outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
