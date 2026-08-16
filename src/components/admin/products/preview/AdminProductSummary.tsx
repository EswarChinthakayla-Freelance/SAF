import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '@/utils/formatCurrency'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Copy01Icon,
  Tick02Icon,
  Tag01Icon,
  Folder01Icon,
  Calendar01Icon,
  Sorting05Icon,
} from '@hugeicons/core-free-icons'
import type { ProductWithRelations } from '@/types/app'

export interface AdminProductSummaryProps {
  product: ProductWithRelations
}

export const AdminProductSummary: React.FC<AdminProductSummaryProps> = ({ product }) => {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedSlug, setCopiedSlug] = useState(false)

  const handleCopyCode = () => {
    if (!product.product_code) return
    navigator.clipboard.writeText(product.product_code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleCopySlug = () => {
    navigator.clipboard.writeText(`/products/${product.slug}`)
    setCopiedSlug(true)
    setTimeout(() => setCopiedSlug(false), 2000)
  }

  const hasComparePrice =
    product.compare_price !== null &&
    product.compare_price !== undefined &&
    product.compare_price > product.price

  const publishedDateFormatted = product.published_at
    ? new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(product.published_at))
    : null

  return (
    <div className="bg-[#141414] border border-[#242424] rounded-none p-5 sm:p-6 space-y-5 shadow-lg">
      {/* Price & Valuation Stage */}
      <div className="pb-4 border-b border-[#222222] space-y-1">
        <span className="text-[11px] font-sans uppercase tracking-wider text-[#7A746B]">
          Catalogue Price
        </span>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-2xl sm:text-3xl font-serif text-[#F5F0E8] font-medium">
            {formatCurrency(product.price, product.currency)}
          </span>
          {hasComparePrice && (
            <span className="text-sm font-sans line-through text-[#666158]">
              {formatCurrency(product.compare_price, product.currency)}
            </span>
          )}
          <span className="text-xs font-mono text-[#8A847A] uppercase">
            ({product.currency || 'INR'})
          </span>
        </div>
      </div>

      {/* Structured Key Attributes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
        {/* Product Code / SKU */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[#7A746B]">
            <HugeiconsIcon icon={Tag01Icon} className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider text-[10px]">Product Code</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-[#F5F0E8] font-medium">
              {product.product_code || '—'}
            </span>
            {product.product_code && (
              <button
                type="button"
                onClick={handleCopyCode}
                aria-label="Copy product code"
                title="Copy product code"
                className="text-[#7A746B] hover:text-[#C9A84C] transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={copiedCode ? Tick02Icon : Copy01Icon} className="w-3.5 h-3.5 text-[#C9A84C]" />
              </button>
            )}
          </div>
        </div>

        {/* Collection Assignment */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[#7A746B]">
            <HugeiconsIcon icon={Folder01Icon} className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider text-[10px]">Collection</span>
          </div>
          <div>
            {product.collections?.name ? (
              <Link
                to={`/admin/products?collection=${product.collection_id}`}
                className="inline-flex items-center gap-1 text-[#E8B84B] hover:text-[#F5F0E8] font-medium transition-colors"
              >
                <span>{product.collections.name}</span>
              </Link>
            ) : (
              <span className="text-[#666158] italic">No collection assigned</span>
            )}
          </div>
        </div>

        {/* URL Slug */}
        <div className="space-y-1">
          <span className="text-[#7A746B] uppercase tracking-wider text-[10px]">
            Public Slug
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#A8A29E] truncate max-w-[180px]">
              /{product.slug}
            </span>
            <button
              type="button"
              onClick={handleCopySlug}
              aria-label="Copy public URL slug"
              title="Copy public URL slug"
              className="text-[#7A746B] hover:text-[#C9A84C] transition-colors cursor-pointer shrink-0"
            >
              <HugeiconsIcon icon={copiedSlug ? Tick02Icon : Copy01Icon} className="w-3.5 h-3.5 text-[#C9A84C]" />
            </button>
          </div>
        </div>

        {/* Display / Sort Order */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[#7A746B]">
            <HugeiconsIcon icon={Sorting05Icon} className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider text-[10px]">Display Rank</span>
          </div>
          <span className="font-mono text-xs text-[#F5F0E8]">
            #{String(product.sort_order ?? 0).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Publication Lifecycle Status */}
      <div className="pt-4 border-t border-[#222222] flex items-center justify-between text-xs text-[#8A847A]">
        <div className="flex items-center gap-1.5">
          <HugeiconsIcon icon={Calendar01Icon} className="w-3.5 h-3.5 text-[#7A746B]" />
          <span>
            {product.is_published && publishedDateFormatted
              ? `Published on ${publishedDateFormatted}`
              : 'Draft — Not visible on public website'}
          </span>
        </div>
      </div>

      {/* Short Description Block */}
      {product.short_desc && (
        <div className="pt-4 border-t border-[#222222] space-y-1.5">
          <span className="text-[11px] font-sans uppercase tracking-wider text-[#7A746B]">
            Brief Summary
          </span>
          <p className="text-xs font-sans text-[#D1CCC2] leading-relaxed">
            {product.short_desc}
          </p>
        </div>
      )}
    </div>
  )
}

export default AdminProductSummary
