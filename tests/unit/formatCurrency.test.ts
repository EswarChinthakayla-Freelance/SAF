import { describe, it, expect } from 'vitest'
import { formatCurrency } from '@/utils/formatCurrency'

describe('formatCurrency utility', () => {
  it('formats positive INR amounts properly', () => {
    const formatted = formatCurrency(185000, 'INR')
    expect(formatted).toContain('1,85,000')
  })

  it('handles null and undefined safely with default ₹0', () => {
    expect(formatCurrency(null)).toBe('₹0')
    expect(formatCurrency(undefined)).toBe('₹0')
  })

  it('formats zero correctly', () => {
    const formatted = formatCurrency(0, 'INR')
    expect(formatted).toContain('0')
  })
})
