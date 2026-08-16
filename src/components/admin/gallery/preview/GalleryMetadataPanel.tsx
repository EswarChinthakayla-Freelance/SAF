import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getMediaUrl } from '@/lib/media'
import { formatDate } from '@/utils/dates'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Tag01Icon,
  ViewIcon,
  LinkSquare02Icon,
  PackageIcon,
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  SparklesIcon,
  Edit02Icon,
} from '@hugeicons/core-free-icons'
import type { AdminGalleryItem } from '@/types/app'

export interface GalleryMetadataPanelProps {
  image: AdminGalleryItem
  onOpenEditSheet: () => void
}

export const GalleryMetadataPanel: React.FC<GalleryMetadataPanelProps> = ({
  image,
  onOpenEditSheet,
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false)
  const linkedProduct = image.products
  const hasAlt = Boolean(image.alt_text && image.alt_text.trim().length > 0)

  const readinessChecks = [
    {
      label: 'Image Description',
      status: hasAlt ? 'Ready' : 'Missing',
      isReady: hasAlt,
      detail: hasAlt ? 'Accessibility caption present' : 'Required for SEO & screen readers',
    },
    {
      label: 'Room Taxonomy',
      status: image.room_type || 'Living Room',
      isReady: true,
      detail: 'Configured in public showroom filters',
    },
    {
      label: 'Catalogue Link',
      status: linkedProduct ? 'Connected' : 'Optional',
      isReady: Boolean(linkedProduct),
      detail: linkedProduct
        ? `Linked to ${linkedProduct.name}`
        : 'Allows direct shopping handoff',
    },
    {
      label: 'Public Visibility',
      status: image.is_active ? 'Active' : 'Hidden',
      isReady: image.is_active,
      detail: image.is_active
        ? 'Shown in public inspiration gallery'
        : 'Internal preview only (Hidden from public)',
    },
  ]

  return (
    <aside className="w-full lg:w-80 xl:w-96 shrink-0 space-y-4 font-sans text-xs">
      {/* Primary Presentation Card */}
      <section className="bg-[#141414] border border-[#242424] rounded-none p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C9A84C] flex items-center gap-1.5">
            <HugeiconsIcon icon={Tag01Icon} className="w-3.5 h-3.5" />
            <span>Image Metadata</span>
          </h2>
          <button
            type="button"
            onClick={onOpenEditSheet}
            className="text-xs text-[#C9A84C] hover:text-[#E8B84B] flex items-center gap-1 font-medium transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Edit02Icon} className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>

        {/* Space, Visibility & Order grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="bg-[#181818] border border-[#262626] rounded-none p-2.5 space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-[#7A746B]">Room Space</span>
            <p className="text-xs font-semibold text-[#F5F0E8]">{image.room_type || 'Living Room'}</p>
          </div>

          <div className="bg-[#181818] border border-[#262626] rounded-none p-2.5 space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-[#7A746B]">Display Order</span>
            <p className="text-xs font-semibold font-mono text-[#C9A84C]">
              Order #{String(image.sort_order ?? 0).padStart(2, '0')}
            </p>
          </div>
        </div>

        {/* Full Image Description / Alt text */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-mono uppercase text-[#7A746B]">
            Accessibility Caption / Alt
          </span>
          {hasAlt ? (
            <p className="text-xs font-sans text-[#F5F0E8] bg-[#181818] border border-[#262626] rounded-none p-3 leading-relaxed whitespace-pre-wrap">
              {image.alt_text}
            </p>
          ) : (
            <div className="p-3 rounded-none bg-[#1C1708] border border-[#B45309]/40 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-[#F59E0B] font-medium">
                <HugeiconsIcon icon={AlertCircleIcon} className="w-4 h-4 text-[#F59E0B]" />
                <span>No description has been added</span>
              </div>
              <p className="text-[11px] text-[#D1CCC2]/80 leading-normal">
                Adding image descriptions improves public showroom searchability and screen-reader accessibility.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onOpenEditSheet}
                className="h-7 px-2 text-[11px] bg-[#291F08] border-[#B45309]/50 text-[#F59E0B] hover:bg-[#3D2C0A]"
              >
                Add Description
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Connected Furniture Catalogue Piece */}
      <section className="bg-[#141414] border border-[#242424] rounded-none p-5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C9A84C] flex items-center gap-1.5">
            <HugeiconsIcon icon={PackageIcon} className="w-3.5 h-3.5" />
            <span>Catalogue Connection</span>
          </h3>
        </div>

        {linkedProduct ? (
          <div className="bg-[#181818] border border-[#2A2A2A] rounded-none p-3 space-y-3">
            <div className="flex items-center gap-3">
              {/* Product Thumbnail */}
              <div className="relative w-12 h-12 rounded bg-[#0E0E0E] overflow-hidden shrink-0 border border-[#2E2E2E]">
                <img
                  src={getMediaUrl('product-images', linkedProduct.cover_image_path, 'thumbnail')}
                  alt={linkedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Meta */}
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-xs font-medium text-[#F5F0E8] truncate">
                  {linkedProduct.name}
                </p>
                {linkedProduct.product_code && (
                  <span className="text-[10px] font-mono text-[#8A847A] block">
                    {linkedProduct.product_code}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#262626]">
              <Link
                to={`/admin/products/${linkedProduct.id}/preview`}
                className="inline-flex items-center h-7 px-2.5 rounded text-[11px] font-medium bg-[#141414] border border-[#2E2E2E] text-[#D1CCC2] hover:text-[#F5F0E8] hover:bg-[#1E1E1E] transition-colors"
              >
                <HugeiconsIcon icon={ViewIcon} className="w-3 h-3 mr-1 text-[#C9A84C]" />
                <span>Product Inspector</span>
              </Link>

              {linkedProduct.is_published && (
                <Link
                  to={`/products/${linkedProduct.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center h-7 px-2 rounded text-[11px] font-medium text-[#9B958B] hover:text-[#C9A84C] transition-colors"
                >
                  <HugeiconsIcon icon={LinkSquare02Icon} className="w-3 h-3 mr-1" />
                  <span>Public View</span>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="p-3 bg-[#181818] border border-[#262626] rounded-none space-y-2 text-center">
            <p className="text-xs text-[#7A746B]">No catalogue furniture piece linked to this photo.</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenEditSheet}
              className="h-7 px-3 text-[11px] bg-[#141414] border-[#2A2A2A] text-[#C9A84C] hover:bg-[#1E1E1E]"
            >
              <HugeiconsIcon icon={LinkSquare02Icon} className="w-3 h-3 mr-1" />
              <span>Link Product</span>
            </Button>
          </div>
        )}
      </section>

      {/* Public Gallery Readiness Checklist */}
      <section className="bg-[#141414] border border-[#242424] rounded-none p-5 space-y-3 shadow-lg">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C9A84C] flex items-center gap-1.5">
          <HugeiconsIcon icon={SparklesIcon} className="w-3.5 h-3.5" />
          <span>Public Gallery Readiness</span>
        </h3>

        <div className="space-y-2">
          {readinessChecks.map((check, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded bg-[#181818] border border-[#262626]"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-[#F5F0E8] flex items-center gap-1.5">
                  <HugeiconsIcon
                    icon={check.isReady ? CheckmarkCircle02Icon : AlertCircleIcon}
                    className={`w-3.5 h-3.5 ${check.isReady ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}
                  />
                  <span>{check.label}</span>
                </div>
                <div className="text-[10px] text-[#7A746B]">{check.detail}</div>
              </div>
              <span
                className={`text-[10px] font-mono font-medium px-1.5 py-0.2 rounded ${check.isReady
                  ? 'bg-[#0D1510] text-[#4ADE80] border border-[#22C55E]/30'
                  : 'bg-[#1C1708] text-[#F59E0B] border border-[#B45309]/30'
                  }`}
              >
                {check.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Details Accordion */}
      <section className="bg-[#141414] border border-[#242424] rounded-none overflow-hidden shadow-lg">
        <button
          type="button"
          onClick={() => setShowTechnicalDetails((prev) => !prev)}
          className="w-full px-5 py-3 flex items-center justify-between text-xs font-mono text-[#8A847A] hover:text-[#F5F0E8] hover:bg-[#181818] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon icon={InformationCircleIcon} className="w-3.5 h-3.5" />
            <span>Technical Asset Details</span>
          </span>
          <HugeiconsIcon
            icon={showTechnicalDetails ? ArrowUp01Icon : ArrowDown01Icon}
            className="w-3.5 h-3.5"
          />
        </button>

        {showTechnicalDetails && (
          <div className="p-5 pt-0 border-t border-[#222222] space-y-2 text-[11px] font-mono text-[#8A847A]">
            <div>
              <span className="text-[#666158] block text-[10px]">DATABASE UUID</span>
              <span className="text-[#D1CCC2] select-all break-all">{image.id}</span>
            </div>
            <div>
              <span className="text-[#666158] block text-[10px]">STORAGE BUCKET PATH</span>
              <span className="text-[#D1CCC2] select-all break-all">{image.storage_path}</span>
            </div>
            <div>
              <span className="text-[#666158] block text-[10px]">CREATED TIMESTAMP</span>
              <span className="text-[#D1CCC2]">{formatDate(image.created_at || '')}</span>
            </div>
            {image.updated_at && (
              <div>
                <span className="text-[#666158] block text-[10px]">LAST MODIFIED</span>
                <span className="text-[#D1CCC2]">{formatDate(image.updated_at)}</span>
              </div>
            )}
          </div>
        )}
      </section>
    </aside>
  )
}
