import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HomePage } from '@/pages/public/HomePage'
import { ValueProps } from '@/components/features/home/ValueProps'
import { Testimonials } from '@/components/features/home/Testimonials'
import { CTABanner } from '@/components/features/home/CTABanner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('HomePage & Feature Components', () => {
  it('renders ValueProps with all 4 architectural pillars', () => {
    renderWithProviders(<ValueProps />)
    expect(screen.getByText('Handcrafted in India')).toBeDefined()
    expect(screen.getByText('Noble Hardwoods & Materials')).toBeDefined()
    expect(screen.getByText('White-Glove Delivery')).toBeDefined()
    expect(screen.getByText('5-Year Structural Warranty')).toBeDefined()
  })

  it('renders static testimonials without database dependency', () => {
    renderWithProviders(<Testimonials />)
    expect(screen.getByText(/trusted by discerning homes/i)).toBeDefined()
  })

  it('renders CTABanner with quote and catalogue exploration links', () => {
    renderWithProviders(<CTABanner />)
    expect(screen.getByText(/request a bespoke quote/i)).toBeDefined()
    expect(screen.getByText(/explore complete catalogue/i)).toBeDefined()
  })

  it('renders the complete HomePage composition', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText(/explore by space/i)).toBeDefined()
    expect(screen.getByText(/crafted with purpose/i)).toBeDefined()
    expect(screen.getByText(/living with sri anjaneya furnitures/i)).toBeDefined()
  })
})
