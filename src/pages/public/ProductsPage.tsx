import React, { useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { PageMeta } from '@/components/seo/PageMeta'
import { ProductFilters } from '@/components/features/products/ProductFilters'
import { ProductGrid } from '@/components/features/products/ProductGrid'
import { ProductsToolbar } from '@/components/features/products/ProductsToolbar'
import { ActiveProductFilters } from '@/components/features/products/ActiveProductFilters'
import { ProductPagination } from '@/components/features/products/ProductPagination'
import { useProducts } from '@/hooks/queries/useProducts'
import { useCollections } from '@/hooks/queries/useCollections'
import { useTags } from '@/hooks/queries/useTags'
import {
  parseProductFilters,
  serializeProductFilters,
  isFilterActive,
  getActiveFilterCount,
} from '@/utils/productFilters'
import type { ProductFilters as ProductFilterType } from '@/types/app'
import type { SortOption } from '@/lib/constants'

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const catalogueTopRef = useRef<HTMLDivElement>(null)

  // 1. Canonical applied filter state parsed from URL
  const filters = parseProductFilters(searchParams)

  // 2. Fetch public collections and tags for filters
  const { data: collections = [] } = useCollections({ activeOnly: true })
  const { data: tags = [] } = useTags()

  // 3. Fetch paginated products using URL-driven filters
  const {
    data: productsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useProducts({
    collectionSlug: filters.collection,
    tags: filters.tags,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    availability: filters.availability,
    sort: filters.sort,
    q: filters.q,
    page: filters.page,
  })

  // Scroll to top of catalogue grid smoothly when changing pages or resetting
  const scrollToCatalogueTop = () => {
    if (catalogueTopRef.current) {
      catalogueTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Update URL search parameters
  const updateFilters = (newPartialFilters: Partial<ProductFilterType>, resetPage = true) => {
    const merged: ProductFilterType = {
      ...filters,
      ...newPartialFilters,
    }

    if (resetPage) {
      delete merged.page
    }

    setSearchParams(serializeProductFilters(merged))
  }

  // Clear all filters (preserves current sort if chosen, or resets all)
  const handleClearAll = () => {
    setSearchParams(serializeProductFilters({ sort: filters.sort }))
    scrollToCatalogueTop()
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage }, false)
    scrollToCatalogueTop()
  }

  // Active filter state helpers
  const filterActive = isFilterActive(filters)
  const activeCount = getActiveFilterCount(filters)

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-24 sm:pt-28 pb-20 overflow-x-hidden w-full">
      <PageMeta
        title="Furniture Catalogue | Sri Anjaneya Furnitures"
        description="Explore handcrafted solid wood furniture by Sri Anjaneya Furnitures. Browse bespoke living, dining, and bedroom pieces tailored for architectural sanctuaries."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header Introduction */}
        <div ref={catalogueTopRef}>
          <PageHeader
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'Products', isCurrent: true },
            ]}
            eyebrow="OUR COLLECTION"
            title="Furniture Catalogue"
            description="Each piece is individually handcrafted from seasoned Burma teak, Indian rosewood, and native hardwoods, engineered for generational heirloom endurance."
            withSeparator
          />
        </div>

        {/* Toolbar: Result Count, Search & Sort Selector */}
        <ProductsToolbar
          totalCount={productsData?.totalCount ?? 0}
          sort={filters.sort}
          onSortChange={(sort: SortOption) => updateFilters({ sort })}
          onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
          activeFilterCount={activeCount}
          searchQuery={filters.q}
          onSearchChange={(q) => updateFilters({ q: q.trim().length > 0 ? q : undefined })}
        />

        {/* Active Filter Chips (if any active) */}
        {filterActive && (
          <ActiveProductFilters
            filters={filters}
            collections={collections}
            tags={tags}
            onRemoveCollection={() => updateFilters({ collection: undefined })}
            onRemoveTag={(tagSlug) =>
              updateFilters({
                tags: (filters.tags || []).filter((t) => t !== tagSlug),
              })
            }
            onRemovePrice={() =>
              updateFilters({ minPrice: undefined, maxPrice: undefined })
            }
            onRemoveAvailability={() =>
              updateFilters({ availability: undefined })
            }
            onRemoveSearch={() => updateFilters({ q: undefined })}
            onClearAll={handleClearAll}
          />
        )}

        {/* Main Catalogue Area: Desktop Sticky Filter Rail + Product Grid */}
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
          {/* Desktop Filter Sidebar + Mobile Filter Sheet */}
          <ProductFilters
            filters={filters}
            onChange={(newFilters) => updateFilters(newFilters)}
            onReset={handleClearAll}
            collections={collections}
            tags={tags}
            isMobileOpen={isMobileFilterOpen}
            onMobileOpenChange={setIsMobileFilterOpen}
          />

          {/* Product Grid Area */}
          <main className="flex-1 w-full space-y-8" aria-label="Products catalogue">
            <ProductGrid
              products={productsData?.products || []}
              isLoading={isLoading}
              isError={isError}
              error={error}
              onRetry={() => refetch()}
              onClearFilters={handleClearAll}
              isFiltered={filterActive}
            />

            {/* Pagination Controls */}
            {productsData && productsData.totalPages > 1 && (
              <ProductPagination
                currentPage={productsData.currentPage}
                totalPages={productsData.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
