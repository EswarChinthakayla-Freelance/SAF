import React, { useState, useEffect, useRef, useTransition, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageMeta } from '@/components/seo/PageMeta'
import { SearchMasthead } from '@/components/features/search/SearchMasthead'
import { SearchInstrument } from '@/components/features/search/SearchInstrument'
import { DiscoveryIndex } from '@/components/features/search/DiscoveryIndex'
import { QueryLens } from '@/components/features/search/QueryLens'
import { SearchZeroMatch } from '@/components/features/search/SearchZeroMatch'
import { SearchErrorState } from '@/components/features/search/SearchErrorState'
import { SearchDiscoveryBridge } from '@/components/features/search/SearchDiscoveryBridge'
import { ProductGrid } from '@/components/features/products/ProductGrid'
import { ProductPagination } from '@/components/features/products/ProductPagination'
import { useProducts } from '@/hooks/queries/useProducts'
import { useCollections } from '@/hooks/queries/useCollections'
import { SEARCH_CONSTRAINTS } from '@/lib/constants'

/**
 * SearchPage — "The Discovery Desk"
 * Architectural search workspace transforming the empty search experience into an
 * editorial furniture-discovery instrument.
 */
export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawQuery = searchParams.get('q') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))

  const [inputValue, setInputValue] = useState(rawQuery)
  const inputRef = useRef<HTMLInputElement>(null)
  const [, startTransition] = useTransition()

  // 1. Synchronize local input when URL changes (e.g. browser back/forward)
  useEffect(() => {
    setInputValue(rawQuery)
  }, [rawQuery])

  // Helper to commit search query to URL immediately
  const applyQuery = useCallback(
    (newQuery: string) => {
      const trimmed = newQuery.trim()
      startTransition(() => {
        const nextParams = new URLSearchParams(searchParams)
        if (trimmed.length >= SEARCH_CONSTRAINTS.MIN_QUERY_LENGTH) {
          nextParams.set('q', trimmed)
          nextParams.delete('page') // Reset page on new query
        } else if (trimmed.length === 0) {
          nextParams.delete('q')
          nextParams.delete('page')
        }
        setSearchParams(nextParams, { replace: true })
      })
    },
    [searchParams, setSearchParams]
  )

  // 2. Debounced URL update on input change (approx 300ms)
  useEffect(() => {
    const trimmedInput = inputValue.trim()

    // If identical to active query, do nothing
    if (trimmedInput === rawQuery.trim()) return

    const timer = setTimeout(() => {
      applyQuery(inputValue)
    }, SEARCH_CONSTRAINTS.DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [inputValue, rawQuery, applyQuery])

  // 3. PostgreSQL full-text search across published products
  const activeQuery = rawQuery.trim()
  const isSearchActive = activeQuery.length >= SEARCH_CONSTRAINTS.MIN_QUERY_LENGTH

  const {
    data: productsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useProducts({
    search: isSearchActive ? activeQuery : undefined,
    enabled: isSearchActive,
    page,
  })

  // Optional active collections for the Discovery Index (cached cheaply)
  const { data: collections = [] } = useCollections({ activeOnly: true })

  const products = isSearchActive ? productsData?.products || [] : []
  const totalCount = isSearchActive ? productsData?.totalCount || 0 : 0
  const totalPages = isSearchActive ? productsData?.totalPages || 1 : 1

  // Handle immediate search on Enter key
  const handleSubmit = () => {
    applyQuery(inputValue)
  }

  // Handle clearing the search
  const handleClear = () => {
    setInputValue('')
    startTransition(() => {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete('q')
      nextParams.delete('page')
      setSearchParams(nextParams, { replace: true })
    })
    inputRef.current?.focus()
  }

  // Handle pagination navigation
  const handlePageChange = (newPage: number) => {
    const nextParams = new URLSearchParams(searchParams)
    if (newPage > 1) {
      nextParams.set('page', newPage.toString())
    } else {
      nextParams.delete('page')
    }
    setSearchParams(nextParams, { replace: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Derive status badge label for The Search Instrument
  const isTypingDebounce = inputValue.trim() !== activeQuery
  const isSearching = isTypingDebounce || (isSearchActive && isLoading)

  let statusText = 'READY'
  if (isSearching) {
    statusText = 'SEARCHING…'
  } else if (isSearchActive) {
    if (totalCount > 0) {
      statusText = `${totalCount} ${totalCount === 1 ? 'RESULT' : 'RESULTS'}`
    } else {
      statusText = 'NO MATCHES'
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-24 sm:pt-28 pb-24 select-none">
      <PageMeta
        title={
          isSearchActive
            ? `Search: "${activeQuery}" | Sri Anjaneya Furnitures`
            : 'Search Furniture | Sri Anjaneya Furnitures'
        }
        description="Search Sri Anjaneya Furnitures handcrafted solid wood catalogue by piece name, wood species (Teak, Rosewood), or descriptive craft details."
        canonicalUrl="/search"
        noIndex={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* 1. The Discovery Masthead */}
        <SearchMasthead />

        {/* 2. The Search Instrument */}
        <SearchInstrument
          ref={inputRef}
          value={inputValue}
          onChange={setInputValue}
          onClear={handleClear}
          onSubmit={handleSubmit}
          statusText={statusText}
          isSearching={isSearching}
        />

        {/* 3. Main Dynamic Search Workspace */}
        <main className="space-y-12">
          {/* STATE A — Pre-Search / Empty State (No query entered) */}
          {!isSearchActive && (
            <DiscoveryIndex collections={collections} />
          )}

          {/* STATE B / C / D — Active Search Area */}
          {isSearchActive && (
            <div className="space-y-10">
              {/* Query Lens Header */}
              <QueryLens
                query={activeQuery}
                totalCount={totalCount}
                isLoading={isLoading}
              />

              {/* Recoverable Error State */}
              {isError && (
                <SearchErrorState error={error} onRetry={() => refetch()} />
              )}

              {/* Zero Match Composition */}
              {!isLoading && !isError && products.length === 0 && (
                <SearchZeroMatch query={activeQuery} onClear={handleClear} />
              )}

              {/* Product Plates Results Field */}
              {(!isError && (isLoading || products.length > 0)) && (
                <div className="space-y-12">
                  <ProductGrid
                    products={products}
                    isLoading={isLoading && products.length === 0}
                  />

                  {/* Backend Search Pagination */}
                  {totalPages > 1 && !isLoading && (
                    <div className="pt-6 border-t border-[#1C1C1C]">
                      <ProductPagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}

                  {/* Closing Architectural Bridge */}
                  {!isLoading && products.length > 0 && (
                    <div className="pt-8">
                      <SearchDiscoveryBridge />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default SearchPage
