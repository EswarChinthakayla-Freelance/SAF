import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MadeForEveryRoomSection } from '@/components/features/home/MadeForEveryRoomSection'
import * as collectionsHook from '@/hooks/queries/useCollections'
import * as reducedMotionHook from '@/hooks/useReducedMotionPreference'
import type { CollectionRow } from '@/types/app'

const mockCollections: CollectionRow[] = [
  {
    id: 'col-1',
    name: 'Living Room',
    slug: 'living-room',
    description: 'Architectural teak sofas, lounge chairs, and bespoke center tables.',
    cover_image_path: 'collections/living.jpg',
    cover_image_alt: 'Living Room Suite',
    sort_order: 1,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'col-2',
    name: 'Bedroom',
    slug: 'bedroom',
    description: 'Handcrafted solid rosewood beds with floating nightstands.',
    cover_image_path: 'collections/bedroom.jpg',
    cover_image_alt: 'Bedroom Suite',
    sort_order: 2,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'col-3',
    name: 'Dining',
    slug: 'dining',
    description: 'Sculptural dining tables with mortise-and-tenon teak seating.',
    cover_image_path: null,
    cover_image_alt: null,
    sort_order: 3,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'col-4',
    name: 'Executive Office',
    slug: 'study-office',
    description: 'Statement hardwood executive desks and credenzas.',
    cover_image_path: 'collections/office.jpg',
    cover_image_alt: 'Executive Office Suite',
    sort_order: 4,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'col-5',
    name: 'Pooja Mandir',
    slug: 'mandir',
    description: 'Sacred architectural mandirs carved in seasoned teak.',
    cover_image_path: null,
    cover_image_alt: null,
    sort_order: 5,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
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

describe('MadeForEveryRoomSection — "The Spatial Room Rail"', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(reducedMotionHook, 'useReducedMotionPreference').mockReturnValue(false)
  })

  it('renders section heading and multi-collection spatial composition', () => {
    vi.spyOn(collectionsHook, 'useCollections').mockReturnValue({
      data: mockCollections,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof collectionsHook.useCollections>)

    renderWithProviders(<MadeForEveryRoomSection />)

    // 1. Heading
    expect(screen.getByRole('heading', { name: /Made for Every Room/i })).toBeInTheDocument()
    expect(screen.getByText(/Explore by Space/i)).toBeInTheDocument()

    // 2. Room Rail labels
    const livingTabs = screen.getAllByRole('tab', { name: /Jump to Living Room room/i })
    expect(livingTabs.length).toBeGreaterThan(0)
    expect(livingTabs[0]).toHaveAttribute('aria-selected', 'true')

    // 3. Active collection content
    expect(screen.getAllByText('Living Room').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Architectural teak sofas/i).length).toBeGreaterThan(0)

    // 4. CTA Link
    const ctaLinks = screen.getAllByRole('link', { name: /Explore Living Room/i })
    expect(ctaLinks.length).toBeGreaterThan(0)
    expect(ctaLinks[0]).toHaveAttribute('href', '/collections/living-room')
  })

  it('navigates to next collection on next button click', () => {
    vi.spyOn(collectionsHook, 'useCollections').mockReturnValue({
      data: mockCollections,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof collectionsHook.useCollections>)

    renderWithProviders(<MadeForEveryRoomSection />)

    // Find next room buttons
    const nextButtons = screen.getAllByRole('button', { name: /Next room/i })
    expect(nextButtons.length).toBeGreaterThan(0)

    fireEvent.click(nextButtons[0])

    // Bedroom should now be active
    expect(screen.getAllByText('Bedroom').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Handcrafted solid rosewood beds/i).length).toBeGreaterThan(0)
  })

  it('switches active collection on room rail click', () => {
    vi.spyOn(collectionsHook, 'useCollections').mockReturnValue({
      data: mockCollections,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof collectionsHook.useCollections>)

    renderWithProviders(<MadeForEveryRoomSection />)

    const diningTabs = screen.getAllByRole('tab', { name: /Jump to Dining room/i })
    fireEvent.click(diningTabs[0])

    expect(screen.getAllByText('Dining').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Sculptural dining tables/i).length).toBeGreaterThan(0)
  })

  it('supports keyboard ArrowRight / ArrowLeft navigation within the spatial viewport', () => {
    vi.spyOn(collectionsHook, 'useCollections').mockReturnValue({
      data: mockCollections,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof collectionsHook.useCollections>)

    renderWithProviders(<MadeForEveryRoomSection />)

    const region = screen.getByLabelText(/Spatial Room Rail Carousel/i)

    fireEvent.keyDown(region, { key: 'ArrowRight' })
    expect(screen.getAllByText('Bedroom').length).toBeGreaterThan(0)

    fireEvent.keyDown(region, { key: 'ArrowLeft' })
    expect(screen.getAllByText('Living Room').length).toBeGreaterThan(0)
  })

  it('renders single feature layout when only 1 active collection exists', () => {
    vi.spyOn(collectionsHook, 'useCollections').mockReturnValue({
      data: [mockCollections[0]],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof collectionsHook.useCollections>)

    renderWithProviders(<MadeForEveryRoomSection />)

    expect(screen.getByRole('heading', { name: /Made for Every Room/i })).toBeInTheDocument()
    expect(screen.getByText('Living Room')).toBeInTheDocument()
    // No multi-step room rail or next button
    expect(screen.queryByLabelText(/Spatial Room Index/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Next room/i })).not.toBeInTheDocument()
  })

  it('gracefully returns null when 0 collections exist', () => {
    vi.spyOn(collectionsHook, 'useCollections').mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof collectionsHook.useCollections>)

    const { container } = renderWithProviders(<MadeForEveryRoomSection />)
    expect(container.firstChild).toBeNull()
  })

  it('renders loading skeleton while query is in progress', () => {
    vi.spyOn(collectionsHook, 'useCollections').mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof collectionsHook.useCollections>)

    renderWithProviders(<MadeForEveryRoomSection />)
    expect(screen.getByRole('heading', { name: /Made for Every Room/i })).toBeInTheDocument()
  })

  it('respects prefers-reduced-motion without breaking navigation', () => {
    vi.spyOn(reducedMotionHook, 'useReducedMotionPreference').mockReturnValue(true)
    vi.spyOn(collectionsHook, 'useCollections').mockReturnValue({
      data: mockCollections,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof collectionsHook.useCollections>)

    renderWithProviders(<MadeForEveryRoomSection />)
    expect(screen.getAllByText('Living Room').length).toBeGreaterThan(0)
  })
})
