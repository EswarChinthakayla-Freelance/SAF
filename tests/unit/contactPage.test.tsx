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
  email: 'concierge@srianjaneyafurnitures.com',
  phone: '+91 98765 43210',
  address: 'No. 42 Artisans Avenue, Woodcraft District, Bengaluru, Karnataka 560001',
  instagram_url: 'https://instagram.com/srianjaneyafurnitures',
  whatsapp_number: '+919876543210',
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
    expect(screen.getByText('+91 98765 43210')).toBeDefined()
    expect(screen.getByText('concierge@srianjaneyafurnitures.com')).toBeDefined()
    expect(screen.getByText('Chat with us on WhatsApp')).toBeDefined()
    expect(screen.getByText('Monday – Saturday')).toBeDefined()
  })

  it('prefills product information when ?product=slug is present in URL', () => {
    renderContactPage('/contact?product=royal-teak-dining-table')

    expect(screen.getByText(/Request Quote for royal teak dining table/i)).toBeDefined()
  })

  it('renders showroom map iframe with accessible title', () => {
    renderContactPage()

    const mapIframe = screen.getByTitle('Sri Anjaneya Furnitures showroom location')
    expect(mapIframe).toBeDefined()
  })
})
