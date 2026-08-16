import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { InquiryForm } from '@/components/features/inquiry/InquiryForm'

const mockSubmit = vi.fn()

vi.mock('@/hooks/mutations/useSubmitInquiry', () => ({
  useSubmitInquiry: () => ({
    submit: mockSubmit,
    isSubmitting: false,
    serverError: null,
  }),
}))

describe('InquiryForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSubmit.mockResolvedValue({ success: true, inquiryId: 'inq-123' })
  })

  it('renders all required form inputs, labels, and character counter', () => {
    render(<InquiryForm onSuccess={vi.fn()} />)

    expect(screen.getByLabelText(/Full Name/i)).toBeDefined()
    expect(screen.getByLabelText(/Email Address/i)).toBeDefined()
    expect(screen.getByLabelText(/Phone \/ WhatsApp/i)).toBeDefined()
    expect(screen.getByLabelText(/Inquiry Subject/i)).toBeDefined()
    expect(screen.getByLabelText(/Requirements/i)).toBeDefined()
    expect(screen.getByText('0/40 min characters')).toBeDefined()
  })

  it('validates minimum 40 characters for message and prevents submission', async () => {
    const handleSuccess = vi.fn()
    render(<InquiryForm onSuccess={handleSuccess} />)

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Ramesh Varma' } })
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'ramesh@example.com' } })
    fireEvent.change(screen.getByLabelText(/Requirements/i), {
      target: { value: 'Short message' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Send Inquiry/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/Inquiry message must be at least 40 characters/i)
      ).toBeDefined()
    })
    expect(mockSubmit).not.toHaveBeenCalled()
    expect(handleSuccess).not.toHaveBeenCalled()
  })

  it('submits valid inquiry data via useSubmitInquiry and calls onSuccess', async () => {
    const handleSuccess = vi.fn()
    render(<InquiryForm onSuccess={handleSuccess} />)

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Ramesh Varma' } })
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'ramesh@example.com' } })
    fireEvent.change(screen.getByLabelText(/Requirements/i), {
      target: {
        value: 'I would like a custom 8-seater Burma teak dining table with brass accents and matching chairs.',
      },
    })

    fireEvent.click(screen.getByRole('button', { name: /Send Inquiry/i }))

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Ramesh Varma',
          email: 'ramesh@example.com',
          message: 'I would like a custom 8-seater Burma teak dining table with brass accents and matching chairs.',
        })
      )
      expect(handleSuccess).toHaveBeenCalledWith('inq-123')
    })
  })

  it('retains all user-typed values when submission fails and does not call onSuccess', async () => {
    mockSubmit.mockResolvedValue({ success: false, error: 'Network timeout error' })
    const handleSuccess = vi.fn()
    render(<InquiryForm onSuccess={handleSuccess} />)

    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/Email Address/i) as HTMLInputElement
    const messageInput = screen.getByLabelText(/Requirements/i) as HTMLTextAreaElement

    fireEvent.change(nameInput, { target: { value: 'Venkatesh Rao' } })
    fireEvent.change(emailInput, { target: { value: 'venkat@example.com' } })
    fireEvent.change(messageInput, {
      target: {
        value: 'We need custom rosewood mandir cabinetry designed for a modern apartment.',
      },
    })

    fireEvent.click(screen.getByRole('button', { name: /Send Inquiry/i }))

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
      expect(handleSuccess).not.toHaveBeenCalled()
    })

    // Assert values remain in the inputs so user does not lose their typed data
    expect(nameInput.value).toBe('Venkatesh Rao')
    expect(emailInput.value).toBe('venkat@example.com')
    expect(messageInput.value).toBe('We need custom rosewood mandir cabinetry designed for a modern apartment.')
  })

  it('prefills product context when productId and productName are passed', () => {
    render(
      <InquiryForm
        productId="bba341b9-d7ce-44cc-81d1-4543029056b2"
        productName="Burma Teak Bed"
        onSuccess={vi.fn()}
      />
    )

    expect(screen.getByText('ENQUIRING ABOUT SPECIFIC PIECE')).toBeDefined()
    expect(screen.getByText('Burma Teak Bed')).toBeDefined()
    const submitBtn = screen.getByRole('button', { name: /Request Bespoke Quote/i })
    expect(submitBtn).toBeDefined()
  })
})
