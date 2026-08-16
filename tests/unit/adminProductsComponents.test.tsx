import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProductStatusBadge } from '@/components/admin/products/ProductStatusBadge'
import { ProductRowActions } from '@/components/admin/products/ProductRowActions'
import { AdminProductCard } from '@/components/admin/products/AdminProductCard'
import { AdminProductMobileRow } from '@/components/admin/products/AdminProductMobileRow'
import { AdminProductsPagination } from '@/components/admin/products/AdminProductsPagination'
import { AdminProductsFilterSheet } from '@/components/admin/products/AdminProductsFilterSheet'
import type { ProductListItem, CollectionRow } from '@/types/app'

const mockProduct: ProductListItem = {
  id: 'prod-42',
  name: 'Rosewood Sanctum Mandir',
  slug: 'rosewood-sanctum-mandir',
  product_code: 'SAF-MDR-042',
  price: 145000,
  compare_price: null,
  currency: 'INR',
  short_desc: 'Heirloom mandir cabinetry with brass inlays.',
  description: null,
  dimensions: null,
  materials: ['Indian Rosewood (Sheesham)'],
  care_instructions: null,
  warranty_info: null,
  delivery_info: null,
  cover_image_path: 'products/mandir.jpg',
  collection_id: 'col-temple',
  is_published: true,
  sort_order: 1,
  published_at: '2026-08-01T00:00:00Z',
  created_at: '2026-08-01T00:00:00Z',
  updated_at: '2026-08-16T12:00:00Z',
  collections: {
    id: 'col-temple',
    name: 'Sacred Sanctum',
    slug: 'sacred-sanctum',
    cover_image_path: null,
  },
}

const mockCollections: CollectionRow[] = [
  {
    id: 'col-temple',
    name: 'Sacred Sanctum',
    slug: 'sacred-sanctum',
    description: null,
    cover_image_path: null,
    sort_order: 1,
    is_active: true,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
]

describe('Admin Products Feature Components', () => {
  it('renders ProductStatusBadge in static and interactive mode', () => {
    const handleToggle = vi.fn()
    const { rerender } = render(
      <ProductStatusBadge isPublished={true} interactive={true} onToggle={handleToggle} />
    )

    const btn = screen.getByRole('button', { name: /Status: Published/i })
    expect(btn).toBeDefined()
    fireEvent.click(btn)
    expect(handleToggle).toHaveBeenCalledTimes(1)

    rerender(<ProductStatusBadge isPublished={false} interactive={false} />)
    expect(screen.getByText('Draft')).toBeDefined()
  })

  it('renders ProductRowActions with Edit button and dropdown items', () => {
    const handleDelete = vi.fn()
    const handleTogglePublish = vi.fn()

    render(
      <MemoryRouter>
        <ProductRowActions
          product={mockProduct}
          onDelete={handleDelete}
          onTogglePublish={handleTogglePublish}
        />
      </MemoryRouter>
    )

    expect(screen.getByRole('button', { name: 'Edit Rosewood Sanctum Mandir' })).toBeDefined()

    const moreBtn = screen.getByRole('button', { name: 'More actions for Rosewood Sanctum Mandir' })
    fireEvent.click(moreBtn)

    expect(screen.getByText('Edit Details')).toBeDefined()
    expect(screen.getByText('View on Website')).toBeDefined()
    expect(screen.getByText('Unpublish to Draft')).toBeDefined()
    expect(screen.getByText('Delete Product')).toBeDefined()

    const deleteItem = screen.getByText('Delete Product')
    fireEvent.click(deleteItem)
    expect(handleDelete).toHaveBeenCalledWith(mockProduct)
  })

  it('renders AdminProductCard in Grid view with details and image', () => {
    render(
      <MemoryRouter>
        <AdminProductCard
          product={mockProduct}
          onDelete={vi.fn()}
          onTogglePublish={vi.fn()}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Rosewood Sanctum Mandir')).toBeDefined()
    expect(screen.getByText('SAF-MDR-042')).toBeDefined()
    expect(screen.getByText('Sacred Sanctum')).toBeDefined()
    expect(screen.getByText('₹1,45,000')).toBeDefined()
    expect(screen.getByText('Edit Product')).toBeDefined()
  })

  it('renders AdminProductMobileRow with compact details', () => {
    render(
      <MemoryRouter>
        <AdminProductMobileRow
          product={mockProduct}
          onDelete={vi.fn()}
          onTogglePublish={vi.fn()}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Rosewood Sanctum Mandir')).toBeDefined()
    expect(screen.getByText('SAF-MDR-042')).toBeDefined()
    expect(screen.getByText('Sacred Sanctum')).toBeDefined()
    expect(screen.getByText('₹1,45,000')).toBeDefined()
  })

  it('renders AdminProductsPagination with correct page range and navigation buttons', () => {
    const handlePageChange = vi.fn()
    render(
      <AdminProductsPagination
        currentPage={2}
        totalPages={4}
        totalCount={60}
        pageSize={16}
        onPageChange={handlePageChange}
      />
    )

    expect(screen.getByText(/Showing/i)).toBeDefined()
    expect(screen.getByText('17–32')).toBeDefined()
    expect(screen.getByText('60')).toBeDefined()

    const prevBtn = screen.getByRole('button', { name: 'Previous page' })
    fireEvent.click(prevBtn)
    expect(handlePageChange).toHaveBeenCalledWith(1)

    const nextBtn = screen.getByRole('button', { name: 'Next page' })
    fireEvent.click(nextBtn)
    expect(handlePageChange).toHaveBeenCalledWith(3)
  })

  it('renders AdminProductsFilterSheet and applies filters', () => {
    const handleApply = vi.fn()
    const handleReset = vi.fn()

    render(
      <AdminProductsFilterSheet
        isOpen={true}
        onClose={vi.fn()}
        collections={mockCollections}
        selectedCollectionId=""
        selectedStatus="all"
        onApplyFilters={handleApply}
        onResetFilters={handleReset}
      />
    )

    expect(screen.getByText('Filter Products')).toBeDefined()
    const applyBtn = screen.getByRole('button', { name: 'Apply Filters' })
    fireEvent.click(applyBtn)

    expect(handleApply).toHaveBeenCalledWith({
      collectionId: '',
      status: 'all',
    })
  })
})
