import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AdminTopbar } from '@/components/layout/AdminTopbar'
import { AdminBreadcrumbProvider } from '@/contexts/AdminBreadcrumbContext'

const mockSignOut = vi.fn()

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { email: 'admin@srianjaneyafurnitures.com' },
    adminProfile: { display_name: 'Master Craftsman Admin' },
    signOut: mockSignOut,
  }),
}))

vi.mock('@/hooks/queries/useInquiries', () => ({
  useNewInquiryCount: () => ({
    data: 3,
    isLoading: false,
    isError: false,
  }),
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const renderTopbar = (initialRoute = '/admin/products') => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <AdminBreadcrumbProvider>
          <SidebarProvider defaultOpen={true}>
            <AdminTopbar />
          </SidebarProvider>
        </AdminBreadcrumbProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('AdminTopbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders skip to main content link for keyboard accessibility', () => {
    renderTopbar()

    const skipLink = screen.getByText('Skip to main content')
    expect(skipLink).toBeDefined()
    expect(skipLink.getAttribute('href')).toBe('#admin-main-content')
  })

  it('renders contextual breadcrumbs based on active route', () => {
    renderTopbar('/admin/products')

    expect(screen.getAllByText('Admin').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Products').length).toBeGreaterThanOrEqual(1)
  })

  it('displays inquiries notification link with accessible aria-label and numeric count', () => {
    renderTopbar()

    const inquiryLink = screen.getByLabelText('3 new quote inquiries')
    expect(inquiryLink).toBeDefined()
    expect(screen.getByText('3')).toBeDefined()
  })

  it('renders account trigger with admin initials and display name', () => {
    renderTopbar()

    expect(screen.getByLabelText('Open account menu')).toBeDefined()
    expect(screen.getByText('MC')).toBeDefined()
    expect(screen.getByText('Master Craftsman Admin')).toBeDefined()
  })
})
