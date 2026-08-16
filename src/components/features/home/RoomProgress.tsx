import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'

interface RoomProgressProps {
  total: number
  activeIndex: number
  onPrev: () => void
  onNext: () => void
  canPrev: boolean
  canNext: boolean
}

/**
 * RoomProgress
 * Architectural progress indicator with node markers, fraction counter, and prev/next controls.
 */
export const RoomProgress: React.FC<RoomProgressProps> = ({
  total,
  activeIndex,
  onPrev,
  onNext,
  canPrev,
  canNext,
}) => {
  const currentFormatted = String(activeIndex + 1).padStart(2, '0')
  const totalFormatted = String(total).padStart(2, '0')
  const progressPercent = total > 1 ? (activeIndex / (total - 1)) * 100 : 100

  return (
    <div className="w-full flex items-center justify-between gap-6 select-none pt-4 border-t border-[#2A2A2A]/50">
      {/* Progress Track & Nodes */}
      <div className="flex-1 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="text-[11px] font-mono text-[#C9A84C] font-semibold"
        >
          {currentFormatted}
        </span>

        <div className="relative flex-1 h-[2px] bg-[#1F1E1B] overflow-hidden">
          {/* Active gold fill line */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#C9A84C] to-[#E8B84B] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <span
          aria-hidden="true"
          className="text-[11px] font-mono text-[#9B958B]/50"
        >
          {totalFormatted}
        </span>
      </div>

      {/* Counter and Navigation Controls */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Fraction Counter */}
        <div
          aria-label={`Room ${activeIndex + 1} of ${total}`}
          className="text-xs font-mono tracking-wider flex items-center gap-1"
        >
          <span className="text-[#F5F0E8] font-medium">{currentFormatted}</span>
          <span className="text-[#9B958B]/40">/</span>
          <span className="text-[#9B958B]/60">{totalFormatted}</span>
        </div>

        {/* Previous & Next Square Controls */}
        <div className="flex items-center gap-1.5" role="group" aria-label="Room navigation">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onPrev}
            disabled={!canPrev}
            aria-label="Previous room"
            className="h-8 w-8 rounded-none border-[#2A2A2A] bg-[#0E0E0E] text-[#9B958B] hover:text-[#F5F0E8] hover:border-[#C9A84C]/50 hover:bg-[#151515] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onNext}
            disabled={!canNext}
            aria-label="Next room"
            className="h-8 w-8 rounded-none border-[#2A2A2A] bg-[#0E0E0E] text-[#9B958B] hover:text-[#F5F0E8] hover:border-[#C9A84C]/50 hover:bg-[#151515] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RoomProgress
