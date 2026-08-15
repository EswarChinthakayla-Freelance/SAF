import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DatePicker } from '@/components/common/DatePicker'
import { DateRangePicker } from '@/components/common/DateRangePicker'

describe('DatePicker Component', () => {
  it('renders with custom placeholder and formats selected date', () => {
    const testDate = new Date('2026-08-15T00:00:00.000Z')
    const { rerender } = render(
      <DatePicker placeholder="Choose consultation date" />
    )

    expect(screen.getByText('Choose consultation date')).toBeDefined()

    rerender(
      <DatePicker value={testDate} placeholder="Choose consultation date" />
    )

    expect(screen.getByText(/August 15/i)).toBeDefined()
  })

  it('allows clearing selected date with clear button', () => {
    const handleChange = vi.fn()
    const testDate = new Date('2026-08-15T00:00:00.000Z')

    render(
      <DatePicker
        value={testDate}
        onChange={handleChange}
        clearable={true}
      />
    )

    const clearBtn = screen.getByRole('button', { name: /clear date/i })
    expect(clearBtn).toBeDefined()
    fireEvent.click(clearBtn)
    expect(handleChange).toHaveBeenCalledWith(undefined)
  })
})

describe('DateRangePicker Component', () => {
  it('renders date range when from and to dates are provided', () => {
    const range = {
      from: new Date('2026-08-01T00:00:00.000Z'),
      to: new Date('2026-08-15T00:00:00.000Z'),
    }

    render(
      <DateRangePicker
        value={range}
        placeholder="Filter range"
      />
    )

    expect(screen.getByText(/Aug 01, 2026 - Aug 15, 2026/i)).toBeDefined()
  })
})
