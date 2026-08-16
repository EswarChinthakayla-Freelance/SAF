import React from 'react'
import { Link } from 'react-router-dom'
import { InquiryStatusBadge } from './InquiryStatusBadge'
import { MobileInquiryRow } from './MobileInquiryRow'
import { formatDate, formatRelativeTime } from '@/utils/dates'
import { GoldButton } from '@/components/brand/GoldButton'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowRight01Icon,
  ViewIcon,
  Mail01Icon,
} from '@hugeicons/core-free-icons'
import type { InquiryRow } from '@/types/app'

export interface RecentInquiriesProps {
  inquiries?: InquiryRow[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  onSelectInquiry: (inquiry: InquiryRow) => void
}

export const RecentInquiries: React.FC<RecentInquiriesProps> = ({
  inquiries = [],
  isLoading = false,
  isError = false,
  onRetry,
  onSelectInquiry,
}) => {
  return (
    <div className="bg-[#111111] border border-[#242424] rounded-none overflow-hidden shadow-sm">
      {/* Section Header */}
      <div className="px-5 sm:px-6 py-4 border-b border-[#222222] flex items-center justify-between gap-4 bg-[#141414]">
        <div className="space-y-0.5">
          <h2 className="text-sm sm:text-base font-sans font-semibold text-[#F5F0E8]">
            Recent Inquiries
          </h2>
          <p className="text-xs text-[#8A847A] font-sans font-normal">
            Latest customer quote and contact enquiries.
          </p>
        </div>

        <Link
          to="/admin/inquiries"
          className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-[#C9A84C] hover:text-[#E8B84B] transition-colors"
        >
          <span>View All</span>
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="p-5 sm:p-6 space-y-3">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className="h-12 bg-[#161616] rounded border border-[#222222] animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        /* Localized Error State */
        <div className="p-8 text-center space-y-3">
          <p className="text-xs text-red-400 font-sans">
            Unable to load recent inquiries at this moment.
          </p>
          {onRetry && (
            <GoldButton onClick={onRetry} size="sm">
              Try Again
            </GoldButton>
          )}
        </div>
      ) : !inquiries || inquiries.length === 0 ? (
        /* Empty State */
        <div className="py-12 px-6 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#7A746B] flex items-center justify-center mx-auto">
            <HugeiconsIcon icon={Mail01Icon} className="w-5 h-5" />
          </div>
          <div className="text-sm font-medium text-[#F5F0E8] font-sans">
            No enquiries yet
          </div>
          <p className="text-xs text-[#7A746B] font-sans max-w-sm mx-auto">
            New customer quote requests and messages will appear here as they are received.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop & Tablet Table (>=640px) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs text-[#F5F0E8] font-sans">
              <thead className="bg-[#141414] text-[#8A847A] uppercase text-[11px] font-medium border-b border-[#222222]">
                <tr>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Subject / Context</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Received</th>
                  <th className="px-6 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1C]">
                {inquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    onClick={() => onSelectInquiry(inquiry)}
                    className="hover:bg-[#161616] transition-colors cursor-pointer group"
                  >
                    {/* Customer */}
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <div className="font-medium text-[#F5F0E8] text-xs">
                        {inquiry.name}
                      </div>
                      <div className="text-[11px] text-[#7A746B] font-mono">
                        {inquiry.email}
                      </div>
                    </td>

                    {/* Subject / Context */}
                    <td className="px-6 py-3.5 max-w-xs truncate text-[#D1CCC2]/90 text-xs">
                      {inquiry.subject || 'General design enquiry'}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <InquiryStatusBadge status={inquiry.status} />
                    </td>

                    {/* Received */}
                    <td className="px-6 py-3.5 whitespace-nowrap text-[#8A847A] text-[11px]">
                      <span title={formatDate(inquiry.created_at)}>
                        {formatRelativeTime(inquiry.created_at)}
                      </span>
                    </td>

                    {/* Action View */}
                    <td className="px-6 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectInquiry(inquiry)
                        }}
                        aria-label={`View inquiry from ${inquiry.name}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans font-medium text-[#C9A84C] hover:text-[#E8B84B] hover:bg-[#1C1C1C] rounded transition-colors cursor-pointer"
                      >
                        <HugeiconsIcon icon={ViewIcon} className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked List (<640px) */}
          <div className="sm:hidden p-4 space-y-3 divide-y divide-transparent">
            {inquiries.map((inquiry) => (
              <MobileInquiryRow
                key={inquiry.id}
                inquiry={inquiry}
                onSelect={onSelectInquiry}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default RecentInquiries
