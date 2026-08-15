import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ProductDimensions } from '@/types/app'

export interface SpecificationsValues {
  dimensions?: ProductDimensions
  materials: string[]
  care_instructions?: string
  warranty_info?: string
  delivery_info?: string
}

export interface SpecificationsSectionProps {
  values: SpecificationsValues
  onChange: (fields: Partial<SpecificationsValues>) => void
}

export const SpecificationsSection: React.FC<SpecificationsSectionProps> = ({
  values,
  onChange,
}) => {
  const [materialInput, setMaterialInput] = useState('')

  const handleAddMaterial = () => {
    const trimmed = materialInput.trim()
    if (trimmed && !values.materials.includes(trimmed)) {
      onChange({ materials: [...values.materials, trimmed] })
      setMaterialInput('')
    }
  }

  const handleRemoveMaterial = (mat: string) => {
    onChange({ materials: values.materials.filter((m) => m !== mat) })
  }

  const handleDimensionChange = (key: keyof ProductDimensions, val: string | number | undefined) => {
    const currentDims = values.dimensions || { unit: 'inches' }
    onChange({
      dimensions: {
        ...currentDims,
        [key]: val,
      },
    })
  }

  return (
    <div className="bg-[#111111] border border-[#2A2A2A] rounded-none p-6 space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-serif font-semibold text-[#F5F0E8]">Specifications & Craft</h3>
        <p className="text-xs text-[#9B958B]">Hardwood materials, dimensions, warranty, and care directives.</p>
      </div>

      {/* Dimensions Fieldset Grid */}
      <fieldset className="space-y-2 border-0 p-0 m-0">
        <legend className="text-xs font-medium uppercase font-mono text-[#F5F0E8]">
          Dimensions
        </legend>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label htmlFor="dim-length" className="text-[10px] text-[#7A746B] uppercase font-mono block mb-1">Length</label>
            <input
              id="dim-length"
              type="text"
              value={values.dimensions?.length || ''}
              onChange={(e) => handleDimensionChange('length', e.target.value)}
              placeholder='e.g. 72"'
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none h-9 px-3 text-xs text-[#F5F0E8] font-mono focus:border-[#C9A84C] outline-none"
            />
          </div>
          <div>
            <label htmlFor="dim-width" className="text-[10px] text-[#7A746B] uppercase font-mono block mb-1">Width</label>
            <input
              id="dim-width"
              type="text"
              value={values.dimensions?.width || ''}
              onChange={(e) => handleDimensionChange('width', e.target.value)}
              placeholder='e.g. 36"'
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none h-9 px-3 text-xs text-[#F5F0E8] font-mono focus:border-[#C9A84C] outline-none"
            />
          </div>
          <div>
            <label htmlFor="dim-height" className="text-[10px] text-[#7A746B] uppercase font-mono block mb-1">Height</label>
            <input
              id="dim-height"
              type="text"
              value={values.dimensions?.height || ''}
              onChange={(e) => handleDimensionChange('height', e.target.value)}
              placeholder='e.g. 30"'
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none h-9 px-3 text-xs text-[#F5F0E8] font-mono focus:border-[#C9A84C] outline-none"
            />
          </div>
          <div>
            <span className="text-[10px] text-[#7A746B] uppercase font-mono block mb-1">Unit</span>
            <Select
              items={{
                inches: 'Inches (in)',
                cm: 'Centimeters (cm)',
                mm: 'Millimeters (mm)',
              }}
              value={values.dimensions?.unit || 'inches'}
              onValueChange={(val) =>
                handleDimensionChange('unit', (val || 'inches') as ProductDimensions['unit'])
              }
            >
              <SelectTrigger aria-label="Dimension Unit" className="w-full bg-[#0A0A0A] border-[#2A2A2A] text-[#F5F0E8] rounded-none h-9 px-3 text-xs font-mono">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent className="bg-[#111111] border-[#2A2A2A] text-[#F5F0E8] rounded-none shadow-2xl z-50">
                <SelectGroup>
                  <SelectItem value="inches">Inches (in)</SelectItem>
                  <SelectItem value="cm">Centimeters (cm)</SelectItem>
                  <SelectItem value="mm">Millimeters (mm)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </fieldset>

      {/* Materials Tag Entry */}
      <div className="space-y-2">
        <label className="block text-xs font-medium uppercase font-mono text-[#F5F0E8]">
          Hardwood Species & Materials
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={materialInput}
            onChange={(e) => setMaterialInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddMaterial()
              }
            }}
            placeholder="e.g. Solid Burma Teak, Pure Brass Hardware..."
            className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-2 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
          />
          <button
            type="button"
            onClick={handleAddMaterial}
            className="px-4 py-2 bg-[#171717] hover:bg-[#222222] text-[#C9A84C] border border-[#2A2A2A] rounded-none text-xs font-medium cursor-pointer"
          >
            + Add
          </button>
        </div>

        {/* Selected Materials Chips */}
        {values.materials.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {values.materials.map((mat) => (
              <span
                key={mat}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-[#171717] border border-[#2A2A2A] text-xs text-[#F5F0E8]"
              >
                {mat}
                <button
                  type="button"
                  onClick={() => handleRemoveMaterial(mat)}
                  className="text-[#7A746B] hover:text-red-400 font-bold transition-colors cursor-pointer"
                  aria-label={`Remove material ${mat}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Care, Warranty & Delivery Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#2A2A2A]">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium uppercase font-mono text-[#F5F0E8]">
            Care Instructions
          </label>
          <textarea
            rows={3}
            value={values.care_instructions || ''}
            onChange={(e) => onChange({ care_instructions: e.target.value })}
            placeholder="Wipe with soft microfiber cloth, apply beeswax annually..."
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none p-3 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium uppercase font-mono text-[#F5F0E8]">
            Warranty Information
          </label>
          <textarea
            rows={3}
            value={values.warranty_info || ''}
            onChange={(e) => onChange({ warranty_info: e.target.value })}
            placeholder="10 Years Structural Hardwood Joinery Warranty..."
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none p-3 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium uppercase font-mono text-[#F5F0E8]">
            White-Glove Delivery
          </label>
          <textarea
            rows={3}
            value={values.delivery_info || ''}
            onChange={(e) => onChange({ delivery_info: e.target.value })}
            placeholder="Fully assembled white-glove doorstep delivery and setup..."
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none p-3 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none resize-none"
          />
        </div>
      </div>
    </div>
  )
}
