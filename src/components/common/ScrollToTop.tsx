import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Restores window scroll position to the top on pathname changes.
 * Avoids resetting scroll during local search-param filter adjustments on the same route.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
  }, [pathname])

  return null
}
