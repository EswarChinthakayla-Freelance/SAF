import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminCollectionsPage } from '@/pages/admin/AdminCollectionsPage'
import type { AdminCollectionItem } from '@/types/app'

const mockCollections: AdminCollectionItem[] = [
  {
    id: 'col-1',
    name: 'Living Sanctuary',
    slug: 'living-sanctuary',
    description: 'Master joinery solid teak living pieces.',
    cover_image_path: 'collections/living.jpg',
    cover_image_alt: 'Teak living room setup',
    sort_order: 10,
    is_active: true,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
    product_count: 5,
  },
  {
    id: 'col-2',
    name: 'Dining & Banquet',
    slug: 'dining-banquet',
    description: 'Bespoke 8-seater dining tables and banquet credenzas.',
    cover_image_path: 'collections/dining.jpg',
    cover_image_alt: 'Teak dining table',
    sort_order: 20,
    is_active: false,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
    product_count: 8,
  },
]

const mockToggleActive = vi.fn()
const mockReorderCollections = vi.fn()
const mockCreateCollection = vi.fn()
const mockUpdateCollection = vi.fn()
const mockDeleteCollection = vi.fn()

vi.mock('@/hooks/queries/useCollections', () => ({
  useAdminCollections: () => ({
    data: mockCollections,
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
}))

vi.mock('@/hooks/mutations/useCollectionMutations', () => ({
  useCollectionMutations: () => ({
    createCollection: { mutateAsync: mockCreateCollection, isPending: false },
    updateCollection: { mutateAsync: mockUpdateCollection, isPending: false },
    deleteCollection: { mutateAsync: mockDeleteCollection, isPending: false },
    toggleActive: { mutate: mockToggleActive, mutateAsync: mockToggleActive, isPending: false },
    reorderCollections: { mutateAsync: mockReorderCollections, isPending: false },
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

describe('AdminCollectionsPage Component — "The Collection Studio"', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders collections workspace header with Inter title, summary, and Add Collection button', () => {
    renderCollectionsPage()

    expect(screen.getByRole('heading', { level: 1, name: 'Collections' })).toBeDefined()
    expect(screen.getByText(/2 collections · 1 active/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /Add Collection/i })).toBeDefined()
    expect(screen.getByPlaceholderText('Search collections…')).toBeDefined()
  })

  it('renders collections table with thumbnail, title, /slug, display order, and visibility badges', () => {
    renderCollectionsPage()

    expect(screen.getAllByText('Living Sanctuary')[0]).toBeDefined()
    expect(screen.getAllByText('/living-sanctuary')[0]).toBeDefined()
    expect(screen.getAllByText('Dining & Banquet')[0]).toBeDefined()
    expect(screen.getAllByText('/dining-banquet')[0]).toBeDefined()
    expect(screen.getAllByText('5 products')[0]).toBeDefined()
    expect(screen.getAllByText('8 products')[0]).toBeDefined()
  })

  it('switches between List View and Board View when view switcher buttons are clicked', () => {
    renderCollectionsPage()

    const boardBtn = screen.getByRole('radio', { name: 'Collection board view' })
    fireEvent.click(boardBtn)

    expect(boardBtn.getAttribute('aria-checked')).toBe('true')
    expect(localStorage.getItem('admin-collections-view')).toBe('board')

    const listBtn = screen.getByRole('radio', { name: 'List view' })
    fireEvent.click(listBtn)

    expect(listBtn.getAttribute('aria-checked')).toBe('true')
    expect(localStorage.getItem('admin-collections-view')).toBe('list')
  })

  it('toggles Reorder mode and renders curated display order controls', () => {
    renderCollectionsPage()

    const reorderBtn = screen.getByRole('button', { name: 'Reorder collections' })
    fireEvent.click(reorderBtn)

    expect(screen.getByText('Curated Display Order Mode')).toBeDefined()
    expect(screen.getByRole('button', { name: /Save Order/i })).toBeDefined()
  })

  it('opens add collection Sheet when Add Collection is clicked', () => {
    renderCollectionsPage()

    const addBtn = screen.getByRole('button', { name: /Add Collection/i })
    fireEvent.click(addBtn)

    expect(screen.getByRole('heading', { level: 2, name: 'Add Collection' })).toBeDefined()
    expect(screen.getByLabelText(/Collection Name/i)).toBeDefined()
  })

  it('opens edit collection Sheet when Edit button is clicked', () => {
    renderCollectionsPage()

    const editBtns = screen.getAllByRole('button', { name: /Edit Living Sanctuary/i })
    fireEvent.click(editBtns[0])

    expect(
      screen.getByRole('heading', { level: 2, name: 'Edit Collection: Living Sanctuary' })
    ).toBeDefined()
  })

  it('opens confirmation dialog when attempting to hide an active collection', () => {
    renderCollectionsPage()

    const activeBadges = screen.getAllByRole('button', { name: /Visibility: Active/i })
    fireEvent.click(activeBadges[0])

    expect(
      screen.getByRole('heading', { name: /Hide “Living Sanctuary” from public website\?/i })
    ).toBeDefined()
    expect(
      screen.getByText(/This collection will stop appearing on public collection pages/i)
    ).toBeDefined()
  })

  it('opens delete confirmation explaining products remain and become unassigned', () => {
    renderCollectionsPage()

    const moreBtn = screen.getAllByRole('button', {
      name: /More actions for Living Sanctuary/i,
    })[0]
    fireEvent.click(moreBtn)

    const deleteMenuItem = screen.getByText('Delete Collection')
    fireEvent.click(deleteMenuItem)

    expect(
      screen.getByRole('heading', { name: /Delete “Living Sanctuary”\?/i })
    ).toBeDefined()
    expect(
      screen.getByText(
        /Deleting this collection will not delete its products\. Products currently assigned to it will become unassigned\./i
      )
    ).toBeDefined()
  })
})
