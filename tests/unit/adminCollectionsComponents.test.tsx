import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CollectionVisibilityBadge } from '@/components/admin/collections/CollectionVisibilityBadge'
import { CollectionRowActions } from '@/components/admin/collections/CollectionRowActions'
import { AdminCollectionCard } from '@/components/admin/collections/AdminCollectionCard'
import { AdminCollectionsToolbar } from '@/components/admin/collections/AdminCollectionsToolbar'
import { AdminCollectionReorderBar } from '@/components/admin/collections/AdminCollectionReorderBar'
import { CollectionDeactivateDialog } from '@/components/admin/collections/CollectionDeactivateDialog'
import type { AdminCollectionItem } from '@/types/app'

const mockCollection: AdminCollectionItem = {
  id: 'col-42',
  name: 'Bespoke Beds',
  slug: 'bespoke-beds',
  description: 'Hand-carved architectural beds in solid timber.',
  cover_image_path: 'collections/bed.jpg',
  cover_image_alt: 'Bespoke teak bed frame',
  sort_order: 10,
  is_active: true,
  created_at: '2026-08-01T00:00:00Z',
  updated_at: '2026-08-16T12:00:00Z',
  product_count: 14,
}

describe('Admin Collections Feature Components', () => {
  it('renders CollectionVisibilityBadge in static and interactive modes', () => {
    const handleToggle = vi.fn()
    const { rerender } = render(
      <CollectionVisibilityBadge isActive={true} interactive={true} onToggle={handleToggle} />
    )

    const btn = screen.getByRole('button', { name: /Visibility: Active/i })
    expect(btn).toBeDefined()
    fireEvent.click(btn)
    expect(handleToggle).toHaveBeenCalledTimes(1)

    rerender(<CollectionVisibilityBadge isActive={false} interactive={false} />)
    expect(screen.getByText('Hidden')).toBeDefined()
  })

  it('renders CollectionRowActions with Edit button, view products link, and menu items', () => {
    const handleEdit = vi.fn()
    const handleDelete = vi.fn()
    const handleToggleActive = vi.fn()

    render(
      <MemoryRouter>
        <CollectionRowActions
          collection={mockCollection}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      </MemoryRouter>
    )

    const editBtn = screen.getByRole('button', { name: 'Edit Bespoke Beds' })
    expect(editBtn).toBeDefined()
    fireEvent.click(editBtn)
    expect(handleEdit).toHaveBeenCalledWith(mockCollection)

    const moreBtn = screen.getByRole('button', { name: 'More actions for Bespoke Beds' })
    fireEvent.click(moreBtn)

    expect(screen.getByText('Edit Collection')).toBeDefined()
    expect(screen.getByText(/View Products \(14\)/i)).toBeDefined()
    expect(screen.getByText('View on Website')).toBeDefined()
    expect(screen.getByText('Hide Collection')).toBeDefined()
    expect(screen.getByText('Delete Collection')).toBeDefined()
  })

  it('renders AdminCollectionCard in Board View with image stage, meta, and actions', () => {
    render(
      <MemoryRouter>
        <AdminCollectionCard
          collection={mockCollection}
          index={0}
          totalCount={1}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Bespoke Beds')).toBeDefined()
    expect(screen.getByText('/bespoke-beds')).toBeDefined()
    expect(screen.getByText('14 products')).toBeDefined()
    expect(screen.getByText('Order: 10')).toBeDefined()
  })

  it('renders AdminCollectionsToolbar with search, visibility select, and reorder button', () => {
    const handleSearch = vi.fn()
    const handleToggleReorder = vi.fn()
    const handleViewMode = vi.fn()

    render(
      <AdminCollectionsToolbar
        searchQuery="bed"
        onSearchChange={handleSearch}
        selectedVisibility="active"
        onVisibilityChange={vi.fn()}
        viewMode="board"
        onViewModeChange={handleViewMode}
        isReorderMode={false}
        onToggleReorderMode={handleToggleReorder}
        onResetFilters={vi.fn()}
      />
    )

    expect(screen.getByPlaceholderText('Search collections…')).toBeDefined()
    expect(screen.getByText(/Search: “bed”/i)).toBeDefined()

    const reorderBtn = screen.getByRole('button', { name: 'Reorder collections' })
    fireEvent.click(reorderBtn)
    expect(handleToggleReorder).toHaveBeenCalledTimes(1)
  })

  it('renders AdminCollectionReorderBar and triggers save / cancel', () => {
    const handleSave = vi.fn()
    const handleCancel = vi.fn()

    render(
      <AdminCollectionReorderBar
        isSaving={false}
        hasChanges={true}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    )

    expect(screen.getByText('Curated Display Order Mode')).toBeDefined()
    const saveBtn = screen.getByRole('button', { name: /Save Order/i })
    fireEvent.click(saveBtn)
    expect(handleSave).toHaveBeenCalledTimes(1)

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelBtn)
    expect(handleCancel).toHaveBeenCalledTimes(1)
  })

  it('renders CollectionDeactivateDialog and confirms hiding', () => {
    const handleConfirm = vi.fn()
    const handleCancel = vi.fn()

    render(
      <CollectionDeactivateDialog
        isOpen={true}
        collection={mockCollection}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    )

    expect(
      screen.getByRole('heading', { name: /Hide “Bespoke Beds” from public website\?/i })
    ).toBeDefined()
    expect(screen.getByText(/14 products/i)).toBeDefined()

    const hideBtn = screen.getByRole('button', { name: 'Hide Collection' })
    fireEvent.click(hideBtn)
    expect(handleConfirm).toHaveBeenCalledTimes(1)
  })
})
