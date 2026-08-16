import React from 'react'
import { Link } from 'react-router-dom'
import { GoldButton } from '@/components/brand/GoldButton'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowLeft01Icon,
  ImageAdd01Icon,
  Sorting01Icon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons'

export interface AdminGalleryHeaderProps {
  totalCount: number
  activeCount: number
  isReorderMode: boolean
  onToggleReorderMode: () => void
  onOpenUpload: () => void
}

export const AdminGalleryHeader: React.FC<AdminGalleryHeaderProps> = ({
  totalCount,
  activeCount,
  isReorderMode,
  onToggleReorderMode,
  onOpenUpload,
}) => {
  return (
    <header className="space-y-4">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-sans text-[#7A746B]">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-[#9B958B] hover:text-[#C9A84C] transition-colors py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C]"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5" />
          <span>Admin</span>
        </Link>
        <span className="text-[#4A4A4A]">/</span>
        <span className="text-[#F5F0E8] font-medium">Gallery</span>
      </nav>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-sans font-semibold text-[#F5F0E8] tracking-tight">
              Gallery
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono border bg-[#141414] text-[#C9A84C] border-[#2A2A2A]">
              <span>{totalCount} {totalCount === 1 ? 'image' : 'images'}</span>
              <span className="text-[#4A4A4A]">·</span>
              <span className="text-[#4ADE80]">{activeCount} active</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm font-sans text-[#9B958B]">
            Manage public gallery images, room metadata, product links and display order.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleReorderMode}
            className={`h-9 px-3 text-xs font-sans font-medium transition-all ${
              isReorderMode
                ? 'bg-[#C9A84C] text-[#0A0A0A] border-[#C9A84C] hover:bg-[#E8B84B]'
                : 'bg-[#141414] border-[#2A2A2A] text-[#D1CCC2] hover:text-[#F5F0E8] hover:bg-[#1C1C1C]'
            }`}
          >
            <HugeiconsIcon icon={isReorderMode ? CheckmarkCircle02Icon : Sorting01Icon} className="w-3.5 h-3.5 mr-1.5" />
            <span>{isReorderMode ? 'Done Reordering' : 'Reorder'}</span>
          </Button>

          <GoldButton
            type="button"
            size="sm"
            onClick={onOpenUpload}
            icon={<HugeiconsIcon icon={ImageAdd01Icon} className="w-3.5 h-3.5" />}
            className="h-9 px-3.5 text-xs uppercase tracking-wider font-semibold"
          >
            Upload Images
          </GoldButton>
        </div>
      </div>
    </header>
  )
}
