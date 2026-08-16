import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ContactPage } from '@/pages/public/ContactPage'

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

const renderContactPage = (initialRoute = '/contact') => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <ContactPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('ContactPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders contact header, showroom information, and phone/email/WhatsApp links', () => {
    renderContactPage()

    expect(screen.getByRole('heading', { level: 1, name: "Let's Talk About Your Space" })).toBeDefined()
    expect(screen.getByText('+91 7337299661')).toBeDefined()
    expect(screen.getByText('srianjaneyafurniturestallur@gmail.com')).toBeDefined()
    expect(screen.getByText('Chat with us on WhatsApp')).toBeDefined()
    expect(screen.getByText('Monday – Saturday')).toBeDefined()
  })

  it('prefills product information when ?product=slug is present in URL', () => {
    renderContactPage('/contact?product=royal-teak-dining-table')

    expect(screen.getByText('Request a Piece Quote')).toBeDefined()
    expect(screen.getByText('ENQUIRING ABOUT SPECIFIC PIECE')).toBeDefined()
    expect(screen.getByText('royal teak dining table')).toBeDefined()
    expect(screen.getByText('Request Bespoke Quote')).toBeDefined()
  })

  it('renders consultation intent rail and showroom map iframe', () => {
    renderContactPage()

    expect(screen.getByText('SELECT CONSULTATION INTENT')).toBeDefined()
    expect(screen.getByText('PRODUCT ENQUIRY')).toBeDefined()
    expect(screen.getByText('CUSTOM REQUIREMENT')).toBeDefined()

    const mapIframe = screen.getByTitle('Sri Anjaneya Furnitures showroom location')
    expect(mapIframe).toBeDefined()
  })
})
