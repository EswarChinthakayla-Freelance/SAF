import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage'
import type { ProductListItem, CollectionRow } from '@/types/app'

const mockProducts: ProductListItem[] = [
  {
    id: 'prod-1',
    name: 'Teak Grand Dining Table',
    slug: 'teak-grand-dining-table',
    product_code: 'SAF-DT-101',
    price: 85000,
    compare_price: null,
    currency: 'INR',
    short_desc: 'Bespoke 8-seater dining table in solid Burma Teak.',
    description: null,
    dimensions: null,
    materials: ['Solid Burma Teak'],
    care_instructions: null,
    warranty_info: null,
    delivery_info: null,
    cover_image_path: 'products/dining-table.jpg',
    collection_id: 'col-1',
    is_published: true,
    sort_order: 1,
    published_at: null,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
    collections: {
      id: 'col-1',
      name: 'Dining & Banquet',
      slug: 'dining-banquet',
      cover_image_path: null,
    },
  },
]

const mockCollections: CollectionRow[] = [
  {
    id: 'col-1',
    name: 'Dining & Banquet',
    slug: 'dining-banquet',
    description: null,
    cover_image_path: null,
    sort_order: 1,
    is_active: true,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
]

const mockTogglePublish = vi.fn()
const mockDeleteProduct = vi.fn()

vi.mock('@/hooks/queries/useProducts', () => ({
  useAdminProducts: () => ({
    data: { products: mockProducts, totalCount: 1, totalPages: 1 },
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
}))

vi.mock('@/hooks/queries/useCollections', () => ({
  useCollections: () => ({
    data: mockCollections,
    isLoading: false,
    isError: false,
    error: null,
  }),
}))

vi.mock('@/hooks/mutations/useProductMutations', () => ({
  useProductMutations: () => ({
    togglePublish: {
      mutate: mockTogglePublish,
      isPending: false,
    },
    deleteProduct: {
      mutateAsync: mockDeleteProduct,
      isPending: false,
    },
  }),
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const renderProductsPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AdminProductsPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('AdminProductsPage Component — "The Product Workspace"', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders products workspace header with Inter title, count, and Add Product CTA', () => {
    renderProductsPage()

    expect(screen.getByRole('heading', { level: 1, name: 'Products' })).toBeDefined()
    expect(screen.getByText('1 product')).toBeDefined()
    expect(screen.getByRole('button', { name: /Add Product/i })).toBeDefined()
    expect(screen.getByPlaceholderText('Search by product name or code…')).toBeDefined()
  })

  it('renders products table with thumbnail, title, product code, price, and publish toggle', () => {
    renderProductsPage()

    expect(screen.getAllByText('Teak Grand Dining Table')[0]).toBeDefined()
    expect(screen.getAllByText('SAF-DT-101')[0]).toBeDefined()
    expect(screen.getAllByText('Dining & Banquet')[0]).toBeDefined()
    expect(screen.getAllByText('₹85,000')[0]).toBeDefined()
    expect(screen.getAllByRole('button', { name: /Status: Published/i })[0]).toBeDefined()
  })

  it('switches between List View and Grid View when view switcher buttons are clicked', () => {
    renderProductsPage()

    const gridBtn = screen.getByRole('radio', { name: 'Grid view' })
    fireEvent.click(gridBtn)

    expect(gridBtn.getAttribute('aria-checked')).toBe('true')
    expect(localStorage.getItem('admin-products-view')).toBe('grid')

    // Switch back to list
    const listBtn = screen.getByRole('radio', { name: 'List view' })
    fireEvent.click(listBtn)
    expect(listBtn.getAttribute('aria-checked')).toBe('true')
    expect(localStorage.getItem('admin-products-view')).toBe('list')
  })

  it('triggers togglePublish mutation when publish status badge/button is clicked', () => {
    renderProductsPage()

    const publishBtn = screen.getAllByRole('button', { name: /Status: Published/i })[0]
    fireEvent.click(publishBtn)

    expect(mockTogglePublish).toHaveBeenCalledWith({
      id: 'prod-1',
      is_published: false,
    })
  })

  it('opens delete confirmation dialog when Delete action is triggered', () => {
    renderProductsPage()

    // Open More dropdown
    const moreBtn = screen.getAllByRole('button', { name: /More actions for Teak Grand Dining Table/i })[0]
    fireEvent.click(moreBtn)

    const deleteMenuItem = screen.getByText('Delete Product')
    fireEvent.click(deleteMenuItem)

    expect(screen.getByRole('heading', { name: /Delete “Teak Grand Dining Table”/i })).toBeDefined()
    expect(
      screen.getByText(/Are you sure you want to permanently delete "Teak Grand Dining Table"/i)
    ).toBeDefined()
  })
})
