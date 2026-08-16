import React, { useState, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { PageMeta } from '@/components/seo/PageMeta'
import { CatalogueCommandBar } from '@/components/features/products/CatalogueCommandBar'
import { ActiveFilterRail } from '@/components/features/products/ActiveFilterRail'
import { ProductFilters } from '@/components/features/products/ProductFilters'
import { ProductGrid } from '@/components/features/products/ProductGrid'
import { ProductPagination } from '@/components/features/products/ProductPagination'
import { GoldButton } from '@/components/brand/GoldButton'
import { useProducts } from '@/hooks/queries/useProducts'
import { useCollections } from '@/hooks/queries/useCollections'
import { useTags } from '@/hooks/queries/useTags'
import {
  parseProductFilters,
  serializeProductFilters,
  isFilterActive,
  getActiveFilterCount,
} from '@/utils/productFilters'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import type { ProductFilters as ProductFilterType } from '@/types/app'
import type { SortOption } from '@/lib/constants'

/**
 * ProductsPage
 * "The Furniture Index" — Public Architectural Furniture Catalogue.
 * Features an editorial header, sticky Catalogue Command Bar, expandable Filter Atelier,
 * image-dominant numbered Product Plates, and monograph pagination.
 */
export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState(false)
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

  // Scroll to top of catalogue grid smoothly when changing pages
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

  // Clear all filters (preserves current sort)
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
  const totalCount = productsData?.totalCount ?? 0

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-24 sm:pt-28 pb-24 overflow-x-hidden w-full select-none">
      <PageMeta
        title="Furniture Catalogue | Sri Anjaneya Furnitures"
        description="Explore handcrafted solid wood furniture by Sri Anjaneya Furnitures. Browse bespoke living, dining, and bedroom pieces tailored for architectural sanctuaries."
        canonicalUrl="/products"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. Refined Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono tracking-wider">
          <Link
            to="/"
            className="text-[#7A746B] hover:text-[#C9A84C] transition-colors focus-visible:text-[#C9A84C] focus-visible:outline-none"
          >
            Home
          </Link>
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 text-[#3A3A3A]" aria-hidden="true" />
          <span className="text-[#C9A84C] font-semibold" aria-current="page">
            Products
          </span>
          {filters.collection && (
            <>
              <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 text-[#3A3A3A]" aria-hidden="true" />
              <span className="text-[#9B958B] capitalize">{filters.collection}</span>
            </>
          )}
        </nav>

        {/* 2. Editorial Catalogue Header Composition */}
        <header className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-end justify-between">
            {/* Left Title & Description (Cols 1-8) */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold block">
                  OUR COLLECTION
                </span>
                <span className="text-[#3A3A3A] font-mono text-xs">//</span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#7A746B]">
                  ARCHITECTURAL INDEX
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#F5F0E8] font-bold tracking-tight leading-[1.05]">
                Furniture Catalogue
              </h1>

              <p className="text-sm sm:text-base text-[#9B958B] leading-relaxed font-sans font-light max-w-2xl pt-1">
                Each piece is individually handcrafted from seasoned Burma teak, Indian rosewood, and native hardwoods, engineered for generational heirloom endurance.
              </p>
            </div>

            {/* Right Metric Plate (Cols 9-12) */}
            <div className="lg:col-span-4 lg:justify-self-end p-4 bg-[#111111] border border-[#222222] space-y-1.5 w-full sm:w-auto min-w-[220px]">
              <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-[#7A746B]">
                <span>INDEX STATUS</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" aria-hidden="true" />
              </div>
              <div className="font-mono text-lg text-[#F5F0E8] font-semibold">
                {totalCount} {totalCount === 1 ? 'Piece Available' : 'Pieces Available'}
              </div>
              <div className="font-mono text-[10px] text-[#C9A84C] tracking-wider uppercase">
                Direct Atelier Commission
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* 3. Sticky Catalogue Command Bar */}
      <div ref={catalogueTopRef} className="mt-8">
        <CatalogueCommandBar
          totalCount={totalCount}
          sort={filters.sort}
          onSortChange={(sort: SortOption) => updateFilters({ sort })}
          isFilterAtelierOpen={isDesktopFilterOpen}
          onToggleFilterAtelier={() => setIsDesktopFilterOpen((prev) => !prev)}
          onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
          activeFilterCount={activeCount}
          searchQuery={filters.q}
          onSearchChange={(q) => updateFilters({ q: q.length > 0 ? q : undefined })}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-6">
        {/* 4. Active Filter Summary Rail */}
        {filterActive && (
          <ActiveFilterRail
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

        {/* 5. Main Catalogue Field: Filter Atelier + Product Field */}
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
          {/* Desktop Filter Atelier (when open) + Mobile Sheet */}
          <ProductFilters
            filters={filters}
            onChange={(newFilters) => updateFilters(newFilters)}
            onReset={handleClearAll}
            collections={collections}
            tags={tags}
            isDesktopOpen={isDesktopFilterOpen}
            isMobileOpen={isMobileFilterOpen}
            onMobileOpenChange={setIsMobileFilterOpen}
          />

          {/* Product Grid Area */}
          <main className="flex-1 w-full space-y-8" aria-label="Furniture catalogue collection">
            <ProductGrid
              products={productsData?.products || []}
              isLoading={isLoading}
              isError={isError}
              error={error}
              onRetry={() => refetch()}
              onClearFilters={handleClearAll}
              isFiltered={filterActive}
              isFilterAtelierOpen={isDesktopFilterOpen}
            />

            {/* Architectural Monograph Pagination */}
            {productsData && productsData.totalPages > 1 && (
              <ProductPagination
                currentPage={productsData.currentPage}
                totalPages={productsData.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </main>
        </div>

        {/* 6. Catalogue Closing Bespoke Craft CTA */}
        <section
          aria-label="Custom Furniture Commission Call to Action"
          className="mt-20 p-8 sm:p-12 bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#0A0A0A] border border-[#222222] flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
              CUSTOM SPATIAL COMMISSIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F0E8]">
              Looking for a Specific Dimension or Silhouette?
            </h2>
            <p className="text-xs sm:text-sm text-[#9B958B] font-sans font-light">
              We collaborate with homeowners, architects, and interior designers to custom fabricate bespoke furniture pieces to exact spatial requirements.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
            <Link to="/contact">
              <GoldButton size="lg" className="text-xs tracking-wider uppercase font-semibold">
                Request Custom Quote
              </GoldButton>
            </Link>
            <Link to="/gallery">
              <GoldButton variant="outline" size="lg" className="text-xs tracking-wider uppercase">
                Explore Spaces Gallery
              </GoldButton>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProductsPage
