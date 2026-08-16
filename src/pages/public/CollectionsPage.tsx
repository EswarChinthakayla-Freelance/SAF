import React from 'react'
import { Link } from 'react-router-dom'
import { PageMeta } from '@/components/seo/PageMeta'
import { CollectionIndexNav } from '@/components/features/collections/CollectionIndexNav'
import { CollectionAtlas } from '@/components/features/collections/CollectionAtlas'
import { CollectionsClosingCTA } from '@/components/features/collections/CollectionsClosingCTA'
import { GoldButton } from '@/components/brand/GoldButton'
import { useCollections } from '@/hooks/queries/useCollections'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'

/**
 * CollectionsPage
 * "The Collection Atlas" — Public Architectural Furniture Collections Route.
 * Presents each collection as an expansive spatial chapter with alternating layouts,
 * large image stages, and continuous collection spine.
 */
export const CollectionsPage: React.FC = () => {
  const {
    data: collections = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useCollections({
    activeOnly: true,
  })

  const totalCount = collections.length

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-24 sm:pt-28 pb-24 overflow-x-hidden w-full select-none">
      <PageMeta
        title="Furniture Collections | Sri Anjaneya Furnitures"
        description="Explore our signature curated solid wood furniture series, harmonized by room type, bespoke timber craft, and architectural aesthetic."
        canonicalUrl="/collections"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. Refined Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono tracking-wider">
          <Link
            to="/"
            className="text-[#7A746B] hover:text-[#C9A84C] transition-colors focus-visible:text-[#C9A84C] focus-visible:outline-none"
          >
            Home
          </Link>
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 text-[#3A3A3A]" aria-hidden="true" />
          <span className="text-[#C9A84C] font-semibold" aria-current="page">
            Collections
          </span>
        </nav>

        {/* 2. Editorial Header Composition */}
        <header className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-end justify-between">
            {/* Left Title & Description (Cols 1-8) */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold block">
                  OUR COLLECTION
                </span>
                <span className="text-[#3A3A3A] font-mono text-xs">//</span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#7A746B]">
                  SPATIAL ATLAS
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#F5F0E8] font-bold tracking-tight leading-[1.05]">
                Furniture for Every Space
              </h1>

              <p className="text-sm sm:text-base text-[#9B958B] leading-relaxed font-sans font-light max-w-2xl pt-1">
                Each collection represents a harmonious family of bespoke solid wood designs, engineered for spatial synergy, master joinery, and generational longevity.
              </p>
            </div>

            {/* Right Metric Summary Plate (Cols 9-12) */}
            {!isLoading && !isError && totalCount > 0 && (
              <div className="lg:col-span-4 lg:justify-self-end p-4 bg-[#111111] border border-[#222222] space-y-1.5 w-full sm:w-auto min-w-[220px]">
                <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-[#7A746B]">
                  <span>ATLAS CHAPTERS</span>
                  <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" aria-hidden="true" />
                </div>
                <div className="font-mono text-lg text-[#F5F0E8] font-semibold">
                  0{totalCount} {totalCount === 1 ? 'Spatial Chapter' : 'Spatial Chapters'}
                </div>
                <div className="font-mono text-[10px] text-[#C9A84C] tracking-wider uppercase">
                  Curated Solid Wood
                </div>
              </div>
            )}
          </div>
        </header>
      </div>

      {/* 3. Atlas Index Navigation */}
      {!isLoading && !isError && collections.length > 0 && (
        <div className="mt-8 mb-4">
          <CollectionIndexNav collections={collections} />
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6" aria-label="Collections Atlas">
        {/* Error Recovery State */}
        {isError ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-4 bg-[#111111] border border-[#2A2A2A] p-8 rounded-none">
            <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-800/40 flex items-center justify-center mx-auto text-red-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="font-serif text-xl font-semibold text-[#F5F0E8]">
              We couldn't load our collections.
            </h2>
            <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
              {error?.message || 'A network error occurred while retrieving our curated series.'}
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <GoldButton onClick={() => refetch()} size="sm">
                Try Again
              </GoldButton>
              <Link to="/products">
                <GoldButton variant="outline" size="sm">
                  Browse All Furniture
                </GoldButton>
              </Link>
            </div>
          </div>
        ) : (
          /* Collection Atlas Chapters */
          <CollectionAtlas collections={collections} isLoading={isLoading} />
        )}

        {/* 4. Section Closing Catalogue CTA */}
        {!isError && <CollectionsClosingCTA />}
      </main>
    </div>
  )
}

export default CollectionsPage
