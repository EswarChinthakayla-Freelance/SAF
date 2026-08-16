import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { DashboardHeader } from '@/components/admin/dashboard/DashboardHeader'
import { DashboardStats } from '@/components/admin/dashboard/DashboardStats'
import { DashboardAttention } from '@/components/admin/dashboard/DashboardAttention'
import { AdminQuickActions } from '@/components/admin/dashboard/AdminQuickActions'
import { RecentInquiries } from '@/components/admin/dashboard/RecentInquiries'
import { MobileInquiryRow } from '@/components/admin/dashboard/MobileInquiryRow'
import { InquiryStatusBadge } from '@/components/admin/dashboard/InquiryStatusBadge'

describe('Admin Dashboard Feature Components', () => {
  it('renders DashboardHeader with H1 and links', () => {
    const handleRefresh = vi.fn()
    render(
      <MemoryRouter>
        <DashboardHeader onRefresh={handleRefresh} isRefreshing={false} />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeDefined()
    expect(screen.getByRole('button', { name: /Add Product/i })).toBeDefined()
    expect(screen.getByText('View Website')).toBeDefined()

    const refreshBtn = screen.getByRole('button', { name: 'Refresh dashboard data' })
    fireEvent.click(refreshBtn)
    expect(handleRefresh).toHaveBeenCalledTimes(1)
  })

  it('renders DashboardStats with zero values gracefully', () => {
    render(
      <MemoryRouter>
        <DashboardStats
          metrics={{
            totalProducts: 0,
            activeCollections: 0,
            activeGalleryImages: 0,
            newInquiries7Days: 0,
          }}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('No products yet')).toBeDefined()
    expect(screen.getByText('No active collections')).toBeDefined()
    expect(screen.getByText('No active gallery images')).toBeDefined()
    expect(screen.getByText('No new enquiries')).toBeDefined()
    expect(screen.queryByText('Needs attention')).toBeNull()
  })

  it('renders DashboardAttention in all-clear state when 0 new inquiries and products exist', () => {
    render(
      <MemoryRouter>
        <DashboardAttention newInquiriesCount={0} totalProducts={12} />
      </MemoryRouter>
    )

    expect(screen.getByText('Status Normal')).toBeDefined()
    expect(screen.getByText('Everything is up to date. All enquiries have been reviewed.')).toBeDefined()
  })

  it('renders AdminQuickActions with all 5 operational routes', () => {
    render(
      <MemoryRouter>
        <AdminQuickActions />
      </MemoryRouter>
    )

    expect(screen.getByText('Add Product')).toBeDefined()
    expect(screen.getByText('Review Inquiries')).toBeDefined()
    expect(screen.getByText('Upload Gallery Images')).toBeDefined()
    expect(screen.getByText('Manage Collections')).toBeDefined()
    expect(screen.getByText('Brand Settings')).toBeDefined()
  })

  it('renders RecentInquiries empty state when inquiries array is empty', () => {
    render(
      <MemoryRouter>
        <RecentInquiries inquiries={[]} onSelectInquiry={vi.fn()} />
      </MemoryRouter>
    )

    expect(screen.getByText('No enquiries yet')).toBeDefined()
    expect(screen.getByText('New customer quote requests and messages will appear here as they are received.')).toBeDefined()
  })

  it('renders RecentInquiries localized error state with retry button', () => {
    const handleRetry = vi.fn()
    render(
      <MemoryRouter>
        <RecentInquiries isError={true} onRetry={handleRetry} onSelectInquiry={vi.fn()} />
      </MemoryRouter>
    )

    expect(screen.getByText('Unable to load recent inquiries at this moment.')).toBeDefined()
    const retryBtn = screen.getByRole('button', { name: /Try Again/i })
    fireEvent.click(retryBtn)
    expect(handleRetry).toHaveBeenCalledTimes(1)
  })

  it('renders MobileInquiryRow with customer name and status', () => {
    const handleSelect = vi.fn()
    const mockInquiry = {
      id: 'inq-test',
      name: 'Pooja Reddy',
      email: 'pooja@example.com',
      phone: null,
      product_id: null,
      subject: 'Living Room Consultation',
      message: 'Hello, looking for a full 3+2+1 seating arrangement.',
      status: 'read',
      source: 'website',
      admin_notes: null,
      replied_at: null,
      created_at: '2026-08-16T12:00:00Z',
      updated_at: '2026-08-16T12:00:00Z',
    }

    render(
      <MobileInquiryRow inquiry={mockInquiry} onSelect={handleSelect} />
    )

    expect(screen.getByText('Pooja Reddy')).toBeDefined()
    expect(screen.getByText('Living Room Consultation')).toBeDefined()
    expect(screen.getByText('Read')).toBeDefined()

    const cardBtn = screen.getByRole('button')
    fireEvent.click(cardBtn)
    expect(handleSelect).toHaveBeenCalledWith(mockInquiry)
  })

  it('renders InquiryStatusBadge for all 4 statuses with accessible labels', () => {
    const { rerender } = render(<InquiryStatusBadge status="new" />)
    expect(screen.getByText('New')).toBeDefined()

    rerender(<InquiryStatusBadge status="read" />)
    expect(screen.getByText('Read')).toBeDefined()

    rerender(<InquiryStatusBadge status="replied" />)
    expect(screen.getByText('Replied')).toBeDefined()

    rerender(<InquiryStatusBadge status="closed" />)
    expect(screen.getByText('Closed')).toBeDefined()
  })
})
