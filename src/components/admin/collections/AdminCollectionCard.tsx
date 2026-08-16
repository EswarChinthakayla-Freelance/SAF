import React from 'react'
import { CollectionVisibilityBadge } from './CollectionVisibilityBadge'
import { CollectionRowActions } from './CollectionRowActions'
import { getMediaUrl } from '@/lib/media'
import { formatDate } from '@/utils/dates'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Image01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  Edit01Icon,
} from '@hugeicons/core-free-icons'
import type { AdminCollectionItem } from '@/types/app'

export interface AdminCollectionCardProps {
  collection: AdminCollectionItem
  index: number
  totalCount: number
  onEdit: (collection: AdminCollectionItem) => void
  onToggleActive?: (collection: AdminCollectionItem) => void
  onDelete: (collection: AdminCollectionItem) => void
  isPendingActive?: boolean
  isReorderMode?: boolean
  onMoveUp?: (index: number) => void
  onMoveDown?: (index: number) => void
}

export const AdminCollectionCard: React.FC<AdminCollectionCardProps> = ({
  collection,
  index,
  totalCount,
  onEdit,
  onToggleActive,
  onDelete,
  isPendingActive = false,
  isReorderMode = false,
  onMoveUp,
  onMoveDown,
}) => {
  const coverUrl = collection.cover_image_path
    ? getMediaUrl('brand-assets', collection.cover_image_path, 'card')
    : null

  return (
    <div className="bg-[#111111] border border-[#242424] hover:border-[#383838] rounded-lg overflow-hidden shadow-sm flex flex-col transition-all duration-200 group font-sans">
      {/* 1. Visual Cover Stage (16:10 Aspect Ratio) */}
      <div className="relative aspect-[16/10] bg-[#161616] overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={collection.cover_image_alt || collection.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#555048] bg-[#141414]">
            <HugeiconsIcon icon={Image01Icon} className="w-8 h-8 mb-1" />
            <span className="text-xs font-mono">No cover image</span>
          </div>
        )}

        {/* Top Overlay Controls */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
          {/* Top-Left: Visibility Badge or Reorder Rank */}
          {isReorderMode ? (
            <span className="px-2.5 py-1 rounded bg-[#0A0A0A]/90 border border-[#C9A84C] text-[#C9A84C] font-mono font-bold text-xs shadow-md backdrop-blur-md">
              #{String(index + 1).padStart(2, '0')}
            </span>
          ) : (
            <CollectionVisibilityBadge
              isActive={collection.is_active}
              interactive={true}
              onToggle={() => onToggleActive?.(collection)}
              isPending={isPendingActive}
            />
          )}

          {/* Top-Right: Reorder Arrows or Quick Actions */}
          {isReorderMode ? (
            <div className="flex items-center gap-1 bg-[#0A0A0A]/90 p-1 rounded border border-[#2A2A2A] backdrop-blur-md">
              <button
                type="button"
                onClick={() => onMoveUp?.(index)}
                disabled={index === 0}
                aria-label={`Move ${collection.name} up`}
                className="p-1 rounded text-[#8A847A] hover:text-[#F5F0E8] hover:bg-[#1E1E1E] disabled:opacity-30 cursor-pointer"
              >
                <HugeiconsIcon icon={ArrowUp01Icon} className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onMoveDown?.(index)}
                disabled={index === totalCount - 1}
                aria-label={`Move ${collection.name} down`}
                className="p-1 rounded text-[#8A847A] hover:text-[#F5F0E8] hover:bg-[#1E1E1E] disabled:opacity-30 cursor-pointer"
              >
                <HugeiconsIcon icon={ArrowDown01Icon} className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="bg-[#0A0A0A]/90 rounded border border-[#2A2A2A] p-0.5 backdrop-blur-md">
              <CollectionRowActions
                collection={collection}
                onEdit={onEdit}
                onToggleActive={onToggleActive}
                onDelete={onDelete}
                isPendingActive={isPendingActive}
              />
            </div>
          )}
        </div>
      </div>

      {/* 2. Content Region */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-sans font-medium text-base text-[#F5F0E8] group-hover:text-[#E8B84B] transition-colors truncate">
              {collection.name}
            </h3>
            <span className="text-[11px] font-mono text-[#7A746B] shrink-0">
              Order: {collection.sort_order}
            </span>
          </div>

          <div className="text-xs text-[#7A746B] font-mono truncate">
            /{collection.slug}
          </div>

          {collection.description && (
            <p className="text-xs text-[#9B958B] line-clamp-2 leading-relaxed font-sans pt-0.5">
              {collection.description}
            </p>
          )}
        </div>

        {/* 3. Bottom Metadata & Footer Action */}
        <div className="pt-3 border-t border-[#1E1E1E] flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#8A847A]">
            <span className="px-2 py-0.5 rounded bg-[#161616] border border-[#242424]">
              {collection.product_count ?? 0} {collection.product_count === 1 ? 'product' : 'products'}
            </span>
            <span className="hidden sm:inline text-[#666158]">•</span>
            <span className="hidden sm:inline text-[#666158]">
              {formatDate(collection.updated_at || collection.created_at)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onEdit(collection)}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#C9A84C] hover:text-[#E8B84B] transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Edit01Icon} className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminCollectionCard
