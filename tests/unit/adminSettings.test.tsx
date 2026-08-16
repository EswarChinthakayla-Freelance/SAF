import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage'
import type { SiteSettingsRow } from '@/types/app'

const mockSettings: SiteSettingsRow = {
  id: 1,
  brand_name: 'Sri Anjaneya Furnitures',
  tagline: 'Bespoke Solid Wood Craftsmanship',
  logo_path: null,
  email: 'srianjaneyafurniturestallur@gmail.com',
  phone: '+91 7337299661',
  address: 'No. 42 Artisans Avenue, Woodcraft District, Bengaluru, Karnataka 560001',
  instagram_url: 'https://instagram.com/srianjaneyafurnitures',
  whatsapp_number: '+917337299661',
  hero_heading: 'Heirloom Furniture',
  hero_subtext: 'Crafted from seasoned solid woods.',
  showroom_hours: {
    mon_sat: '10:00 AM – 8:00 PM',
    sun: '10:00 AM – 2:00 PM',
  },
  created_at: '2026-08-01T00:00:00Z',
  updated_at: '2026-08-01T00:00:00Z',
}

const mockUpdateSettings = vi.fn()

vi.mock('@/hooks/queries/useSiteSettings', () => ({
  useSiteSettings: () => ({
    data: mockSettings,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
}))

vi.mock('@/hooks/mutations/useSettingsMutation', () => ({
  useSettingsMutation: () => ({
    saveSettings: {
      mutateAsync: mockUpdateSettings,
      isPending: false,
    },
    updateSettings: {
      mutateAsync: mockUpdateSettings,
      isPending: false,
    },
  }),
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const renderSettingsPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AdminSettingsPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('AdminSettingsPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders ChatGPT-style category navigation and general settings by default', async () => {
    renderSettingsPage()

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /General/i })[0]).toBeDefined()
    })

    expect(screen.getAllByRole('button', { name: /Brand & Logo/i })[0]).toBeDefined()
    expect(screen.getAllByRole('button', { name: /Contact & Concierge/i })[0]).toBeDefined()
    expect(screen.getAllByRole('button', { name: /Showroom Hours/i })[0]).toBeDefined()

    expect(screen.getByDisplayValue('Sri Anjaneya Furnitures')).toBeDefined()
    expect(screen.getByDisplayValue('Bespoke Solid Wood Craftsmanship')).toBeDefined()
  })

  it('switches active category when category navigation item is clicked', async () => {
    renderSettingsPage()

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /Contact/i })[0]).toBeDefined()
    })

    const contactBtn = screen.getAllByRole('button', { name: /Contact/i })[0]
    fireEvent.click(contactBtn)

    expect(screen.getByText('Contact Channels')).toBeDefined()
    expect(screen.getByDisplayValue('srianjaneyafurniturestallur@gmail.com')).toBeDefined()
    expect(screen.getByDisplayValue('+91 7337299661')).toBeDefined()
  })

  it('renders structured showroom hours in showroom category', async () => {
    renderSettingsPage()

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /Showroom Hours/i })[0]).toBeDefined()
    })

    const showroomBtn = screen.getAllByRole('button', { name: /Showroom Hours/i })[0]
    fireEvent.click(showroomBtn)

    expect(screen.getByText('Showroom Visiting Hours')).toBeDefined()
    expect(screen.getByDisplayValue('10:00 AM – 8:00 PM')).toBeDefined()
    expect(screen.getByDisplayValue('10:00 AM – 2:00 PM')).toBeDefined()
  })

  it('submits updated settings through sticky save bar', async () => {
    renderSettingsPage()

    await waitFor(() => {
      expect(screen.getByDisplayValue('Sri Anjaneya Furnitures')).toBeDefined()
    })

    const nameInput = screen.getByDisplayValue('Sri Anjaneya Furnitures')
    fireEvent.change(nameInput, { target: { value: 'Sri Anjaneya Furnitures Ltd' } })

    const saveBtn = screen.getByRole('button', { name: /Save Changes/i })
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(mockUpdateSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          settings: expect.objectContaining({
            brand_name: 'Sri Anjaneya Furnitures Ltd',
          }),
        })
      )
    })
  })

  it('switches to Featured Pieces category and displays featured items showcase', async () => {
    renderSettingsPage()

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /Featured Pieces/i })[0]).toBeDefined()
    })

    const featuredBtn = screen.getAllByRole('button', { name: /Featured Pieces/i })[0]
    fireEvent.click(featuredBtn)

    expect(screen.getByText('Homepage Featured Pieces')).toBeDefined()
    expect(screen.getByText(/Add Product to Featured Showcase/i)).toBeDefined()
  })
})
