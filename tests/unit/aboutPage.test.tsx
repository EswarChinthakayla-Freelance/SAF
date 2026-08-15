import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AboutPage } from '@/pages/public/AboutPage'

const mockSettings = {
  id: 1,
  brand_name: 'Sri Anjaneya Furnitures',
  tagline: 'Bespoke Solid Wood Craftsmanship',
  email: 'concierge@srianjaneyafurnitures.com',
  phone: '+91 98765 43210',
  address: 'No. 42 Artisans Avenue, Woodcraft District, Bengaluru, Karnataka 560001',
  instagram_url: 'https://instagram.com/srianjaneyafurnitures',
  whatsapp_number: '+919876543210',
  hero_heading: 'Heirloom Furniture',
  hero_subtext: 'Crafted from solid woods.',
  showroom_hours: {
    mon_sat: '10:00 AM – 8:00 PM',
    sun: '10:00 AM – 2:00 PM',
  },
  created_at: '2026-08-01T00:00:00Z',
  updated_at: '2026-08-01T00:00:00Z',
}

vi.mock('@/hooks/queries/useSiteSettings', () => ({
  useSiteSettings: () => ({
    data: mockSettings,
    isLoading: false,
    isError: false,
    error: null,
  }),
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const renderAboutPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('AboutPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders about header, brand story, and philosophy', () => {
    renderAboutPage()

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Craftsmanship at the Intersection of Heritage/i,
      })
    ).toBeDefined()
    expect(screen.getByText(/In an era dominated by mass-manufactured composite boards/i)).toBeDefined()
  })

  it('renders craftsmanship tenets in 01, 02, 03 layout', () => {
    renderAboutPage()

    expect(screen.getByText('01')).toBeDefined()
    expect(screen.getByText('Handcrafted Solid Hardwoods')).toBeDefined()
    expect(screen.getByText('02')).toBeDefined()
    expect(screen.getByText('Master Joinery & Structural Integrity')).toBeDefined()
    expect(screen.getByText('03')).toBeDefined()
    expect(screen.getByText('Considered Architectural Proportion')).toBeDefined()
  })

  it('renders showroom address and hours from site settings', () => {
    renderAboutPage()

    expect(
      screen.getByText('No. 42 Artisans Avenue, Woodcraft District, Bengaluru, Karnataka 560001')
    ).toBeDefined()
    expect(screen.getByText('Monday – Saturday')).toBeDefined()
    expect(screen.getByText('10:00 AM – 8:00 PM')).toBeDefined()
    expect(screen.getByText('Get Directions')).toBeDefined()
  })

  it('renders conversion CTA actions', () => {
    renderAboutPage()

    expect(screen.getByText('Discover furniture made for your space.')).toBeDefined()
    expect(screen.getByText('Explore Catalogue')).toBeDefined()
    expect(screen.getByText('Request a Quote')).toBeDefined()
  })
})
