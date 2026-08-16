import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminInquiriesPage } from '@/pages/admin/AdminInquiriesPage'
import type { AdminInquiryListItem } from '@/types/app'

const mockInquiries: AdminInquiryListItem[] = [
  {
    id: 'inq-101',
    name: 'Suresh Raina',
    email: 'suresh@example.com',
    phone: '+91 99887 76655',
    product_id: 'prod-001',
    product: {
      id: 'prod-001',
      name: 'Sanctuary Teak Bed Frame',
      slug: 'sanctuary-teak-bed-frame',
      is_published: true,
      primary_image: 'teak-bed.jpg',
    },
    subject: 'Teak Bed Frame Inquiry',
    message: 'Looking for a King size solid teak sanctuary bed frame with rattan headboard.',
    status: 'new',
    source: 'website',
    admin_notes: 'Initial telephone call scheduled for Monday.',
    replied_at: null,
    created_at: '2026-08-15T12:00:00Z',
    updated_at: '2026-08-15T12:00:00Z',
  },
  {
    id: 'inq-102',
    name: 'Ananya Sharma',
    email: 'ananya@example.com',
    phone: null,
    product_id: null,
    product: null,
    subject: 'Bespoke Dining Set',
    message: 'Interested in a 6-seater solid rosewood dining table with upholstered chairs.',
    status: 'read',
    source: 'website',
    admin_notes: null,
    replied_at: null,
    created_at: '2026-08-14T09:30:00Z',
    updated_at: '2026-08-14T09:30:00Z',
  },
]

vi.mock('@/hooks/queries/useInquiries', () => ({
  useInquiries: () => ({
    data: {
      inquiries: mockInquiries,
      totalCount: 2,
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    isFetching: false,
  }),
  useInquiryStatusCounts: () => ({
    data: {
      all: 2,
      new: 1,
      read: 1,
      replied: 0,
      closed: 0,
    },
    isLoading: false,
  }),
  useInquiryDetail: (id?: string) => ({
    data: id === 'inq-101' ? mockInquiries[0] : id === 'inq-102' ? mockInquiries[1] : null,
    isLoading: false,
    isError: false,
    error: null,
  }),
}))

const mockUpdateInquiry = vi.fn().mockResolvedValue({})
const mockDeleteInquiry = vi.fn().mockResolvedValue({})

vi.mock('@/hooks/mutations/useInquiryMutations', () => ({
  useInquiryMutations: () => ({
    updateInquiry: {
      mutate: mockUpdateInquiry,
      mutateAsync: mockUpdateInquiry,
      isPending: false,
    },
    deleteInquiry: {
      mutate: mockDeleteInquiry,
      mutateAsync: mockDeleteInquiry,
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

describe('AdminInquiriesPage — "The Conversation Desk"', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders page header, breadcrumbs, and workflow status rail with live counts', () => {
    renderInquiriesPage()

    // Header & Breadcrumb
    expect(screen.getByRole('heading', { name: 'Inquiries', level: 1 })).toBeDefined()
    expect(screen.getByText('Admin')).toBeDefined()

    // Workflow Rail Tabs
    const tabs = screen.getAllByRole('tab')
    expect(tabs.length).toBe(5)
    expect(screen.getAllByText('All')[0]).toBeDefined()
    expect(screen.getAllByText('New')[0]).toBeDefined()
    expect(screen.getAllByText('Read')[0]).toBeDefined()
    expect(screen.getAllByText('Replied')[0]).toBeDefined()
    expect(screen.getAllByText('Closed')[0]).toBeDefined()
  })

  it('renders Command Bar with search input, result count, and sort order', () => {
    renderInquiriesPage()

    expect(
      screen.getByPlaceholderText('Search name, email, phone or subject…')
    ).toBeDefined()
    expect(screen.getByText('2 enquiries')).toBeDefined()
    expect(screen.getByText('Newest first')).toBeDefined()
  })

  it('renders desktop table and mobile list with customer contact, subject, status, received, and View action', () => {
    renderInquiriesPage()

    // Customer
    expect(screen.getAllByText('Suresh Raina')[0]).toBeDefined()
    expect(screen.getAllByText('suresh@example.com')[0]).toBeDefined()
    expect(screen.getAllByText('+91 99887 76655')[0]).toBeDefined()

    // Subject & Product
    expect(screen.getAllByText('Teak Bed Frame Inquiry')[0]).toBeDefined()
    expect(screen.getAllByText(/Sanctuary Teak Bed Frame/i)[0]).toBeDefined()

    // Status Badges
    expect(screen.getAllByText('New')[0]).toBeDefined()
    expect(screen.getAllByText('Read')[0]).toBeDefined()

    // View Action
    const viewButtons = screen.getAllByRole('button', { name: /View/i })
    expect(viewButtons.length).toBeGreaterThan(0)
  })

  it('opens InquiryDetailSheet and triggers automatic new -> read mutation on first open', async () => {
    renderInquiriesPage()

    const viewButton = screen.getAllByRole('button', { name: /View/i })[0]
    fireEvent.click(viewButton)

    // Verification of Sheet content
    expect(screen.getByRole('dialog')).toBeDefined()
    expect(screen.getByText('Customer Message')).toBeDefined()
    expect(
      screen.getByText(/Looking for a King size solid teak sanctuary bed/i)
    ).toBeDefined()
    expect(screen.getByText('Internal Admin Notes')).toBeDefined()
    expect(screen.getByText('Customer Contact')).toBeDefined()

    // Verifies automatic new -> read transition was triggered on open
    expect(mockUpdateInquiry).toHaveBeenCalledWith({
      id: 'inq-101',
      status: 'read',
    })
  })

  it('allows saving internal notes inside the Detail Sheet', async () => {
    renderInquiriesPage()

    const viewButton = screen.getAllByRole('button', { name: /View/i })[0]
    fireEvent.click(viewButton)

    const notesTextarea = screen.getByLabelText('Internal admin notes')
    fireEvent.change(notesTextarea, {
      target: { value: 'Customer requested quotation for teak finish.' },
    })

    const saveNotesBtn = screen.getByRole('button', { name: /Save Notes/i })
    fireEvent.click(saveNotesBtn)

    await waitFor(() => {
      expect(mockUpdateInquiry).toHaveBeenCalledWith({
        id: 'inq-101',
        admin_notes: 'Customer requested quotation for teak finish.',
      })
    })
  })
})
