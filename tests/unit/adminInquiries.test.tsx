import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminInquiriesPage } from '@/pages/admin/AdminInquiriesPage'
import type { InquiryRow } from '@/types/app'

const mockInquiries: InquiryRow[] = [
  {
    id: 'inq-101',
    name: 'Suresh Raina',
    email: 'suresh@example.com',
    phone: '+91 99887 76655',
    product_id: null,
    subject: 'Teak Bed Frame Inquiry',
    message: 'Looking for a King size solid teak sanctuary bed frame with rattan headboard.',
    status: 'new',
    source: 'web',
    admin_notes: null,
    replied_at: null,
    created_at: '2026-08-15T12:00:00Z',
    updated_at: '2026-08-15T12:00:00Z',
  },
]

vi.mock('@/hooks/queries/useInquiries', () => ({
  useInquiries: () => ({
    data: {
      inquiries: mockInquiries,
      totalCount: 1,
      totalPages: 1,
    },
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
  useInquiryDetail: (id?: string) => ({
    data: id === 'inq-101' ? mockInquiries[0] : null,
    isLoading: false,
    isError: false,
    error: null,
  }),
}))

const mockUpdateInquiry = vi.fn()

vi.mock('@/hooks/mutations/useInquiryMutations', () => ({
  useInquiryMutations: () => ({
    updateInquiry: {
      mutate: mockUpdateInquiry,
      mutateAsync: mockUpdateInquiry,
      isPending: false,
    },
  }),
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const renderInquiriesPage = (initialRoute = '/admin/inquiries') => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/admin/inquiries" element={<AdminInquiriesPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('AdminInquiriesPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders status tabs (All, New, Read, Replied, Closed)', () => {
    renderInquiriesPage()

    expect(screen.getByRole('button', { name: 'All Inquiries' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'New' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Read' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Replied' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Closed' })).toBeDefined()
  })

  it('renders inquiry list with customer contact, subject, and status', () => {
    renderInquiriesPage()

    expect(screen.getByText('Suresh Raina')).toBeDefined()
    expect(screen.getByText('suresh@example.com')).toBeDefined()
    expect(screen.getByText('Teak Bed Frame Inquiry')).toBeDefined()
    expect(screen.getAllByText('New')[0]).toBeDefined()
  })

  it('opens InquiryDetailSheet and triggers automatic new -> read mutation', () => {
    renderInquiriesPage()

    const inspectBtn = screen.getByRole('button', { name: /Inspect/i })
    fireEvent.click(inspectBtn)

    expect(screen.getByText('Customer Message')).toBeDefined()
    expect(screen.getByText(/King size solid teak sanctuary bed/i)).toBeDefined()
    expect(screen.getByText('Internal Admin Notes')).toBeDefined()

    // Verifies automatic new -> read transition was triggered on open
    expect(mockUpdateInquiry).toHaveBeenCalledWith({
      id: 'inq-101',
      status: 'read',
    })
  })
})

