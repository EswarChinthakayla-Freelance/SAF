import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminGalleryPreviewPage } from '@/pages/admin/AdminGalleryPreviewPage'
import type { AdminGalleryItem } from '@/types/app'

const mockGalleryItem: AdminGalleryItem = {
  id: 'gal-100',
  storage_path: 'inspiration/master-bed.webp',
  alt_text: 'Hand-carved rosewood bed in tranquil morning ambient suite',
  room_type: 'Bedroom',
  product_id: 'prod-rosewood-bed',
  sort_order: 8,
  is_active: true,
  created_at: '2026-08-01T00:00:00Z',
  updated_at: '2026-08-16T12:00:00Z',
  products: {
    id: 'prod-rosewood-bed',
    name: 'Rosewood Sanctum Bed',
    slug: 'rosewood-sanctum-bed',
    product_code: 'SAF-BED-042',
    cover_image_path: 'products/bed.jpg',
    is_published: true,
    price: 145000,
  },
}

const mockSequence: AdminGalleryItem[] = [
  {
    id: 'gal-99',
    storage_path: 'inspiration/living-prev.webp',
    alt_text: 'Living room teak layout',
    room_type: 'Living Room',
    product_id: null,
    sort_order: 7,
    is_active: true,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-16T12:00:00Z',
    products: null,
  },
  mockGalleryItem,
  {
    id: 'gal-101',
    storage_path: 'inspiration/dining-next.webp',
    alt_text: 'Dining table layout',
    room_type: 'Dining',
    product_id: null,
    sort_order: 9,
    is_active: true,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-16T12:00:00Z',
    products: null,
  },
]

let mockQueryData: AdminGalleryItem | null = mockGalleryItem
let mockIsLoading = false
let mockIsError = false

const mockToggleActive = vi.fn()
const mockDelete = vi.fn()

vi.mock('@/hooks/queries/useGallery', () => ({
  useAdminGalleryDetail: () => ({
    data: mockQueryData,
    isLoading: mockIsLoading,
    isError: mockIsError,
    error: mockIsError ? new Error('Gallery image not found') : null,
    refetch: vi.fn(),
  }),
  useAdminGallerySequence: () => ({
    data: mockSequence,
    isLoading: false,
    isError: false,
    error: null,
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
    updateGalleryImage: { mutateAsync: vi.fn(), isPending: false },
    deleteGalleryImage: { mutateAsync: mockDelete, isPending: false },
    toggleActive: { mutateAsync: mockToggleActive, isPending: false },
  }),
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const renderPreviewPage = (initialRoute = '/admin/gallery/gal-100/preview') => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/admin/gallery/:id/preview" element={<AdminGalleryPreviewPage />} />
          <Route path="/admin/gallery" element={<div>Gallery List Page</div>} />
          <Route path="/admin/products/:id/preview" element={<div>Product Inspector Page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('AdminGalleryPreviewPage — "The Media Inspector"', () => {
  beforeEach(() => {
    mockQueryData = mockGalleryItem
    mockIsLoading = false
    mockIsError = false
    vi.clearAllMocks()
  })

  it('renders loading skeleton when fetching image record', () => {
    mockIsLoading = true
    renderPreviewPage()

    expect(screen.getByLabelText(/Loading gallery image preview/i)).toBeDefined()
  })

  it('renders Topbar, Canvas, Metadata panel, and Connected Product details', () => {
    renderPreviewPage()

    expect(screen.getByText('Back to Gallery')).toBeDefined()
    expect(screen.getByText('Image 2 of 3')).toBeDefined()
    expect(screen.getAllByText('Bedroom')[0]).toBeDefined()
    expect(screen.getByText('Visible')).toBeDefined()
    expect(screen.getByRole('button', { name: /Edit Metadata/i })).toBeDefined()

    // Alt text
    expect(screen.getByText('Hand-carved rosewood bed in tranquil morning ambient suite')).toBeDefined()

    // Connected product card
    expect(screen.getByText('Rosewood Sanctum Bed')).toBeDefined()
    expect(screen.getByText('SAF-BED-042')).toBeDefined()
    expect(screen.getByRole('link', { name: /Product Inspector/i })).toBeDefined()

    // Readiness checklist
    expect(screen.getByText('Public Gallery Readiness')).toBeDefined()
    expect(screen.getByText('Accessibility caption present')).toBeDefined()
  })

  it('adjusts zoom levels on canvas zoom in and zoom out controls', () => {
    renderPreviewPage()

    expect(screen.getByText('100%')).toBeDefined()

    const zoomInBtn = screen.getByRole('button', { name: 'Zoom in' })
    fireEvent.click(zoomInBtn)
    expect(screen.getByText('125%')).toBeDefined()

    const zoomOutBtn = screen.getByRole('button', { name: 'Zoom out' })
    fireEvent.click(zoomOutBtn)
    expect(screen.getByText('100%')).toBeDefined()

    const fitBtn = screen.getByRole('button', { name: 'Fit image to screen' })
    fireEvent.click(fitBtn)
    expect(screen.getByText('100%')).toBeDefined()
  })

  it('opens metadata editing Sheet when Edit Metadata is clicked', () => {
    renderPreviewPage()

    const editBtn = screen.getByRole('button', { name: /Edit Metadata/i })
    fireEvent.click(editBtn)

    expect(screen.getByText('Edit Image Metadata')).toBeDefined()
    expect(screen.getByDisplayValue('Hand-carved rosewood bed in tranquil morning ambient suite')).toBeDefined()
  })

  it('opens delete confirmation and executes deletion', () => {
    renderPreviewPage()

    const moreBtn = screen.getByRole('button', { name: 'More inspector actions' })
    fireEvent.click(moreBtn)

    const deleteItem = screen.getByText('Delete Image Permanently')
    fireEvent.click(deleteItem)

    expect(screen.getByText(/This will permanently delete this visual from the public inspiration gallery/i)).toBeDefined()

    const confirmBtn = screen.getByRole('button', { name: 'Delete Image' })
    fireEvent.click(confirmBtn)

    expect(mockDelete).toHaveBeenCalledWith({
      id: 'gal-100',
      storagePath: 'inspiration/master-bed.webp',
    })
  })

  it('renders Not Found state when record is missing', () => {
    mockQueryData = null
    renderPreviewPage()

    expect(screen.getByText('This gallery image could not be found')).toBeDefined()
    expect(screen.getByText('Return to Gallery')).toBeDefined()
  })
})
