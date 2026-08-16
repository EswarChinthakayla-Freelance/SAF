import React from 'react'
import { GoldButton } from '@/components/brand/GoldButton'
import { HugeiconsIcon } from '@hugeicons/react'
import { Sorting05Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'

export interface AdminCollectionReorderBarProps {
  isSaving: boolean
  hasChanges: boolean
  onSave: () => void
  onCancel: () => void
}

export const AdminCollectionReorderBar: React.FC<AdminCollectionReorderBarProps> = ({
  isSaving,
  hasChanges,
  onSave,
  onCancel,
}) => {
  return (
    <div className="bg-[#18150D] border border-[#C9A84C]/40 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-md animate-fade-in font-sans">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center text-[#E8B84B] shrink-0">
          <HugeiconsIcon icon={Sorting05Icon} className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs sm:text-sm font-semibold text-[#F5F0E8]">
            Curated Display Order Mode
          </div>
          <div className="text-[11px] text-[#9B958B]">
            Use the rank arrows on rows or cards to reorder. Changes will apply to public collection browsing.
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="px-3.5 py-1.5 rounded bg-[#1C1C1C] hover:bg-[#252525] border border-[#2A2A2A] text-xs font-medium text-[#9B958B] hover:text-[#F5F0E8] transition-colors disabled:opacity-40 cursor-pointer"
        >
          Cancel
        </button>

        <GoldButton
          onClick={onSave}
          disabled={!hasChanges || isSaving}
          loading={isSaving}
          loadingText="Saving Order…"
          size="sm"
          icon={<HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5" />}
          className="text-xs uppercase font-mono tracking-wider font-semibold"
        >
          Save Order
        </GoldButton>
      </div>
    </div>
  )
}

export default AdminCollectionReorderBar
