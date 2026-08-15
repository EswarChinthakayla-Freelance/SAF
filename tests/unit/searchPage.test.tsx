import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SearchPage } from '@/pages/public/SearchPage'
import type { ProductListItem } from '@/types/app'

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
      cover_image_path: null,
    },
  },
]

vi.mock('@/hooks/queries/useProducts', () => ({
  useProducts: (filters: { searchQuery?: string; search?: string }) => {
    const q = filters.search || filters.searchQuery
    if (q === 'teak') {
      return {
        data: { products: mockProducts, totalCount: 1, totalPages: 1 },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      }
    }
    if (q === 'nonexistent') {
      return {
        data: { products: [], totalCount: 0, totalPages: 1 },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      }
    }
    if (q === 'error-query') {
      return {
        data: null,
        isLoading: false,
        isError: true,
        error: new Error('PostgREST query failed'),
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

const renderSearchPage = (initialRoute = '/search') => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('SearchPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders pre-search state when no query is present in URL', () => {
    renderSearchPage('/search')

    expect(screen.getByRole('heading', { level: 1, name: 'Find Your Furniture' })).toBeDefined()
    expect(screen.getByText('Search our handcrafted catalogue')).toBeDefined()
    expect(screen.getByText('Browse All Furniture')).toBeDefined()
  })

  it('populates search input from ?q= parameter and displays search results', () => {
    renderSearchPage('/search?q=teak')

    const input = screen.getByLabelText('Search furniture pieces') as HTMLInputElement
    expect(input.value).toBe('teak')
    expect(screen.getByText(/1 piece found for "teak"/i)).toBeDefined()
    expect(screen.getByText('Teak Grand Dining Table')).toBeDefined()
    expect(screen.getByText('₹85,000')).toBeDefined()
  })

  it('displays empty results state when query matches zero products', () => {
    renderSearchPage('/search?q=nonexistent')

    expect(screen.getByText('No furniture found for “nonexistent”.')).toBeDefined()
  })

  it('clears query and resets to pre-search state when clear button is clicked', () => {
    renderSearchPage('/search?q=teak')

    const clearButton = screen.getByLabelText('Clear search query')
    fireEvent.click(clearButton)

    const input = screen.getByLabelText('Search furniture pieces') as HTMLInputElement
    expect(input.value).toBe('')
  })

  it('renders recoverable error state when search query fails', () => {
    renderSearchPage('/search?q=error-query')

    expect(screen.getByText("We couldn't complete your search.")).toBeDefined()
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeDefined()
    expect(screen.getByText('Browse Catalogue')).toBeDefined()
  })
})
