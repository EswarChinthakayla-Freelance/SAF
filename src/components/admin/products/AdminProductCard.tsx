import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ProductStatusBadge } from './ProductStatusBadge'
import { ProductRowActions } from './ProductRowActions'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/dates'
import { getMediaUrl } from '@/lib/media'
import { HugeiconsIcon } from '@hugeicons/react'
import { Image01Icon, ViewIcon } from '@hugeicons/core-free-icons'
import type { ProductListItem } from '@/types/app'

export interface AdminProductCardProps {
  product: ProductListItem
  onTogglePublish?: (product: ProductListItem) => void
  onDelete: (product: ProductListItem) => void
  isPendingPublish?: boolean
}

export const AdminProductCard: React.FC<AdminProductCardProps> = ({
  product,
  onTogglePublish,
  onDelete,
  isPendingPublish = false,
}) => {
  const navigate = useNavigate()
  const imageUrl = product.cover_image_path
    ? getMediaUrl('product-images', product.cover_image_path, 'card')
    : null

  return (
    <div
      onClick={() => navigate(`/admin/products/${product.id}/preview`)}
      className="group relative bg-[#111111] border border-[#242424] hover:border-[#383838] rounded-none overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-sm cursor-pointer hover:bg-[#141414]"
    >
      {/* 1. Image Stage */}
      <div className="relative aspect-[4/3] w-full bg-[#161616] border-b border-[#1F1F1F] overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-[#555]">
            <HugeiconsIcon icon={Image01Icon} className="w-8 h-8" />
            <span className="text-[10px] font-sans">No Image</span>
          </div>
        )}

        {/* Top-Left: Status Badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <ProductStatusBadge
            isPublished={product.is_published}
            onToggle={onTogglePublish ? () => onTogglePublish(product) : undefined}
            isPending={isPendingPublish}
            interactive={true}
          />
        </div>

        {/* Top-Right: Quick More Actions */}
        <div
          className="absolute top-2.5 right-2.5 z-10 bg-[#0A0A0A]/80 backdrop-blur-sm rounded"
          onClick={(e) => e.stopPropagation()}
        >
          <ProductRowActions
            product={product}
            onTogglePublish={onTogglePublish}
            onDelete={onDelete}
            isPendingPublish={isPendingPublish}
          />
        </div>
      </div>

      {/* 2. Body Details */}
      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="font-sans font-medium text-sm text-[#F5F0E8] group-hover:text-[#E8B84B] transition-colors truncate">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 text-[11px] font-sans text-[#7A746B]">
            <span className="font-mono text-[#9B958B]">{product.product_code || '—'}</span>
            <span>·</span>
            <span className="truncate">{product.collections?.name || 'Unassigned'}</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-[#1C1C1C]">
          <div className="font-mono font-semibold text-sm text-[#F5F0E8]">
            {formatCurrency(product.price, product.currency)}
          </div>
          <span className="text-[11px] font-sans text-[#7A746B]">
            Updated {formatDate(product.updated_at || product.created_at)}
          </span>
        </div>
      </div>

      {/* 3. Footer Action Bar */}
      <div
        className="px-4 py-2.5 bg-[#141414] border-t border-[#1F1F1F] flex items-center justify-between gap-2 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => navigate(`/admin/products/${product.id}/preview`)}
          className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-[#C9A84C] hover:text-[#E8B84B] transition-colors cursor-pointer"
        >
          <HugeiconsIcon icon={ViewIcon} className="w-3.5 h-3.5" />
          <span>View Piece</span>
        </button>

        {onTogglePublish && (
          <button
            type="button"
            onClick={() => onTogglePublish(product)}
            disabled={isPendingPublish}
            className="text-[11px] font-sans text-[#8A847A] hover:text-[#F5F0E8] transition-colors cursor-pointer disabled:opacity-50"
          >
            {product.is_published ? 'Unpublish' : 'Publish'}
          </button>
        )}
      </div>
    </div>
  )
}

export default AdminProductCard
