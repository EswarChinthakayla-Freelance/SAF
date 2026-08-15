import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SEARCH_CONSTRAINTS } from '@/lib/constants'

export interface UseSearchOptions {
  syncWithUrl?: boolean
  paramName?: string
  debounceMs?: number
}

/**
 * Debounced search hook with optional URL search param synchronization.
 */
export function useSearch(options: UseSearchOptions = {}) {
  const {
    syncWithUrl = true,
    paramName = 'q',
    debounceMs = SEARCH_CONSTRAINTS.DEBOUNCE_MS,
  } = options

  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = syncWithUrl ? searchParams.get(paramName) || '' : ''

  const [query, setQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)

  // Debounce query update
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = query.trim()
      setDebouncedQuery(trimmed)

      if (syncWithUrl) {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev)
            if (trimmed.length >= SEARCH_CONSTRAINTS.MIN_QUERY_LENGTH) {
              next.set(paramName, trimmed)
              next.set('page', '1') // Reset pagination on new search
            } else {
              next.delete(paramName)
            }
            return next
          },
          { replace: true }
        )
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs, syncWithUrl, paramName, setSearchParams])

  const clearQuery = () => {
    setQuery('')
    setDebouncedQuery('')
  }

  return {
    query,
    setQuery,
    debouncedQuery,
    clearQuery,
    isSearching: query !== debouncedQuery,
  }
}
