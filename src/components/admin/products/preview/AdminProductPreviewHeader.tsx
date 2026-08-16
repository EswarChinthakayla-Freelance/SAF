import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowLeft01Icon,
  Edit01Icon,
  GlobeIcon,
  Copy01Icon,
  MoreHorizontalIcon,
  Delete02Icon,
  UnavailableIcon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ProductStatusBadge } from '@/components/admin/products/ProductStatusBadge'
import type { ProductWithRelations } from '@/types/app'

export interface AdminProductPreviewHeaderProps {
  product: ProductWithRelations
  onTogglePublish?: () => void
  onDeleteClick?: () => void
  isPendingPublish?: boolean
}

export const AdminProductPreviewHeader: React.FC<AdminProductPreviewHeaderProps> = ({
  product,
  onTogglePublish,
  onDeleteClick,
  isPendingPublish = false,
}) => {
  const navigate = useNavigate()
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedSlug, setCopiedSlug] = useState(false)

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!product.product_code) return
    navigator.clipboard.writeText(product.product_code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleCopySlug = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `${window.location.origin}/products/${product.slug}`
    navigator.clipboard.writeText(url)
    setCopiedSlug(true)
    setTimeout(() => setCopiedSlug(false), 2000)
  }

  return (
    <header className="space-y-4">
      {/* Top Navigation & Breadcrumb Bar */}
      <div className="flex items-center justify-between gap-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-sans text-[#7A746B]">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 text-[#9B958B] hover:text-[#C9A84C] transition-colors py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C]"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5" />
            <span>Products</span>
          </Link>
          <span className="text-[#4A4A4A]">/</span>
          <span className="text-[#F5F0E8] font-medium truncate max-w-[200px] sm:max-w-md">
            {product.name}
          </span>
        </nav>

        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-[#181818] border border-[#2E2E2E] text-[#C9A84C]">
          Product Inspector
        </span>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#F5F0E8] font-normal tracking-tight truncate">
              {product.name}
            </h1>
            <ProductStatusBadge
              isPublished={product.is_published}
              onToggle={onTogglePublish}
              isPending={isPendingPublish}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#9B958B]">
            {product.product_code && (
              <div className="inline-flex items-center gap-1.5 bg-[#141414] border border-[#262626] px-2 py-0.5 rounded font-mono text-[11px] text-[#D1CCC2]">
                <span>{product.product_code}</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  aria-label="Copy product code"
                  title="Copy product code"
                  className="text-[#7A746B] hover:text-[#C9A84C] transition-colors cursor-pointer"
                >
                  <HugeiconsIcon icon={copiedCode ? Tick02Icon : Copy01Icon} className="w-3 h-3 text-[#C9A84C]" />
                </button>
              </div>
            )}

            {product.collections?.name && (
              <span className="text-[#9B958B]">
                Collection:{' '}
                <Link
                  to={`/admin/products?collection=${product.collection_id}`}
                  className="text-[#D1CCC2] hover:text-[#C9A84C] underline-offset-4 hover:underline transition-colors"
                >
                  {product.collections.name}
                </Link>
              </span>
            )}
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          {/* View on Public Website (Only if Published) */}
          {product.is_published && (
            <a
              href={`/products/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-sans font-medium rounded-md bg-[#161616] hover:bg-[#202020] border border-[#2A2A2A] hover:border-[#383838] text-[#D1CCC2] hover:text-[#F5F0E8] transition-colors"
            >
              <HugeiconsIcon icon={GlobeIcon} className="w-3.5 h-3.5 text-[#9B958B]" />
              <span className="hidden md:inline">View on Website</span>
            </a>
          )}

          {/* Primary Edit Button (Gold) */}
          <button
            type="button"
            onClick={() => navigate(`/admin/products/${product.id}`)}
            className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md text-xs font-sans font-semibold bg-[#C9A84C] hover:bg-[#E8B84B] text-[#0A0A0A] shadow-md transition-all cursor-pointer"
          >
            <HugeiconsIcon icon={Edit01Icon} className="w-3.5 h-3.5" />
            <span>Edit Product</span>
          </button>

          {/* More Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`More actions for ${product.name}`}
              className="inline-flex items-center justify-center h-9 w-9 rounded-md bg-[#161616] hover:bg-[#202020] border border-[#2A2A2A] hover:border-[#383838] text-[#9B958B] hover:text-[#F5F0E8] transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={MoreHorizontalIcon} className="w-4 h-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 bg-[#141414] border border-[#2A2A2A] text-[#F5F0E8] shadow-2xl p-1 font-sans rounded-md"
            >
              <DropdownMenuItem
                onClick={handleCopySlug}
                className="flex items-center gap-2 px-2.5 py-2 text-xs text-[#D1CCC2] hover:text-[#F5F0E8] hover:bg-[#1F1F1F] rounded cursor-pointer"
              >
                <HugeiconsIcon icon={copiedSlug ? Tick02Icon : Copy01Icon} className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>{copiedSlug ? 'Link Copied!' : 'Copy Public URL'}</span>
              </DropdownMenuItem>

              {onTogglePublish && (
                <DropdownMenuItem
                  disabled={isPendingPublish}
                  onClick={onTogglePublish}
                  className="flex items-center gap-2 px-2.5 py-2 text-xs text-[#D1CCC2] hover:text-[#F5F0E8] hover:bg-[#1F1F1F] rounded cursor-pointer"
                >
                  <HugeiconsIcon
                    icon={product.is_published ? UnavailableIcon : GlobeIcon}
                    className={`w-3.5 h-3.5 ${product.is_published ? 'text-amber-400' : 'text-emerald-400'}`}
                  />
                  <span>{product.is_published ? 'Unpublish to Draft' : 'Publish to Catalogue'}</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator className="bg-[#242424] my-1" />

              {onDeleteClick && (
                <DropdownMenuItem
                  onClick={onDeleteClick}
                  className="flex items-center gap-2 px-2.5 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded cursor-pointer"
                >
                  <HugeiconsIcon icon={Delete02Icon} className="w-3.5 h-3.5" />
                  <span>Delete Product</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default AdminProductPreviewHeader
