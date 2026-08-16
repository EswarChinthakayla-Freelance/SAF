import React from 'react'
import { Link } from 'react-router-dom'
import { getMediaUrl } from '@/lib/media'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  PackageIcon,
  LinkSquare02Icon,
  ViewIcon,
} from '@hugeicons/core-free-icons'
import type { AdminInquiryDetail } from '@/types/app'

export interface InquiryProductContextProps {
  inquiry: AdminInquiryDetail
}

export const InquiryProductContext: React.FC<InquiryProductContextProps> = ({ inquiry }) => {
  const { product, product_id, subject } = inquiry

  if (!product_id && !subject) {
    return null
  }

  const thumbnailUrl = product?.primary_image
    ? getMediaUrl('product-images', product.primary_image, 'thumbnail')
    : null

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 space-y-3 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-[#C9A84C]">
          <HugeiconsIcon icon={PackageIcon} className="w-3.5 h-3.5" />
        </div>
        <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-[#8A847A]">
          Subject & Catalogue Context
        </span>
      </div>

      {/* Subject Line */}
      {subject && (
        <div className="space-y-1">
          <span className="text-[11px] text-[#7A746B] block">Subject</span>
          <p className="text-sm font-medium text-[#F5F0E8] leading-snug">
            {subject}
          </p>
        </div>
      )}

      {/* Linked Product Plate */}
      {product ? (
        <div className="pt-2 border-t border-[#202020] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={product.name}
                className="w-10 h-10 object-cover rounded bg-[#1E1E1E] border border-[#2E2E2E] shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded bg-[#1E1E1E] border border-[#2E2E2E] flex items-center justify-center text-[#7A746B] shrink-0">
                <HugeiconsIcon icon={PackageIcon} className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0 space-y-0.5">
              <span className="text-xs font-medium text-[#F5F0E8] truncate block">
                {product.name}
              </span>
              <span className="text-[11px] text-[#C9A84C] font-mono block">
                Catalogue Item
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              to={`/admin/products/${product.id}/preview`}
              className="inline-flex items-center h-8 px-2.5 text-xs bg-[#1A1A1A] hover:bg-[#222222] border border-[#2E2E2E] text-[#D1CCC2] hover:text-[#F5F0E8] rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C]"
            >
              <HugeiconsIcon icon={ViewIcon} className="w-3.5 h-3.5 mr-1 text-[#C9A84C]" />
              <span>Preview</span>
            </Link>

            {product.is_published && product.slug && (
              <Link
                to={`/products/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                title="View Public Catalogue Page"
                className="inline-flex items-center justify-center h-8 w-8 text-[#8A847A] hover:text-[#F5F0E8] hover:bg-[#1E1E1E] rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C]"
              >
                <HugeiconsIcon icon={LinkSquare02Icon} className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      ) : product_id ? (
        <div className="pt-2 border-t border-[#202020] text-xs text-[#7A746B] italic font-mono">
          Linked catalogue product is no longer active.
        </div>
      ) : null}
    </div>
  )
}

export default InquiryProductContext
