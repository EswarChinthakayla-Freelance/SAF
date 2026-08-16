import React, { useState, useRef, useEffect, useCallback } from 'react'
import { getMediaUrl } from '@/lib/media'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ZoomInAreaIcon,
  ZoomOutAreaIcon,
  RotateLeftIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  FullScreenIcon,
  Minimize01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons'
import type { AdminGalleryItem } from '@/types/app'

export interface GalleryImageCanvasProps {
  image: AdminGalleryItem
  onPrevious?: () => void
  onNext?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
}

export const GalleryImageCanvas: React.FC<GalleryImageCanvasProps> = ({
  image,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const canvasRef = useRef<HTMLDivElement>(null)
  const imageUrl = getMediaUrl('gallery-images', image.storage_path, 'gallery-inspect')

  // Reset zoom & pan when image changes
  useEffect(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [image.id])

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.25, 4))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.25, 0.5)
      if (next <= 1) setPan({ x: 0, y: 0 })
      return next
    })
  }, [])

  const handleResetZoom = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  // Keyboard navigation, zoom, and fullscreen shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events if focused in an input/textarea
      const target = e.target as HTMLElement
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return
      }

      if (e.key === 'ArrowLeft' && hasPrevious && onPrevious) {
        e.preventDefault()
        onPrevious()
      } else if (e.key === 'ArrowRight' && hasNext && onNext) {
        e.preventDefault()
        onNext()
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        handleZoomIn()
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault()
        handleZoomOut()
      } else if (e.key === '0') {
        e.preventDefault()
        handleResetZoom()
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault()
        onToggleFullscreen?.()
      } else if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault()
        onToggleFullscreen?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    hasPrevious,
    hasNext,
    onPrevious,
    onNext,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    isFullscreen,
    onToggleFullscreen,
  ])

  // Mouse pan handlers when zoom > 1
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      e.preventDefault()
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      e.preventDefault()
      const maxPan = 300 * (zoom - 1)
      const newX = Math.max(Math.min(e.clientX - dragStart.x, maxPan), -maxPan)
      const newY = Math.max(Math.min(e.clientY - dragStart.y, maxPan), -maxPan)
      setPan({ x: newX, y: newY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div
      ref={canvasRef}
      className={`select-none transition-all duration-200 overflow-hidden flex items-center justify-center ${
        isFullscreen
          ? 'fixed inset-0 z-[100] w-screen h-screen bg-[#070707]'
          : 'relative flex-1 w-full bg-[#070707] border border-[#222222] rounded-lg shadow-2xl min-h-[420px] lg:min-h-[560px]'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
      }}
    >
      {/* Fullscreen Close / Exit Action at Top-Right */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFullscreen}
            aria-label="Exit fullscreen"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#161616]/90 hover:bg-[#242424] text-[#D1CCC2] hover:text-[#F5F0E8] border border-[#2E2E2E] shadow-2xl backdrop-blur-md text-xs font-mono transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-3.5 h-3.5" />
            <span>Exit Fullscreen (Esc)</span>
          </button>
        </div>
      )}

      {/* Primary Inspector Image Stage */}
      <div
        className="w-full h-full flex items-center justify-center p-4 sm:p-8 transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
        }}
      >
        <img
          src={imageUrl}
          alt={image.alt_text || 'Inspected gallery photo'}
          className="max-w-full max-h-full object-contain pointer-events-none drop-shadow-2xl"
          draggable={false}
          loading="eager"
        />
      </div>

      {/* Previous & Next Navigation Side Arrows */}
      {hasPrevious && onPrevious && (
        <button
          type="button"
          onClick={onPrevious}
          aria-label="Previous gallery image"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0E0E0E]/80 hover:bg-[#1C1C1C] text-[#D1CCC2] hover:text-[#F5F0E8] border border-[#2E2E2E] flex items-center justify-center shadow-xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] z-30"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5" />
        </button>
      )}

      {hasNext && onNext && (
        <button
          type="button"
          onClick={onNext}
          aria-label="Next gallery image"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0E0E0E]/80 hover:bg-[#1C1C1C] text-[#D1CCC2] hover:text-[#F5F0E8] border border-[#2E2E2E] flex items-center justify-center shadow-xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] z-30"
        >
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5" />
        </button>
      )}

      {/* Bottom Floating Control Dock */}
      <div className="absolute bottom-4 inset-x-0 flex items-center justify-center pointer-events-none z-30">
        <div className="inline-flex items-center gap-1 p-1.5 rounded-lg bg-[#0E0E0E]/90 backdrop-blur-md border border-[#2A2A2A] shadow-2xl pointer-events-auto">
          {/* Zoom Out */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            aria-label="Zoom out"
            title="Zoom Out (-)"
            className="w-8 h-8 p-0 text-[#A8A29E] hover:text-[#F5F0E8] hover:bg-[#1E1E1E] rounded disabled:opacity-30"
          >
            <HugeiconsIcon icon={ZoomOutAreaIcon} className="w-4 h-4" />
          </Button>

          {/* Zoom Percentage Label */}
          <span className="w-12 text-center text-[11px] font-mono font-medium text-[#F5F0E8]">
            {Math.round(zoom * 100)}%
          </span>

          {/* Zoom In */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 4}
            aria-label="Zoom in"
            title="Zoom In (+)"
            className="w-8 h-8 p-0 text-[#A8A29E] hover:text-[#F5F0E8] hover:bg-[#1E1E1E] rounded disabled:opacity-30"
          >
            <HugeiconsIcon icon={ZoomInAreaIcon} className="w-4 h-4" />
          </Button>

          <div className="w-[1px] h-4 bg-[#2E2E2E] mx-1" />

          {/* Fit / Reset */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetZoom}
            aria-label="Fit image to screen"
            title="Fit to Canvas (0)"
            className="h-8 px-2 text-[11px] font-mono text-[#C9A84C] hover:text-[#E8B84B] hover:bg-[#1E1E1E] rounded"
          >
            <HugeiconsIcon icon={RotateLeftIcon} className="w-3.5 h-3.5 mr-1" />
            <span>Fit</span>
          </Button>

          <div className="w-[1px] h-4 bg-[#2E2E2E] mx-1" />

          {/* Fullscreen Trigger */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Enter Fullscreen (F)'}
            className={`w-8 h-8 p-0 rounded transition-colors ${
              isFullscreen ? 'text-[#C9A84C] bg-[#1E1E1E]' : 'text-[#A8A29E] hover:text-[#F5F0E8] hover:bg-[#1E1E1E]'
            }`}
          >
            <HugeiconsIcon icon={isFullscreen ? Minimize01Icon : FullScreenIcon} className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
