import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog'

describe('ConfirmDeleteDialog component', () => {
  it('renders record name and consequence explanation when open', () => {
    const handleConfirm = vi.fn()
    const handleCancel = vi.fn()

    render(
      <ConfirmDeleteDialog
        isOpen={true}
        recordType="Product"
        recordName="Royal Burma Teak Chair"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    )

    expect(screen.getByText(/Royal Burma Teak Chair/)).toBeDefined()
    expect(screen.getByText(/permanently remove the record/i)).toBeDefined()

    const deleteBtn = screen.getByRole('button', { name: /delete product/i })
    fireEvent.click(deleteBtn)
    expect(handleConfirm).toHaveBeenCalledTimes(1)
  })

  it('renders nothing when isOpen=false', () => {
    const { container } = render(
      <ConfirmDeleteDialog
        isOpen={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )
    expect(container.firstChild).toBeNull()
  })
})
