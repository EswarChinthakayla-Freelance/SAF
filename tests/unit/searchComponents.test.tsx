import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SearchMasthead } from '@/components/features/search/SearchMasthead'
import { SearchInstrument } from '@/components/features/search/SearchInstrument'
import { DiscoveryIndex } from '@/components/features/search/DiscoveryIndex'
import { QueryLens } from '@/components/features/search/QueryLens'
import { SearchZeroMatch } from '@/components/features/search/SearchZeroMatch'
import { SearchDiscoveryBridge } from '@/components/features/search/SearchDiscoveryBridge'

describe('Search Feature Components', () => {
  it('renders SearchMasthead with breadcrumb, eyebrow, H1, and truthful scope guidance', () => {
    render(
      <MemoryRouter>
        <SearchMasthead />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Find Your Furniture' })).toBeDefined()
    expect(screen.getByText('DISCOVERY')).toBeDefined()
    expect(screen.getByText(/Search the public catalogue by furniture piece name/i)).toBeDefined()
    expect(screen.getByText('SEARCHABLE DIMENSIONS')).toBeDefined()
  })

  it('renders SearchInstrument with accessible label, input value, status badge, and clear action', () => {
    const handleClear = vi.fn()
    const handleChange = vi.fn()
    const handleSubmit = vi.fn()

    const { rerender } = render(
      <SearchInstrument
        value="rosewood"
        onChange={handleChange}
        onClear={handleClear}
        onSubmit={handleSubmit}
        statusText="4 RESULTS"
      />
    )

    const input = screen.getByLabelText('Search furniture catalogue') as HTMLInputElement
    expect(input.value).toBe('rosewood')
    expect(screen.getByText('4 RESULTS')).toBeDefined()

    const clearButton = screen.getByLabelText('Clear search query')
    fireEvent.click(clearButton)
    expect(handleClear).toHaveBeenCalledTimes(1)

    // Test Enter key
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(handleSubmit).toHaveBeenCalledTimes(1)

    // Rerender with searching status
    rerender(
      <SearchInstrument
        value="teak"
        onChange={handleChange}
        onClear={handleClear}
        statusText="SEARCHING…"
        isSearching={true}
      />
    )
    expect(screen.getByText('SEARCHING…')).toBeDefined()
  })

  it('renders DiscoveryIndex with 3 editorial destination corridors and optional collections', () => {
    const mockCollections = [
      {
        id: 'col-1',
        name: 'Dining & Banquet',
        slug: 'dining',
        description: null,
        cover_image_path: null,
        cover_image_alt: null,
        is_active: true,
        sort_order: 1,
        created_at: '2026-08-01T00:00:00Z',
        updated_at: '2026-08-01T00:00:00Z',
      },
    ]

    render(
      <MemoryRouter>
        <DiscoveryIndex collections={mockCollections} />
      </MemoryRouter>
    )

    expect(screen.getByText('EXPLORE THE ARCHIVE')).toBeDefined()
    expect(screen.getByText('The Collection Atlas')).toBeDefined()
    expect(screen.getByText('The Furniture Index')).toBeDefined()
    expect(screen.getByText('The Spaces Gallery')).toBeDefined()
    expect(screen.getByText('Dining & Banquet')).toBeDefined()
  })

  it('renders QueryLens with query header, piece count, and polite screen reader announcement', () => {
    render(
      <QueryLens query="teak table" totalCount={3} />
    )

    expect(screen.getByRole('heading', { level: 2, name: /Results for/i })).toBeDefined()
    expect(screen.getByText('“teak table”')).toBeDefined()
    expect(screen.getByText('3 pieces')).toBeDefined()
    expect(screen.getByText('3 pieces found for "teak table".')).toBeDefined()
  })

  it('renders SearchZeroMatch with guidance and recovery action links', () => {
    const handleClear = vi.fn()

    render(
      <MemoryRouter>
        <SearchZeroMatch query="spaceship" onClear={handleClear} />
      </MemoryRouter>
    )

    expect(screen.getByText(/No furniture found for/i)).toBeDefined()
    expect(screen.getByText('“spaceship”')).toBeDefined()
    expect(screen.getByText('01 // CORE PIECES')).toBeDefined()
    expect(screen.getByText('Browse Complete Catalogue')).toBeDefined()
    expect(screen.getByText('Explore Collections')).toBeDefined()
    expect(screen.getByText('Request Custom Quote →')).toBeDefined()

    const clearButton = screen.getByRole('button', { name: /Clear Search/i })
    fireEvent.click(clearButton)
    expect(handleClear).toHaveBeenCalledTimes(1)
  })

  it('renders SearchDiscoveryBridge with custom quote CTA and collections link', () => {
    render(
      <MemoryRouter>
        <SearchDiscoveryBridge />
      </MemoryRouter>
    )

    expect(screen.getByText("Didn't find the exact piece for your space?")).toBeDefined()
    expect(screen.getByText('Request Custom Quote')).toBeDefined()
    expect(screen.getByText('Explore Collections')).toBeDefined()
  })
})
