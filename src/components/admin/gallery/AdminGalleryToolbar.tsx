import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { GALLERY_ROOM_FILTERS } from '@/lib/constants'
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon, Cancel01Icon, FilterIcon } from '@hugeicons/core-free-icons'

export interface AdminGalleryToolbarProps {
  search: string
  onSearchChange: (val: string) => void
  roomType: string
  onRoomTypeChange: (val: string) => void
  status: 'all' | 'active' | 'inactive'
  onStatusChange: (val: 'all' | 'active' | 'inactive') => void
  linkedStatus: 'all' | 'linked' | 'unlinked'
  onLinkedStatusChange: (val: 'all' | 'linked' | 'unlinked') => void
  onResetFilters: () => void
  totalCount: number
  isFiltered: boolean
}

export const AdminGalleryToolbar: React.FC<AdminGalleryToolbarProps> = ({
  search,
  onSearchChange,
  roomType,
  onRoomTypeChange,
  status,
  onStatusChange,
  linkedStatus,
  onLinkedStatusChange,
  onResetFilters,
  totalCount,
  isFiltered,
}) => {
  return (
    <div className="bg-[#111111] border border-[#242424] rounded-lg p-3.5 sm:p-4 space-y-3 shadow-lg">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A746B]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search gallery images..."
              className="w-full h-9 pl-9 pr-8 bg-[#0A0A0A] border border-[#262626] rounded-md text-xs font-sans text-[#F5F0E8] placeholder:text-[#666158] focus:border-[#C9A84C] focus:outline-none transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A746B] hover:text-[#F5F0E8] transition-colors"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Room Filter */}
          <div className="w-[140px] sm:w-[155px]">
            <Select
              items={{
                all: 'All Rooms',
                ...GALLERY_ROOM_FILTERS.filter((r) => r.slug !== 'all').reduce(
                  (acc, r) => ({ ...acc, [r.label]: r.label }),
                  {} as Record<string, string>
                ),
              }}
              value={roomType}
              onValueChange={(val) => onRoomTypeChange(val || 'all')}
            >
              <SelectTrigger className="w-full h-9 bg-[#0A0A0A] border-[#262626] text-xs font-sans text-[#F5F0E8] focus:ring-1 focus:ring-[#C9A84C]">
                <SelectValue placeholder="All Rooms" />
              </SelectTrigger>
              <SelectContent className="bg-[#141414] border-[#262626] text-[#F5F0E8]">
                <SelectGroup>
                  <SelectItem value="all" className="text-xs font-sans">
                    All Rooms
                  </SelectItem>
                  {GALLERY_ROOM_FILTERS.filter((r) => r.slug !== 'all').map((room) => (
                    <SelectItem key={room.slug} value={room.label} className="text-xs font-sans">
                      {room.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Visibility Filter */}
          <div className="w-[130px] sm:w-[145px]">
            <Select
              items={{
                all: 'All Visibility',
                active: 'Active',
                inactive: 'Inactive',
              }}
              value={status}
              onValueChange={(val) => onStatusChange(val as 'all' | 'active' | 'inactive')}
            >
              <SelectTrigger className="w-full h-9 bg-[#0A0A0A] border-[#262626] text-xs font-sans text-[#F5F0E8] focus:ring-1 focus:ring-[#C9A84C]">
                <SelectValue placeholder="All Visibility" />
              </SelectTrigger>
              <SelectContent className="bg-[#141414] border-[#262626] text-[#F5F0E8]">
                <SelectGroup>
                  <SelectItem value="all" className="text-xs font-sans">
                    All Visibility
                  </SelectItem>
                  <SelectItem value="active" className="text-xs font-sans">
                    Active
                  </SelectItem>
                  <SelectItem value="inactive" className="text-xs font-sans">
                    Inactive
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Product Link Filter */}
          <div className="w-[140px] sm:w-[155px]">
            <Select
              items={{
                all: 'All Images',
                linked: 'Linked to Product',
                unlinked: 'Not Linked',
              }}
              value={linkedStatus}
              onValueChange={(val) => onLinkedStatusChange(val as 'all' | 'linked' | 'unlinked')}
            >
              <SelectTrigger className="w-full h-9 bg-[#0A0A0A] border-[#262626] text-xs font-sans text-[#F5F0E8] focus:ring-1 focus:ring-[#C9A84C]">
                <SelectValue placeholder="All Product Links" />
              </SelectTrigger>
              <SelectContent className="bg-[#141414] border-[#262626] text-[#F5F0E8]">
                <SelectGroup>
                  <SelectItem value="all" className="text-xs font-sans">
                    All Images
                  </SelectItem>
                  <SelectItem value="linked" className="text-xs font-sans">
                    Linked to Product
                  </SelectItem>
                  <SelectItem value="unlinked" className="text-xs font-sans">
                    Not Linked
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters CTA */}
          {isFiltered && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-9 px-2.5 text-xs text-[#C9A84C] hover:text-[#E8B84B] hover:bg-[#1C1C1C]"
            >
              <HugeiconsIcon icon={FilterIcon} className="w-3.5 h-3.5 mr-1" />
              <span>Reset</span>
            </Button>
          )}
        </div>

        {/* Live Result Count */}
        <div className="text-xs font-mono text-[#8A847A] shrink-0 text-right">
          {totalCount} {totalCount === 1 ? 'match' : 'matches'}
        </div>
      </div>
    </div>
  )
}
