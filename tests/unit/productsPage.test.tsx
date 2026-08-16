import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProductPlate } from '@/components/features/products/ProductPlate'
import { ProductCard } from '@/components/features/products/ProductCard'
import { ProductGrid } from '@/components/features/products/ProductGrid'
import { CatalogueCommandBar } from '@/components/features/products/CatalogueCommandBar'
import { ActiveFilterRail } from '@/components/features/products/ActiveFilterRail'
import { ProductPagination } from '@/components/features/products/ProductPagination'
import type { ProductListItem } from '@/types/app'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

const mockProduct: ProductListItem = {
  id: 'prod-1',
  name: 'Aurelia Solid Teak Lounge Chair',
  slug: 'aurelia-solid-teak-lounge-chair',
  price: 48000,
  compare_price: 55000,
  currency: 'INR',
  cover_image_path: 'products/aurelia.jpg',
  collection_id: 'col-1',
  is_published: true,
  sort_order: 1,
  product_code: 'SAF-LC-01',
  short_desc: 'Sculpted solid Burma teak lounge chair.',
  description: 'Handcrafted armchair with woven cane backrest.',
  dimensions: {},
  materials: ['Solid Burma Teak', 'Cane'],
  care_instructions: null,
  warranty_info: '5-year structural warranty',
  delivery_info: 'White-glove delivery across India',
  published_at: '2026-08-01T00:00:00Z',
  created_at: '2026-08-01T00:00:00Z',
  updated_at: '2026-08-01T00:00:00Z',
  collections: {
    id: 'col-1',
    name: 'Living Room',
    slug: 'living-room',
    cover_image_path: null,
  },
}

describe('The Furniture Index — Products Catalogue Components', () => {
  it('renders ProductPlate and ProductCard with plate numbering, collection, and price', () => {
    const { unmount } = renderWithProviders(<ProductPlate product={mockProduct} index={0} />)

    expect(screen.getByText('Aurelia Solid Teak Lounge Chair')).toBeDefined()
    expect(screen.getByText('PLATE 001')).toBeDefined()
    expect(screen.getAllByText('Living Room').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('₹48,000')).toBeDefined()
    expect(screen.getByText('₹55,000')).toBeDefined()
    expect(screen.getByText(/View Piece/i)).toBeDefined()
    unmount()

    // Test ProductCard wrapper
    renderWithProviders(<ProductCard product={mockProduct} index={1} />)
    expect(screen.getByText('PLATE 002')).toBeDefined()
  })

  it('renders CatalogueCommandBar with piece count, search input, and filter toggle', () => {
    const handleSortChange = vi.fn()
    const handleToggleAtelier = vi.fn()
    const handleOpenMobile = vi.fn()

    renderWithProviders(
      <CatalogueCommandBar
        totalCount={24}
        sort="curated"
        onSortChange={handleSortChange}
        isFilterAtelierOpen={false}
        onToggleFilterAtelier={handleToggleAtelier}
        onOpenMobileFilters={handleOpenMobile}
        activeFilterCount={2}
        searchQuery=""
      />
    )

    expect(screen.getByText('24')).toBeDefined()
    expect(screen.getByText(/Pieces Available/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /Toggle catalogue filters panel/i })).toBeDefined()
    expect(screen.getByPlaceholderText(/Search furniture/i)).toBeDefined()
  })

  it('renders ActiveFilterRail with removable filter chips and clear all button', () => {
    const handleRemoveCollection = vi.fn()
    const handleRemoveTag = vi.fn()
    const handleClearAll = vi.fn()

    renderWithProviders(
      <ActiveFilterRail
        filters={{ collection: 'living-room', tags: ['teak'] }}
        collections={[{ id: 'col-1', name: 'Living Room', slug: 'living-room', description: null, cover_image_path: null, cover_image_alt: null, sort_order: 1, is_active: true, created_at: '', updated_at: '' }]}
        tags={[{ id: 't-1', name: 'Solid Teak', slug: 'teak' }]}
        onRemoveCollection={handleRemoveCollection}
        onRemoveTag={handleRemoveTag}
        onRemovePrice={vi.fn()}
        onRemoveAvailability={vi.fn()}
        onRemoveSearch={vi.fn()}
        onClearAll={handleClearAll}
      />
    )

    expect(screen.getByText('Living Room')).toBeDefined()
    expect(screen.getByText('Solid Teak')).toBeDefined()

    const clearAllButton = screen.getByText('Clear All')
    fireEvent.click(clearAllButton)
    expect(handleClearAll).toHaveBeenCalledTimes(1)
  })

  it('renders ProductGrid with empty state and clear filters action when filtered', () => {
    const handleClear = vi.fn()

    renderWithProviders(
      <ProductGrid
        products={[]}
        isFiltered={true}
        onClearFilters={handleClear}
      />
    )

    expect(screen.getByText('No pieces match this selection.')).toBeDefined()
    const clearButton = screen.getByText('Clear Filters')
    fireEvent.click(clearButton)
    expect(handleClear).toHaveBeenCalledTimes(1)
  })

  it('renders ProductPagination with page numbers and handles page clicks', () => {
    const handlePageChange = vi.fn()

    renderWithProviders(
      <ProductPagination
        currentPage={2}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    )

    const prevButton = screen.getByRole('button', { name: /previous/i })
    fireEvent.click(prevButton)
    expect(handlePageChange).toHaveBeenCalledWith(1)

    const nextButton = screen.getByRole('button', { name: /next/i })
    fireEvent.click(nextButton)
    expect(handlePageChange).toHaveBeenCalledWith(3)
  })
})
