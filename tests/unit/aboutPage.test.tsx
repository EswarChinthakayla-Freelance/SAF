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
  email: 'srianjaneyafurniturestallur@gmail.com',
  phone: '+91 7337299661',
  address: 'No. 42 Artisans Avenue, Woodcraft District, Bengaluru, Karnataka 560001',
  instagram_url: 'https://instagram.com/srianjaneyafurnitures',
  whatsapp_number: '+917337299661',
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

  it('renders about manifesto header, breadcrumb, and intro', () => {
    renderAboutPage()

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Craftsmanship at the Intersection of Heritage & Modern Architecture/i,
      })
    ).toBeDefined()
    expect(screen.getByText(/Sri Anjaneya Furnitures is dedicated to preserving the art of bespoke Indian solid woodcraft/i)).toBeDefined()
    expect(screen.getByText('01 // THE MANIFESTO')).toBeDefined()
    expect(screen.getByText('Read The Manifesto')).toBeDefined()
  })

  it('renders Material Observatory and Craft Philosophy tenets', () => {
    renderAboutPage()

    expect(screen.getByText('CHAPTER 02 // MATERIAL & SILHOUETTE')).toBeDefined()
    expect(screen.getByText('Solid Native Hardwoods')).toBeDefined()
    expect(screen.getByText('Architectural Silhouettes')).toBeDefined()
    expect(screen.getByText('Generational Permanence')).toBeDefined()

    expect(screen.getByText('CHAPTER 03 // CRAFT PHILOSOPHY')).toBeDefined()
    expect(screen.getByText('Material Honesty')).toBeDefined()
    expect(screen.getByText('Joinery as Architecture')).toBeDefined()
    expect(screen.getByText('Spatial Harmony')).toBeDefined()
    expect(screen.getByText('Generational Duty')).toBeDefined()
  })

  it('renders showroom address and hours from site settings', () => {
    renderAboutPage()

    expect(
      screen.getByText('No. 42 Artisans Avenue, Woodcraft District, Bengaluru, Karnataka 560001')
    ).toBeDefined()
    expect(screen.getByText('Monday – Saturday')).toBeDefined()
    expect(screen.getByText('10:00 AM – 8:00 PM')).toBeDefined()
    expect(screen.getByText('Get Directions')).toBeDefined()
    expect(screen.getByText('WhatsApp Concierge')).toBeDefined()
  })

  it('renders continue journey destination rules and bespoke quote CTA', () => {
    renderAboutPage()

    expect(screen.getByText('CHAPTER 06 // CONTINUE THE JOURNEY')).toBeDefined()
    expect(screen.getByText('The Collection Atlas')).toBeDefined()
    expect(screen.getByText('The Furniture Index')).toBeDefined()
    expect(screen.getByText('Spaces, Styled.')).toBeDefined()
    expect(screen.getByText('Request Custom Quote')).toBeDefined()
  })
})
