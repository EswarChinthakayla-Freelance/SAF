import React, { useState, useEffect } from 'react'
import { getMediaUrl } from '@/lib/media'
import { GoldButton } from '@/components/brand/GoldButton'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowUp01Icon,
  ArrowDown01Icon,
  Sorting01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons'
import type { AdminGalleryItem } from '@/types/app'

export interface AdminGalleryReorderProps {
  items: AdminGalleryItem[]
  onSaveOrder: (orderedItems: { id: string; sort_order: number }[]) => Promise<void>
  onCancel: () => void
}

export const AdminGalleryReorder: React.FC<AdminGalleryReorderProps> = ({
  items: initialItems,
  onSaveOrder,
  onCancel,
}) => {
  const [orderedItems, setOrderedItems] = useState<AdminGalleryItem[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    // Clone initial list sorted by current sort_order
    const sorted = [...initialItems].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    setOrderedItems(sorted)
  }, [initialItems])

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= orderedItems.length) return
    const updated = [...orderedItems]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    setOrderedItems(updated)
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }

  const handleDragOver = (e: React.DragEvent, _index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null)
      return
    }
    moveItem(draggedIndex, targetIndex)
    setDraggedIndex(null)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const payload = orderedItems.map((item, idx) => ({
        id: item.id,
        sort_order: idx + 1,
      }))
      await onSaveOrder(payload)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Reorder Action Bar */}
      <div className="sticky top-16 z-30 bg-[#16140A] border border-[#C9A84C]/50 rounded-lg p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-[#C9A84C]/15 text-[#E8B84B]">
            <HugeiconsIcon icon={Sorting01Icon} className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-sans font-semibold text-[#F5F0E8]">
              Reorder Mode Active ({orderedItems.length} images)
            </h2>
            <p className="text-xs font-sans text-[#D1CCC2]/80">
              Drag tiles or use arrow controls to organize public display ranking. Click Save to apply changes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSaving}
            className="h-9 px-3 text-xs text-[#9B958B] hover:text-[#F5F0E8] hover:bg-[#242424]"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-3.5 h-3.5 mr-1" />
            <span>Cancel</span>
          </Button>

          <GoldButton
            type="button"
            size="sm"
            onClick={handleSave}
            loading={isSaving}
            loadingText="Saving Order..."
            className="h-9 px-4 text-xs font-semibold uppercase tracking-wider"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5 mr-1.5" />
            <span>Save Order</span>
          </GoldButton>
        </div>
      </div>

      {/* Draggable & Accessible Reorder Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {orderedItems.map((item, idx) => {
          const thumbUrl = getMediaUrl('gallery-images', item.storage_path, 'thumbnail')
          const isFirst = idx === 0
          const isLast = idx === orderedItems.length - 1

          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={() => setDraggedIndex(null)}
              className={`bg-[#141414] border rounded-lg p-3 flex items-center gap-3 transition-all cursor-grab active:cursor-grabbing select-none ${
                draggedIndex === idx
                  ? 'border-[#C9A84C] opacity-50 shadow-lg ring-1 ring-[#C9A84C]'
                  : 'border-[#242424] hover:border-[#383838]'
              }`}
            >
              {/* Order Badge */}
              <div className="flex flex-col items-center justify-center w-8 h-8 rounded-md bg-[#1C1C1C] border border-[#2E2E2E] shrink-0 font-mono text-xs font-bold text-[#C9A84C]">
                #{String(idx + 1).padStart(2, '0')}
              </div>

              {/* Thumbnail */}
              <div className="relative w-14 h-14 rounded bg-[#0A0A0A] overflow-hidden shrink-0 border border-[#262626]">
                <img
                  src={thumbUrl}
                  alt={item.alt_text || `Gallery image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Information */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#0A0A0A] border border-[#2A2A2A] text-[#C9A84C]">
                  {item.room_type || 'Living Room'}
                </span>
                <p className="text-xs font-sans text-[#F5F0E8] truncate">
                  {item.alt_text || 'Untitled Visual'}
                </p>
              </div>

              {/* Accessible Move Controls */}
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  type="button"
                  disabled={isFirst || isSaving}
                  onClick={() => moveItem(idx, idx - 1)}
                  aria-label={`Move ${item.alt_text || 'image'} up`}
                  className="p-1 rounded bg-[#1C1C1C] hover:bg-[#262626] text-[#A8A29E] hover:text-[#F5F0E8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <HugeiconsIcon icon={ArrowUp01Icon} className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={isLast || isSaving}
                  onClick={() => moveItem(idx, idx + 1)}
                  aria-label={`Move ${item.alt_text || 'image'} down`}
                  className="p-1 rounded bg-[#1C1C1C] hover:bg-[#262626] text-[#A8A29E] hover:text-[#F5F0E8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <HugeiconsIcon icon={ArrowDown01Icon} className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
