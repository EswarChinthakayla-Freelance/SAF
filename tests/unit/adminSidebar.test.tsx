import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { email: 'admin@srianjaneyafurnitures.com' },
    adminProfile: { display_name: 'Master Craftsman Admin' },
    signOut: vi.fn(),
  }),
}))

vi.mock('@/hooks/queries/useInquiries', () => ({
  useNewInquiryCount: () => ({
    data: 5,
    isLoading: false,
    isError: false,
  }),
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const renderSidebar = (initialRoute = '/admin') => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
        </SidebarProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('Admin AppSidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders brand identity and all primary ACP navigation items', () => {
    renderSidebar()

    expect(screen.getByText('Sri Anjaneya')).toBeDefined()
    expect(screen.getByText('Furnitures')).toBeDefined()
    expect(screen.getByText('ACP')).toBeDefined()

    expect(screen.getByText('Dashboard')).toBeDefined()
    expect(screen.getByText('Products')).toBeDefined()
    expect(screen.getByText('Collections')).toBeDefined()
    expect(screen.getByText('Inspiration Gallery')).toBeDefined()
    expect(screen.getByText('Quote Inquiries')).toBeDefined()
    expect(screen.getByText('Brand Settings')).toBeDefined()
  })

  it('displays the unread quote inquiries badge when count is greater than zero', () => {
    renderSidebar()

    expect(screen.getByText('5')).toBeDefined()
  })
})
