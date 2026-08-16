import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import type { InquiryRow } from '@/types/app'

const mockMetrics = {
  totalProducts: 24,
  activeCollections: 6,
  activeGalleryImages: 18,
  newInquiries7Days: 8,
}

const mockRecentInquiries: InquiryRow[] = [
  {
    id: 'inq-1',
    name: 'Anandha Varma',
    email: 'anandha@example.com',
    phone: '+91 98765 43210',
    product_id: null,
    subject: 'Custom Teak Dining Set',
    message: 'Need 8-seater table with brass accents and custom matching chairs.',
    status: 'new',
    source: 'website',
    admin_notes: null,
    replied_at: null,
    created_at: '2026-08-15T10:00:00Z',
    updated_at: '2026-08-15T10:00:00Z',
  },
]

const mockRefetchMetrics = vi.fn()
const mockRefetchInquiries = vi.fn()

vi.mock('@/hooks/queries/useDashboard', () => ({
  useDashboardMetrics: () => ({
    data: mockMetrics,
    isLoading: false,
    isError: false,
    error: null,
    refetch: mockRefetchMetrics,
    isFetching: false,
  }),
}))

vi.mock('@/hooks/queries/useInquiries', () => ({
  useRecentInquiries: () => ({
    data: mockRecentInquiries,
    isLoading: false,
    isError: false,
    error: null,
    refetch: mockRefetchInquiries,
    isFetching: false,
  }),
  useInquiryDetail: (id?: string) => ({
    data: id === 'inq-1' ? mockRecentInquiries[0] : null,
    isLoading: false,
    isError: false,
    error: null,
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

describe('AdminDashboardPage Component — "The Operations Desk"', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders compact header with Add Product and View Website actions', () => {
    renderDashboard()

    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeDefined()
    expect(screen.getByText('Manage your catalogue, gallery and customer enquiries from one place.')).toBeDefined()
    expect(screen.getByRole('button', { name: /Add Product/i })).toBeDefined()
    expect(screen.getByText('View Website')).toBeDefined()
  })

  it('renders 4 required KPI stat cards with correct values and navigation links', () => {
    renderDashboard()

    expect(screen.getByText('Total Products')).toBeDefined()
    expect(screen.getByText('24')).toBeDefined()

    expect(screen.getByText('Active Collections')).toBeDefined()
    expect(screen.getByText('6')).toBeDefined()

    expect(screen.getByText('Active Gallery Images')).toBeDefined()
    expect(screen.getByText('18')).toBeDefined()

    expect(screen.getByText('New Inquiries')).toBeDefined()
    expect(screen.getByText('8')).toBeDefined()
    expect(screen.getByText('Needs attention')).toBeDefined()
  })

  it('renders Attention panel and compact Quick Actions list', () => {
    renderDashboard()

    expect(screen.getByRole('heading', { level: 2, name: 'Attention' })).toBeDefined()
    expect(screen.getByText(/8 new enquiries awaiting response/i)).toBeDefined()

    expect(screen.getByRole('heading', { level: 2, name: 'Quick Actions' })).toBeDefined()
    expect(screen.getAllByText('Add Product').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Review Inquiries')).toBeDefined()
    expect(screen.getByText('Upload Gallery Images')).toBeDefined()
    expect(screen.getByText('Manage Collections')).toBeDefined()
    expect(screen.getByText('Brand Settings')).toBeDefined()
  })

  it('renders recent inquiries with customer details, status, and opens detail sheet on View', () => {
    renderDashboard()

    expect(screen.getByRole('heading', { level: 2, name: 'Recent Inquiries' })).toBeDefined()
    expect(screen.getAllByText('Anandha Varma')[0]).toBeDefined()
    expect(screen.getAllByText('anandha@example.com')[0]).toBeDefined()
    expect(screen.getAllByText('Custom Teak Dining Set')[0]).toBeDefined()
    expect(screen.getAllByText('New')[0]).toBeDefined()

    const viewBtn = screen.getByRole('button', { name: /View inquiry from Anandha Varma/i })
    fireEvent.click(viewBtn)

    expect(screen.getByText('Customer Message')).toBeDefined()
    expect(screen.getByText(/Need 8-seater table with brass accents/i)).toBeDefined()
  })

  it('triggers manual refresh when refresh button is clicked', () => {
    renderDashboard()

    const refreshBtn = screen.getByRole('button', { name: 'Refresh dashboard data' })
    fireEvent.click(refreshBtn)

    expect(mockRefetchMetrics).toHaveBeenCalled()
    expect(mockRefetchInquiries).toHaveBeenCalled()
  })
})
