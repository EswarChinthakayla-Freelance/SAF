import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ZoomInAreaIcon,
  ZoomOutAreaIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Maximize01Icon,
  ViewIcon,
  RefreshIcon,
} from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'

export interface ImageControlDockProps {
  zoom: number
  minZoom?: number
  maxZoom?: number
  onZoomIn: () => void
  onZoomOut: () => void
  onFit: () => void
  onReset: () => void
  onPrevImage?: () => void
  onNextImage?: () => void
  hasMultipleImages?: boolean
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  supportsFullscreen?: boolean
  className?: string
}

/**
 * ImageControlDock
 * Floating architectural dock providing professional image inspection controls:
 * Zoom (+/-), percentage indicator, Fit, Reset, Previous/Next navigation, and Fullscreen toggle.
 * Optimized with responsive compact layouts for mobile and touchscreens.
 */
export const ImageControlDock: React.FC<ImageControlDockProps> = ({
  zoom,
  minZoom = 1,
  maxZoom = 4,
  onZoomIn,
  onZoomOut,
  onFit,
  onReset,
  onPrevImage,
  onNextImage,
  hasMultipleImages = false,
  isFullscreen = false,
  onToggleFullscreen,
  supportsFullscreen = true,
  className = '',
}) => {
  const zoomPercent = Math.round(zoom * 100)

  return (
    <TooltipProvider delay={200}>
      <nav
        aria-label="Image inspection controls"
        className={`inline-flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-[#111111]/95 backdrop-blur-md border border-[#2A2A2A] shadow-2xl text-[#F5F0E8] max-w-[96vw] overflow-x-auto no-scrollbar ${className}`}
      >
        {/* 1. Image Navigation (when multiple images exist) */}
        {hasMultipleImages && onPrevImage && onNextImage && (
          <>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onPrevImage}
                    aria-label="Previous image"
                    className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-[#1E1E1E] text-[#D1CCC2] hover:text-[#C9A84C] cursor-pointer rounded-none"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                }
              />
              <TooltipContent side="top" className="bg-[#141414] text-[#F5F0E8] border border-[#2A2A2A] text-xs font-mono">
                Previous Image (←)
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onNextImage}
                    aria-label="Next image"
                    className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-[#1E1E1E] text-[#D1CCC2] hover:text-[#C9A84C] cursor-pointer rounded-none"
                  >
                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                }
              />
              <TooltipContent side="top" className="bg-[#141414] text-[#F5F0E8] border border-[#2A2A2A] text-xs font-mono">
                Next Image (→)
              </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-4 sm:h-5 bg-[#2A2A2A] mx-0.5" />
          </>
        )}

        {/* 2. Zoom Controls */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onZoomOut}
                disabled={zoom <= minZoom}
                aria-label="Zoom out"
                className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-[#1E1E1E] text-[#D1CCC2] hover:text-[#C9A84C] disabled:opacity-30 cursor-pointer rounded-none"
              >
                <HugeiconsIcon icon={ZoomOutAreaIcon} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            }
          />
          <TooltipContent side="top" className="bg-[#141414] text-[#F5F0E8] border border-[#2A2A2A] text-xs font-mono">
            Zoom Out (-)
          </TooltipContent>
        </Tooltip>

        {/* Zoom Level Indicator */}
        <div
          role="status"
          aria-live="polite"
          className="px-1 sm:px-2 font-mono text-[11px] sm:text-xs text-[#C9A84C] min-w-[42px] sm:min-w-[50px] text-center select-none font-semibold"
        >
          {zoomPercent}%
        </div>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onZoomIn}
                disabled={zoom >= maxZoom}
                aria-label="Zoom in"
                className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-[#1E1E1E] text-[#D1CCC2] hover:text-[#C9A84C] disabled:opacity-30 cursor-pointer rounded-none"
              >
                <HugeiconsIcon icon={ZoomInAreaIcon} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            }
          />
          <TooltipContent side="top" className="bg-[#141414] text-[#F5F0E8] border border-[#2A2A2A] text-xs font-mono">
            Zoom In (+)
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-4 sm:h-5 bg-[#2A2A2A] mx-0.5" />

        {/* 3. Fit Image to Screen */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onFit}
                aria-label="Fit image to screen"
                className="h-7 px-2 sm:h-8 sm:px-2.5 hover:bg-[#1E1E1E] text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#D1CCC2] hover:text-[#C9A84C] cursor-pointer rounded-none"
              >
                <HugeiconsIcon icon={ViewIcon} className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                <span>Fit</span>
              </Button>
            }
          />
          <TooltipContent side="top" className="bg-[#141414] text-[#F5F0E8] border border-[#2A2A2A] text-xs font-mono">
            Fit to Screen (0)
          </TooltipContent>
        </Tooltip>

        {/* 4. Reset View */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onReset}
                aria-label="Reset view"
                className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-[#1E1E1E] text-[#D1CCC2] hover:text-[#C9A84C] cursor-pointer rounded-none"
              >
                <HugeiconsIcon icon={RefreshIcon} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </Button>
            }
          />
          <TooltipContent side="top" className="bg-[#141414] text-[#F5F0E8] border border-[#2A2A2A] text-xs font-mono">
            Reset Zoom & Position
          </TooltipContent>
        </Tooltip>

        {/* 5. Fullscreen Toggle (when supported) */}
        {supportsFullscreen && onToggleFullscreen && (
          <>
            <Separator orientation="vertical" className="h-4 sm:h-5 bg-[#2A2A2A] mx-0.5" />
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onToggleFullscreen}
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-[#1E1E1E] text-[#D1CCC2] hover:text-[#C9A84C] cursor-pointer rounded-none"
                  >
                    <HugeiconsIcon icon={Maximize01Icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                }
              />
              <TooltipContent side="top" className="bg-[#141414] text-[#F5F0E8] border border-[#2A2A2A] text-xs font-mono">
                {isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </nav>
    </TooltipProvider>
  )
}

export default ImageControlDock
