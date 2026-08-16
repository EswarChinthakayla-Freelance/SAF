import React from 'react'
import type { InquiryStatus } from '@/lib/constants'
import type { InquiryStatusCounts } from '@/types/app'

export interface InquiryWorkflowRailProps {
  activeStatus?: InquiryStatus | 'all'
  onStatusChange: (status: InquiryStatus | 'all') => void
  counts?: InquiryStatusCounts
  isLoadingCounts?: boolean
}

interface WorkflowTab {
  key: InquiryStatus | 'all'
  label: string
  countKey: keyof InquiryStatusCounts
}

const WORKFLOW_TABS: WorkflowTab[] = [
  { key: 'all', label: 'All', countKey: 'all' },
  { key: 'new', label: 'New', countKey: 'new' },
  { key: 'read', label: 'Read', countKey: 'read' },
  { key: 'replied', label: 'Replied', countKey: 'replied' },
  { key: 'closed', label: 'Closed', countKey: 'closed' },
]

export const InquiryWorkflowRail: React.FC<InquiryWorkflowRailProps> = ({
  activeStatus = 'all',
  onStatusChange,
  counts,
}) => {
  const currentKey = activeStatus || 'all'

  return (
    <div className="w-full border-b border-[#242424] overflow-x-auto no-scrollbar">
      <nav
        role="tablist"
        aria-label="Inquiry workflow status"
        className="flex items-center gap-1 sm:gap-2 min-w-max pb-px"
      >
        {WORKFLOW_TABS.map((tab) => {
          const isActive = currentKey === tab.key
          const count = counts ? counts[tab.countKey] : undefined
          const isNewTab = tab.key === 'new'
          const hasNewInquiries = isNewTab && typeof count === 'number' && count > 0

          return (
            <button
              key={tab.key}
              role="tab"
              type="button"
              id={`inquiry-tab-${tab.key}`}
              aria-selected={isActive}
              aria-controls={`inquiry-panel-${tab.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onStatusChange(tab.key)}
              className={`group relative flex items-center gap-2 h-10 px-3.5 sm:px-4 text-xs font-sans font-medium transition-all cursor-pointer select-none rounded-t focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C] ${
                isActive
                  ? 'text-[#F5F0E8] bg-[#171717] border-t border-x border-[#2A2A2A]'
                  : 'text-[#9B958B] hover:text-[#F5F0E8] hover:bg-[#141414]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {hasNewInquiries && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8B84B] animate-pulse" aria-hidden="true" />
                )}
                <span>{tab.label}</span>
              </span>

              {count !== undefined && (
                <span
                  className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[11px] font-mono leading-none transition-colors ${
                    isActive
                      ? isNewTab && count > 0
                        ? 'bg-[#E8B84B] text-[#0A0A0A] font-semibold'
                        : 'bg-[#2A2A2A] text-[#F5F0E8]'
                      : isNewTab && count > 0
                      ? 'bg-[#1A160E] text-[#E8B84B] border border-[#C9A84C]/40 font-semibold'
                      : 'bg-[#181818] text-[#7A746B] border border-[#242424]'
                  }`}
                >
                  {count}
                </span>
              )}

              {/* Active Gold Bottom Line Indicator */}
              {isActive && (
                <span
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-[#C9A84C]"
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default InquiryWorkflowRail
