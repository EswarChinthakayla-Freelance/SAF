import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { InquiryStatusBadge } from './InquiryStatusBadge'
import { formatDate } from '@/utils/dates'
import { INQUIRY_STATUSES, type InquiryStatus } from '@/lib/constants'
import { HugeiconsIcon } from '@hugeicons/react'
import { WorkflowCircle01Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'

export interface InquiryStatusControlProps {
  status: InquiryStatus
  onStatusChange: (status: InquiryStatus) => void
  repliedAt?: string | null
  disabled?: boolean
}

export const InquiryStatusControl: React.FC<InquiryStatusControlProps> = ({
  status,
  onStatusChange,
  repliedAt,
  disabled = false,
}) => {
  return (
    <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 space-y-3.5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-[#C9A84C]">
            <HugeiconsIcon icon={WorkflowCircle01Icon} className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-[#8A847A]">
            Workflow & Status
          </span>
        </div>

        <InquiryStatusBadge status={status} />
      </div>

      {/* Status Selector */}
      <div className="space-y-1.5">
        <label
          htmlFor="inquiry-status-select"
          className="text-xs text-[#9B958B] block font-sans"
        >
          Change Status
        </label>

        <Select
          value={status}
          onValueChange={(val) => onStatusChange(val as InquiryStatus)}
          disabled={disabled}
        >
          <SelectTrigger
            id="inquiry-status-select"
            aria-label="Workflow status selector"
            className="w-full bg-[#181818] border-[#2E2E2E] text-[#F5F0E8] rounded h-9 px-3 text-xs font-sans"
          >
            <SelectValue placeholder="Select workflow status" />
          </SelectTrigger>
          <SelectContent className="bg-[#141414] border-[#2E2E2E] text-[#F5F0E8] shadow-2xl">
            <SelectGroup>
              {INQUIRY_STATUSES.map((st) => (
                <SelectItem
                  key={st}
                  value={st}
                  className="text-xs focus:bg-[#1C1C1C] focus:text-[#C9A84C] capitalize"
                >
                  {st}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Historical Reply Timestamp */}
      {repliedAt && (
        <div className="p-2.5 bg-[#0D1510] border border-[#22C55E]/30 rounded text-xs text-[#4ADE80] flex items-center gap-2 font-mono">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5 shrink-0 text-[#22C55E]" />
          <span>Replied on {formatDate(repliedAt)}</span>
        </div>
      )}
    </div>
  )
}

export default InquiryStatusControl
