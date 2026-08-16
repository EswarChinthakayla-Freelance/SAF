import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ProductStatusBadge } from './ProductStatusBadge'
import { ProductRowActions } from './ProductRowActions'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/dates'
import { getMediaUrl } from '@/lib/media'
import { HugeiconsIcon } from '@hugeicons/react'
import { Image01Icon } from '@hugeicons/core-free-icons'
import type { ProductListItem } from '@/types/app'

export interface AdminProductMobileRowProps {
  product: ProductListItem
  onTogglePublish?: (product: ProductListItem) => void
  onDelete: (product: ProductListItem) => void
  isPendingPublish?: boolean
}

export const AdminProductMobileRow: React.FC<AdminProductMobileRowProps> = ({
  product,
  onTogglePublish,
  onDelete,
  isPendingPublish = false,
}) => {
  const navigate = useNavigate()
  const thumbUrl = product.cover_image_path
    ? getMediaUrl('product-images', product.cover_image_path, 'thumbnail')
    : null

  return (
    <div
      onClick={() => navigate(`/admin/products/${product.id}/preview`)}
      className="p-4 rounded-none bg-[#141414] border border-[#242424] hover:border-[#383838] active:bg-[#181818] transition-colors space-y-3 cursor-pointer"
    >
      {/* Top row: Thumbnail + Details + Actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Thumbnail */}
          <div className="w-13 h-13 rounded bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden shrink-0 flex items-center justify-center">
            {thumbUrl ? (
              <img
                src={thumbUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <HugeiconsIcon icon={Image01Icon} className="w-5 h-5 text-[#555]" />
            )}
          </div>

          {/* Identity */}
          <div className="min-w-0 space-y-0.5">
            <h3 className="font-sans font-medium text-xs sm:text-sm text-[#F5F0E8] truncate">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 text-[11px] font-sans text-[#7A746B]">
              <span className="font-mono text-[#9B958B]">{product.product_code || '—'}</span>
              <span>·</span>
              <span className="truncate">{product.collections?.name || 'Unassigned'}</span>
            </div>
          </div>
        </div>

        {/* Row Actions */}
        <ProductRowActions
          product={product}
          onTogglePublish={onTogglePublish}
          onDelete={onDelete}
          isPendingPublish={isPendingPublish}
        />
      </div>

      {/* Bottom row: Price + Status + Updated */}
      <div className="flex items-center justify-between pt-2 border-t border-[#1F1F1F] text-xs">
        <div className="font-mono font-semibold text-[#F5F0E8]">
          {formatCurrency(product.price, product.currency)}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#7A746B] font-sans hidden xs:inline">
            {formatDate(product.updated_at || product.created_at)}
          </span>
          <ProductStatusBadge
            isPublished={product.is_published}
            onToggle={onTogglePublish ? () => onTogglePublish(product) : undefined}
            isPending={isPendingPublish}
            interactive={true}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminProductMobileRow
