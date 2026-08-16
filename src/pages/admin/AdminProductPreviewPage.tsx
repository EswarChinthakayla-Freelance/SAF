import React, { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAdminProduct } from '@/hooks/queries/useProducts'
import { useProductMutations } from '@/hooks/mutations/useProductMutations'
import { useSetAdminBreadcrumbs } from '@/contexts/AdminBreadcrumbContext'
import type { AppBreadcrumbItem } from '@/types/app'
import { ErrorState } from '@/components/common/ErrorState'
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog'
import { AdminProductPreviewHeader } from '@/components/admin/products/preview/AdminProductPreviewHeader'
import { AdminProductMediaStage } from '@/components/admin/products/preview/AdminProductMediaStage'
import { AdminProductSummary } from '@/components/admin/products/preview/AdminProductSummary'
import { AdminProductSpecifications } from '@/components/admin/products/preview/AdminProductSpecifications'
import { AdminProductVariants } from '@/components/admin/products/preview/AdminProductVariants'
import { AdminProductTags } from '@/components/admin/products/preview/AdminProductTags'
import { AdminProductMediaOverview } from '@/components/admin/products/preview/AdminProductMediaOverview'
import { ProductReadinessPanel } from '@/components/admin/products/preview/ProductReadinessPanel'
import { AdminProductPreviewSkeleton } from '@/components/admin/products/preview/AdminProductPreviewSkeleton'
import { HugeiconsIcon } from '@hugeicons/react'
import { Edit01Icon, ArrowLeft01Icon } from '@hugeicons/core-free-icons'

export const AdminProductPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: product, isLoading, isError, error, refetch } = useAdminProduct(id)
  const { togglePublish, deleteProduct } = useProductMutations()

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Configure topbar breadcrumbs
  const breadcrumbs = useMemo<AppBreadcrumbItem[]>(
    () => [
      { label: 'Admin', href: '/admin' },
      { label: 'Products', href: '/admin/products' },
      { label: product?.name || 'Product Preview', isCurrent: true, isLoading },
    ],
    [product?.name, isLoading]
  )
  useSetAdminBreadcrumbs(breadcrumbs)

  if (isLoading) {
    return <AdminProductPreviewSkeleton />
  }

  if (isError || !product) {
    return (
      <div className="p-4 sm:p-8">
        <ErrorState
          title="Product Record Not Found"
          message={error?.message || 'We could not retrieve this product record. It may have been unlisted or removed.'}
          onRetry={refetch}
        />
        <div className="mt-6 text-center">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-[#181818] border border-[#2A2A2A] text-xs font-sans text-[#F5F0E8] hover:border-[#C9A84C] transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5" />
            <span>Return to Products Catalogue</span>
          </Link>
        </div>
      </div>
    )
  }

  const handleTogglePublish = () => {
    if (!id) return
    togglePublish.mutate({
      id,
      is_published: !product.is_published,
    })
  }

  const handleDeleteConfirm = async () => {
    if (!id) return
    setIsDeleting(true)
    try {
      await deleteProduct.mutateAsync(id)
      navigate('/admin/products')
    } catch (err) {
      console.error('Failed to delete product from preview:', err)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="space-y-8 pb-20 w-full max-w-[1600px] mx-auto">
      {/* 1. Header with Breadcrumb, H1 Title, Status Badge, and Primary Actions */}
      <AdminProductPreviewHeader
        product={product}
        onTogglePublish={handleTogglePublish}
        onDeleteClick={() => setShowDeleteDialog(true)}
        isPendingPublish={togglePublish.isPending}
      />

      {/* 2. Main Upper Asymmetric Split Stage (Visual Stage + Record Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Product Visual Stage (~58%) */}
        <div className="lg:col-span-7">
          <AdminProductMediaStage product={product} />
        </div>

        {/* Right: Record Summary Panel (~42%) */}
        <div className="lg:col-span-5">
          <AdminProductSummary product={product} />
        </div>
      </div>

      {/* 3. Description & Craftsmanship Specifications */}
      <AdminProductSpecifications product={product} />

      {/* 4. Structured Variants Presentation */}
      <AdminProductVariants
        variants={product.product_variants}
        baseCurrency={product.currency}
      />

      {/* 5. Assigned Tags */}
      <AdminProductTags tags={product.product_tags} />

      {/* 6. Media Overview Strip */}
      <AdminProductMediaOverview
        images={product.product_images}
        fallbackCoverPath={product.cover_image_path}
        productName={product.name}
      />

      {/* 7. Public Presentation & Catalogue Readiness Checklist */}
      <ProductReadinessPanel product={product} />

      {/* 8. Bottom Fast-Action Bar (Desktop/Tablet) */}
      <div className="pt-4 border-t border-[#242424] flex items-center justify-between gap-4">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-sans text-[#9B958B] hover:text-[#F5F0E8] transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5" />
          <span>Back to Products Catalogue</span>
        </Link>

        <button
          type="button"
          onClick={() => navigate(`/admin/products/${product.id}`)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none text-xs font-sans font-semibold bg-[#C9A84C] hover:bg-[#E8B84B] text-[#0A0A0A] shadow-lg transition-all cursor-pointer"
        >
          <HugeiconsIcon icon={Edit01Icon} className="w-4 h-4" />
          <span>Edit Product Record</span>
        </button>
      </div>

      {/* 9. Mobile Sticky Bottom Action Bar (< 640px) */}
      <div className="fixed bottom-0 inset-x-0 sm:hidden z-40 bg-[#0E0E0E]/95 backdrop-blur-md border-t border-[#242424] p-3 px-4 flex items-center justify-between gap-3 shadow-2xl">
        <Link
          to="/admin/products"
          className="inline-flex items-center justify-center h-10 px-3 rounded-none bg-[#161616] border border-[#2A2A2A] text-xs font-sans text-[#9B958B] hover:text-[#F5F0E8]"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
        </Link>

        <button
          type="button"
          onClick={() => navigate(`/admin/products/${product.id}`)}
          className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-none text-xs font-sans font-semibold bg-[#C9A84C] hover:bg-[#E8B84B] text-[#0A0A0A] shadow-md cursor-pointer"
        >
          <HugeiconsIcon icon={Edit01Icon} className="w-4 h-4" />
          <span>Edit Product</span>
        </button>
      </div>

      {/* 10. Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={showDeleteDialog}
        recordType="Product"
        recordName={product.name}
        consequenceMessage={`Are you sure you want to permanently delete "${product.name}"? The product record and its variant configurations will be removed from the database. Storage images will be cleaned up safely.`}
        confirmLabel="Delete Product"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default AdminProductPreviewPage
