import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminProductPreviewPage } from '@/pages/admin/AdminProductPreviewPage'
import type { ProductWithRelations } from '@/types/app'

const mockProduct: ProductWithRelations = {
  id: 'prod-123',
  name: 'Heritage Teak Four-Poster Bed',
  slug: 'heritage-teak-four-poster-bed',
  product_code: 'SAF-BED-789',
  price: 185000,
  compare_price: 210000,
  currency: 'INR',
  short_desc: 'Handcrafted four-poster architectural bed in mature plantation Teak.',
  description: 'Meticulously crafted with traditional mortise-and-tenon joinery and brass accents.\nDesigned to last generations.',
  dimensions: { length: 215, width: 195, height: 210, unit: 'cm' },
  materials: ['Burma Teak', 'Solid Brass Inlay', 'Hand-rubbed Linseed Oil'],
  care_instructions: 'Dust regularly with soft dry microfiber. Condition wood annually.',
  warranty_info: '10-year structural integrity guarantee on solid teak timber joints.',
  delivery_info: 'White-glove room-of-choice delivery and full assembly included across South India.',
  cover_image_path: 'products/bed-cover.jpg',
  collection_id: 'col-royal',
  is_published: true,
  sort_order: 3,
  published_at: '2026-08-01T10:00:00Z',
  created_at: '2026-08-01T00:00:00Z',
  updated_at: '2026-08-16T12:00:00Z',
  collections: {
    id: 'col-royal',
    name: 'Royal Heritage Suite',
    slug: 'royal-heritage-suite',
    cover_image_path: null,
  },
  product_images: [
    {
      id: 'img-1',
      product_id: 'prod-123',
      storage_path: 'products/bed-cover.jpg',
      alt_text: 'Hero perspective of four-poster teak bed',
      sort_order: 0,
      is_cover: true,
      created_at: '2026-08-01T00:00:00Z',
    },
    {
      id: 'img-2',
      product_id: 'prod-123',
      storage_path: 'products/bed-detail.jpg',
      alt_text: 'Detail joinery and brass post finial',
      sort_order: 1,
      is_cover: false,
      created_at: '2026-08-01T00:00:00Z',
    },
  ],
  product_variants: [
    {
      id: 'var-king',
      product_id: 'prod-123',
      label: 'King (78x72 in)',
      sku: 'SAF-BED-789-K',
      material: 'Burma Teak',
      color: 'Natural Honey Teak',
      size_label: 'King Size',
      price: 185000,
      compare_price: 210000,
      stock_status: 'in_stock',
      sort_order: 0,
      created_at: '2026-08-01T00:00:00Z',
      updated_at: '2026-08-01T00:00:00Z',
    },
    {
      id: 'var-queen',
      product_id: 'prod-123',
      label: 'Queen (72x60 in)',
      sku: 'SAF-BED-789-Q',
      material: 'Burma Teak',
      color: 'Dark Walnut Finish',
      size_label: 'Queen Size',
      price: 165000,
      compare_price: null,
      stock_status: 'made_to_order',
      sort_order: 1,
      created_at: '2026-08-01T00:00:00Z',
      updated_at: '2026-08-01T00:00:00Z',
    },
  ],
  product_tags: [
    {
      tag_id: 'tag-luxury',
      tags: { id: 'tag-luxury', name: 'Master Bedroom', slug: 'master-bedroom' },
    },
    {
      tag_id: 'tag-teak',
      tags: { id: 'tag-teak', name: 'Solid Teak', slug: 'solid-teak' },
    },
  ],
}

let mockQueryData: ProductWithRelations | null = mockProduct
let mockIsLoading = false
let mockIsError = false

const mockTogglePublish = vi.fn()
const mockDeleteProduct = vi.fn()

