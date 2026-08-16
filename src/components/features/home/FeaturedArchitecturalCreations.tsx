import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { useFeaturedProducts } from '@/hooks/queries/useProducts'
import { FeaturedCreationStage } from './FeaturedCreationStage'
import type { ProductListItem } from '@/types/app'

const DEFAULT_FEATURED_CREATIONS: ProductListItem[] = [
  {
    id: 'feat-1',
    name: 'Royal Heritage Teak Bed',
    slug: 'royal-heritage-teak-bed',
    product_code: 'SAF-BED-001',
    short_desc: 'Heirloom solid teak bed with master mortise joinery.',
    description: null,
    price: 84000,
    compare_price: 95000,
    currency: 'INR',
    cover_image_path: null,
    dimensions: '72 x 78 in',
    materials: ['Solid Teak'],
    care_instructions: null,
    warranty_info: null,
    delivery_info: null,
    collection_id: 'col-1',
    is_published: true,
    sort_order: 1,
    published_at: '2026-01-01T00:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    collections: {
      id: 'col-1',
      name: 'Bedroom Collection',
      slug: 'bedroom',
    },
  },
  {
    id: 'feat-2',
    name: 'Teak Aerofoil Ceiling Fan',
    slug: 'teak-aerofoil-ceiling-fan',
    product_code: 'SAF-FAN-002',
    short_desc: 'Aerodynamic sculptured teak blades with silent brushless motor.',
    description: null,
    price: 24000,
    compare_price: null,
    currency: 'INR',
    cover_image_path: null,
    dimensions: '52 in Sweep',
    materials: ['Solid Teak', 'BLDC Motor'],
    care_instructions: null,
    warranty_info: null,
    delivery_info: null,
    collection_id: 'col-2',
    is_published: true,
    sort_order: 2,
    published_at: '2026-01-01T00:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    collections: {
      id: 'col-2',
      name: 'Fans Collection',
      slug: 'fans',
    },
  },
  {
    id: 'feat-3',
    name: 'Bespoke Imperial Teak Sofa',
    slug: 'bespoke-imperial-teak-sofa',
    product_code: 'SAF-SOFA-003',
    short_desc: 'Monumental architectural 3-seater frame sculpted from raw log teak.',
    description: null,
    price: 112000,
    compare_price: 130000,
    currency: 'INR',
    cover_image_path: null,
    dimensions: '84 x 36 x 32 in',
    materials: ['Solid Teak', 'Natural Linen'],
    care_instructions: null,
    warranty_info: null,
    delivery_info: null,
    collection_id: 'col-3',
    is_published: true,
    sort_order: 3,
    published_at: '2026-01-01T00:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    collections: {
      id: 'col-3',
      name: 'Living Room Collection',
      slug: 'living-room',
    },
  },
]

/**
 * FeaturedArchitecturalCreations — "The Architectural Exhibition Stage"
 * Replaces the conventional 2-column product grid with a signature digital furniture exhibition.
 */
export const FeaturedArchitecturalCreations: React.FC = () => {
  const { data: products, isLoading } = useFeaturedProducts(6)
  const [activeIndex, setActiveIndex] = useState(0)

  // Use live database products if available, otherwise display curated showcase pieces
  const displayProducts = products && products.length > 0 ? products : DEFAULT_FEATURED_CREATIONS
  const count = displayProducts.length

  // Keyboard navigation when stage container has focus
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (count <= 1) return
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setActiveIndex((prev) => Math.max(0, prev - 1))
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      setActiveIndex((prev) => Math.min(count - 1, prev + 1))
    }
  }

  // 1. Loading State: Architectural Skeleton
  if (isLoading && (!products || (products as ProductListItem[]).length === 0)) {
    return (
      <section
        id="featured-creations"
        aria-labelledby="featured-creations-heading"
        className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 select-none"
      >
        <div className="space-y-4">
          <div className="h-4 w-32 bg-[#1A1A1A] animate-pulse" />
          <div className="h-10 w-80 bg-[#1A1A1A] animate-pulse" />
          <div className="h-px w-full bg-[#2A2A2A]" />
        </div>
        <div className="h-[60vh] w-full bg-[#111111] border border-[#2A2A2A] animate-pulse rounded-none" />
      </section>
    )
  }

  return (
    <section
      id="featured-creations"
      aria-labelledby="featured-creations-heading"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 focus:outline-none"
    >
      {/* Editorial Section Header: Asymmetric Composition */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold block">
              FEATURED // 04
            </span>
            <h2
              id="featured-creations-heading"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#F5F0E8] font-bold tracking-tight leading-[1.08]"
            >
              Featured Architectural Creations
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#9B958B] leading-relaxed font-sans font-light max-w-xl">
            Individually sculpted from seasoned teak, rosewood, and noble timber with master joinery for discerning homes.
          </p>
        </div>

        {/* Architectural Divider */}
        <div className="w-full h-px bg-[#2A2A2A]" />
      </div>

      {/* Exhibition Stage */}
      <FeaturedCreationStage
        products={displayProducts}
        activeIndex={activeIndex}
        onSelectIndex={setActiveIndex}
        onPrev={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : count - 1))}
        onNext={() => setActiveIndex((prev) => (prev < count - 1 ? prev + 1 : 0))}
      />

      {/* Bottom Complete Catalogue Link */}
      <div className="text-center pt-8 border-t border-[#2A2A2A]/60 flex justify-center">
        <Link
          to="/products"
          className="inline-flex items-center gap-3 text-xs font-mono uppercase tracking-[0.2em] text-[#C9A84C] hover:text-[#E8B84B] font-semibold transition-colors py-2 group"
        >
          <span>View Complete Furniture Catalogue</span>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  )
}

export default FeaturedArchitecturalCreations
