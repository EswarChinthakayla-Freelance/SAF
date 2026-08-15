import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageMeta } from '@/components/seo/PageMeta'
import { ProductStructuredData } from '@/components/seo/ProductStructuredData'
import { AppBreadcrumb } from '@/components/common/AppBreadcrumb'
import { ProductImageGallery } from '@/components/features/products/ProductImageGallery'
import { VariantSelector } from '@/components/features/products/VariantSelector'
import { ProductSpecifications } from '@/components/features/products/ProductSpecifications'
import { ProductActions } from '@/components/features/products/ProductActions'
import { RelatedProducts } from '@/components/features/products/RelatedProducts'
import { PriceTag } from '@/components/brand/PriceTag'
import { GoldButton } from '@/components/brand/GoldButton'
import { InquiryForm } from '@/components/features/inquiry/InquiryForm'
import { InquirySuccess } from '@/components/features/inquiry/InquirySuccess'
import { ProductDetailSkeleton } from '@/components/common/ProductDetailSkeleton'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { useProduct } from '@/hooks/queries/useProducts'
import { getMediaUrl } from '@/lib/media'
import { STOCK_STATUS_LABELS, type StockStatus } from '@/lib/constants'
import type { ProductVariantRow } from '@/types/app'

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, isLoading, isError, error, refetch } = useProduct(slug)

  const [selectedVariant, setSelectedVariant] = useState<ProductVariantRow | null>(null)
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null)

  // Initialize deterministic default variant when product data arrives
  useEffect(() => {
    if (product?.product_variants && product.product_variants.length > 0) {
      const sorted = [...product.product_variants].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
      )
      // Pick first in-stock or made-to-order variant, or first overall
      const available = sorted.find((v) => v.stock_status !== 'out_of_stock') || sorted[0]
      setSelectedVariant(available)
    } else {
      setSelectedVariant(null)
    }
  }, [product?.id])

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-24 sm:pt-28 pb-20">
        <PageMeta title="Loading Furniture Specification" description="Retrieving handcrafted product details from Sri Anjaneya Furnitures." />
        <ProductDetailSkeleton />
      </div>
    )
  }

  // Error State with Retry
  if (isError) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-32 pb-20 flex items-center justify-center">
        <PageMeta title="Product Load Error" description="Unable to load product specification." noIndex={true} />
        <div className="max-w-md mx-auto px-4 text-center space-y-5 bg-[#111111] border border-[#2A2A2A] p-8 rounded-none">
          <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-800/40 flex items-center justify-center mx-auto text-red-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-serif font-semibold text-[#F5F0E8]">
            We Couldn't Load This Product
          </h1>
          <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
            {error?.message || 'A network error occurred while retrieving the product specification.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <GoldButton onClick={() => refetch()} size="sm">
              Try Again
            </GoldButton>
            <Link to="/products">
              <GoldButton variant="outline" size="sm">
                Browse Catalogue
              </GoldButton>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Product Not Found State
  if (!product) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-32 pb-20 flex items-center justify-center">
        <PageMeta title="Page Not Found" description="The requested handcrafted furniture piece could not be found." noIndex={true} />
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
            Product Unavailable
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#F5F0E8]">
            This Piece Could Not Be Found
          </h1>
          <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
            It may no longer be part of our current handcrafted catalogue or the link may have expired.
          </p>
          <div className="pt-4 flex items-center justify-center gap-3">
            <Link to="/products">
              <GoldButton size="sm">Browse Furniture</GoldButton>
            </Link>
            <Link to="/collections">
              <GoldButton variant="outline" size="sm">Explore Collections</GoldButton>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Dynamic Pricing Calculation
  const currentPrice = selectedVariant?.price ?? product.price
  const comparePrice = selectedVariant?.compare_price ?? product.compare_price
  const availabilityStatus = selectedVariant?.stock_status

  // SEO & Social Graph Meta Image
  const ogImageUrl = product.cover_image_path
    ? getMediaUrl('product-images', product.cover_image_path, 'card')
    : undefined

  const collectionName = product.collections?.name

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-24 sm:pt-28 pb-24">
      {/* Dynamic SEO Meta & Structured Data */}
      <PageMeta
        title={`${product.name} | Sri Anjaneya Furnitures`}
        description={
          product.short_desc ||
          product.description?.slice(0, 155) ||
          `Explore the handcrafted ${product.name} by Sri Anjaneya Furnitures.`
        }
        canonicalUrl={`/products/${product.slug}`}
        ogImage={ogImageUrl}
      />
      <ProductStructuredData product={product} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 lg:space-y-14">
        {/* 1. Contextual AppBreadcrumb Navigation */}
        <AppBreadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            ...(product.collections
              ? [{ label: product.collections.name, href: `/products?collection=${product.collections.slug}` }]
              : []),
            { label: product.name, isCurrent: true },
          ]}
          className="pt-2"
        />

        {/* 2. Main Product Presentation (60% Media Gallery, 40% Product Information) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Image Gallery Surface */}
          <div className="lg:col-span-7">
            <ProductImageGallery
              images={
                product.product_images && product.product_images.length > 0
                  ? product.product_images
                  : product.cover_image_path
                    ? [
                        {
                          id: `cover-${product.id}`,
                          product_id: product.id,
                          storage_path: product.cover_image_path,
                          alt_text: product.name,
                          sort_order: 0,
                          is_cover: true,
                          created_at: product.created_at,
                        },
                      ]
                    : []
              }
              productName={product.name}
            />
          </div>

          {/* Right Column: Sticky Product Evaluation & Conversion Column */}
          <div className="lg:col-span-5 space-y-7 lg:sticky lg:top-28">
            {/* Identity & Header */}
            <div className="space-y-2">
              {collectionName && (
                <span className="text-[10px] uppercase font-mono tracking-[0.22em] text-[#C9A84C] font-semibold block">
                  {collectionName}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F5F0E8] tracking-tight leading-[1.1]">
                {product.name}
              </h1>
              {product.product_code && (
                <span className="text-[11px] font-mono text-[#7A746B] block">
                  Product Code: {product.product_code}
                </span>
              )}
            </div>

            {/* Price & Availability Tag */}
            <div className="flex items-center justify-between py-3 border-y border-[#2A2A2A]">
              <PriceTag
                price={currentPrice}
                comparePrice={comparePrice}
                currency={product.currency}
              />
              {availabilityStatus && (
                <span
                  className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-none ${availabilityStatus === 'in_stock'
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                    : availabilityStatus === 'made_to_order'
                      ? 'bg-[#C9A84C]/20 text-[#E8B84B] border border-[#C9A84C]/40'
                      : 'bg-red-950/60 text-red-400 border border-red-800/40'
                    }`}
                >
                  {STOCK_STATUS_LABELS[availabilityStatus as StockStatus]}
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.short_desc && (
              <p className="text-xs sm:text-sm text-[#D1CCC2]/90 leading-relaxed font-sans font-light">
                {product.short_desc}
              </p>
            )}

            {/* Structured Variant Selector */}
            <VariantSelector
              variants={product.product_variants || []}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
              basePrice={product.price}
              currency={product.currency}
            />

            {/* Core Quote Conversion & Sharing Actions */}
            <ProductActions
              product={product}
              selectedVariant={selectedVariant}
              onRequestQuote={() => setIsInquiryOpen(true)}
            />
          </div>
        </div>

        {/* 3. Detailed Specifications & Craft Story */}
        <ProductSpecifications product={product} className="pt-8" />

        {/* 4. Related Products from the Same Collection */}
        <RelatedProducts
          collectionId={product.collection_id}
          currentProductId={product.id}
          collectionName={collectionName}
        />
      </div>

      {/* 5. Mobile Sticky Bottom Action Bar (Fixed conversion for small screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-[#2A2A2A] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#7A746B] uppercase block">Starting from</span>
          <PriceTag price={currentPrice} currency={product.currency} />
        </div>
        <GoldButton
          onClick={() => setIsInquiryOpen(true)}
          size="default"
          className="flex-1 max-w-[200px] text-xs font-semibold uppercase tracking-wider"
        >
          Request Quote
        </GoldButton>
      </div>

      {/* 6. Request Quote Slide-Over Sheet Modal */}
      <Sheet open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg bg-[#0D0C0B] border-l border-[#2A2A2A] text-[#F5F0E8] p-6 overflow-y-auto"
        >
          <SheetHeader className="pb-4 border-b border-[#2A2A2A] text-left">
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#C9A84C] font-semibold">
              Bespoke Inquiry
            </span>
            <SheetTitle className="font-serif text-xl sm:text-2xl text-[#F5F0E8]">
              Request a Quote
            </SheetTitle>
            <SheetDescription className="text-xs text-[#9B958B]">
              Enquiring for <span className="text-[#F5F0E8] font-medium">{product.name}</span>
              {selectedVariant ? ` (${selectedVariant.label})` : ''}. Our master craftsmen will provide dimensions, pricing, and timber availability within 24 hours.
            </SheetDescription>
          </SheetHeader>

          <div className="py-6">
            {submittedInquiryId ? (
              <InquirySuccess
                inquiryId={submittedInquiryId}
                onReset={() => {
                  setSubmittedInquiryId(null)
                  setIsInquiryOpen(false)
                }}
              />
            ) : (
              <InquiryForm
                productId={product.id}
                productName={`${product.name}${selectedVariant ? ` [${selectedVariant.label}]` : ''}`}
                onSuccess={(id) => setSubmittedInquiryId(id || 'submitted')}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default ProductDetailPage
