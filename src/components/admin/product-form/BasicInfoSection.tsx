import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { slugify } from '@/utils/slugify'
import type { CollectionRow } from '@/types/app'

export interface BasicInfoValues {
  name: string
  slug: string
  product_code?: string
  collection_id: string | null
  short_desc?: string
  description?: string
}

export interface BasicInfoSectionProps {
  values: BasicInfoValues
  onChange: (fields: Partial<BasicInfoValues>) => void
  collections: CollectionRow[]
  errors?: Record<string, string | undefined>
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  values,
  onChange,
  collections,
  errors = {},
}) => {
  const [isManualSlug, setIsManualSlug] = React.useState(Boolean(values.slug))

  const handleNameChange = (name: string) => {
    const updates: Partial<BasicInfoValues> = { name }
    if (!isManualSlug) {
      updates.slug = slugify(name)
    }
    onChange(updates)
  }

  const handleRegenerateSlug = () => {
    setIsManualSlug(false)
    onChange({ slug: slugify(values.name || '') })
  }

  const collectionItems = React.useMemo(() => {
    const map: Record<string, string> = {
      none: '— Standalone Piece / No Collection —',
    }
    collections.forEach((col) => {
      map[col.id] = col.name
    })
    return map
  }, [collections])

  return (
    <div className="bg-[#111111] border border-[#2A2A2A] rounded-none p-6 space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-serif font-semibold text-[#F5F0E8]">Basic Information</h3>
        <p className="text-xs text-[#9B958B]">Core identity, catalogue naming, collection assignment, and narrative copy.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Product Name */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-medium uppercase font-mono text-[#F5F0E8]">
            Product Title / Piece Name <span className="text-[#C9A84C]">*</span>
          </label>
          <input
            type="text"
            required
            value={values.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Grand Teak Heritage Pooja Mandir"
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-2.5 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
          />
          {errors.name && <p className="text-[11px] text-red-400">{errors.name}</p>}
        </div>

        {/* Slug with regenerate option */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium uppercase font-mono text-[#F5F0E8]">
              URL Slug <span className="text-[#C9A84C]">*</span>
            </label>
            <button
              type="button"
              onClick={handleRegenerateSlug}
              className="text-[10px] text-[#C9A84C] hover:underline font-mono"
            >
              Auto-generate
            </button>
          </div>
          <input
            type="text"
            required
            value={values.slug}
            onChange={(e) => {
              setIsManualSlug(true)
              onChange({ slug: slugify(e.target.value) })
            }}
            placeholder="grand-teak-heritage-pooja-mandir"
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-2.5 text-xs text-[#F5F0E8] font-mono focus:border-[#C9A84C] outline-none"
          />
          {errors.slug && <p className="text-[11px] text-red-400">{errors.slug}</p>}
        </div>

        {/* Product Code / SKU */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium uppercase font-mono text-[#F5F0E8]">
            Product Code / SKU
          </label>
          <input
            type="text"
            value={values.product_code || ''}
            onChange={(e) => onChange({ product_code: e.target.value })}
            placeholder="SAF-MND-001"
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-2.5 text-xs text-[#F5F0E8] font-mono focus:border-[#C9A84C] outline-none"
          />
        </div>

        {/* Collection Selector */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-medium uppercase font-mono text-[#F5F0E8]">
            Collection / Category
          </label>
          <Select
            items={collectionItems}
            value={values.collection_id || 'none'}
            onValueChange={(val) =>
              onChange({ collection_id: val === 'none' || !val ? null : val })
            }
          >
            <SelectTrigger className="w-full bg-[#0A0A0A] border-[#2A2A2A] text-[#F5F0E8] rounded-none h-10 px-4 text-xs font-sans">
              <SelectValue placeholder="— Standalone Piece / No Collection —" />
            </SelectTrigger>
            <SelectContent className="bg-[#111111] border-[#2A2A2A] text-[#F5F0E8] rounded-none shadow-2xl z-50">
              <SelectGroup>
                <SelectItem value="none">— Standalone Piece / No Collection —</SelectItem>
                {collections.map((col) => (
                  <SelectItem key={col.id} value={col.id}>
                    {col.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Short Description */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-medium uppercase font-mono text-[#F5F0E8]">
            Short Description / Catalogue Summary
          </label>
          <input
            type="text"
            value={values.short_desc || ''}
            onChange={(e) => onChange({ short_desc: e.target.value })}
            placeholder="Brief 1-line overview for cards and search results..."
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-2.5 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
          />
        </div>

        {/* Full Editorial Description */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-medium uppercase font-mono text-[#F5F0E8]">
            Detailed Editorial Description
          </label>
          <textarea
            rows={5}
            value={values.description || ''}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Detailed architectural craftsmanship description, wood grain characteristics, joinery techniques..."
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none p-4 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  )
}
