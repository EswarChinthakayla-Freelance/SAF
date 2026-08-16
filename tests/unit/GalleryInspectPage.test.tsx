import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GalleryInspectPage } from '@/pages/public/GalleryInspectPage'
import * as galleryHooks from '@/hooks/queries/useGallery'
import type { GalleryItemWithProduct } from '@/types/app'

const mockGalleryItem: GalleryItemWithProduct = {
  id: 'gal-101',
  storage_path: 'gallery/living-101.jpg',
  alt_text: 'Heritage Teak Spatial Lounge',
  room_type: 'Living Room',
  product_id: 'prod-teak-lounge',
  sort_order: 1,
  is_active: true,
  created_at: '2026-08-01T00:00:00Z',
  updated_at: '2026-08-01T00:00:00Z',
  products: {
    id: 'prod-teak-lounge',
    name: 'Royal Heritage Teak Lounge',
    slug: 'royal-heritage-teak-lounge',
    is_published: true,
  },
}

const mockGalleryList: GalleryItemWithProduct[] = [
  mockGalleryItem,
  {
    id: 'gal-102',
    storage_path: 'gallery/bedroom-102.jpg',
    alt_text: 'Sanctuary Master Bedroom Suite',
    room_type: 'Bedroom',
    product_id: null,
    sort_order: 2,
    is_active: true,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
    products: null,
  },
]

describe('GalleryInspectPage Component', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
  })

  const renderWithRouter = (initialRoute = '/gallery/frame/gal-101') => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route path="/gallery/frame/:id" element={<GalleryInspectPage />} />
            <Route path="/gallery" element={<div>Gallery List</div>} />
            <Route path="/products/:slug" element={<div>Product Detail</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('renders topbar with image title, room type, and sequence counter', () => {
    vi.spyOn(galleryHooks, 'useGalleryItem').mockReturnValue({
      data: mockGalleryItem,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof galleryHooks.useGalleryItem>)

    vi.spyOn(galleryHooks, 'useGalleryList').mockReturnValue({
      data: mockGalleryList,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof galleryHooks.useGalleryList>)

    renderWithRouter()

    expect(screen.getByRole('heading', { level: 1, name: /Heritage Teak Spatial Lounge/i })).toBeInTheDocument()
    expect(screen.getByText('01 / 02')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Return to Inspiration Gallery/i })).toBeInTheDocument()
  })

  it('renders dock controls and supports zoom actions', () => {
    vi.spyOn(galleryHooks, 'useGalleryItem').mockReturnValue({
      data: mockGalleryItem,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof galleryHooks.useGalleryItem>)

    vi.spyOn(galleryHooks, 'useGalleryList').mockReturnValue({
      data: mockGalleryList,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof galleryHooks.useGalleryList>)

    renderWithRouter()

    expect(screen.getByText('100%')).toBeInTheDocument()

    const zoomInBtn = screen.getByRole('button', { name: /Zoom in/i })
    const zoomOutBtn = screen.getByRole('button', { name: /Zoom out/i })
    const fitBtn = screen.getByRole('button', { name: /Fit image to screen/i })

    fireEvent.click(zoomInBtn)
    expect(screen.getByText('150%')).toBeInTheDocument()

    fireEvent.click(zoomInBtn)
    expect(screen.getByText('200%')).toBeInTheDocument()

    fireEvent.click(zoomOutBtn)
    expect(screen.getByText('150%')).toBeInTheDocument()

    fireEvent.click(fitBtn)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('opens and closes info drawer with linked product specifications', () => {
    vi.spyOn(galleryHooks, 'useGalleryItem').mockReturnValue({
      data: mockGalleryItem,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof galleryHooks.useGalleryItem>)

    vi.spyOn(galleryHooks, 'useGalleryList').mockReturnValue({
      data: mockGalleryList,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof galleryHooks.useGalleryList>)

    renderWithRouter()

    const toggleBtn = screen.getByRole('button', { name: /Toggle frame specifications drawer/i })
    fireEvent.click(toggleBtn)

    expect(screen.getByText('Frame Details')).toBeInTheDocument()
    expect(screen.getByText('Royal Heritage Teak Lounge')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Explore Related Product/i })).toHaveAttribute(
      'href',
      '/products/royal-heritage-teak-lounge'
    )
  })

  it('renders error state when gallery item is not found', () => {
    vi.spyOn(galleryHooks, 'useGalleryItem').mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error('Frame not found'),
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof galleryHooks.useGalleryItem>)

    vi.spyOn(galleryHooks, 'useGalleryList').mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof galleryHooks.useGalleryList>)

    renderWithRouter()

    expect(screen.getByText('Inspiration Frame Unavailable')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Return to Gallery/i })).toBeInTheDocument()
  })
})
