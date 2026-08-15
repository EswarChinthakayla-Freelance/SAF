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

describe('AdminProductsPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders products table with thumbnail, title, product code, price, and publish toggle', () => {
    renderProductsPage()

    expect(screen.getByText('Teak Grand Dining Table')).toBeDefined()
    expect(screen.getByText('SAF-DT-101')).toBeDefined()
    expect(screen.getAllByText('Dining & Banquet')[0]).toBeDefined()
    expect(screen.getByText('₹85,000')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Published' })).toBeDefined()
  })

  it('triggers togglePublish mutation when publish status button is clicked', () => {
    renderProductsPage()

    const publishBtn = screen.getByRole('button', { name: 'Published' })
    fireEvent.click(publishBtn)

    expect(mockTogglePublish).toHaveBeenCalledWith({
      id: 'prod-1',
      is_published: false,
    })
  })

  it('opens delete confirmation dialog when Delete button is clicked', () => {
    renderProductsPage()

    const deleteBtn = screen.getByRole('button', { name: 'Delete' })
    fireEvent.click(deleteBtn)

    expect(screen.getByRole('heading', { level: 3 })).toBeDefined()
    expect(
      screen.getByText(/Are you sure you want to permanently delete "Teak Grand Dining Table"/i)
    ).toBeDefined()
  })

  it('updates autoslug when title changes and preserves manual slug override', async () => {
    const { BasicInfoSection } = await import('@/components/admin/product-form/BasicInfoSection')
    const handleChange = vi.fn()

    render(
      <BasicInfoSection
        values={{
          name: '',
          slug: '',
          product_code: '',
          collection_id: null,
          short_desc: '',
          description: '',
        }}
        onChange={handleChange}
        collections={mockCollections}
      />
    )

    const titleInput = screen.getByPlaceholderText(/e\.g\. Grand Teak/i)
    fireEvent.change(titleInput, { target: { value: 'Royal Teak Bed' } })

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Royal Teak Bed',
        slug: 'royal-teak-bed',
      })
    )

    // Manual slug override
    const slugInput = screen.getByPlaceholderText(/grand-teak-heritage/i)
    fireEvent.change(slugInput, { target: { value: 'custom-teak-bed' } })
    expect(handleChange).toHaveBeenCalledWith({ slug: 'custom-teak-bed' })
  })

  it('supports image reordering, alt text editing, and cover selection in MediaSection', async () => {
    const { MediaSection } = await import('@/components/admin/product-form/MediaSection')
    const handleSetCover = vi.fn()
    const handleUpdateAlt = vi.fn()
    const handleDelete = vi.fn()
    const handleReorder = vi.fn()

    const mockImages = [
      {
        id: 'img-1',
        product_id: 'p1',
        storage_path: 'products/img1.jpg',
        alt_text: 'Image One',
        sort_order: 0,
        is_cover: true,
        created_at: '2026-08-01T00:00:00Z',
      },
      {
        id: 'img-2',
        product_id: 'p1',
        storage_path: 'products/img2.jpg',
        alt_text: 'Image Two',
        sort_order: 1,
        is_cover: false,
        created_at: '2026-08-01T00:00:00Z',
      },
    ]

    render(
      <MediaSection
        images={mockImages}
        onUploadImages={vi.fn()}
        onSetCover={handleSetCover}
        onUpdateAltText={handleUpdateAlt}
        onDeleteImage={handleDelete}
        onReorderImage={handleReorder}
      />
    )

    expect(screen.getByText('Cover Image')).toBeDefined()
    expect(screen.getByText('Product Images (2)')).toBeDefined()

    // Click Set as Cover on second image
    const setCoverBtn = screen.getByRole('button', { name: /Set image 2 as cover/i })
    fireEvent.click(setCoverBtn)
    expect(handleSetCover).toHaveBeenCalledWith('img-2')

    // Click Move Down on first image
    const moveDownBtn = screen.getByRole('button', { name: /Move image 1 down/i })
    fireEvent.click(moveDownBtn)
    expect(handleReorder).toHaveBeenCalledWith(0, 1)
  })
})
