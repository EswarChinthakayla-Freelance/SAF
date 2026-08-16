import React from 'react'
import { Link } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Notification02Icon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
  Mail01Icon,
  PackageIcon,
} from '@hugeicons/core-free-icons'

export interface DashboardAttentionProps {
  newInquiriesCount?: number
  totalProducts?: number
  className?: string
}

export const DashboardAttention: React.FC<DashboardAttentionProps> = ({
  newInquiriesCount = 0,
  totalProducts = 0,
  className = '',
}) => {
  const hasItemsNeedingAttention = newInquiriesCount > 0 || totalProducts === 0

  return (
    <div
      className={`bg-[#111111] border border-[#242424] rounded-none p-5 flex flex-col justify-between shadow-sm ${className}`}
    >
      <div className="space-y-4">
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={hasItemsNeedingAttention ? Notification02Icon : CheckmarkCircle02Icon}
              className={`w-4 h-4 ${hasItemsNeedingAttention ? 'text-[#E8B84B]' : 'text-emerald-400'
                }`}
            />
            <h2 className="text-xs font-semibold font-sans uppercase tracking-wider text-[#F5F0E8]">
              Attention
            </h2>
          </div>
          <span className="text-[11px] font-sans text-[#7A746B]">
            {hasItemsNeedingAttention ? 'Pending Review' : 'Status Normal'}
          </span>
        </div>

        {/* Attention Items List */}
        <div className="space-y-3 text-xs">
          {newInquiriesCount > 0 && (
            <Link
              to="/admin/inquiries?status=new"
              className="flex items-center justify-between p-3 rounded bg-[#161410] border border-[#C9A84C]/30 hover:border-[#C9A84C]/60 hover:bg-[#1A1712] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded bg-[#C9A84C]/20 text-[#E8B84B] flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={Mail01Icon} className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-medium text-[#F5F0E8] font-sans">
                    {newInquiriesCount} new {newInquiriesCount === 1 ? 'enquiry' : 'enquiries'} awaiting response
                  </div>
                  <div className="text-[11px] text-[#8A847A] font-sans">
                    Review and reply to recent customer requests
                  </div>
                </div>
              </div>
              <span className="text-xs text-[#C9A84C] group-hover:translate-x-0.5 transition-transform">
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />
              </span>
            </Link>
          )}

          {totalProducts === 0 && (
            <Link
              to="/admin/products/new"
              className="flex items-center justify-between p-3 rounded bg-[#161616] border border-[#2A2A2A] hover:border-[#383838] hover:bg-[#1C1C1C] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded bg-[#2A2A2A] text-[#D1CCC2] flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={PackageIcon} className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-medium text-[#F5F0E8] font-sans">
                    Catalogue is currently empty
                  </div>
                  <div className="text-[11px] text-[#8A847A] font-sans">
                    Add your first product to begin publishing collections
                  </div>
                </div>
              </div>
              <span className="text-xs text-[#9B958B] group-hover:translate-x-0.5 transition-transform">
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />
              </span>
            </Link>
          )}

          {!hasItemsNeedingAttention && (
            <div className="flex items-center gap-3 p-3.5 rounded bg-[#141414] border border-[#1F1F1F] text-[#8A847A]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <div className="text-xs font-sans">
                Everything is up to date. All enquiries have been reviewed.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer link */}
      <div className="pt-3 mt-3 border-t border-[#1C1C1C] flex items-center justify-between text-[11px] font-sans text-[#7A746B]">
        <span>Operational status</span>
        <Link
          to="/admin/inquiries"
          className="text-[#9B958B] hover:text-[#C9A84C] transition-colors inline-flex items-center gap-1 font-medium"
        >
          <span>All Inquiries</span>
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}

export default DashboardAttention
