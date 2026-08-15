import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminCollectionsPage } from '@/pages/admin/AdminCollectionsPage'
import type { CollectionRow } from '@/types/app'

const mockCollections: CollectionRow[] = [
  {
    id: 'col-1',
    name: 'Living Sanctuary',
    slug: 'living-sanctuary',
    description: 'Master joinery solid teak living pieces.',
    cover_image_path: 'collections/living.jpg',
    sort_order: 1,
    is_active: true,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
]

const mockToggleActive = vi.fn()

vi.mock('@/hooks/queries/useCollections', () => ({
  useCollections: () => ({
    data: mockCollections,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
}))

vi.mock('@/hooks/mutations/useCollectionMutations', () => ({
  useCollectionMutations: () => ({
    createCollection: { mutateAsync: vi.fn(), isPending: false },
    updateCollection: { mutateAsync: vi.fn(), isPending: false },
    deleteCollection: { mutateAsync: vi.fn(), isPending: false },
    toggleActive: { mutate: mockToggleActive, isPending: false },
  }),
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const renderCollectionsPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AdminCollectionsPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('AdminCollectionsPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders collections table with title, slug, sort order, and visibility toggle', () => {
    renderCollectionsPage()

    expect(screen.getByText('Living Sanctuary')).toBeDefined()
    expect(screen.getByText('slug: living-sanctuary')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Active' })).toBeDefined()
  })

  it('opens add collection Sheet when + Add Collection is clicked', () => {
    renderCollectionsPage()

    const addBtn = screen.getByRole('button', { name: /\+ Add Collection/i })
    fireEvent.click(addBtn)

    expect(screen.getByText('Add Collection')).toBeDefined()
    expect(screen.getByText(/Collection Name/i)).toBeDefined()
  })

  it('opens edit collection Sheet when Edit button is clicked', () => {
    renderCollectionsPage()

    const editBtn = screen.getByRole('button', { name: 'Edit' })
    fireEvent.click(editBtn)

    expect(screen.getByText('Edit Collection: Living Sanctuary')).toBeDefined()
  })

  it('triggers toggleActive mutation when visibility button is clicked', () => {
    renderCollectionsPage()

    const activeBtn = screen.getByRole('button', { name: 'Active' })
    fireEvent.click(activeBtn)

    expect(mockToggleActive).toHaveBeenCalledWith({
      id: 'col-1',
      is_active: false,
    })
  })

  it('opens delete confirmation explaining products remain and become unassigned', () => {
    renderCollectionsPage()

    const deleteBtn = screen.getByRole('button', { name: 'Delete' })
    fireEvent.click(deleteBtn)

    expect(screen.getByRole('heading', { level: 3 })).toBeDefined()
    expect(
      screen.getByText(/Deleting this collection will not delete its products\. Products currently assigned to it will become unassigned\./i)
    ).toBeDefined()
  })
})

