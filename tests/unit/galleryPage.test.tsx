import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GalleryPage } from '@/pages/public/GalleryPage'
import { GalleryFilterRail } from '@/components/features/gallery/GalleryFilterRail'
import type { GalleryItemWithProduct } from '@/types/app'

const mockGalleryImages: GalleryItemWithProduct[] = [
  {
    id: 'gal-1',
    storage_path: 'gallery/living-1.jpg',
    alt_text: 'Sculpted Burma Teak Living Room',
    room_type: 'Living Room',
    product_id: 'prod-101',
    sort_order: 1,
    is_active: true,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
    products: {
      id: 'prod-101',
      name: 'Royal Burma Teak Lounge Chair',
      slug: 'royal-burma-teak-lounge-chair',
      is_published: true,
    },
  },
  {
    id: 'gal-2',
    storage_path: 'gallery/bedroom-1.jpg',
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

vi.mock('@/hooks/queries/useGallery', () => ({
  useGallery: (roomSlug?: string) => {
    if (roomSlug === 'outdoor') {
      return {
        data: { pages: [{ images: [], nextPage: null, totalCount: 0 }] },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        hasNextPage: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        isFetchNextPageError: false,
      }
    }
    if (roomSlug === 'error-room') {
      return {
        data: null,
        isLoading: false,
        isError: true,
        error: new Error('Network timeout'),
        refetch: vi.fn(),
        hasNextPage: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        isFetchNextPageError: false,
      }
    }
    return {
      data: { pages: [{ images: mockGalleryImages, nextPage: null, totalCount: 2 }] },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      isFetchNextPageError: false,
    }
  },
  useGalleryItem: vi.fn(),
  useGalleryList: vi.fn(),
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const renderGalleryPage = (initialRoute = '/gallery') => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/gallery/frame/:id" element={<div>Frame Inspect</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('GalleryPage and GalleryFilterRail Components', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders GalleryFilterRail with exactly 6 canonical room filters', () => {
    const handleSelectRoom = vi.fn()
    render(
      <GalleryFilterRail
        activeRoom="living-room"
        onSelectRoom={handleSelectRoom}
      />
    )

    expect(screen.getByText('All')).toBeDefined()
    expect(screen.getByText('Living Room')).toBeDefined()
    expect(screen.getByText('Bedroom')).toBeDefined()
    expect(screen.getByText('Dining')).toBeDefined()
    expect(screen.getByText('Office')).toBeDefined()
    expect(screen.getByText('Outdoor')).toBeDefined()

    const bedroomBtn = screen.getByText('Bedroom')
    fireEvent.click(bedroomBtn)
    expect(handleSelectRoom).toHaveBeenCalledWith('bedroom')
  })

  it('renders GalleryPage with editorial hero, inspiration plates, and status indicator', () => {
    renderGalleryPage('/gallery')

    expect(screen.getByRole('heading', { level: 1, name: 'Spaces, Styled.' })).toBeDefined()
    expect(screen.getByText('Sculpted Burma Teak Living Room')).toBeDefined()
    expect(screen.getByAltText('Sanctuary Master Bedroom Suite')).toBeDefined()
    expect(screen.getByText('2 Curated Frames')).toBeDefined()
  })

  it('renders empty state when room has no imagery', () => {
    renderGalleryPage('/gallery?room=outdoor')

    expect(screen.getByText('No inspiration images are available for this room yet.')).toBeDefined()
    expect(screen.getByText('View All Spaces')).toBeDefined()
  })

  it('normalizes invalid room query param safely to all', () => {
    renderGalleryPage('/gallery?room=random-invalid-space')

    expect(screen.getByRole('heading', { level: 1, name: 'Spaces, Styled.' })).toBeDefined()
    expect(screen.getByText('Sculpted Burma Teak Living Room')).toBeDefined()
  })
})
