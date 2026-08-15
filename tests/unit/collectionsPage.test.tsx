import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CollectionsPage } from '@/pages/public/CollectionsPage'
import { CollectionDetailPage } from '@/pages/public/CollectionDetailPage'
import type { CollectionRow, ProductListItem } from '@/types/app'

const mockCollections: CollectionRow[] = [
  {
    id: 'col-1',
    name: 'Living Sanctuary',
    slug: 'living-sanctuary',
    description: 'Sculpted teak and rosewood seating for serene living areas.',
    cover_image_path: 'collections/living.jpg',
    cover_image_alt: 'Living Sanctuary Collection',
    sort_order: 1,
    is_active: true,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 'col-2',
    name: 'Dining & Banquet',
    slug: 'dining-banquet',
    description: 'Generational solid hardwood dining tables and chairs.',
    cover_image_path: 'collections/dining.jpg',
    cover_image_alt: 'Dining & Banquet Collection',
    sort_order: 2,
    is_active: true,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
]

const mockProducts: ProductListItem[] = [
  {
    id: 'prod-1',
    name: 'Teak Grand Dining Table',
    slug: 'teak-grand-dining-table',
    product_code: 'SAF-DT-101',
    price: 85000,
    compare_price: null,
    currency: 'INR',
    short_desc: 'Bespoke 8-seater dining table in Burma Teak.',
    description: null,
    dimensions: null,
    materials: ['Solid Burma Teak'],
    care_instructions: null,
    warranty_info: null,
    delivery_info: null,
    cover_image_path: 'products/dining-table.jpg',
    collection_id: 'col-2',
    is_published: true,
    sort_order: 1,
    published_at: null,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
    collections: {
      id: 'col-2',
      name: 'Dining & Banquet',
      slug: 'dining-banquet',
      cover_image_path: 'collections/dining.jpg',
    },
  },
]

vi.mock('@/hooks/queries/useCollections', () => ({
  useCollections: () => ({
    data: mockCollections,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
  useCollection: (slug?: string) => {
    if (slug === 'dining-banquet') {
      return {
        data: mockCollections[1],
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      }
    }
    if (slug === 'empty-collection') {
      return {
        data: { ...mockCollections[0], slug: 'empty-collection', name: 'Empty Collection' },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      }
    }
    if (slug === 'not-found') {
      return { data: null, isLoading: false, isError: false, error: null, refetch: vi.fn() }
    }
    return { data: null, isLoading: false, isError: true, error: new Error('Network error'), refetch: vi.fn() }
  },
}))

vi.mock('@/hooks/queries/useProducts', () => ({
  useProducts: (filters: { collection?: string }) => {
    if (filters.collection === 'dining-banquet') {
      return {
        data: { products: mockProducts, totalCount: 1, totalPages: 1 },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      }
    }
    return {
      data: { products: [], totalCount: 0, totalPages: 1 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    }
  },
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const renderWithRouter = (ui: React.ReactElement, initialRoute = '/') => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('CollectionsPage and CollectionDetailPage Components', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders CollectionsPage with header, active collection cards, and links', () => {
    renderWithRouter(<CollectionsPage />, '/collections')

    expect(screen.getByRole('heading', { level: 1, name: 'Furniture for Every Space' })).toBeDefined()
    expect(screen.getByText('Living Sanctuary')).toBeDefined()
    expect(screen.getByText('Dining & Banquet')).toBeDefined()
    expect(screen.getAllByText('Discover Collection').length).toBe(2)
  })

  it('renders CollectionDetailPage with cover hero, description, and filtered ProductGrid', () => {
    renderWithRouter(
      <Routes>
        <Route path="/collections/:slug" element={<CollectionDetailPage />} />
      </Routes>,
      '/collections/dining-banquet'
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Dining & Banquet' })).toBeDefined()
    expect(screen.getByText('Generational solid hardwood dining tables and chairs.')).toBeDefined()
    expect(screen.getByText('Teak Grand Dining Table')).toBeDefined()
    expect(screen.getByText('₹85,000')).toBeDefined()
  })

  it('renders empty state when collection has no published products', () => {
    renderWithRouter(
      <Routes>
        <Route path="/collections/:slug" element={<CollectionDetailPage />} />
      </Routes>,
      '/collections/empty-collection'
    )

    expect(screen.getByText('No pieces are currently available in this collection.')).toBeDefined()
    expect(screen.getByText('Browse All Furniture')).toBeDefined()
  })

  it('renders not found state when collection slug does not exist', () => {
    renderWithRouter(
      <Routes>
        <Route path="/collections/:slug" element={<CollectionDetailPage />} />
      </Routes>,
      '/collections/not-found'
    )

    expect(screen.getByText('Collection Not Found')).toBeDefined()
    expect(screen.getByText('Explore All Collections')).toBeDefined()
  })
})
