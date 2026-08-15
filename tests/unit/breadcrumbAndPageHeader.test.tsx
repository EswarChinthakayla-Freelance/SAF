import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import {
  AdminBreadcrumbProvider,
  useSetAdminBreadcrumbs,
  useAdminBreadcrumbContext,
} from '@/contexts/AdminBreadcrumbContext'

describe('Section 6.10: Breadcrumb & PageHeader Architecture', () => {
  describe('PageHeader Component', () => {
    it('renders public editorial header with eyebrow, H1, description, and breadcrumbs', () => {
      render(
        <MemoryRouter>
          <PageHeader
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'Products', isCurrent: true },
            ]}
            eyebrow="OUR COLLECTION"
            title="Furniture Catalogue"
            description="Handcrafted solid timber furniture built for architectural spaces."
            withSeparator={true}
          />
        </MemoryRouter>
      )

      expect(screen.getByText('OUR COLLECTION')).toBeDefined()
      expect(screen.getByRole('heading', { level: 1, name: 'Furniture Catalogue' })).toBeDefined()
      expect(
        screen.getByText('Handcrafted solid timber furniture built for architectural spaces.')
      ).toBeDefined()
    })

    it('renders admin operational header with badge and actions', () => {
      render(
        <MemoryRouter>
          <PageHeader
            variant="admin"
            title="Royal Teak Bed"
            badge={<span data-testid="test-badge">Published</span>}
            description="SKU: RTB-001"
            actions={<button data-testid="test-action">Edit Details</button>}
          />
        </MemoryRouter>
      )

      expect(screen.getByRole('heading', { level: 1, name: 'Royal Teak Bed' })).toBeDefined()
      expect(screen.getByTestId('test-badge').textContent).toBe('Published')
      expect(screen.getByTestId('test-action')).toBeDefined()
      expect(screen.getByText('SKU: RTB-001')).toBeDefined()
    })
  })

  describe('Admin Breadcrumb Context', () => {
    const BreadcrumbConsumer: React.FC = () => {
      const { breadcrumbs } = useAdminBreadcrumbContext()
      return (
        <div>
          {breadcrumbs?.map((b) => (
            <span key={b.label} data-testid="ctx-crumb">
              {b.label}
            </span>
          ))}
        </div>
      )
    }

    const TestPage: React.FC = () => {
      useSetAdminBreadcrumbs([
        { label: 'Admin', href: '/admin' },
        { label: 'Products', href: '/admin/products' },
        { label: 'Custom Teak Chair', isCurrent: true },
      ])
      return <div data-testid="child-page">Child Page Content</div>
    }

    it('allows admin child page to set contextual breadcrumbs in provider context', () => {
      render(
        <AdminBreadcrumbProvider>
          <BreadcrumbConsumer />
          <TestPage />
        </AdminBreadcrumbProvider>
      )

      const crumbs = screen.getAllByTestId('ctx-crumb')
      expect(crumbs).toHaveLength(3)
      expect(screen.getByText('Custom Teak Chair')).toBeDefined()
    })
  })
})
