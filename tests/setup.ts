import { afterEach, vi } from 'vitest'
import '@testing-library/jest-dom'

// 1. matchMedia Mock with prefers-reduced-motion control
let reducedMotionPreference = false

export const setReducedMotion = (enabled: boolean) => {
  reducedMotionPreference = enabled
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => {
    const isReducedMotion = query.includes('prefers-reduced-motion')
    return {
      matches: isReducedMotion ? reducedMotionPreference : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
  }),
})

// 2. Controllable IntersectionObserver Mock
type IntersectionCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void

const activeObserverCallbacks: Set<IntersectionCallback> = new Set()

export const triggerIntersection = (isIntersecting: boolean, target?: Element) => {
  const entry = {
    isIntersecting,
    target: target || document.createElement('div'),
    boundingClientRect: {} as DOMRectReadOnly,
    intersectionRatio: isIntersecting ? 1 : 0,
    intersectionRect: {} as DOMRectReadOnly,
    isType: 'IntersectionObserverEntry',
    rootBounds: null,
    time: Date.now(),
  } as unknown as IntersectionObserverEntry

  activeObserverCallbacks.forEach((cb) => {
    cb([entry], {} as IntersectionObserver)
  })
}

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin: string = '0px'
  readonly thresholds: ReadonlyArray<number> = [0]
  private callback: IntersectionCallback

  constructor(callback: IntersectionCallback) {
    this.callback = callback
    activeObserverCallbacks.add(callback)
  }

  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn(() => {
    activeObserverCallbacks.delete(this.callback)
  })
  takeRecords = vi.fn(() => [])
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})

// 3. ResizeObserver Mock
class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
})

// 4. URL.createObjectURL & URL.revokeObjectURL
if (!URL.createObjectURL) {
  URL.createObjectURL = vi.fn((blob: Blob) => `blob:${blob.size}-${Math.random()}`)
}
if (!URL.revokeObjectURL) {
  URL.revokeObjectURL = vi.fn()
}

// 5. Navigator Clipboard Mock
if (!navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue(''),
    },
    writable: true,
  })
}

// 6. Global cleanup after each test
afterEach(() => {
  vi.clearAllMocks()
  activeObserverCallbacks.clear()
  reducedMotionPreference = false
})