vi.mock('@/hooks/queries/useProducts', () => ({
  useAdminProduct: () => ({
    data: mockQueryData,
    isLoading: mockIsLoading,
    isError: mockIsError,
    error: mockIsError ? new Error('Product not found') : null,
    refetch: vi.fn(),
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

const renderPreviewPage = (initialRoute = '/admin/products/prod-123/preview') => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/admin/products/:id/preview" element={<AdminProductPreviewPage />} />
          <Route path="/admin/products/:id" element={<div>Product Edit Page</div>} />
          <Route path="/admin/products" element={<div>Products Catalogue Page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('AdminProductPreviewPage — "The Product Inspector"', () => {
  beforeEach(() => {
    mockQueryData = mockProduct
    mockIsLoading = false
    mockIsError = false
    vi.clearAllMocks()
  })

  it('renders loading skeleton when query is in flight', () => {
    mockIsLoading = true
    renderPreviewPage()
    expect(screen.getByLabelText(/Loading product preview/i)).toBeDefined()
  })

  it('renders complete Product Inspector header, price, collection, and breadcrumb', () => {
    renderPreviewPage()

    // Title and Inspector badge
    expect(screen.getByRole('heading', { level: 1, name: 'Heritage Teak Four-Poster Bed' })).toBeDefined()
    expect(screen.getByText('Product Inspector')).toBeDefined()

    // Status and SKU
    expect(screen.getAllByText(/SAF-BED-789/)[0]).toBeDefined()
    expect(screen.getAllByText('Royal Heritage Suite')[0]).toBeDefined()

    // Price
    expect(screen.getAllByText('₹1,85,000')[0]).toBeDefined()
    expect(screen.getAllByText('₹2,10,000')[0]).toBeDefined()

    // Primary action
    expect(screen.getAllByRole('button', { name: 'Edit Product' })[0]).toBeDefined()
  })

  it('renders media stage with active image and thumbnail strip', () => {
    renderPreviewPage()

    const heroImg = screen.getAllByAltText('Hero perspective of four-poster teak bed')[0]
    expect(heroImg).toBeDefined()

    expect(screen.getByLabelText(/View image 1 of 2/i)).toBeDefined()
    expect(screen.getByLabelText(/View image 2 of 2/i)).toBeDefined()
    expect(screen.getAllByText('Catalogue Cover')[0]).toBeDefined()
  })

  it('renders structured specifications without raw JSON and preserves paragraphs', () => {
    renderPreviewPage()

    // Description text
    expect(screen.getByText(/traditional mortise-and-tenon joinery/i)).toBeDefined()

    // Formatted dimensions
    expect(screen.getByText('Architectural Dimensions')).toBeDefined()
    expect(screen.getByText('195')).toBeDefined() // Width
    expect(screen.getByText('215')).toBeDefined() // Depth
    expect(screen.getByText('210')).toBeDefined() // Height

    // Materials
    expect(screen.getAllByText('Burma Teak')[0]).toBeDefined()
    expect(screen.getByText('Solid Brass Inlay')).toBeDefined()

    // Care, Warranty, Delivery
    expect(screen.getByText(/Dust regularly with soft dry microfiber/i)).toBeDefined()
    expect(screen.getByText(/10-year structural integrity guarantee/i)).toBeDefined()
    expect(screen.getByText(/White-glove room-of-choice delivery/i)).toBeDefined()
  })

  it('renders structured variants table with stocks status pills', () => {
    renderPreviewPage()

    expect(screen.getByText(/Configured Variants \(2\)/i)).toBeDefined()
    expect(screen.getAllByText('King (78x72 in)')[0]).toBeDefined()
    expect(screen.getAllByText('SAF-BED-789-K')[0]).toBeDefined()
    expect(screen.getAllByText('In Stock')[0]).toBeDefined()

    expect(screen.getAllByText('Queen (72x60 in)')[0]).toBeDefined()
    expect(screen.getAllByText('SAF-BED-789-Q')[0]).toBeDefined()
    expect(screen.getAllByText('Made to Order')[0]).toBeDefined()
  })

  it('renders discovery tags and public presentation checklist', () => {
    renderPreviewPage()

    // Tags
    expect(screen.getByText('Master Bedroom')).toBeDefined()
    expect(screen.getByText('Solid Teak')).toBeDefined()

    // Readiness Checklist
    expect(screen.getByText('Public Presentation & Catalogue Readiness')).toBeDefined()
    expect(screen.getByText('Cover Photography')).toBeDefined()
    expect(screen.getByText('Base Valuation')).toBeDefined()
    expect(screen.getByText('Collection Chapter')).toBeDefined()
  })

  it('navigates to Edit page on clicking Edit Product button', () => {
    renderPreviewPage()

    const editBtn = screen.getAllByRole('button', { name: 'Edit Product' })[0]
    fireEvent.click(editBtn)

    expect(screen.getByText('Product Edit Page')).toBeDefined()
  })

  it('opens delete confirmation and executes deletion', async () => {
    renderPreviewPage()

    const moreBtn = screen.getByRole('button', { name: 'More actions for Heritage Teak Four-Poster Bed' })
    fireEvent.click(moreBtn)

    const deleteMenuItem = screen.getByText('Delete Product')
    fireEvent.click(deleteMenuItem)

    // Dialog appears
    expect(screen.getByText(/Are you sure you want to permanently delete/i)).toBeDefined()

    const confirmBtns = screen.getAllByRole('button', { name: 'Delete Product' })
    const confirmBtn = confirmBtns[confirmBtns.length - 1]
    fireEvent.click(confirmBtn)

    expect(mockDeleteProduct).toHaveBeenCalledWith('prod-123')
  })

  it('renders ErrorState when product record is not found', () => {
    mockQueryData = null
    mockIsError = true

    renderPreviewPage()

    expect(screen.getByText('Product Record Not Found')).toBeDefined()
    expect(screen.getByText('Return to Products Catalogue')).toBeDefined()
  })
})
