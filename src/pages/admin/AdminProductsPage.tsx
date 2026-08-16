import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AdminProductsToolbar, type ViewMode } from '@/components/admin/products/AdminProductsToolbar'
import { AdminProductsTable } from '@/components/admin/products/AdminProductsTable'
import { AdminProductGrid } from '@/components/admin/products/AdminProductGrid'
import { AdminProductsPagination } from '@/components/admin/products/AdminProductsPagination'
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog'
import { GoldButton } from '@/components/brand/GoldButton'
import { useAdminProducts } from '@/hooks/queries/useProducts'
import { useCollections } from '@/hooks/queries/useCollections'
import { useProductMutations } from '@/hooks/mutations/useProductMutations'
import { SEARCH_CONSTRAINTS } from '@/lib/constants'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  PlusSignIcon,
  PackageIcon,
  Search01Icon,
  RefreshIcon,
} from '@hugeicons/core-free-icons'
import type { ProductListItem } from '@/types/app'

const STORAGE_VIEW_KEY = 'admin-products-view'

/**
 * AdminProductsPage — "The Product Workspace"
 * Clean, fast catalogue management with List / Grid switcher,
 * URL-synced filtering, responsive cards, and safe publication actions.
 */
export const AdminProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // 1. View Mode Persistence (Local Storage only, excluded from server query)
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_VIEW_KEY)
      if (saved === 'grid' || saved === 'list') return saved
    } catch {
      // Fallback
    }
    return 'list'
  })

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode)
    try {
      localStorage.setItem(STORAGE_VIEW_KEY, mode)
    } catch {
      // Ignore
    }
  }, [])

  // 2. URL Search Params & Filter State
  const initialQuery = searchParams.get('q') || ''
  const initialCollection = searchParams.get('collection') || ''
  const initialStatus = (searchParams.get('status') || 'all') as 'all' | 'published' | 'draft'
  const initialPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10))

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [debouncedSearch, setDebouncedSearch] = useState(initialQuery)
  const [selectedCollectionId, setSelectedCollectionId] = useState(initialCollection)
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft'>(initialStatus)
  const [page, setPage] = useState(initialPage)

  // 3. Delete Modal State
  const [productToDelete, setProductToDelete] = useState<ProductListItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
    }, SEARCH_CONSTRAINTS.DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Sync state to URL params cleanly
  useEffect(() => {
    const nextParams = new URLSearchParams()
    if (debouncedSearch) nextParams.set('q', debouncedSearch)
    if (selectedCollectionId) nextParams.set('collection', selectedCollectionId)
    if (selectedStatus !== 'all') nextParams.set('status', selectedStatus)
    if (page > 1) nextParams.set('page', page.toString())

    setSearchParams(nextParams, { replace: true })
  }, [debouncedSearch, selectedCollectionId, selectedStatus, page, setSearchParams])

  // 4. Queries & Mutations
  const { data: collections } = useCollections({ activeOnly: false })
  const {
    data: productsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdminProducts({
    searchQuery: debouncedSearch || undefined,
    collectionId: selectedCollectionId || undefined,
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
    page,
    pageSize: 16,
  })

  const { togglePublish, deleteProduct } = useProductMutations()

  // 5. Filter Handlers
  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setPage(1)
  }

  const handleCollectionChange = (val: string) => {
    setSelectedCollectionId(val)
    setPage(1)
  }

  const handleStatusChange = (val: 'all' | 'published' | 'draft') => {
    setSelectedStatus(val)
    setPage(1)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setDebouncedSearch('')
    setSelectedCollectionId('')
    setSelectedStatus('all')
    setPage(1)
  }

  const handleTogglePublish = (product: ProductListItem) => {
    togglePublish.mutate({
      id: product.id,
      is_published: !product.is_published,
    })
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return
    setIsDeleting(true)
    try {
      await deleteProduct.mutateAsync(productToDelete.id)
      setProductToDelete(null)
    } catch (err) {
      console.error('Failed to delete product:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const products = useMemo(() => productsData?.products || [], [productsData?.products])
  const totalCount = productsData?.totalCount || 0
  const totalPages = productsData?.totalPages || 1

  const isDatabaseEmpty =
    !isLoading &&
    totalCount === 0 &&
    !debouncedSearch &&
    !selectedCollectionId &&
    selectedStatus === 'all'

  const isNoFilterMatches =
    !isLoading &&
    totalCount === 0 &&
    (Boolean(debouncedSearch) || Boolean(selectedCollectionId) || selectedStatus !== 'all')

  return (
    <div className="space-y-6 max-w-[1600px] w-full mx-auto select-none">
      {/* 1. Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222222]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-sans font-semibold text-[#F5F0E8] tracking-tight">
              Products
            </h1>
            {!isLoading && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#181818] border border-[#2A2A2A] text-xs font-mono text-[#9B958B]">
                {totalCount} {totalCount === 1 ? 'product' : 'products'}
              </span>
            )}
            {isFetching && !isLoading && (
              <HugeiconsIcon icon={RefreshIcon} className="w-3.5 h-3.5 text-[#C9A84C] animate-spin" />
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#8A847A] font-sans font-normal leading-relaxed">
            Manage catalogue products, pricing, media and publication status.
          </p>
        </div>

        <Link to="/admin/products/new" className="shrink-0">
          <GoldButton
            size="sm"
            icon={<HugeiconsIcon icon={PlusSignIcon} className="w-3.5 h-3.5" />}
            className="text-xs uppercase font-mono tracking-wider font-semibold w-full sm:w-auto"
          >
            Add Product
          </GoldButton>
        </Link>
      </div>

      {/* 2. Product Command Bar (Search, Filters, View Switcher) */}
      <AdminProductsToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCollectionId={selectedCollectionId}
        onCollectionChange={handleCollectionChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        collections={collections}
        onResetFilters={handleResetFilters}
      />

      {/* 3. Catalogue Workspace Area */}
      {isLoading ? (
        /* Loading Skeletons */
        viewMode === 'list' ? (
          <div className="bg-[#111111] border border-[#242424] rounded-none p-4 space-y-3">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="h-16 bg-[#161616] rounded border border-[#222222] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
              <div
                key={idx}
                className="h-72 bg-[#111111] border border-[#242424] rounded-none animate-pulse"
              />
            ))}
          </div>
        )
      ) : isError ? (
        /* Localized Error State */
        <div className="p-12 text-center bg-[#111111] border border-[#242424] rounded-none space-y-3">
          <p className="text-xs sm:text-sm text-red-400 font-sans">
            {error?.message || 'We could not load the products at this time.'}
          </p>
          <GoldButton onClick={() => refetch()} size="sm">
            Try Again
          </GoldButton>
        </div>
      ) : isDatabaseEmpty ? (
        /* Empty Database State */
        <div className="py-16 px-6 text-center bg-[#111111] border border-[#242424] rounded-none space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#7A746B] flex items-center justify-center mx-auto">
            <HugeiconsIcon icon={PackageIcon} className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-sans font-semibold text-[#F5F0E8]">
              No products yet
            </h2>
            <p className="text-xs text-[#8A847A] font-sans max-w-sm mx-auto">
              Add your first bespoke piece to begin building the furniture catalogue.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/admin/products/new">
              <GoldButton size="sm" icon={<HugeiconsIcon icon={PlusSignIcon} className="w-3.5 h-3.5" />}>
                Add Product
              </GoldButton>
            </Link>
          </div>
        </div>
      ) : isNoFilterMatches ? (
        /* No Filter Matches State */
        <div className="py-16 px-6 text-center bg-[#111111] border border-[#242424] rounded-none space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#7A746B] flex items-center justify-center mx-auto">
            <HugeiconsIcon icon={Search01Icon} className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-sans font-semibold text-[#F5F0E8]">
              No products match these filters
            </h2>
            <p className="text-xs text-[#8A847A] font-sans max-w-sm mx-auto">
              Try adjusting your search query, collection selection, or publication status.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-sans font-medium text-[#C9A84C] hover:text-[#E8B84B] underline transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        /* Active Catalogue List or Grid View */
        <div className="space-y-6">
          {viewMode === 'list' ? (
            <AdminProductsTable
              products={products}
              onTogglePublish={handleTogglePublish}
              onDelete={(p) => setProductToDelete(p)}
              isPendingPublish={togglePublish.isPending}
            />
          ) : (
            <AdminProductGrid
              products={products}
              onTogglePublish={handleTogglePublish}
              onDelete={(p) => setProductToDelete(p)}
              isPendingPublish={togglePublish.isPending}
            />
          )}

          {/* 4. Unified Pagination */}
          <AdminProductsPagination
            currentPage={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={16}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* 5. Safe Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={Boolean(productToDelete)}
        recordType="Product"
        recordName={productToDelete?.name}
        consequenceMessage={`Are you sure you want to permanently delete "${productToDelete?.name}"? All associated variants, specifications, and media records will be removed.`}
        confirmLabel="Delete Product"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setProductToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default AdminProductsPage
