import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProductVisualViewerPage } from '@/pages/public/ProductVisualViewerPage'
import * as productsHook from '@/hooks/queries/useProducts'
import type { ProductWithRelations } from '@/types/app'

const mockProductDetail: ProductWithRelations = {
  id: 'prod-1',
  name: 'Royal Heritage Teak Bed',
  slug: 'royal-heritage-teak-bed',
  product_code: 'SAF-BED-001',
  price: 84000,
  compare_price: 95000,
  currency: 'INR',
  short_desc: 'Heirloom solid teak bed with master mortise joinery.',
  description: 'Full description',
  dimensions: '72 x 78 in',
  materials: 'Solid Teak',
  care_instructions: null,
  warranty_info: null,
  delivery_info: null,
  cover_image_path: 'products/bed-1.jpg',
  collection_id: 'col-1',
  is_published: true,
  sort_order: 1,
  published_at: '2026-01-01T00:00:00Z',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  collections: {
    id: 'col-1',
    name: 'Bedroom Collection',
    slug: 'bedroom',
    cover_image_path: null,
  },
  product_images: [
    {
      id: 'img-1',
      product_id: 'prod-1',
      storage_path: 'products/bed-1.jpg',
      alt_text: 'Royal Heritage Teak Bed Front View',
      sort_order: 1,
      is_cover: true,
      created_at: '2026-01-01T00:00:00Z',
    },
    {
      id: 'img-2',
      product_id: 'prod-1',
      storage_path: 'products/bed-2.jpg',
      alt_text: 'Royal Heritage Teak Bed Side Detail',
      sort_order: 2,
      is_cover: false,
      created_at: '2026-01-01T00:00:00Z',
    },
  ],
  product_variants: [],
  product_tags: [],
}

const renderWithRouter = (initialRoute = '/products/royal-heritage-teak-bed/view') => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/products/:slug/view" element={<ProductVisualViewerPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('ProductVisualViewerPage — Dedicated Full-Page Visual Inspector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders light-table topbar, image workspace, and thumbnail navigation', () => {
    vi.spyOn(productsHook, 'useProduct').mockReturnValue({
      data: mockProductDetail,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof productsHook.useProduct>)

    renderWithRouter()

    // 1. Topbar elements
    expect(screen.getByRole('heading', { level: 1, name: 'Royal Heritage Teak Bed' })).toBeInTheDocument()
    expect(screen.getByText('01 / 02')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Return to Royal Heritage Teak Bed/i })).toBeInTheDocument()

    // 2. Control Dock
    expect(screen.getByRole('button', { name: /Zoom in/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Zoom out/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Fit image to screen/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Reset view/i })).toBeInTheDocument()
  })

  it('navigates between thumbnails when clicking thumbnail buttons', () => {
    vi.spyOn(productsHook, 'useProduct').mockReturnValue({
      data: mockProductDetail,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof productsHook.useProduct>)

    renderWithRouter()

    const thumb2 = screen.getAllByRole('tab', { name: /View image 2 of 2/i })
    expect(thumb2.length).toBeGreaterThan(0)

    fireEvent.click(thumb2[0])
    expect(screen.getByText('02 / 02')).toBeInTheDocument()
  })

  it('supports zoom in, zoom out, fit, and reset controls', () => {
    vi.spyOn(productsHook, 'useProduct').mockReturnValue({
      data: mockProductDetail,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof productsHook.useProduct>)

    renderWithRouter()

    const zoomInBtn = screen.getByRole('button', { name: /Zoom in/i })
    const zoomOutBtn = screen.getByRole('button', { name: /Zoom out/i })
    const fitBtn = screen.getByRole('button', { name: /Fit image to screen/i })

    // Zoom in
    fireEvent.click(zoomInBtn)
    expect(screen.getByText('150%')).toBeInTheDocument()

    // Zoom in again
    fireEvent.click(zoomInBtn)
    expect(screen.getByText('200%')).toBeInTheDocument()

    // Zoom out
    fireEvent.click(zoomOutBtn)
    expect(screen.getByText('150%')).toBeInTheDocument()

    // Fit
    fireEvent.click(fitBtn)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('supports keyboard ArrowLeft / ArrowRight navigation', () => {
    vi.spyOn(productsHook, 'useProduct').mockReturnValue({
      data: mockProductDetail,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof productsHook.useProduct>)

    renderWithRouter()

    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByText('02 / 02')).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(screen.getByText('01 / 02')).toBeInTheDocument()
  })

  it('renders product details inside collapsible drawer when toggled', () => {
    vi.spyOn(productsHook, 'useProduct').mockReturnValue({
      data: mockProductDetail,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof productsHook.useProduct>)

    renderWithRouter()

    const infoToggleBtn = screen.getByRole('button', { name: /Toggle product info drawer/i })
    fireEvent.click(infoToggleBtn)

    expect(screen.getByText(/Creation Details/i)).toBeInTheDocument()
    expect(screen.getByText(/SAF-BED-001/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /View Full Product Page/i })).toHaveAttribute(
      'href',
      '/products/royal-heritage-teak-bed'
    )
  })

  it('renders error state when product is not found', () => {
    vi.spyOn(productsHook, 'useProduct').mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error('Product not found'),
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof productsHook.useProduct>)

    renderWithRouter()

    expect(screen.getByText(/Product Unavailable/i)).toBeInTheDocument()
  })
})
