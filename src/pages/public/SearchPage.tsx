import React, { useState, useEffect, useRef, useTransition } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { PageMeta } from '@/components/seo/PageMeta'
import { ProductGrid } from '@/components/features/products/ProductGrid'
import { ProductPagination } from '@/components/features/products/ProductPagination'
import { GoldButton } from '@/components/brand/GoldButton'
import { useProducts } from '@/hooks/queries/useProducts'
import { SEARCH_CONSTRAINTS } from '@/lib/constants'

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawQuery = searchParams.get('q') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))

  const [inputValue, setInputValue] = useState(rawQuery)
  const inputRef = useRef<HTMLInputElement>(null)
  const [, startTransition] = useTransition()

  // Synchronize input with URL query when URL changes (e.g. browser back/forward)
  useEffect(() => {
    setInputValue(rawQuery)
  }, [rawQuery])

  // Debounced URL update on input change
  useEffect(() => {
    const trimmedInput = inputValue.trim()

    // If identical to active query, do nothing
    if (trimmedInput === rawQuery) return

    const timer = setTimeout(() => {
      startTransition(() => {
        const nextParams = new URLSearchParams(searchParams)
        if (trimmedInput.length >= SEARCH_CONSTRAINTS.MIN_QUERY_LENGTH) {
          nextParams.set('q', trimmedInput)
          nextParams.delete('page') // Reset page on new query
        } else if (trimmedInput.length === 0) {
          nextParams.delete('q')
          nextParams.delete('page')
        }
        setSearchParams(nextParams, { replace: true })
      })
    }, SEARCH_CONSTRAINTS.DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [inputValue, rawQuery, searchParams, setSearchParams])

  // Query PostgreSQL full-text search across published products
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

  const products = isSearchActive ? productsData?.products || [] : []
  const totalCount = isSearchActive ? productsData?.totalCount || 0 : 0
  const totalPages = isSearchActive ? productsData?.totalPages || 1 : 1

  const handleClear = () => {
    setInputValue('')
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('q')
    nextParams.delete('page')
    setSearchParams(nextParams, { replace: true })
    inputRef.current?.focus()
  }

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

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-24 sm:pt-28 pb-24">
      <PageMeta
        title={
          isSearchActive
            ? `Search: "${activeQuery}" | Sri Anjaneya Furnitures`
            : 'Search Furniture | Sri Anjaneya Furnitures'
        }
        description="Search Sri Anjaneya Furnitures handcrafted solid wood catalogue by piece name, wood species (Teak, Rosewood, Sheesham), or room space."
        canonicalUrl="/search"
        noIndex={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* PageHeader Introduction */}
        <PageHeader
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Search', isCurrent: true },
          ]}
          eyebrow="DISCOVERY"
          title="Find Your Furniture"
          description="Search across handcrafted solid wood pieces, wood species, dimensions, and collections."
          className="text-center"
        />

        <div className="relative max-w-2xl mx-auto">
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A746B] pointer-events-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Input Element */}
          <input
            ref={inputRef}
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by piece name, timber species (Teak, Rosewood), or collection..."
            aria-label="Search furniture pieces"
            className="w-full bg-[#111111] border border-[#2A2A2A] rounded-none py-4 pl-12 pr-12 text-sm sm:text-base text-[#F5F0E8] placeholder-[#555047] focus:border-[#C9A84C] focus-visible:ring-1 focus-visible:ring-[#C9A84C] outline-none shadow-2xl transition-colors"
          />

          {/* Clear Button */}
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search query"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A746B] hover:text-[#F5F0E8] p-1 rounded-full cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C9A84C] outline-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Dynamic Results Area */}
        <main>
          {/* 1. Pre-Search State (No query entered yet) */}
          {!isSearchActive && !isLoading && (
            <div className="py-20 text-center max-w-md mx-auto space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
                Explore The Archive
              </span>
              <h2 className="font-serif text-2xl text-[#F5F0E8] font-bold">
                Search our handcrafted catalogue
              </h2>
              <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
                Discover pieces by keywords such as <span className="text-[#C9A84C] font-mono">"Teak Lounge"</span>, <span className="text-[#C9A84C] font-mono">"Dining Table"</span>, or <span className="text-[#C9A84C] font-mono">"Rosewood"</span>.
              </p>
              <div className="pt-3">
                <Link to="/products">
                  <GoldButton variant="outline" size="sm">
                    Browse All Furniture
                  </GoldButton>
                </Link>
              </div>
            </div>
          )}

          {/* 2. Error Recovery State */}
          {isError && (
            <div className="py-20 text-center max-w-md mx-auto space-y-4 bg-[#111111] border border-[#2A2A2A] p-8 rounded-none">
              <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-800/40 flex items-center justify-center mx-auto text-red-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="font-serif text-xl font-semibold text-[#F5F0E8]">
                We couldn't complete your search.
              </h2>
              <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
                {error?.message || 'A network error occurred while querying the furniture archive.'}
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <GoldButton onClick={() => refetch()} size="sm">
                  Try Again
                </GoldButton>
                <Link to="/products">
                  <GoldButton variant="outline" size="sm">
                    Browse Catalogue
                  </GoldButton>
                </Link>
              </div>
            </div>
          )}

          {/* 3. Empty Search Results State */}
          {isSearchActive && !isLoading && !isError && products.length === 0 && (
            <div className="py-20 text-center max-w-md mx-auto space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
                0 Results Found
              </span>
              <h2 className="font-serif text-2xl text-[#F5F0E8] font-bold">
                No furniture found for “{activeQuery}”.
              </h2>
              <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
                Try searching with broader timber names, room types, or explore our full collection catalogue.
              </p>
              <div className="pt-3">
                <Link to="/products">
                  <GoldButton size="sm">Browse All Furniture</GoldButton>
                </Link>
              </div>
            </div>
          )}

          {/* 4. Active Results Grid */}
          {isSearchActive && (isLoading || products.length > 0) && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
                <span className="text-xs font-mono text-[#9B958B]">
                  {isLoading
                    ? 'Searching furniture archive...'
                    : `${totalCount} ${totalCount === 1 ? 'piece' : 'pieces'} found for "${activeQuery}"`}
                </span>
              </div>

              <ProductGrid products={products} isLoading={isLoading} />

              {/* Search Result Pagination */}
              {totalPages > 1 && !isLoading && (
                <ProductPagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default SearchPage
