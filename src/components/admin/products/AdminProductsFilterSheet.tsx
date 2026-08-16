import React, { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { GoldButton } from '@/components/brand/GoldButton'
import type { CollectionRow } from '@/types/app'

export interface AdminProductsFilterSheetProps {
  isOpen: boolean
  onClose: () => void
  collections?: CollectionRow[]
  selectedCollectionId: string
  selectedStatus: 'all' | 'published' | 'draft'
  onApplyFilters: (filters: {
    collectionId: string
    status: 'all' | 'published' | 'draft'
  }) => void
  onResetFilters: () => void
}

export const AdminProductsFilterSheet: React.FC<AdminProductsFilterSheetProps> = ({
  isOpen,
  onClose,
  collections = [],
  selectedCollectionId,
  selectedStatus,
  onApplyFilters,
  onResetFilters,
}) => {
  const [stagedCollectionId, setStagedCollectionId] = useState(selectedCollectionId)
  const [stagedStatus, setStagedStatus] = useState(selectedStatus)

  useEffect(() => {
    if (isOpen) {
      setStagedCollectionId(selectedCollectionId)
      setStagedStatus(selectedStatus)
    }
  }, [isOpen, selectedCollectionId, selectedStatus])

  const handleApply = () => {
    onApplyFilters({
      collectionId: stagedCollectionId,
      status: stagedStatus,
    })
    onClose()
  }

  const handleReset = () => {
    setStagedCollectionId('')
    setStagedStatus('all')
    onResetFilters()
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[#111111] border-l border-[#2A2A2A] text-[#F5F0E8] p-6 flex flex-col justify-between"
      >
        <div className="space-y-6">
          <SheetHeader className="border-b border-[#222222] pb-4">
            <SheetTitle className="text-base font-sans font-semibold text-[#F5F0E8]">
              Filter Products
            </SheetTitle>
          </SheetHeader>

          {/* Collection Filter */}
          <div className="space-y-2">
            <label
              htmlFor="mobile-collection-filter"
              className="block text-xs font-mono uppercase text-[#8A847A]"
            >
              Collection
            </label>
            <Select
              items={{
                all: 'All Collections',
                ...collections.reduce((acc, col) => {
                  acc[col.id] = col.name
                  return acc
                }, {} as Record<string, string>),
              }}
              value={stagedCollectionId || 'all'}
              onValueChange={(val) => setStagedCollectionId(val === 'all' || !val ? '' : val)}
            >
              <SelectTrigger
                id="mobile-collection-filter"
                aria-label="Filter by collection"
                className="w-full bg-[#161616] border-[#2A2A2A] text-[#F5F0E8] rounded-none font-sans text-xs h-10 px-3"
              >
                <SelectValue placeholder="All Collections" />
              </SelectTrigger>
              <SelectContent className="bg-[#141414] border-[#2A2A2A] text-[#F5F0E8] rounded-none shadow-xl z-50">
                <SelectGroup>
                  <SelectItem value="all">All Collections</SelectItem>
                  {collections.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Publication Status Filter */}
          <div className="space-y-2">
            <label
              htmlFor="mobile-status-filter"
              className="block text-xs font-mono uppercase text-[#8A847A]"
            >
              Publication Status
            </label>
            <Select
              items={{
                all: 'All Statuses',
                published: 'Published',
                draft: 'Draft',
              }}
              value={stagedStatus}
              onValueChange={(val) =>
                setStagedStatus((val || 'all') as 'all' | 'published' | 'draft')
              }
            >
              <SelectTrigger
                id="mobile-status-filter"
                aria-label="Filter by publication status"
                className="w-full bg-[#161616] border-[#2A2A2A] text-[#F5F0E8] rounded-none font-sans text-xs h-10 px-3"
              >
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-[#141414] border-[#2A2A2A] text-[#F5F0E8] rounded-none shadow-xl z-50">
                <SelectGroup>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer Actions */}
        <SheetFooter className="pt-6 border-t border-[#222222] flex flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 text-xs font-sans font-medium text-[#9B958B] hover:text-[#F5F0E8] transition-colors"
          >
            Reset
          </button>
          <GoldButton onClick={handleApply} size="sm" className="w-full sm:w-auto">
            Apply Filters
          </GoldButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default AdminProductsFilterSheet
