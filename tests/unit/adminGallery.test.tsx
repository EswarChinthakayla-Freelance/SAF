import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminGalleryPage } from '@/pages/admin/AdminGalleryPage'
import type { AdminGalleryItem, AdminGalleryListResult } from '@/types/app'

const mockGalleryImages: AdminGalleryItem[] = [
  {
    id: 'gal-1',
    storage_path: 'inspiration/living1.webp',
    alt_text: 'Living room architectural setting with teak sofa',
    room_type: 'Living Room',
    product_id: 'prod-teak-sofa',
    sort_order: 1,
    is_active: true,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-16T12:00:00Z',
    products: {
      id: 'prod-teak-sofa',
      name: 'Architectural Teak Sofa',
      slug: 'architectural-teak-sofa',
      product_code: 'SAF-SOF-001',
      cover_image_path: 'products/sofa.jpg',
      is_published: true,
      price: 95000,
    },
  },
  {
    id: 'gal-2',
    storage_path: 'inspiration/dining1.webp',
    alt_text: 'Solid teak dining suite in ambient sunlight',
    room_type: 'Dining',
    product_id: null,
    sort_order: 2,
    is_active: false,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-16T12:00:00Z',
    products: null,
  },
]

const mockGalleryListResult: AdminGalleryListResult = {
  images: mockGalleryImages,
  totalCount: 2,
  activeCount: 1,
  page: 1,
  pageSize: 24,
  totalPages: 1,
}

const mockToggleActive = vi.fn()
const mockReorder = vi.fn()
const mockDelete = vi.fn()

vi.mock('@/hooks/queries/useGallery', () => ({
  useAdminGallery: () => ({
    data: mockGalleryListResult,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
  useAdminGallerySequence: () => ({
    data: mockGalleryImages,
    isLoading: false,
    isError: false,
    error: null,
  }),
}))

vi.mock('@/hooks/queries/useProducts', () => ({
  useAdminProducts: () => ({
    data: {
      products: [
        { id: 'prod-teak-sofa', name: 'Architectural Teak Sofa', product_code: 'SAF-SOF-001' },
      ],
      totalCount: 1,
      totalPages: 1,
    },
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

describe('AdminGalleryPage — "The Media Studio"', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders clean Inter heading, breadcrumbs, and stats counter', () => {
    renderGalleryPage()

    expect(screen.getByRole('heading', { level: 1, name: 'Gallery' })).toBeDefined()
    expect(screen.getByText('2 images')).toBeDefined()
    expect(screen.getByText('1 active')).toBeDefined()
    expect(screen.getByRole('button', { name: /Upload Images/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /Reorder/i })).toBeDefined()
  })

  it('renders Media Command Bar with search, room, visibility and product filters', () => {
    renderGalleryPage()

    expect(screen.getByPlaceholderText('Search gallery images...')).toBeDefined()
    expect(screen.getByText('All Rooms')).toBeDefined()
    expect(screen.getByText('All Visibility')).toBeDefined()
    expect(screen.getByText('All Images')).toBeDefined()
  })

  it('renders media tiles with room badges, visibility status, linked product and View action', () => {
    renderGalleryPage()

    expect(screen.getByText('Living Room')).toBeDefined()
    expect(screen.getByText('Dining')).toBeDefined()
    expect(screen.getByText('Living room architectural setting with teak sofa')).toBeDefined()
    expect(screen.getByText('Solid teak dining suite in ambient sunlight')).toBeDefined()
    expect(screen.getByText('Architectural Teak Sofa')).toBeDefined()
    expect(screen.getByText('No linked product')).toBeDefined()
    expect(screen.getByText('Order 01')).toBeDefined()
    expect(screen.getByText('Order 02')).toBeDefined()

    const viewButtons = screen.getAllByRole('button', { name: 'View' })
    expect(viewButtons.length).toBe(2)
  })

  it('toggles Reorder Mode and enables drag/button reordering', async () => {
    renderGalleryPage()

    const reorderBtn = screen.getByRole('button', { name: 'Reorder' })
    fireEvent.click(reorderBtn)

    expect(screen.getByText(/Reorder Mode Active/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /Save Order/i })).toBeDefined()

    const saveOrderBtn = screen.getByRole('button', { name: /Save Order/i })
    fireEvent.click(saveOrderBtn)

    expect(mockReorder).toHaveBeenCalled()
  })

  it('opens Bulk Upload workspace when Upload Images is clicked', () => {
    renderGalleryPage()

    const uploadBtn = screen.getByRole('button', { name: /Upload Images/i })
    fireEvent.click(uploadBtn)

    expect(screen.getByText('Bulk Media Upload Workspace')).toBeDefined()
    expect(screen.getByText(/Click to choose files or drag & drop photographs here/i)).toBeDefined()
  })

  it('opens metadata editing Sheet from tile More menu', () => {
    renderGalleryPage()

    const moreButtons = screen.getAllByRole('button', { name: /More actions for/i })
    fireEvent.click(moreButtons[0])

    const editItem = screen.getByText('Edit Metadata')
    fireEvent.click(editItem)

    expect(screen.getByText('Edit Image Metadata')).toBeDefined()
    expect(screen.getByDisplayValue('Living room architectural setting with teak sofa')).toBeDefined()
  })

  it('opens delete confirmation dialog and executes deletion', () => {
    renderGalleryPage()

    const moreButtons = screen.getAllByRole('button', { name: /More actions for/i })
    fireEvent.click(moreButtons[0])

    const deleteItem = screen.getByText('Delete Image')
    fireEvent.click(deleteItem)

    expect(screen.getByText(/This will permanently delete this visual from the public inspiration gallery/i)).toBeDefined()

    const confirmDeleteBtn = screen.getByRole('button', { name: 'Delete Visual' })
    fireEvent.click(confirmDeleteBtn)

    expect(mockDelete).toHaveBeenCalledWith({
      id: 'gal-1',
      storagePath: 'inspiration/living1.webp',
    })
  })
})
