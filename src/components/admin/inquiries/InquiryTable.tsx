import React from 'react'
import { InquiryStatusBadge } from './InquiryStatusBadge'
import { Button } from '@/components/ui/button'
import { formatDate, formatRelativeTime } from '@/utils/dates'
import { HugeiconsIcon } from '@hugeicons/react'
import { ViewIcon, PackageIcon } from '@hugeicons/core-free-icons'
import type { AdminInquiryListItem } from '@/types/app'

export interface InquiryTableProps {
  inquiries: AdminInquiryListItem[]
  selectedId?: string | null
  onSelectInquiry: (inquiry: AdminInquiryListItem) => void
}

export const InquiryTable: React.FC<InquiryTableProps> = ({
  inquiries,
  selectedId,
  onSelectInquiry,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded border border-[#242424] bg-[#0E0E0E] shadow-xl">
      <table className="w-full text-left border-collapse text-xs font-sans">
        {/* Table Header */}
        <thead>
          <tr className="border-b border-[#242424] bg-[#121212] text-[#8A847A]">
            <th scope="col" className="py-3 px-4 sm:px-6 font-medium w-[28%]">
              Customer
            </th>
            <th scope="col" className="py-3 px-4 font-medium w-[32%]">
              Subject / Product
            </th>
            <th scope="col" className="py-3 px-4 font-medium w-[14%]">
              Status
            </th>
            <th scope="col" className="py-3 px-4 font-medium w-[16%]">
              Received
            </th>
            <th scope="col" className="py-3 px-4 sm:px-6 font-medium text-right w-[10%]">
              Action
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-[#1D1D1D]">
          {inquiries.map((inquiry) => {
            const isSelected = selectedId === inquiry.id
            const isNew = inquiry.status === 'new'

            return (
              <tr
                key={inquiry.id}
                onClick={() => onSelectInquiry(inquiry)}
                className={`group cursor-pointer transition-colors duration-150 relative ${
                  isSelected
                    ? 'bg-[#181610]'
                    : isNew
                    ? 'bg-[#10100E] hover:bg-[#161510]'
                    : 'hover:bg-[#141414]'
                }`}
              >
                {/* Customer Cell */}
                <td className="py-3.5 px-4 sm:px-6 relative">
                  {/* Left 2px Gold Attention Bar for 'new' inquiries */}
                  {isNew && (
                    <span
                      className="absolute left-0 inset-y-0 w-0.5 bg-[#C9A84C]"
                      aria-hidden="true"
                    />
                  )}
                  <div className="space-y-0.5">
                    <div className="font-medium text-[13px] text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors">
                      {inquiry.name}
                    </div>
                    <div className="text-[11px] text-[#8A847A] truncate max-w-[220px]">
                      {inquiry.email}
                    </div>
                    {inquiry.phone && (
                      <div className="text-[10px] text-[#6E6960] font-mono">
                        {inquiry.phone}
                      </div>
                    )}
                  </div>
                </td>

                {/* Subject / Product Cell */}
                <td className="py-3.5 px-4">
                  <div className="space-y-1 max-w-sm">
                    <div className="text-[13px] text-[#D1CCC2] truncate font-medium">
                      {inquiry.subject || 'Bespoke Furniture Quote Request'}
                    </div>

                    {inquiry.product ? (
                      <div className="inline-flex items-center gap-1 text-[11px] text-[#C9A84C] truncate">
                        <HugeiconsIcon icon={PackageIcon} className="w-3 h-3 shrink-0" />
                        <span className="truncate">Product · {inquiry.product.name}</span>
                      </div>
                    ) : inquiry.product_id ? (
                      <div className="text-[11px] text-[#7A746B] italic font-mono truncate">
                        Catalogue Product Linked
                      </div>
                    ) : null}
                  </div>
                </td>

                {/* Status Badge Cell */}
                <td className="py-3.5 px-4">
                  <InquiryStatusBadge status={inquiry.status} />
                </td>

                {/* Received Time Cell */}
                <td className="py-3.5 px-4">
                  <div className="space-y-0.5">
                    <div className="text-[12px] text-[#D1CCC2] font-mono">
                      {formatRelativeTime(inquiry.created_at)}
                    </div>
                    <div className="text-[10px] text-[#6E6960] font-mono">
                      {formatDate(inquiry.created_at)}
                    </div>
                  </div>
                </td>

                {/* Action View Button Cell */}
                <td className="py-3.5 px-4 sm:px-6 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectInquiry(inquiry)
                    }}
                    aria-label={`View inquiry from ${inquiry.name}`}
                    className="h-8 px-2.5 text-xs text-[#C9A84C] hover:text-[#E8B84B] hover:bg-[#1E1C14] rounded transition-colors inline-flex items-center gap-1 font-medium"
                  >
                    <HugeiconsIcon icon={ViewIcon} className="w-3.5 h-3.5" />
                    <span>View</span>
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default InquiryTable
