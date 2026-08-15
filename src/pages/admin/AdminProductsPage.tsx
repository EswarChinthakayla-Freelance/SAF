import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AdminDataTable, type Column } from '@/components/admin/AdminDataTable'
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog'
import { GoldButton } from '@/components/brand/GoldButton'
import { useAdminProducts } from '@/hooks/queries/useProducts'
import { useCollections } from '@/hooks/queries/useCollections'
import { useProductMutations } from '@/hooks/mutations/useProductMutations'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/dates'
import { getMediaUrl } from '@/lib/media'
import { SEARCH_CONSTRAINTS } from '@/lib/constants'
import type { ProductListItem } from '@/types/app'

export const AdminProductsPage: React.FC = () => {
  const navigate = useNavigate()

  // Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [page, setPage] = useState(1)

  // Delete Dialog State
  const [productToDelete, setProductToDelete] = useState<ProductListItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
      setPage(1)
    }, SEARCH_CONSTRAINTS.DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Queries
  const { data: collections } = useCollections({ activeOnly: false })
  const {
    data: productsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminProducts({
    searchQuery: debouncedSearch || undefined,
    collectionId: selectedCollectionId || undefined,
    page,
    pageSize: 15,
  })

  const { togglePublish, deleteProduct } = useProductMutations()

  // Filter handlers
  const handleResetFilters = () => {
    setSearchQuery('')
    setDebouncedSearch('')
    setSelectedCollectionId('')
    setSelectedStatus('all')
    setPage(1)
  }

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedCollectionId || selectedStatus !== 'all'
  )

  // Filter locally by published status if needed (since backend can do collection & search)
  const rawProducts = productsData?.products || []
  const filteredProducts = rawProducts.filter((p) => {
    if (selectedStatus === 'published') return p.is_published
    if (selectedStatus === 'draft') return !p.is_published
    return true
  })

  // Table Columns Definition
  const columns: Column<ProductListItem>[] = [
    {
      header: 'Product',
      accessor: (row) => {
        const thumbUrl = row.cover_image_path
          ? getMediaUrl('product-images', row.cover_image_path, 'thumbnail')
          : null

        return (
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="w-12 h-12 rounded-none bg-[#171717] border border-[#2A2A2A] overflow-hidden shrink-0 flex items-center justify-center">
              {thumbUrl ? (
                <img
                  src={thumbUrl}
                  alt={row.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="text-[10px] font-mono text-[#7A746B]">No Image</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="font-medium text-[#F5F0E8] truncate">{row.name}</div>
              <div className="text-[11px] text-[#7A746B] font-mono truncate">
                slug: {row.slug}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      header: 'Code',
      accessor: (row) => (
        <span className="font-mono text-xs text-[#D1CCC2]/90">
          {row.product_code || '—'}
        </span>
      ),
      className: 'hidden md:table-cell',
    },
    {
      header: 'Collection',
      accessor: (row) => (
        <span className="text-xs text-[#D1CCC2]/90">
          {row.collections?.name || 'Unassigned'}
        </span>
      ),
      className: 'hidden sm:table-cell',
    },
    {
      header: 'Price',
      accessor: (row) => (
        <div className="font-mono text-xs font-semibold text-[#F5F0E8]">
          {formatCurrency(row.price, row.currency)}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => {
        return (
          <button
            type="button"
            onClick={() =>
              togglePublish.mutate({ id: row.id, is_published: !row.is_published })
            }
            disabled={togglePublish.isPending}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border transition-all cursor-pointer ${row.is_published
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/60'
              : 'bg-[#171717] text-[#9B958B] border-[#2A2A2A] hover:text-[#F5F0E8]'
              }`}
          >
            {row.is_published ? 'Published' : 'Draft'}
          </button>
        )
      },
    },
    {
      header: 'Updated',
      accessor: (row) => (
        <span className="text-[11px] text-[#7A746B] font-mono">
          {formatDate(row.updated_at || row.created_at)}
        </span>
      ),
      className: 'hidden lg:table-cell',
    },
  ]

  // Row Action Renderers
  const renderActions = (row: ProductListItem) => (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => navigate(`/admin/products/${row.id}`)}
        className="px-2.5 py-1.5 text-xs text-[#C9A84C] hover:text-[#E8B84B] font-mono font-semibold rounded hover:bg-[#171717] transition-colors"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => setProductToDelete(row)}
        className="px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 font-mono rounded hover:bg-red-950/40 transition-colors"
      >
        Delete
      </button>
    </div>
  )

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        variant="admin"
        title="Furniture Products"
        description="Manage solid wood furniture pieces, variants, specifications, and publication states."
        actions={
          <Link to="/admin/products/new">
            <GoldButton size="sm" className="text-xs uppercase tracking-wider">
              + Add Product
            </GoldButton>
          </Link>
        }
      />

      {/* Structured DataTable with Search, Filters, and Pagination */}
      <AdminDataTable<ProductListItem>
        columns={columns}
        data={filteredProducts}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        onRetry={refetch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search products by title or code..."
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        filterControls={
          <div className="flex flex-wrap items-center gap-2">
            {/* Collection Filter */}
            <Select
              items={{
                all: 'All Collections',
                ...(collections || []).reduce((acc, col) => {
                  acc[col.id] = col.name
                  return acc
                }, {} as Record<string, string>),
              }}
              value={selectedCollectionId || 'all'}
              onValueChange={(val) => {
                setSelectedCollectionId(val === 'all' || !val ? '' : val)
                setPage(1)
              }}
            >
              <SelectTrigger
                aria-label="Filter by collection"
                className="bg-[#111111] border-[#2A2A2A] text-[#F5F0E8] rounded-none font-mono text-xs h-9 px-3 min-w-[150px]"
              >
                <SelectValue placeholder="All Collections" />
              </SelectTrigger>
              <SelectContent className="bg-[#111111] border-[#2A2A2A] text-[#F5F0E8] rounded-none shadow-2xl z-50">
                <SelectGroup>
                  <SelectItem value="all">All Collections</SelectItem>
                  {collections?.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              items={{
                all: 'All Statuses',
                published: 'Published',
                draft: 'Draft',
              }}
              value={selectedStatus}
              onValueChange={(val) => {
                setSelectedStatus((val || 'all') as any)
                setPage(1)
              }}
            >
              <SelectTrigger
                aria-label="Filter by publication status"
                className="bg-[#111111] border-[#2A2A2A] text-[#F5F0E8] rounded-none font-mono text-xs h-9 px-3 min-w-[130px]"
              >
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#111111] border-[#2A2A2A] text-[#F5F0E8] rounded-none shadow-2xl z-50">
                <SelectGroup>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        }
        emptyTitle="No products found"
        emptyDescription="No furniture pieces matched your active filter and search criteria."
        emptyAction={
          <Link to="/admin/products/new">
            <GoldButton size="sm">+ Create Product</GoldButton>
          </Link>
        }
        renderActions={renderActions}
        keyExtractor={(row) => row.id}
      />

      {/* Explicit Delete Confirmation Dialog */}
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
