import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GalleryFilterRail } from '@/components/features/gallery/GalleryFilterRail'

describe('GalleryFilterRail Component', () => {
  it('renders all canonical room filters', () => {
    const handleSelectRoom = vi.fn()
    render(<GalleryFilterRail activeRoom="living-room" onSelectRoom={handleSelectRoom} />)

    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Living Room')).toBeInTheDocument()
    expect(screen.getByText('Bedroom')).toBeInTheDocument()
    expect(screen.getByText('Dining')).toBeInTheDocument()
    expect(screen.getByText('Office')).toBeInTheDocument()
    expect(screen.getByText('Outdoor')).toBeInTheDocument()
  })

  it('triggers onSelectRoom with correct slug when tab is clicked', () => {
    const handleSelectRoom = vi.fn()
    render(<GalleryFilterRail activeRoom="all" onSelectRoom={handleSelectRoom} />)

    const diningTab = screen.getByRole('tab', { name: /Dining/i })
    fireEvent.click(diningTab)
    expect(handleSelectRoom).toHaveBeenCalledWith('dining')
  })

  it('marks active tab with aria-selected="true"', () => {
    render(<GalleryFilterRail activeRoom="bedroom" onSelectRoom={vi.fn()} />)

    const bedroomTab = screen.getByRole('tab', { name: /Bedroom/i })
    expect(bedroomTab).toHaveAttribute('aria-selected', 'true')

    const livingTab = screen.getByRole('tab', { name: /Living Room/i })
    expect(livingTab).toHaveAttribute('aria-selected', 'false')
  })
})
