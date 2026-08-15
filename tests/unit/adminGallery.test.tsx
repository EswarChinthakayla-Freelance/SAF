import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminGalleryPage } from '@/pages/admin/AdminGalleryPage'
import type { GalleryImageRow } from '@/types/app'

const mockGalleryImages: GalleryImageRow[] = [
  {
    id: 'gal-1',
    storage_path: 'inspiration/living1.webp',
    alt_text: 'Living room architectural setting with teak sofa',
    room_type: 'Living Room',
    product_id: null,
    sort_order: 1,
    is_active: true,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gal-2',
    storage_path: 'inspiration/dining1.webp',
    alt_text: 'Solid teak dining suite in ambient sunlight',
    room_type: 'Dining Room',
    product_id: null,
    sort_order: 2,
    is_active: false,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
]

const mockToggleActive = vi.fn()
const mockReorder = vi.fn()
const mockDelete = vi.fn()

vi.mock('@/hooks/queries/useGallery', () => ({
  useAdminGallery: () => ({
    data: mockGalleryImages,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
}))

vi.mock('@/hooks/queries/useProducts', () => ({
  useAdminProducts: () => ({
    data: { products: [], totalCount: 0, totalPages: 1 },
    isLoading: false,
    isError: false,
    error: null,
  }),
}))

vi.mock('@/hooks/mutations/useGalleryMutations', () => ({
  useGalleryMutations: () => ({
    createGalleryImage: { mutateAsync: vi.fn(), isPending: false },
    updateGalleryImage: { mutateAsync: vi.fn(), isPending: false },
    deleteGalleryImage: { mutateAsync: mockDelete, isPending: false },
    reorderGalleryImages: { mutateAsync: mockReorder, isPending: false },
    toggleActive: { mutate: mockToggleActive, isPending: false },
  }),
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const renderGalleryPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AdminGalleryPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('AdminGalleryPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders gallery visual grid with room types, alt captions, and active states', () => {
    renderGalleryPage()

    expect(screen.getByText('Living Room')).toBeDefined()
    expect(screen.getByText('Dining Room')).toBeDefined()
    expect(screen.getByText('Living room architectural setting with teak sofa')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Active' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Hidden' })).toBeDefined()
  })

  it('toggles active status when Active/Hidden button is clicked', () => {
    renderGalleryPage()

    const activeBtn = screen.getByRole('button', { name: 'Active' })
    fireEvent.click(activeBtn)

    expect(mockToggleActive).toHaveBeenCalledWith({
      id: 'gal-1',
      is_active: false,
    })
  })

  it('opens metadata editing Sheet when Edit Metadata is clicked', () => {
    renderGalleryPage()

    const editBtns = screen.getAllByRole('button', { name: /Edit Metadata/i })
    fireEvent.click(editBtns[0])

    expect(screen.getByText('Edit Image Metadata')).toBeDefined()
    expect(screen.getByDisplayValue('Living room architectural setting with teak sofa')).toBeDefined()
  })

  it('opens delete confirmation dialog explaining storage removal', () => {
    renderGalleryPage()

    const deleteBtns = screen.getAllByRole('button', { name: 'Delete' })
    fireEvent.click(deleteBtns[0])

    expect(screen.getByRole('heading', { level: 3 })).toBeDefined()
    expect(
      screen.getByText(/Are you sure you want to delete this inspiration image from the public gallery and storage\?/i)
    ).toBeDefined()
  })
})
