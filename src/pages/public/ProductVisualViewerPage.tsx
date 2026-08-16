import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowLeft02Icon,
  ArrowRight01Icon,
  InformationCircleIcon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { PageMeta } from '@/components/seo/PageMeta'
import { ErrorState } from '@/components/common/ErrorState'
import { useProduct } from '@/hooks/queries/useProducts'
import { ProductImageCanvas } from '@/components/features/products/ProductImageCanvas'
import { ImageControlDock } from '@/components/features/products/ImageControlDock'
import { ViewerThumbnailRail } from '@/components/features/products/ViewerThumbnailRail'
import { ProductShareAction } from '@/components/features/products/ProductShareAction'
import { formatCurrency } from '@/utils/formatCurrency'
import { getMediaUrl } from '@/lib/media'
import { STORAGE_BUCKETS } from '@/lib/constants'
import type { ProductImageRow } from '@/types/app'

/**
 * ProductVisualViewerPage
 * Dedicated full-page visual inspection companion at `/products/:slug/view`.
 * Provides 100svh light-table examination, deep-zoom, pan, full-screen, responsive mobile bottom sheet,
 * and image-aware Web Share.
 */
export const ProductVisualViewerPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const { data: product, isLoading, isError, error, refetch } = useProduct(slug)

  // 1. Image Ordering & Resolution
  const images = useMemo<ProductImageRow[]>(() => {
    if (!product?.product_images || product.product_images.length === 0) {
      const fallbackPath = product?.cover_image_path || ''
      return [
        {
          id: 'cover',
          product_id: product?.id || '',
          storage_path: fallbackPath,
          alt_text: product?.name || 'Architectural Creation',
          sort_order: 0,
          is_cover: true,
          created_at: new Date().toISOString(),
        },
      ]
    }
    return [...product.product_images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  }, [product])

  // 2. Selected Image State
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Initialize selected image from `?image=` query param if provided
  useEffect(() => {
    if (images.length === 0) return
    const imageQuery = searchParams.get('image')
    if (imageQuery) {
      const foundIdx = images.findIndex((img, idx) => img.id === imageQuery || String(idx) === imageQuery)
      if (foundIdx >= 0) {
        setSelectedIdx(foundIdx)
      }
    }
  }, [searchParams, images])

  const activeImage = images[selectedIdx] || images[0]

  const handleSelectImage = useCallback(
    (newIdx: number) => {
      const clamped = Math.max(0, Math.min(images.length - 1, newIdx))
      setSelectedIdx(clamped)
      // Update URL search params cleanly without page reload
      const targetImg = images[clamped]
      if (targetImg) {
        setSearchParams({ image: targetImg.id || String(clamped) }, { replace: true })
      }
      // Reset zoom & pan when image changes
      setZoom(1)
      setPan({ x: 0, y: 0 })
    },
    [images, setSearchParams]
  )

  const minZoom = 1
  const maxZoom = 4
  const zoomStep = 0.5

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(maxZoom, Number((prev + zoomStep).toFixed(1))))
  }

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(minZoom, Number((prev - zoomStep).toFixed(1)))
      if (next <= 1) {
        setPan({ x: 0, y: 0 })
      }
      return next
    })
  }

  const handleFit = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleToggleZoom = () => {
    if (zoom > 1.2) {
      handleFit()
    } else {
      setZoom(2)
    }
  }

  // 4. Fullscreen Controls
  const supportsFullscreen = typeof document !== 'undefined' && Boolean(document.fullscreenEnabled)

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
        setIsFullscreen(false)
      }
    }
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // 5. Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture keys if an input is focused
      if (
        document.activeElement &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)
      ) {
        return
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          handleSelectImage(selectedIdx - 1)
          break
        case 'ArrowRight':
          e.preventDefault()
          handleSelectImage(selectedIdx + 1)
          break
        case '+':
        case '=':
          e.preventDefault()
          handleZoomIn()
          break
        case '-':
        case '_':
          e.preventDefault()
          handleZoomOut()
          break
        case '0':
          e.preventDefault()
          handleFit()
          break
        case 'f':
        case 'F':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'Escape':
          e.preventDefault()
          if (isInfoOpen) {
            setIsInfoOpen(false)
          } else if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {})
          } else {
            navigate(product ? `/products/${product.slug}` : '/products')
          }
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIdx, handleSelectImage, isInfoOpen, product, navigate, toggleFullscreen])

  // 6. Loading State
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#060606] flex flex-col z-50 font-sans select-none">
        {/* Topbar Skeleton */}
        <div className="h-14 bg-[#0B0B0B] border-b border-[#2A2A2A] px-4 flex items-center justify-between">
          <div className="h-4 w-32 bg-[#1A1A1A] animate-pulse" />
          <div className="h-4 w-20 bg-[#1A1A1A] animate-pulse" />
          <div className="h-8 w-8 bg-[#1A1A1A] animate-pulse" />
        </div>
        {/* Center Workspace Skeleton */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-3xl aspect-[4/3] bg-[#111111] border border-[#2A2A2A] animate-pulse flex items-center justify-center">
            <span className="font-mono text-xs text-[#7A746B] uppercase tracking-widest">
              Loading High-Res Visual Inspection...
            </span>
          </div>
        </div>
      </div>
    )
  }

  // 7. Error State
  if (isError || !product) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center p-6 text-[#F5F0E8]">
        <div className="space-y-4 text-center max-w-md">
          <ErrorState
            title="Product Unavailable"
            message={error?.message || 'This creation is no longer available in the public catalogue.'}
            onRetry={refetch}
          />
          <div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C9A84C] hover:text-[#E8B84B] pt-2"
            >
              ← Return to Catalogue
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const currentFormatted = String(selectedIdx + 1).padStart(2, '0')
  const totalFormatted = String(Math.max(1, images.length)).padStart(2, '0')
  const activeImageUrl = activeImage?.storage_path
    ? getMediaUrl(STORAGE_BUCKETS.PRODUCT_IMAGES, activeImage.storage_path, 'share-image')
    : null

  return (
    <div className="fixed inset-0 bg-[#060606] text-[#F5F0E8] flex flex-col z-50 overflow-hidden font-sans select-none">
      <PageMeta
        title={`${product.name} — Visual View | Sri Anjaneya Furnitures`}
        description={product.short_desc || `Architectural image inspection for ${product.name}.`}
        canonicalUrl={`/products/${product.slug}`}
        ogImage={activeImageUrl || undefined}
      />

      {/* A. Light-Table Slim Topbar */}
      <header className="h-14 shrink-0 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#2A2A2A] px-3 sm:px-6 flex items-center justify-between z-20">
        {/* Left: Back Action & Product Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 max-w-[55%] sm:max-w-[65%]">
          <Link
            to={`/products/${product.slug}`}
            className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#9B958B] hover:text-[#E8B84B] transition-colors shrink-0"
            aria-label={`Return to ${product.name} product details`}
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} className="w-4 h-4" />
            <span className="hidden sm:inline">Product</span>
          </Link>
          <span className="text-[#3A3A3A] hidden sm:inline">/</span>
          <h1 className="text-xs sm:text-sm font-serif font-semibold text-[#F5F0E8] truncate">
            {product.name}
          </h1>
          {product.collections?.name && (
            <span className="hidden md:inline text-[10px] uppercase font-mono tracking-widest text-[#C9A84C] bg-[#171717] px-2 py-0.5 border border-[#2A2A2A] shrink-0">
              {product.collections.name}
            </span>
          )}
        </div>

        {/* Center: Image Counter */}
        <div
          role="status"
          aria-live="polite"
          className="font-mono text-[11px] sm:text-xs text-[#C9A84C] font-semibold tracking-widest px-2 sm:px-3 py-0.5 sm:py-1 bg-[#141414] border border-[#2A2A2A] rounded-none shrink-0"
        >
          {currentFormatted} / {totalFormatted}
        </div>

        {/* Right: Actions (Share, Info, Close) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Progressive Web Share */}
          <ProductShareAction
            productName={product.name}
            productSlug={product.slug}
            imageUrl={activeImageUrl}
            variant="ghost"
            size="sm"
            showText={false}
            className="h-8 w-8 hover:bg-[#1E1E1E] text-[#D1CCC2] hover:text-[#C9A84C] rounded-none cursor-pointer"
          />

          {/* Product Info Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsInfoOpen((prev) => !prev)}
            aria-label="Toggle product info drawer"
            aria-expanded={isInfoOpen}
            aria-controls="product-info-sheet"
            className={`h-8 w-8 hover:bg-[#1E1E1E] rounded-none cursor-pointer ${
              isInfoOpen ? 'text-[#C9A84C] bg-[#1E1E1E]' : 'text-[#D1CCC2]'
            }`}
          >
            <HugeiconsIcon icon={InformationCircleIcon} className="w-4 h-4" />
          </Button>

          {/* Exit / Close */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/products/${product.slug}`)}
            aria-label={`Close inspection and return to ${product.name}`}
            className="h-8 w-8 hover:bg-[#1E1E1E] text-[#D1CCC2] hover:text-red-400 rounded-none cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* B. Central Light-Table Workspace */}
      <main className="flex-1 relative flex overflow-hidden">
        {/* Left Thumbnail Rail (Desktop >= 1024px) */}
        <div className="hidden lg:flex flex-col justify-center px-4 z-10">
          <ViewerThumbnailRail
            images={images}
            selectedIndex={selectedIdx}
            onSelectIndex={handleSelectImage}
            productName={product.name}
            collectionSlug={product.collections?.slug}
            orientation="vertical"
          />
        </div>

        {/* Center Canvas */}
        <div className="flex-1 relative h-full w-full">
          <ProductImageCanvas
            image={activeImage}
            productName={product.name}
            collectionSlug={product.collections?.slug}
            zoom={zoom}
            onZoomChange={setZoom}
            pan={pan}
            onPanChange={setPan}
            onToggleZoom={handleToggleZoom}
          />

          {/* Floating Image Control Dock */}
          <div className="absolute bottom-16 lg:bottom-8 left-1/2 -translate-x-1/2 z-20 max-w-[96vw]">
            <ImageControlDock
              zoom={zoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFit={handleFit}
              onReset={handleReset}
              onPrevImage={() => handleSelectImage(selectedIdx - 1)}
              onNextImage={() => handleSelectImage(selectedIdx + 1)}
              hasMultipleImages={images.length > 1}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              supportsFullscreen={supportsFullscreen}
            />
          </div>

          {/* Mobile Bottom Thumbnail Strip (< 1024px) */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 lg:hidden flex justify-center z-10 px-4">
              <ViewerThumbnailRail
                images={images}
                selectedIndex={selectedIdx}
                onSelectIndex={handleSelectImage}
                productName={product.name}
                collectionSlug={product.collections?.slug}
                orientation="horizontal"
              />
            </div>
          )}
        </div>

        {/* C. Product Context Sheet (Mobile Bottom Sheet / Desktop Right Slide-Over) */}
        {isInfoOpen && (
          <>
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
              onClick={() => setIsInfoOpen(false)}
              aria-hidden="true"
            />

            {/* Sheet Container */}
            <aside
              id="product-info-sheet"
              aria-label="Product specifications preview"
              className="fixed inset-x-0 bottom-0 z-50 max-h-[82vh] lg:max-h-none lg:inset-y-0 lg:left-auto lg:right-0 lg:w-96 bg-[#0E0E0E]/98 backdrop-blur-2xl border-t lg:border-t-0 lg:border-l border-[#2A2A2A] p-5 sm:p-6 rounded-t-2xl lg:rounded-none flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-bottom lg:slide-in-from-right duration-200"
            >
              {/* Mobile Drag Pill */}
              <div className="w-10 h-1 bg-[#3A3A3A] rounded-full mx-auto mb-3 lg:hidden shrink-0" />

              <div className="flex-1 overflow-y-auto space-y-5 pr-1 no-scrollbar">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                  <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#C9A84C] font-semibold">
                    Creation Details
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsInfoOpen(false)}
                    className="text-xs text-[#7A746B] hover:text-[#F5F0E8] font-mono cursor-pointer px-2 py-1 hover:bg-[#1A1A1A]"
                  >
                    ✕ Close
                  </button>
                </div>

                {/* Title & Collection */}
                <div className="space-y-1.5">
                  {product.collections?.name && (
                    <span className="text-[11px] uppercase font-mono tracking-widest text-[#C9A84C]">
                      {product.collections.name}
                    </span>
                  )}
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F0E8] leading-tight">
                    {product.name}
                  </h2>
                  {product.product_code && (
                    <div className="text-[11px] font-mono text-[#7A746B]">
                      CODE: {product.product_code}
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="p-3 bg-[#141414] border border-[#222222]">
                  <div className="text-[10px] uppercase font-mono text-[#7A746B] tracking-wider mb-1">
                    Investment / Price
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-mono text-[#E8B84B] font-bold">
                      {formatCurrency(product.price)}
                    </span>
                    {product.compare_price && product.compare_price > product.price && (
                      <span className="text-sm font-mono text-[#7A746B] line-through">
                        {formatCurrency(product.compare_price)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {product.short_desc && (
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase font-mono text-[#7A746B] tracking-wider">
                      Craft Overview
                    </div>
                    <p className="text-xs text-[#D1CCC2] leading-relaxed font-sans font-light">
                      {product.short_desc}
                    </p>
                  </div>
                )}

                {/* Materials */}
                {Array.isArray(product.materials) && product.materials.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] uppercase font-mono text-[#7A746B] tracking-wider">
                      Materials & Joinery
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {product.materials.map((mat) => (
                        <span
                          key={mat}
                          className="text-[10px] font-mono uppercase bg-[#181818] text-[#D1CCC2] border border-[#2A2A2A] px-2 py-0.5"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bottom */}
              <div className="pt-4 mt-4 border-t border-[#2A2A2A] shrink-0">
                <Link
                  to={`/products/${product.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#C9A84C] hover:bg-[#E8B84B] text-[#0A0A0A] font-mono text-xs uppercase tracking-widest font-semibold transition-colors shadow-lg"
                >
                  <span>View Full Product Page</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                </Link>
              </div>
            </aside>
          </>
        )}
      </main>
    </div>
  )
}

export default ProductVisualViewerPage
