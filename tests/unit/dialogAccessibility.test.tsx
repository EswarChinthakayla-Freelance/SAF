import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LightboxModal } from '@/components/features/gallery/LightboxModal'
import type { GalleryItemWithProduct } from '@/types/app'

const mockGalleryItems: GalleryItemWithProduct[] = [
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
    is_active: true,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
]

describe('LightboxModal Accessibility & Keyboard Interactions', () => {
  const handleClose = vi.fn()
  const handleSelectIndex = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Dialog with accessible title, description, and navigation controls', () => {
    render(
      <MemoryRouter>
        <LightboxModal
          images={mockGalleryItems}
          selectedIndex={0}
          onClose={handleClose}
          onSelectIndex={handleSelectIndex}
        />
      </MemoryRouter>
    )

    expect(screen.getByRole('dialog')).toBeDefined()
    expect(screen.getByLabelText('View next image')).toBeDefined()
    expect(screen.getByLabelText('View previous image')).toBeDefined()
  })

  it('navigates with ArrowRight and ArrowLeft keyboard events', () => {
    render(
      <MemoryRouter>
        <LightboxModal
          images={mockGalleryItems}
          selectedIndex={0}
          onClose={handleClose}
          onSelectIndex={handleSelectIndex}
        />
      </MemoryRouter>
    )

    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(handleSelectIndex).toHaveBeenCalledWith(1)

    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(handleSelectIndex).toHaveBeenCalledWith(1)
  })

  it('does not render Next/Prev buttons when only 1 image exists', () => {
    render(
      <MemoryRouter>
        <LightboxModal
          images={[mockGalleryItems[0]]}
          selectedIndex={0}
          onClose={handleClose}
          onSelectIndex={handleSelectIndex}
        />
      </MemoryRouter>
    )

    expect(screen.queryByLabelText('View next image')).toBeNull()
    expect(screen.queryByLabelText('View previous image')).toBeNull()
  })
})
