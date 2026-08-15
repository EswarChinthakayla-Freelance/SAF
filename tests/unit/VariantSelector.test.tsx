import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VariantSelector } from '@/components/features/products/VariantSelector'
import type { ProductVariantRow } from '@/types/app'

describe('VariantSelector component', () => {
  const sampleVariants: ProductVariantRow[] = [
    {
      id: 'v-1',
      product_id: 'prod-1',
      label: 'Standard Antique Honey',
      sku: 'SAF-V1',
      material: 'Burma Teak',
      color: 'Honey Polish',
      size_label: '48" x 24"',
      price: 185000,
      compare_price: null,
      stock_status: 'in_stock',
      sort_order: 0,
    },
    {
      id: 'v-2',
      product_id: 'prod-1',
      label: 'Grand Imperial Rosewood',
      sku: 'SAF-V2',
      material: 'East Indian Rosewood',
      color: 'Natural Dark Oil',
      size_label: '60" x 30"',
      price: 245000,
      compare_price: null,
      stock_status: 'made_to_order',
      sort_order: 1,
    },
  ]

  it('renders all variants with material and dimension details', () => {
    render(
      <VariantSelector
        variants={sampleVariants}
        selectedVariant={sampleVariants[0]}
        onSelectVariant={vi.fn()}
        basePrice={185000}
      />
    )

    expect(screen.getByText('Standard Antique Honey')).toBeDefined()
    expect(screen.getByText('Grand Imperial Rosewood')).toBeDefined()
    expect(screen.getByText('Burma Teak')).toBeDefined()
  })

  it('calls onSelectVariant when user clicks a variant chip', () => {
    const handleSelect = vi.fn()
    render(
      <VariantSelector
        variants={sampleVariants}
        selectedVariant={sampleVariants[0]}
        onSelectVariant={handleSelect}
        basePrice={185000}
      />
    )

    const rosewoodVariant = screen.getByText('Grand Imperial Rosewood')
    fireEvent.click(rosewoodVariant)
    expect(handleSelect).toHaveBeenCalledWith(sampleVariants[1])
  })
})
