import React from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Search01Icon,
  Cancel01Icon,
  Sorting01Icon,
  RefreshIcon,
} from '@hugeicons/core-free-icons'
import type { InquiryStatus } from '@/lib/constants'

export interface InquiryCommandBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onClearSearch: () => void
  sort: 'newest' | 'oldest'
  onSortChange: (sort: 'newest' | 'oldest') => void
  totalCount: number
  activeStatus?: InquiryStatus | 'all'
  onRefresh?: () => void
  isRefreshing?: boolean
}

export const InquiryCommandBar: React.FC<InquiryCommandBarProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  sort,
  onSortChange,
  totalCount,
  activeStatus = 'all',
  onRefresh,
  isRefreshing = false,
}) => {
  // Compute grammatical count label
  const getCountLabel = () => {
    if (searchQuery.trim().length > 0) {
      return totalCount === 1 ? '1 match' : `${totalCount} matches`
    }
    const statusLabel =
      activeStatus && activeStatus !== 'all' ? ` ${activeStatus}` : ''
    return totalCount === 1
      ? `1${statusLabel} enquiry`
      : `${totalCount}${statusLabel} enquiries`
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Search Input Box */}
      <div className="relative flex-1 max-w-xl">
        <HugeiconsIcon
          icon={Search01Icon}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A746B] pointer-events-none"
        />
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search name, email, phone or subject…"
          aria-label="Search inquiries by name, email, phone or subject"
          className="h-9 pl-9 pr-8 bg-[#141414] border-[#2A2A2A] text-xs font-sans text-[#F5F0E8] placeholder:text-[#666158] rounded focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
        />
        {searchQuery.trim().length > 0 && (
          <button
            type="button"
            onClick={onClearSearch}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A746B] hover:text-[#F5F0E8] p-0.5 rounded transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right Controls: Result Count, Sort Dropdown, Refresh */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
        {/* Grammatical Counter */}
        <span className="text-xs font-mono text-[#8A847A] whitespace-nowrap">
          {getCountLabel()}
        </span>

        <div className="flex items-center gap-2">
          {/* Sort Selector */}
          <Select
            value={sort}
            onValueChange={(val) => onSortChange(val as 'newest' | 'oldest')}
          >
            <SelectTrigger
              aria-label="Sort order"
              className="h-9 w-[150px] bg-[#141414] border-[#2A2A2A] text-[#D1CCC2] hover:text-[#F5F0E8] text-xs font-sans rounded px-3"
            >
              <HugeiconsIcon icon={Sorting01Icon} className="w-3.5 h-3.5 mr-1.5 text-[#C9A84C] shrink-0" />
              <SelectValue placeholder="Sort">
                {sort === 'newest' ? 'Newest first' : 'Oldest first'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#141414] border-[#2E2E2E] text-[#F5F0E8] shadow-2xl">
              <SelectGroup>
                <SelectItem value="newest" className="text-xs focus:bg-[#1C1C1C] focus:text-[#C9A84C]">
                  Newest first
                </SelectItem>
                <SelectItem value="oldest" className="text-xs focus:bg-[#1C1C1C] focus:text-[#C9A84C]">
                  Oldest first
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Optional Refresh Button */}
          {onRefresh && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh inquiries"
              aria-label="Refresh inquiries"
              className="h-9 w-9 p-0 bg-[#141414] border-[#2A2A2A] text-[#8A847A] hover:text-[#F5F0E8] hover:bg-[#1C1C1C] rounded"
            >
              <HugeiconsIcon
                icon={RefreshIcon}
                className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#C9A84C]' : ''}`}
              />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default InquiryCommandBar
