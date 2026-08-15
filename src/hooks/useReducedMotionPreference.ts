import { useState, useEffect } from 'react'

/**
 * Returns true if the user's OS or browser has requested reduced motion.
 * Cleanly handles modern and legacy media query listeners.
 */
export function useReducedMotionPreference(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false
    }
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
        setPrefersReducedMotion(e.matches)
      }

      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      } else if (typeof (mediaQuery as any).addListener === 'function') {
        ;(mediaQuery as any).addListener(handleChange)
        return () => (mediaQuery as any).removeListener(handleChange)
      }
    } catch {
      // Graceful fallback for non-compliant browser or test environments
    }
  }, [])

  return prefersReducedMotion
}

export default useReducedMotionPreference
