import React, { useRef } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { PageMeta } from '@/components/seo/PageMeta'
import { CollectionCoverStage } from '@/components/features/collections/CollectionCoverStage'
import { CollectionDossier } from '@/components/features/collections/CollectionDossier'
import { CollectionProductExhibition } from '@/components/features/collections/CollectionProductExhibition'
import { NextCollectionChapter } from '@/components/features/collections/NextCollectionChapter'
import { CollectionDetailSkeleton } from '@/components/features/collections/CollectionDetailSkeleton'
import { GoldButton } from '@/components/brand/GoldButton'
import { useCollection, useCollections } from '@/hooks/queries/useCollections'
import { useProducts } from '@/hooks/queries/useProducts'
import type { SortOption } from '@/lib/constants'

/**
 * CollectionDetailPage
 * "The Collection Monograph" — Public Collection Overview / Monograph Route.
 * Features an asymmetric Cover Stage, editorial Dossier, adaptive Single/Multi-Piece Exhibition,
 * and Next Collection chapter bridge.
 */
export const CollectionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const sort = (searchParams.get('sort') as SortOption) || 'curated'

  const exhibitionRef = useRef<HTMLDivElement>(null)

  // 1. Fetch current collection
  const {
    data: collection,
    isLoading: isCollectionLoading,
    isError: isCollectionError,
    error: collectionError,
    refetch: refetchCollection,
  } = useCollection(slug)

  // 2. Fetch all active collections to find adjacent next collection
  const { data: allCollections = [] } = useCollections({ activeOnly: true })

  // 3. Fetch products bounded to this collection
  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts({
    collectionSlug: slug,
    sort,
    page,
    enabled: Boolean(slug && collection),
  })

  // Scroll smoothly to exhibition section
  const handleExplorePieces = () => {
    const el = document.getElementById('collection-pieces')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Update URL search parameters
  const handleSortChange = (newSort: SortOption) => {
    const next = new URLSearchParams(searchParams)
    next.set('sort', newSort)
    next.delete('page')
    setSearchParams(next)
  }

  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams)
    if (newPage > 1) {
      next.set('page', newPage.toString())
    } else {
      next.delete('page')
    }
    setSearchParams(next)
    handleExplorePieces()
  }

  // Loading State
  if (isCollectionLoading) {
    return <CollectionDetailSkeleton />
  }

  // Collection Query Error State
  if (isCollectionError) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-32 pb-20 flex items-center justify-center select-none">
        <PageMeta title="Collection Load Error" description="Unable to load collection details." noIndex={true} />
        <div className="max-w-md mx-auto px-4 text-center space-y-4 bg-[#111111] border border-[#2A2A2A] p-8">
          <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-800/40 flex items-center justify-center mx-auto text-red-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-serif font-semibold text-[#F5F0E8]">
            We Couldn't Load This Collection
          </h2>
          <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
            {collectionError?.message || 'A network error occurred while retrieving this collection.'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <GoldButton onClick={() => refetchCollection()} size="sm">
              Try Again
            </GoldButton>
            <Link to="/collections">
              <GoldButton variant="outline" size="sm">
                Browse Collections
              </GoldButton>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Not Found State (404)
  if (!collection) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-32 pb-20 flex items-center justify-center select-none">
        <PageMeta title="Collection Not Found" description="The requested furniture collection could not be found." noIndex={true} />
        <div className="max-w-md mx-auto px-4 text-center space-y-4 bg-[#0E0E0E] border border-[#222222] p-8 sm:p-10">
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold block">
            COLLECTION UNAVAILABLE
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#F5F0E8]">
            Collection Not Found
          </h1>
          <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
            The requested furniture collection is either inactive or does not exist in our master archive.
          </p>
          <div className="pt-4 flex items-center justify-center gap-3">
            <Link to="/collections">
              <GoldButton size="sm">Explore All Collections</GoldButton>
            </Link>
            <Link to="/products">
              <GoldButton variant="outline" size="sm">Browse Furniture</GoldButton>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Compute next adjacent collection from sorted list
  const sortedActive = [...allCollections].sort((a, b) => a.sort_order - b.sort_order)
  const currentIndex = sortedActive.findIndex((c) => c.slug === collection.slug)
  const nextCollection = currentIndex >= 0 && currentIndex < sortedActive.length - 1
    ? sortedActive[currentIndex + 1]
    : undefined

  const products = productsData?.products || []
  const totalCount = productsData?.totalCount || 0
  const totalPages = productsData?.totalPages || 1

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pb-24 overflow-x-hidden w-full select-none">
      <PageMeta
        title={`${collection.name} | Sri Anjaneya Furnitures`}
        description={
          collection.description ||
          `Discover handcrafted solid wood furniture in the ${collection.name} collection by Sri Anjaneya Furnitures.`
        }
        canonicalUrl={`/collections/${collection.slug}`}
      />

      {/* 1. Full-Bleed Collection Cover Canvas Hero */}
      <CollectionCoverStage
        collection={collection}
        productCount={totalCount}
        onExplorePieces={handleExplorePieces}
      />

      {/* 2. Collection Dossier Transition */}
      <CollectionDossier
        collection={collection}
        productCount={totalCount}
      />

      {/* 4. Main Product Exhibition Section */}
      <main
        ref={exhibitionRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 space-y-16"
        aria-label={`${collection.name} Collection Monograph`}
      >
        <CollectionProductExhibition
          collection={collection}
          products={products}
          totalCount={totalCount}
          totalPages={totalPages}
          currentPage={page}
          sort={sort}
          onSortChange={handleSortChange}
          onPageChange={handlePageChange}
          isLoading={isProductsLoading}
          isError={isProductsError}
          error={productsError}
          onRetry={refetchProducts}
        />

        {/* 5. Next Collection Monograph Chapter Bridge */}
        <NextCollectionChapter nextCollection={nextCollection} />

        {/* 6. Bespoke Commission Closing CTA */}
        <section
          aria-label="Custom Furniture Commission Call to Action"
          className="p-8 sm:p-12 bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#0A0A0A] border border-[#222222] flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
              CUSTOM SPATIAL COMMISSIONS
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F0E8]">
              Need a Piece Tailored to Your Space?
            </h3>
            <p className="text-xs sm:text-sm text-[#9B958B] font-sans font-light">
              Every design in the {collection.name} collection can be tailored in timber variety, fabric selection, and custom spatial dimensions.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
            <Link to="/contact">
              <GoldButton size="lg" className="text-xs uppercase font-mono tracking-wider">
                Request Custom Quote
              </GoldButton>
            </Link>
            <Link to="/gallery">
              <GoldButton variant="outline" size="lg" className="text-xs uppercase font-mono tracking-wider">
                Explore Gallery
              </GoldButton>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default CollectionDetailPage
