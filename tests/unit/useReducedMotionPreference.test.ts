import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'

describe('useReducedMotionPreference Hook', () => {
  let listeners: ((e: any) => void)[] = []
  let matchesValue = false

  beforeEach(() => {
    listeners = []
    matchesValue = false

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: matchesValue,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event: string, callback: (e: any) => void) => {
          listeners.push(callback)
        }),
        removeEventListener: vi.fn((event: string, callback: (e: any) => void) => {
          listeners = listeners.filter((l) => l !== callback)
        }),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns false when user does not prefer reduced motion', () => {
    matchesValue = false
    const { result } = renderHook(() => useReducedMotionPreference())
    expect(result.current).toBe(false)
  })

  it('returns true when user prefers reduced motion', () => {
    matchesValue = true
    const { result } = renderHook(() => useReducedMotionPreference())
    expect(result.current).toBe(true)
  })

  it('updates state when media query change listener fires', () => {
    matchesValue = false
    const { result } = renderHook(() => useReducedMotionPreference())
    expect(result.current).toBe(false)

    act(() => {
      listeners.forEach((l) => l({ matches: true }))
    })

    expect(result.current).toBe(true)
  })

  it('removes event listener on unmount', () => {
    const { unmount } = renderHook(() => useReducedMotionPreference())
    expect(listeners.length).toBe(1)

    unmount()
    expect(listeners.length).toBe(0)
  })
})
