import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FeaturedArchitecturalCreations } from '@/components/features/home/FeaturedArchitecturalCreations'
import * as productsHook from '@/hooks/queries/useProducts'
import * as reducedMotionHook from '@/hooks/useReducedMotionPreference'
import type { ProductListItem } from '@/types/app'

const mockFeaturedProducts: ProductListItem[] = [
  {
    id: 'prod-1',
    name: 'Royal Heritage Teak Bed',
    slug: 'royal-heritage-teak-bed',
    product_code: 'SAF-BED-001',
    price: 84000,
    compare_price: 95000,
    currency: 'INR',
    cover_image_path: 'products/bed-1.jpg',
    collection_id: 'col-1',
    is_published: true,
    sort_order: 1,
    created_at: '2026-01-01T00:00:00Z',
    collections: {
      id: 'col-1',
      name: 'Bedroom Collection',
      slug: 'bedroom',
    },
  },
  {
    id: 'prod-2',
    name: 'Teak Aerofoil Ceiling Fan',
    slug: 'teak-aerofoil-ceiling-fan',
    product_code: 'SAF-FAN-002',
    price: 24000,
    compare_price: null,
    currency: 'INR',
    cover_image_path: 'products/fan-1.jpg',
    collection_id: 'col-2',
    is_published: true,
    sort_order: 2,
    created_at: '2026-01-01T00:00:00Z',
    collections: {
      id: 'col-2',
      name: 'Fans Collection',
      slug: 'fans',
    },
  },
]

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('FeaturedArchitecturalCreations — "The Architectural Exhibition Stage"', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(reducedMotionHook, 'useReducedMotionPreference').mockReturnValue(false)
  })

  it('renders asymmetric section header and active exhibition plate', () => {
    vi.spyOn(productsHook, 'useFeaturedProducts').mockReturnValue({
      data: mockFeaturedProducts,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof productsHook.useFeaturedProducts>)

    renderWithProviders(<FeaturedArchitecturalCreations />)

    // 1. Heading & Eyebrow
    expect(
      screen.getByRole('heading', { level: 2, name: /Featured Architectural Creations/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/FEATURED \/\/ 04/i)).toBeInTheDocument()

    // 2. Active Creation
    expect(screen.getAllByText('Royal Heritage Teak Bed').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Bedroom Collection/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText('₹84,000').length).toBeGreaterThan(0)

    // 3. CTA Links (Explore Product & Inspect Creation)
    const exploreLinks = screen.getAllByRole('link', { name: /Explore Product/i })
    expect(exploreLinks[0]).toHaveAttribute('href', '/products/royal-heritage-teak-bed')

    const inspectLinks = screen.getAllByRole('link', { name: /Inspect/i })
    expect(inspectLinks[0]).toHaveAttribute('href', '/products/royal-heritage-teak-bed/view')
  })

  it('navigates to next featured product on next button click', () => {
    vi.spyOn(productsHook, 'useFeaturedProducts').mockReturnValue({
      data: mockFeaturedProducts,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof productsHook.useFeaturedProducts>)

    renderWithProviders(<FeaturedArchitecturalCreations />)

    const nextButtons = screen.getAllByRole('button', { name: /Next creation/i })
    fireEvent.click(nextButtons[0])

    // Second product should now be active
    expect(screen.getAllByText('Teak Aerofoil Ceiling Fan').length).toBeGreaterThan(0)
    expect(screen.getAllByText('₹24,000').length).toBeGreaterThan(0)
  })

  it('switches active creation on index rail click', () => {
    vi.spyOn(productsHook, 'useFeaturedProducts').mockReturnValue({
      data: mockFeaturedProducts,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof productsHook.useFeaturedProducts>)

    renderWithProviders(<FeaturedArchitecturalCreations />)

    const tab2 = screen.getByRole('tab', {
      name: /View featured product 2: Teak Aerofoil Ceiling Fan/i,
    })
    fireEvent.click(tab2)

    expect(screen.getAllByText('Teak Aerofoil Ceiling Fan').length).toBeGreaterThan(0)
  })

  it('supports keyboard ArrowLeft / ArrowRight navigation', () => {
    vi.spyOn(productsHook, 'useFeaturedProducts').mockReturnValue({
      data: mockFeaturedProducts,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof productsHook.useFeaturedProducts>)

    renderWithProviders(<FeaturedArchitecturalCreations />)

    const section = screen.getByLabelText(/Featured Architectural Creations/i, { selector: 'section' })

    fireEvent.keyDown(section, { key: 'ArrowRight' })
    expect(screen.getAllByText('Teak Aerofoil Ceiling Fan').length).toBeGreaterThan(0)

    fireEvent.keyDown(section, { key: 'ArrowLeft' })
    expect(screen.getAllByText('Royal Heritage Teak Bed').length).toBeGreaterThan(0)
  })

  it('renders curated showcase creations when query returns empty array', () => {
    vi.spyOn(productsHook, 'useFeaturedProducts').mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof productsHook.useFeaturedProducts>)

    renderWithProviders(<FeaturedArchitecturalCreations />)
    expect(
      screen.getByRole('heading', { level: 2, name: /Featured Architectural Creations/i })
    ).toBeInTheDocument()
    expect(screen.getAllByText('Royal Heritage Teak Bed').length).toBeGreaterThan(0)
  })

  it('renders loading skeleton while query is in flight', () => {
    vi.spyOn(productsHook, 'useFeaturedProducts').mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof productsHook.useFeaturedProducts>)

    const { container } = renderWithProviders(<FeaturedArchitecturalCreations />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })
})
