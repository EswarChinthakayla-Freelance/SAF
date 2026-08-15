import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GalleryPage } from '@/pages/public/GalleryPage'
import { RoomFilter } from '@/components/features/gallery/RoomFilter'
import { LightboxModal } from '@/components/features/gallery/LightboxModal'
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
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('GalleryPage, RoomFilter, and LightboxModal Components', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders RoomFilter with exactly 6 canonical room filters', () => {
    const handleSelectRoom = vi.fn()
    render(
      <RoomFilter
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

  it('renders GalleryPage with header and inspiration images', () => {
    renderGalleryPage('/gallery')

    expect(screen.getByRole('heading', { level: 1, name: 'Spaces, Styled.' })).toBeDefined()
    expect(screen.getByText('Sculpted Burma Teak Living Room')).toBeDefined()
    expect(screen.getByText('Sanctuary Master Bedroom Suite')).toBeDefined()
    expect(screen.getByText('Featured Piece')).toBeDefined()
  })

  it('renders LightboxModal with image, controls, and linked product CTA', () => {
    const handleClose = vi.fn()
    const handleSelectIndex = vi.fn()

    render(
      <MemoryRouter>
        <LightboxModal
          images={mockGalleryImages}
          selectedIndex={0}
          onClose={handleClose}
          onSelectIndex={handleSelectIndex}
        />
      </MemoryRouter>
    )

    expect(screen.getAllByText('Sculpted Burma Teak Living Room').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('1 of 2')).toBeDefined()
    expect(screen.getByText('Explore Royal Burma Teak Lounge Chair')).toBeDefined()

    // Test next button
    const nextBtn = screen.getByRole('button', { name: 'View next image' })
    fireEvent.click(nextBtn)
    expect(handleSelectIndex).toHaveBeenCalledWith(1)
  })

  it('omits linked product CTA in LightboxModal when product_id is null', () => {
    render(
      <MemoryRouter>
        <LightboxModal
          images={mockGalleryImages}
          selectedIndex={1}
          onClose={vi.fn()}
          onSelectIndex={vi.fn()}
        />
      </MemoryRouter>
    )

    expect(screen.getAllByText('Sanctuary Master Bedroom Suite').length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText(/Explore/i)).toBeNull()
  })

  it('renders empty state when room has no imagery', () => {
    renderGalleryPage('/gallery?room=outdoor')

    expect(screen.getByText('No inspiration images are available for this room yet.')).toBeDefined()
    expect(screen.getByText('View All Spaces')).toBeDefined()
  })

  it('handles keyboard navigation with ArrowRight and ArrowLeft in LightboxModal', () => {
    const handleSelectIndex = vi.fn()

    render(
      <MemoryRouter>
        <LightboxModal
          images={mockGalleryImages}
          selectedIndex={0}
          onClose={vi.fn()}
          onSelectIndex={handleSelectIndex}
        />
      </MemoryRouter>
    )

    // ArrowRight -> Next
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(handleSelectIndex).toHaveBeenCalledWith(1)

    // ArrowLeft -> Wrap around to last item (index 1)
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(handleSelectIndex).toHaveBeenCalledWith(1)
  })

  it('safely handles single image in LightboxModal without crashing', () => {
    const handleSelectIndex = vi.fn()

    render(
      <MemoryRouter>
        <LightboxModal
          images={[mockGalleryImages[0]]}
          selectedIndex={0}
          onClose={vi.fn()}
          onSelectIndex={handleSelectIndex}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('1 of 1')).toBeDefined()
    // No previous/next buttons rendered when single image
    expect(screen.queryByRole('button', { name: 'View next image' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'View previous image' })).toBeNull()
  })

  it('normalizes invalid room query param safely to all', () => {
    renderGalleryPage('/gallery?room=random-invalid-space')

    // Expect default page header and inspiration items to be rendered without crash
    expect(screen.getByRole('heading', { level: 1, name: 'Spaces, Styled.' })).toBeDefined()
    expect(screen.getByText('Sculpted Burma Teak Living Room')).toBeDefined()
  })
})
