import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { getMediaUrl } from '@/lib/media'
import { getCollectionFallbackImage } from '@/lib/collectionFallback'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'
import type { GalleryItemWithProduct } from '@/types/app'

export interface GalleryInspectCanvasProps {
  image: GalleryItemWithProduct
  zoom: number
  onZoomChange: (zoom: number) => void
  pan: { x: number; y: number }
  onPanChange: (pan: { x: number; y: number }) => void
  onToggleZoom?: () => void
  className?: string
}

const CornerRegisterMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none absolute z-20 ${className}`} aria-hidden="true">
    <div className="relative w-6 h-6">
      <span className="absolute top-0 left-0 w-2.5 h-[1.5px] bg-[#C9A84C]" />
      <span className="absolute top-0 left-0 w-[1.5px] h-2.5 bg-[#C9A84C]" />
      <span className="absolute bottom-0 right-0 w-2.5 h-[1.5px] bg-[#C9A84C]" />
      <span className="absolute bottom-0 right-0 w-[1.5px] h-2.5 bg-[#C9A84C]" />
    </div>
  </div>
)

export const GalleryInspectCanvas: React.FC<GalleryInspectCanvasProps> = ({
  image,
  zoom,
  onZoomChange,
  pan,
  onPanChange,
  onToggleZoom,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [hasImageError, setHasImageError] = useState(false)
  const shouldReduceMotion = useReducedMotionPreference()

  useEffect(() => {
    setHasImageError(false)
  }, [image.storage_path])

  const fallbackUrl = getCollectionFallbackImage(
    image.room_type || undefined,
    image.alt_text || image.room_type || undefined,
    0
  )
  const imageUrl = !hasImageError && image.storage_path
    ? getMediaUrl(STORAGE_BUCKETS.GALLERY_IMAGES, image.storage_path, 'gallery-inspect')
    : fallbackUrl

  const altText = image.alt_text || `${image.room_type || 'Curated space'} inspiration photograph`

  // Clamp pan coordinates within container boundaries so image is never dragged out of sight
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

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return
    const nextX = e.clientX - dragStart.x
    const nextY = e.clientY - dragStart.y
    onPanChange(clampPan(nextX, nextY, zoom))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch pan handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom <= 1 || e.touches.length !== 1) return
    setIsDragging(true)
    const touch = e.touches[0]
    setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || zoom <= 1 || e.touches.length !== 1) return
    const touch = e.touches[0]
    const nextX = touch.clientX - dragStart.x
    const nextY = touch.clientY - dragStart.y
    onPanChange(clampPan(nextX, nextY, zoom))
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY < 0 ? 0.2 : -0.2
      const nextZoom = Math.max(1, Math.min(4, Number((zoom + delta).toFixed(1))))
      onZoomChange(nextZoom)
      if (nextZoom <= 1) {
        onPanChange({ x: 0, y: 0 })
      } else {
        onPanChange(clampPan(pan.x, pan.y, nextZoom))
      }
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      onDoubleClick={onToggleZoom}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-[#060606] select-none ${
        zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
      } ${className}`}
    >
      {/* Corner Precision Marks */}
      <CornerRegisterMark className="top-6 left-6" />
      <CornerRegisterMark className="top-6 right-6" />
      <CornerRegisterMark className="bottom-6 left-6" />
      <CornerRegisterMark className="bottom-6 right-6" />

      {/* Frame Canvas */}
      <motion.div
        animate={{
          scale: zoom,
          x: pan.x,
          y: pan.y,
        }}
        transition={
          isDragging || shouldReduceMotion
            ? { duration: 0 }
            : { type: 'spring', damping: 25, stiffness: 220 }
        }
        className="w-full h-full flex items-center justify-center p-4 sm:p-8 pointer-events-none"
      >
        <img
          src={imageUrl}
          alt={altText}
          onError={() => setHasImageError(true)}
          className="max-h-full max-w-full object-contain shadow-2xl transition-opacity duration-300"
          draggable={false}
        />
      </motion.div>
    </div>
  )
}

export default GalleryInspectCanvas
