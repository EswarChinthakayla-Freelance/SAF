import React from 'react'

export interface PricingValues {
  price: number
  compare_price?: number | null
  currency?: string
  is_published: boolean
  sort_order: number
}

export interface PricingSectionProps {
  values: PricingValues
  onChange: (fields: Partial<PricingValues>) => void
  errors?: Record<string, string | undefined>
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  values,
  onChange,
  errors = {},
}) => {
  return (
    <div className="bg-[#111111] border border-[#2A2A2A] rounded-none p-6 space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-serif font-semibold text-[#F5F0E8]">Pricing & Visibility</h3>
        <p className="text-xs text-[#9B958B]">Set commercial prices and public catalogue publishing status.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Sale Price */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium uppercase font-mono text-[#F5F0E8]">
            Base Price (INR ₹) <span className="text-[#C9A84C]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#C9A84C]">
              ₹
            </span>
            <input
              type="number"
              min="0"
              required
              value={values.price === 0 ? '' : values.price}
              onChange={(e) => onChange({ price: Number(e.target.value) || 0 })}
              placeholder="185000"
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none pl-8 pr-4 py-2.5 text-xs text-[#F5F0E8] font-mono focus:border-[#C9A84C] outline-none"
            />
          </div>
          {errors.price && <p className="text-[11px] text-red-400">{errors.price}</p>}
        </div>

        {/* Compare / Original Price */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium uppercase font-mono text-[#F5F0E8]">
            Original / Compare Price (Optional)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#9B958B]">
              ₹
            </span>
            <input
              type="number"
              min="0"
              value={values.compare_price === null || values.compare_price === undefined ? '' : values.compare_price}
              onChange={(e) =>
                onChange({
                  compare_price: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder="210000"
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none pl-8 pr-4 py-2.5 text-xs text-[#F5F0E8] font-mono focus:border-[#C9A84C] outline-none"
            />
          </div>
          {errors.compare_price && <p className="text-[11px] text-red-400">{errors.compare_price}</p>}
        </div>

        {/* Sort Order */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium uppercase font-mono text-[#F5F0E8]">
            Catalogue Sort Priority
          </label>
          <input
            type="number"
            min="0"
            value={values.sort_order}
            onChange={(e) => onChange({ sort_order: Number(e.target.value) || 0 })}
            placeholder="0"
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-2.5 text-xs text-[#F5F0E8] font-mono focus:border-[#C9A84C] outline-none"
          />
        </div>

        {/* Publish Switch Control */}
        <div className="space-y-1.5 flex flex-col justify-center">
          <label className="block text-xs font-medium uppercase font-mono text-[#F5F0E8]">
            Catalogue Visibility
          </label>
          <label className="flex items-center gap-3 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={values.is_published}
              onChange={(e) => onChange({ is_published: e.target.checked })}
              className="w-4 h-4 rounded text-[#C9A84C] bg-[#0A0A0A] border-[#2A2A2A] focus:ring-[#C9A84C] accent-[#C9A84C]"
            />
            <span className="text-xs text-[#F5F0E8] font-medium">
              {values.is_published ? (
                <span className="text-emerald-400 font-semibold">Published (Live on Public Catalogue)</span>
              ) : (
                <span className="text-[#9B958B]">Draft (Hidden from Public Browsing)</span>
              )}
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
