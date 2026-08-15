import React from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { PageMeta } from '@/components/seo/PageMeta'
import { CollectionGrid } from '@/components/features/collections/CollectionGrid'
import { GoldButton } from '@/components/brand/GoldButton'
import { useCollections } from '@/hooks/queries/useCollections'

export const CollectionsPage: React.FC = () => {
  const { data: collections = [], isLoading, isError, error, refetch } = useCollections({
    activeOnly: true,
  })

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-24 sm:pt-28 pb-24">
      <PageMeta
        title="Furniture Collections | Sri Anjaneya Furnitures"
        description="Explore our signature curated solid wood furniture series, harmonized by room type, bespoke timber craft, and architectural aesthetic."
        canonicalUrl="/collections"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* PageHeader Component */}
        <PageHeader
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Collections', isCurrent: true },
          ]}
          eyebrow="COLLECTIONS"
          title="Furniture for Every Space"
          description="Each collection represents a harmonious family of bespoke solid wood designs, engineered for spatial synergy, master joinery, and generational longevity."
        />

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
          /* Collection Listing Grid */
          <CollectionGrid collections={collections} isLoading={isLoading} />
        )}
      </div>
    </div>
  )
}

export default CollectionsPage
