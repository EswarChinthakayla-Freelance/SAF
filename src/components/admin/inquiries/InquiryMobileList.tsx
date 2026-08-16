import React from 'react'
import { InquiryMobileRow } from './InquiryMobileRow'
import type { AdminInquiryListItem } from '@/types/app'

export interface InquiryMobileListProps {
  inquiries: AdminInquiryListItem[]
  selectedId?: string | null
  onSelectInquiry: (inquiry: AdminInquiryListItem) => void
}

export const InquiryMobileList: React.FC<InquiryMobileListProps> = ({
  inquiries,
  selectedId,
  onSelectInquiry,
}) => {
  return (
    <div className="space-y-3 sm:hidden" role="feed" aria-label="Customer inquiries list">
      {inquiries.map((inquiry) => (
        <InquiryMobileRow
          key={inquiry.id}
          inquiry={inquiry}
          isSelected={selectedId === inquiry.id}
          onSelect={onSelectInquiry}
        />
      ))}
    </div>
  )
}

export default InquiryMobileList
