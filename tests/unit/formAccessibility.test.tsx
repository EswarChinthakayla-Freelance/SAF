import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { InquiryForm } from '@/components/features/inquiry/InquiryForm'
import { InquirySuccess } from '@/components/features/inquiry/InquirySuccess'

const mockSubmit = vi.fn()

vi.mock('@/hooks/mutations/useSubmitInquiry', () => ({
  useSubmitInquiry: () => ({
    submit: mockSubmit,
    isSubmitting: false,
    serverError: null,
  }),
}))

describe('Form Accessibility & Validation Semantics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all form inputs with accessible labels and required indicators', () => {
    render(
      <MemoryRouter>
        <InquiryForm onSuccess={vi.fn()} />
      </MemoryRouter>
    )

    expect(screen.getByLabelText(/Full Name/i)).toBeDefined()
    expect(screen.getByLabelText(/Email Address/i)).toBeDefined()
    expect(screen.getByLabelText(/Requirements & Dimensions/i)).toBeDefined()
  })

  it('sets aria-invalid and aria-describedby error elements on validation failure', async () => {
    render(
      <MemoryRouter>
        <InquiryForm onSuccess={vi.fn()} />
      </MemoryRouter>
    )

    const submitBtn = screen.getByRole('button', { name: /Send Inquiry Brief/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/Full Name/i)
      expect(nameInput.getAttribute('aria-invalid')).toBe('true')
      expect(nameInput.getAttribute('aria-describedby')).toBe('name-error')
      expect(screen.getByText(/Name must be at least 2 characters/i)).toBeDefined()
    })
  })

  it('renders InquirySuccess with role region and auto-focuses on mount', () => {
    render(
      <MemoryRouter>
        <InquirySuccess onReset={vi.fn()} />
      </MemoryRouter>
    )

    const region = screen.getByRole('region', { name: /Inquiry submission confirmation/i })
    expect(region).toBeDefined()
    expect(document.activeElement).toBe(region)
  })
})
