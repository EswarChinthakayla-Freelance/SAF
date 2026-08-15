import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GoldButton } from '@/components/brand/GoldButton'

describe('GoldButton component', () => {
  it('renders children and responds to click events', () => {
    const handleClick = vi.fn()
    render(<GoldButton onClick={handleClick}>Explore Pieces</GoldButton>)

    const button = screen.getByRole('button', { name: /explore pieces/i })
    expect(button).toBeDefined()
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disables interaction and displays loading state when loading=true', () => {
    const handleClick = vi.fn()
    render(
      <GoldButton loading={true} loadingText="Saving Details..." onClick={handleClick}>
        Save
      </GoldButton>
    )

    const button = screen.getByRole('button')
    expect(button.getAttribute('disabled')).not.toBeNull()
    expect(screen.getByText(/saving details.../i)).toBeDefined()
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('supports outline variant', () => {
    render(<GoldButton variant="outline">Outline Action</GoldButton>)
    const button = screen.getByRole('button', { name: /outline action/i })
    expect(button.className).toContain('border')
  })
})
