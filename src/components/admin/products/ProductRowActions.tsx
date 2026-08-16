import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Edit01Icon,
  MoreHorizontalIcon,
  ViewIcon,
  GlobeIcon,
  Delete02Icon,
  UnavailableIcon,
} from '@hugeicons/core-free-icons'
import type { ProductListItem } from '@/types/app'

export interface ProductRowActionsProps {
  product: ProductListItem
  onTogglePublish?: (product: ProductListItem) => void
  onDelete: (product: ProductListItem) => void
  isPendingPublish?: boolean
}

export const ProductRowActions: React.FC<ProductRowActionsProps> = ({
  product,
  onTogglePublish,
  onDelete,
  isPendingPublish = false,
}) => {
  const navigate = useNavigate()

  return (
    <div
      className="flex items-center justify-end gap-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Primary Action Button: View / Preview */}
      <button
        type="button"
        onClick={() => navigate(`/admin/products/${product.id}/preview`)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans font-medium text-[#C9A84C] hover:text-[#E8B84B] hover:bg-[#1C1C1C] rounded transition-colors cursor-pointer"
        aria-label={`View ${product.name}`}
      >
        <HugeiconsIcon icon={ViewIcon} className="w-3.5 h-3.5" />
        <span>View</span>
      </button>

      {/* More Actions Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`More actions for ${product.name}`}
          className="p-1.5 text-[#7A746B] hover:text-[#F5F0E8] hover:bg-[#1A1A1A] rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] cursor-pointer"
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} className="w-4 h-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-48 bg-[#111111] border border-[#2A2A2A] text-[#F5F0E8] p-1 shadow-xl z-50 rounded-none"
        >
          {/* Inspect Piece (Preview) */}
          <DropdownMenuItem
            onClick={() => navigate(`/admin/products/${product.id}/preview`)}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#D1CCC2] hover:text-[#F5F0E8] hover:bg-[#1C1C1C] rounded cursor-pointer"
          >
            <HugeiconsIcon icon={ViewIcon} className="w-3.5 h-3.5 text-[#9B958B]" />
            <span>Product Inspector</span>
          </DropdownMenuItem>

          {/* Edit Product Details */}
          <DropdownMenuItem
            onClick={() => navigate(`/admin/products/${product.id}`)}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#D1CCC2] hover:text-[#F5F0E8] hover:bg-[#1C1C1C] rounded cursor-pointer"
          >
            <HugeiconsIcon icon={Edit01Icon} className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Edit Details</span>
          </DropdownMenuItem>

          {/* View Public Page (if published) */}
          {product.is_published && (
            <DropdownMenuItem
              onClick={() => window.open(`/products/${product.slug}`, '_blank', 'noopener,noreferrer')}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#D1CCC2] hover:text-[#F5F0E8] hover:bg-[#1C1C1C] rounded cursor-pointer"
            >
              <HugeiconsIcon icon={GlobeIcon} className="w-3.5 h-3.5 text-[#9B958B]" />
              <span>View on Website</span>
            </DropdownMenuItem>
          )}

          {/* Toggle Publish / Unpublish */}
          {onTogglePublish && (
            <DropdownMenuItem
              onClick={() => onTogglePublish(product)}
              disabled={isPendingPublish}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#D1CCC2] hover:text-[#F5F0E8] hover:bg-[#1C1C1C] rounded cursor-pointer"
            >
              {product.is_published ? (
                <>
                  <HugeiconsIcon icon={UnavailableIcon} className="w-3.5 h-3.5 text-amber-400" />
                  <span>Unpublish to Draft</span>
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={GlobeIcon} className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Publish to Catalogue</span>
                </>
              )}
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="bg-[#242424] my-1" />

          {/* Delete Product */}
          <DropdownMenuItem
            onClick={() => onDelete(product)}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded cursor-pointer"
          >
            <HugeiconsIcon icon={Delete02Icon} className="w-3.5 h-3.5" />
            <span>Delete Product</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ProductRowActions
