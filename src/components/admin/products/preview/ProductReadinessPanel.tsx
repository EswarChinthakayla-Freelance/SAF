import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  SparklesIcon,
  GlobeIcon,
  UnavailableIcon,
} from '@hugeicons/core-free-icons'
import type { ProductWithRelations } from '@/types/app'
import { formatCurrency } from '@/utils/formatCurrency'

export interface ProductReadinessPanelProps {
  product: ProductWithRelations
}

export const ProductReadinessPanel: React.FC<ProductReadinessPanelProps> = ({ product }) => {
  const hasCoverImage = Boolean(
    product.cover_image_path || product.product_images?.some((img) => img.is_cover)
  )
  const hasCollection = Boolean(product.collection_id && product.collections?.name)
  const hasShortDesc = Boolean(product.short_desc && product.short_desc.trim().length > 0)
  const hasDescription = Boolean(product.description && product.description.trim().length > 0)
  const variantsCount = product.product_variants?.length ?? 0
  const tagsCount = product.product_tags?.length ?? 0

  // Attention items for catalogue readiness
  const attentionItems: string[] = []
  if (!hasCoverImage) attentionItems.push('No cover image is selected or uploaded.')
  if (!hasCollection) attentionItems.push('Piece is not assigned to a showroom collection.')
  if (!hasShortDesc) attentionItems.push('Short summary is missing for search & social previews.')
  if (!product.is_published) {
    attentionItems.push('Product is currently Draft (not visible on the public website).')
  }

  const checklistItems = [
    {
      label: 'Cover Photography',
      status: hasCoverImage ? 'Ready' : 'Missing',
      isReady: hasCoverImage,
      detail: hasCoverImage ? 'High-resolution cover configured' : 'Required for premium public display',
    },
    {
      label: 'Product Title & SKU',
      status: 'Ready',
      isReady: true,
      detail: `${product.name} (${product.product_code || 'No SKU'})`,
    },
    {
      label: 'Base Valuation',
      status: 'Ready',
      isReady: true,
      detail: formatCurrency(product.price, product.currency),
    },
    {
      label: 'Collection Chapter',
      status: hasCollection ? 'Assigned' : 'Unassigned',
      isReady: hasCollection,
      detail: hasCollection ? product.collections?.name : 'Recommend assigning to a collection',
    },
    {
      label: 'Short Summary',
      status: hasShortDesc ? 'Ready' : 'Missing',
      isReady: hasShortDesc,
      detail: hasShortDesc ? 'Optimized for previews' : 'Recommended for catalogue card display',
    },
    {
      label: 'Editorial Description',
      status: hasDescription ? 'Ready' : 'Missing',
      isReady: hasDescription,
      detail: hasDescription ? 'Story & notes populated' : 'Add craft narrative',
    },
    {
      label: 'Structured Variants',
      status: variantsCount > 0 ? `${variantsCount} Configured` : 'Standard Model',
      isReady: true,
      detail: variantsCount > 0 ? `${variantsCount} custom options` : 'Single default model',
    },
    {
      label: 'Discovery Tags',
      status: tagsCount > 0 ? `${tagsCount} Assigned` : 'None',
      isReady: tagsCount > 0,
      detail: tagsCount > 0 ? `${tagsCount} tags active` : 'Helps showroom search filters',
    },
    {
      label: 'Public Publication',
      status: product.is_published ? 'Published' : 'Draft',
      isReady: product.is_published,
      detail: product.is_published ? 'Active in public catalogue' : 'Hidden from clients',
    },
  ]

  return (
    <section className="bg-[#141414] border border-[#242424] rounded-none p-5 sm:p-6 space-y-5 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-sans font-semibold uppercase tracking-wider text-[#C9A84C] flex items-center gap-2">
          <HugeiconsIcon icon={SparklesIcon} className="w-4 h-4" />
          <span>Public Presentation & Catalogue Readiness</span>
        </h2>
      </div>

      {/* Needs Attention Alert (if any) */}
      {attentionItems.length > 0 && (
        <div className="bg-[#1C1708] border border-[#B45309]/50 rounded-none p-3.5 sm:p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FBBF24]">
            <HugeiconsIcon icon={AlertCircleIcon} className="w-4 h-4 text-[#F59E0B]" />
            <span>Catalogue Items Requiring Attention</span>
          </div>
          <ul className="space-y-1 pl-6 list-disc text-xs text-[#D1CCC2]/90">
            {attentionItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Checklist Rows Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {checklistItems.map((item) => (
          <div
            key={item.label}
            className="bg-[#181818] border border-[#262626] rounded-none p-3 space-y-1 text-xs font-sans"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#F5F0E8] font-medium">{item.label}</span>
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${item.isReady
                  ? 'bg-[#0D1510] text-[#4ADE80] border border-[#166534]'
                  : 'bg-[#1C1708] text-[#FBBF24] border border-[#B45309]'
                  }`}
              >
                <HugeiconsIcon
                  icon={item.isReady ? CheckmarkCircle02Icon : AlertCircleIcon}
                  className="w-2.5 h-2.5"
                />
                {item.status}
              </span>
            </div>
            <p className="text-[11px] text-[#8A847A] truncate">{item.detail}</p>
          </div>
        ))}
      </div>

      {/* Public Status Notice */}
      <div className="pt-2 border-t border-[#222222] flex items-center justify-between text-xs text-[#9B958B]">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={product.is_published ? GlobeIcon : UnavailableIcon}
            className={`w-4 h-4 ${product.is_published ? 'text-emerald-400' : 'text-amber-400'}`}
          />
          <span>
            {product.is_published
              ? 'Publicly accessible at /products/' + product.slug
              : 'Draft — Completely inaccessible on the public website'}
          </span>
        </div>
      </div>
    </section>
  )
}

export default ProductReadinessPanel
