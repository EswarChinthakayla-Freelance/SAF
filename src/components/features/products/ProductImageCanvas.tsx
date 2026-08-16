import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { getMediaUrl } from '@/lib/media'
import { getCollectionFallbackImage } from '@/lib/collectionFallback'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'
import type { ProductImageRow } from '@/types/app'

export interface ProductImageCanvasProps {
  image?: ProductImageRow | null
  productName: string
  collectionSlug?: string
  zoom: number
  onZoomChange: (zoom: number) => void
  pan: { x: number; y: number }
  onPanChange: (pan: { x: number; y: number }) => void
  onToggleZoom?: () => void
  className?: string
}

/**
 * ProductImageCanvas
 * Immersive light-table inspection canvas.
 * Supports fluid pan/drag with boundary clamping when zoomed, double-click zoom toggle,
 * touch gestures, and progressive high-resolution image delivery.
 */
export const ProductImageCanvas: React.FC<ProductImageCanvasProps> = ({
  image,
  productName,
  collectionSlug,
  zoom,
  onZoomChange,
  pan,
  onPanChange,
  onToggleZoom,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [hasImageError, setHasImageError] = useState(false)
  const shouldReduceMotion = useReducedMotionPreference()

  // Reset error when image changes
  useEffect(() => {
    setHasImageError(false)
  }, [image?.storage_path])

  const fallbackUrl = getCollectionFallbackImage(collectionSlug, productName, 0)
  const imageUrl = image?.storage_path
    ? getMediaUrl(STORAGE_BUCKETS.PRODUCT_IMAGES, image.storage_path, zoom > 1.5 ? 'lightbox' : 'viewer-main')
    : fallbackUrl

  const altText = image?.alt_text || `${productName} — architectural photograph`

  // Clamp pan coordinates within container boundaries so the image never disappears
  const clampPan = useCallback(
    (nextX: number, nextY: number, currentZoom: number) => {
      if (!containerRef.current || currentZoom <= 1) {
        return { x: 0, y: 0 }
      }
      const { clientWidth, clientHeight } = containerRef.current
      const maxPanX = (clientWidth * (currentZoom - 1)) / 2
      const maxPanY = (clientHeight * (currentZoom - 1)) / 2

      return {
        x: Math.max(-maxPanX, Math.min(maxPanX, nextX)),
        y: Math.max(-maxPanY, Math.min(maxPanY, nextY)),
      }
    },
    []
  )

  // Pointer drag for panning when zoomed
  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return
    isDraggingRef.current = true
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || zoom <= 1) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    const newPan = clampPan(dragStartRef.current.panX + dx, dragStartRef.current.panY + dy, zoom)
    onPanChange(newPan)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    setIsDragging(false)
    try {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      // safe fallback
    }
  }

  // Double click / tap toggle between Fit and 2x zoom
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onToggleZoom) {
      onToggleZoom()
    } else {
      if (zoom > 1) {
        onZoomChange(1)
        onPanChange({ x: 0, y: 0 })
      } else {
        onZoomChange(2)
      }
    }
  }

  const cursorStyle = zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none bg-[#080808] touch-none ${cursorStyle} ${className}`}
      aria-label={`${productName} image inspection workspace. Double click to zoom.`}
    >
      {/* 1. Subtle Architectural Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* 2. Image Display Stage */}
      {hasImageError || !imageUrl ? (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 z-10">
          <div className="w-16 h-16 rounded-none border border-[#2A2A2A] bg-[#111111] flex items-center justify-center text-[#C9A84C] font-serif text-xl">
            SAF
          </div>
          <p className="text-sm text-[#D1CCC2] font-serif">Image not available</p>
          <p className="text-xs text-[#7A746B] max-w-xs font-sans font-light">
            This photograph is currently being updated in our digital catalogue.
          </p>
        </div>
      ) : (
        <motion.div
          className="relative max-w-full max-h-full flex items-center justify-center p-4 sm:p-8"
          style={{
            x: pan.x,
            y: pan.y,
            scale: zoom,
          }}
          transition={
            shouldReduceMotion || isDragging
              ? { duration: 0 }
              : { type: 'spring', stiffness: 300, damping: 30 }
          }
        >
          <div className="relative bg-white shadow-2xl border border-[#2A2A2A]/40 p-2 sm:p-4">
            <img
              src={imageUrl}
              alt={altText}
              onError={() => setHasImageError(true)}
              draggable={false}
              className="max-h-[calc(100svh-180px)] max-w-[calc(100vw-80px)] md:max-w-[75vw] object-contain block mx-auto select-none pointer-events-none"
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ProductImageCanvas
