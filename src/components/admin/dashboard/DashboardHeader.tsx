import React from 'react'
import { Link } from 'react-router-dom'
import { GoldButton } from '@/components/brand/GoldButton'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  PlusSignIcon,
  ArrowUpRight01Icon,
  RefreshIcon,
} from '@hugeicons/core-free-icons'

export interface DashboardHeaderProps {
  onRefresh?: () => void
  isRefreshing?: boolean
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222222]">
      {/* Title & Description */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-sans font-semibold text-[#F5F0E8] tracking-tight">
            Dashboard
          </h1>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh dashboard data"
              title="Refresh dashboard data"
              className="p-1.5 text-[#7A746B] hover:text-[#F5F0E8] hover:bg-[#1A1A1A] rounded transition-colors disabled:opacity-50 cursor-pointer"
            >
              <HugeiconsIcon
                icon={RefreshIcon}
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#C9A84C]' : ''}`}
              />
            </button>
          )}
        </div>
        <p className="text-xs sm:text-sm text-[#8A847A] font-sans font-normal leading-relaxed">
          Manage your catalogue, gallery and customer enquiries from one place.
        </p>
      </div>

      {/* Primary & Secondary Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-sans font-medium text-[#9B958B] hover:text-[#F5F0E8] bg-[#141414] hover:bg-[#1A1A1A] border border-[#2A2A2A] rounded transition-colors"
        >
          <span>View Website</span>
          <HugeiconsIcon icon={ArrowUpRight01Icon} className="w-3.5 h-3.5 text-[#7A746B]" />
        </a>

        <Link to="/admin/products/new">
          <GoldButton
            size="sm"
            icon={<HugeiconsIcon icon={PlusSignIcon} className="w-3.5 h-3.5" />}
            className="text-xs uppercase font-mono tracking-wider font-semibold"
          >
            Add Product
          </GoldButton>
        </Link>
      </div>
    </div>
  )
}

export default DashboardHeader
