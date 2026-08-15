import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'

const mockMetrics = {
  totalProducts: 24,
  activeCollections: 6,
  activeGalleryImages: 18,
  newInquiries7Days: 8,
}

const mockRecentInquiries = [
  {
    id: 'inq-1',
    name: 'Anandha Varma',
    email: 'anandha@example.com',
    phone: '+91 98765 43210',
    product_id: null,
    subject: 'Custom Teak Dining Set',
    message: 'Need 8-seater table with brass accents and custom matching chairs.',
    status: 'new',
    source: 'web',
    admin_notes: null,
    replied_at: null,
    created_at: '2026-08-15T10:00:00Z',
    updated_at: '2026-08-15T10:00:00Z',
  },
]

vi.mock('@/hooks/queries/useDashboard', () => ({
  useDashboardMetrics: () => ({
    data: mockMetrics,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
}))

vi.mock('@/hooks/queries/useInquiries', () => ({
  useRecentInquiries: () => ({
    data: mockRecentInquiries,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
}))

vi.mock('@/hooks/mutations/useInquiryMutations', () => ({
  useInquiryMutations: () => ({
    updateInquiry: {
      mutateAsync: vi.fn(),
      isPending: false,
    },
  }),
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const renderDashboard = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('AdminDashboardPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders 4 required KPI stat cards with correct metrics', () => {
    renderDashboard()

    expect(screen.getByText('Total Products')).toBeDefined()
    expect(screen.getByText('24')).toBeDefined()

    expect(screen.getByText('Active Collections')).toBeDefined()
    expect(screen.getByText('6')).toBeDefined()

    expect(screen.getByText('Active Gallery Images')).toBeDefined()
    expect(screen.getByText('18')).toBeDefined()

    expect(screen.getByText('New Inquiries')).toBeDefined()
    expect(screen.getByText('8')).toBeDefined()
  })

  it('renders recent inquiries table with customer details and status badge', () => {
    renderDashboard()

    expect(screen.getByText('Anandha Varma')).toBeDefined()
    expect(screen.getByText('anandha@example.com')).toBeDefined()
    expect(screen.getByText('Custom Teak Dining Set')).toBeDefined()
    expect(screen.getByText('New')).toBeDefined()
  })

  it('opens InquiryDetailSheet when Inspect button or row is clicked', () => {
    renderDashboard()

    const inspectBtn = screen.getByRole('button', { name: /Inspect/i })
    fireEvent.click(inspectBtn)

    expect(screen.getByText('Customer Message')).toBeDefined()
    expect(screen.getByText(/Need 8-seater table with brass accents/i)).toBeDefined()
  })

  it('renders quick action shortcuts to catalogue, inquiries, and gallery', () => {
    renderDashboard()

    expect(screen.getByText('Add Catalogue Piece')).toBeDefined()
    expect(screen.getByText('Review Quote Inquiries')).toBeDefined()
    expect(screen.getByText('Inspiration Gallery')).toBeDefined()
  })
})
