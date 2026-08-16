import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProductShareAction } from '@/components/features/products/ProductShareAction'
import { toast } from '@/components/ui/toast'

vi.mock('@/components/ui/toast', () => ({
  toast: {
    create: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

describe('ProductShareAction — 3-Tier Progressive Web Share', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Tier 1: Uses native Web Share with File payload when supported', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined)
    const canShareMock = vi.fn().mockReturnValue(true)

    // Mock fetch for image blob
    const mockBlob = new Blob(['mock-image-data'], { type: 'image/jpeg' })
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: vi.fn().mockResolvedValue(mockBlob),
    })

    Object.defineProperty(global.navigator, 'share', {
      value: shareMock,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(global.navigator, 'canShare', {
      value: canShareMock,
      writable: true,
      configurable: true,
    })

    render(
      <ProductShareAction
        productName="Royal Teak Bed"
        productSlug="royal-teak-bed"
        imageUrl="https://example.com/bed.jpg"
      />
    )

    const shareBtn = screen.getByRole('button', { name: /Share Royal Teak Bed/i })
    fireEvent.click(shareBtn)

    await waitFor(() => {
      expect(shareMock).toHaveBeenCalled()
      const shareArgs = shareMock.mock.calls[0][0]
      expect(shareArgs.files).toBeDefined()
      expect(shareArgs.files.length).toBe(1)
      expect(shareArgs.title).toContain('Royal Teak Bed')
    })
  })

  it('Tier 2: Falls back to native URL share when file sharing is unsupported', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined)
    const canShareMock = vi.fn().mockReturnValue(false)

    Object.defineProperty(global.navigator, 'share', {
      value: shareMock,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(global.navigator, 'canShare', {
      value: canShareMock,
      writable: true,
      configurable: true,
    })

    render(
      <ProductShareAction
        productName="Royal Teak Bed"
        productSlug="royal-teak-bed"
        imageUrl="https://example.com/bed.jpg"
      />
    )

    const shareBtn = screen.getByRole('button', { name: /Share Royal Teak Bed/i })
    fireEvent.click(shareBtn)

    await waitFor(() => {
      expect(shareMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining('Royal Teak Bed'),
          url: expect.stringContaining('/products/royal-teak-bed'),
        })
      )
    })
  })

  it('Tier 3: Falls back to clipboard copy and toast when navigator.share is unavailable', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined)

    Object.defineProperty(global.navigator, 'share', {
      value: undefined,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(global.navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    })

    render(
      <ProductShareAction
        productName="Royal Teak Bed"
        productSlug="royal-teak-bed"
      />
    )

    const shareBtn = screen.getByRole('button', { name: /Share Royal Teak Bed/i })
    fireEvent.click(shareBtn)

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('/products/royal-teak-bed'))
      expect(toast.success).toHaveBeenCalledWith('Product link copied to clipboard.')
    })
  })

  it('handles user cancellation (AbortError) neutrally without alarming error toast', async () => {
    const abortError = new Error('Share canceled')
    abortError.name = 'AbortError'
    const shareMock = vi.fn().mockRejectedValue(abortError)

    Object.defineProperty(global.navigator, 'share', {
      value: shareMock,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(global.navigator, 'canShare', {
      value: vi.fn().mockReturnValue(false),
      writable: true,
      configurable: true,
    })

    render(
      <ProductShareAction
        productName="Royal Teak Bed"
        productSlug="royal-teak-bed"
      />
    )

    const shareBtn = screen.getByRole('button', { name: /Share Royal Teak Bed/i })
    fireEvent.click(shareBtn)

    await waitFor(() => {
      expect(shareMock).toHaveBeenCalled()
      expect(toast.error).not.toHaveBeenCalled()
    })
  })
})
