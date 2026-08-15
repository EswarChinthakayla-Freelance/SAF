import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductCardSkeleton } from '@/components/common/ProductCardSkeleton'
import { ProductGridSkeleton } from '@/components/common/ProductGridSkeleton'
import { GalleryGridSkeleton } from '@/components/common/GalleryGridSkeleton'
import { ProductDetailSkeleton } from '@/components/common/ProductDetailSkeleton'
import { AdminTableSkeleton } from '@/components/common/AdminTableSkeleton'

describe('Domain Skeleton Components', () => {
  it('renders ProductCardSkeleton with 4:5 image ratio container', () => {
    const { container } = render(<ProductCardSkeleton />)
    const imageContainer = container.querySelector('.aspect-\\[4\\/5\\]')
    expect(imageContainer).not.toBeNull()
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true')
  })

  it('renders ProductGridSkeleton with role status and requested card count', () => {
    render(<ProductGridSkeleton count={4} />)
    const grid = screen.getByRole('status')
    expect(grid).toBeDefined()
    expect(screen.getByText('Loading products...')).toBeDefined()
  })

  it('renders GalleryGridSkeleton with role status and alternating aspect ratios', () => {
    const { container } = render(<GalleryGridSkeleton count={6} />)
    expect(screen.getByRole('status')).toBeDefined()
    expect(container.querySelectorAll('.aspect-\\[3\\/4\\]').length).toBeGreaterThan(0)
    expect(container.querySelectorAll('.aspect-\\[4\\/5\\]').length).toBeGreaterThan(0)
  })

  it('renders ProductDetailSkeleton with 2-column layout and status label', () => {
    const { container } = render(<ProductDetailSkeleton />)
    expect(screen.getByRole('status')).toBeDefined()
    expect(container.querySelector('.lg\\:col-span-7')).toBeDefined()
    expect(container.querySelector('.lg\\:col-span-5')).toBeDefined()
  })

  it('renders AdminTableSkeleton with structured headers and rows', () => {
    const { container } = render(<AdminTableSkeleton columnsCount={4} rowsCount={3} />)
    expect(screen.getByRole('status')).toBeDefined()
    expect(container.querySelectorAll('th').length).toBe(4)
    expect(container.querySelectorAll('tbody tr').length).toBe(3)
  })
})
