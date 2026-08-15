import React, { useRef } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { PageMeta } from '@/components/seo/PageMeta'
import { AppBreadcrumb } from '@/components/common/AppBreadcrumb'
import { ProductGrid } from '@/components/features/products/ProductGrid'
import { ProductPagination } from '@/components/features/products/ProductPagination'
import { GoldButton } from '@/components/brand/GoldButton'
import { useCollection } from '@/hooks/queries/useCollections'
import { useProducts } from '@/hooks/queries/useProducts'
import { getMediaUrl } from '@/lib/media'

export const CollectionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))

  const heroRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // 1. Fetch collection metadata by slug
  const {
    data: collection,
    isLoading: isCollectionLoading,
    isError: isCollectionError,
    error: collectionError,
    refetch: refetchCollection,
  } = useCollection(slug)

  // 2. Fetch products bounded to this collection
  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts({
    collection: slug,
    page,
  })

  // Scroll parallax calculation for hero image
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], ['0%', '12%'])
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.04])

  const handlePageChange = (newPage: number) => {
    const nextParams = new URLSearchParams(searchParams)
    if (newPage > 1) {
      nextParams.set('page', newPage.toString())
    } else {
      nextParams.delete('page')
    }
    setSearchParams(nextParams, { replace: false })
    window.scrollTo({ top: heroRef.current?.offsetHeight || 400, behavior: 'smooth' })
  }

  // Loading Skeleton State
  if (isCollectionLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-24 pb-20">
        <PageMeta title="Loading Collection" description="Retrieving handcrafted furniture collection from Sri Anjaneya Furnitures." />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="h-[60svh] bg-[#111111] border border-[#2A2A2A] rounded-none animate-pulse" />
          <div className="space-y-6">
            <div className="h-6 w-48 bg-[#1A1816] rounded animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/5] bg-[#111111] border border-[#2A2A2A] rounded-none animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Network Failure State
  if (isCollectionError || isProductsError) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-32 pb-20 flex items-center justify-center">
        <PageMeta title="Collection Load Error" description="Unable to load collection details." noIndex={true} />
        <div className="max-w-md mx-auto px-4 text-center space-y-4 bg-[#111111] border border-[#2A2A2A] p-8 rounded-none">
          <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-800/40 flex items-center justify-center mx-auto text-red-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-serif font-semibold text-[#F5F0E8]">
            We Couldn't Load This Collection
          </h2>
          <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
            {(collectionError || productsError)?.message || 'A network error occurred while retrieving this collection.'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <GoldButton onClick={() => { refetchCollection(); refetchProducts(); }} size="sm">
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
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-32 pb-20 flex items-center justify-center">
        <PageMeta title="Page Not Found" description="The requested furniture collection could not be found." noIndex={true} />
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
            Collection Unavailable
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#F5F0E8]">
            Collection Not Found
          </h1>
          <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
            The requested furniture collection is either inactive or does not exist in our catalog.
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

  const products = productsData?.products || []
  const totalCount = productsData?.totalCount || 0
  const totalPages = productsData?.totalPages || 1

  const coverImageUrl = collection.cover_image_path
    ? getMediaUrl('brand-assets', collection.cover_image_path, 'hero')
    : undefined

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pb-24">
      <PageMeta
        title={`${collection.name} | Sri Anjaneya Furnitures`}
        description={
          collection.description ||
          `Discover handcrafted solid wood furniture in the ${collection.name} collection by Sri Anjaneya Furnitures.`
        }
        canonicalUrl={`/collections/${collection.slug}`}
        ogImage={coverImageUrl}
      />

      {/* 1. Collection Cover Hero Section */}
      <div
        ref={heroRef}
        className="relative h-[65svh] sm:h-[75svh] w-full overflow-hidden bg-[#0A0A0A] border-b border-[#2A2A2A]"
      >
        {coverImageUrl ? (
          <motion.img
            src={coverImageUrl}
            alt={collection.cover_image_alt || `${collection.name} Collection`}
            style={
              shouldReduceMotion
                ? undefined
                : {
                  y: heroY,
                  scale: heroScale,
                }
            }
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#151412] via-[#0A0A0A] to-[#151412]" />
        )}

        {/* Ambient Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-[#0A0A0A]/30" />

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 w-full space-y-4">
            {/* Breadcrumb Navigation */}
            <AppBreadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Collections', href: '/collections' },
                { label: collection.name, isCurrent: true },
              ]}
              className="text-xs"
            />

            <span className="text-[10px] sm:text-xs uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold block">
              Curated Collection
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#F5F0E8] tracking-tight leading-[1.08] max-w-3xl">
              {collection.name}
            </h1>

            {collection.description && (
              <p className="text-xs sm:text-sm lg:text-base text-[#D1CCC2]/90 font-sans font-light leading-relaxed max-w-2xl">
                {collection.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Collection Products Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-10">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F0E8]">
              Explore {collection.name} Pieces
            </h2>
            <span className="text-xs font-mono text-[#9B958B] mt-0.5 block">
              {totalCount} {totalCount === 1 ? 'Handcrafted Piece' : 'Handcrafted Pieces'}
            </span>
          </div>
        </div>

        {/* Product Grid or Empty State */}
        {products.length === 0 && !isProductsLoading ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
              Catalogue Update
            </span>
            <h3 className="font-serif text-2xl text-[#F5F0E8] font-bold">
              No pieces are currently available in this collection.
            </h3>
            <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
              Pieces for this collection are being handcrafted in our workshop. Explore our other published collections in the meantime.
            </p>
            <div className="pt-3">
              <Link to="/products">
                <GoldButton size="sm">Browse All Furniture</GoldButton>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <ProductGrid products={products} isLoading={isProductsLoading} />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <ProductPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default CollectionDetailPage
