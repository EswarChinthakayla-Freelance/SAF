import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PriceTag } from '@/components/brand/PriceTag'

describe('PriceTag component', () => {
  it('renders formatted current price in INR', () => {
    render(<PriceTag price={185000} />)
    expect(screen.getByText(/1,85,000/)).toBeDefined()
  })

  it('renders compare price with strikethrough when comparePrice > price', () => {
    render(<PriceTag price={185000} comparePrice={210000} />)
    expect(screen.getByText(/1,85,000/)).toBeDefined()
    const compareElement = screen.getByText(/2,10,000/)
    expect(compareElement).toBeDefined()
    expect(compareElement.className).toContain('line-through')
  })

  it('does not render compare price if it is lower than or equal to price', () => {
    render(<PriceTag price={185000} comparePrice={185000} />)
    const matches = screen.queryAllByText(/1,85,000/)
    expect(matches.length).toBe(1)
  })
})
