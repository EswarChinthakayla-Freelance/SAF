import React from 'react'
import { CollectionVisibilityBadge } from './CollectionVisibilityBadge'
import { CollectionRowActions } from './CollectionRowActions'
import { getMediaUrl } from '@/lib/media'
import { formatDate } from '@/utils/dates'
import { HugeiconsIcon } from '@hugeicons/react'
import { Image01Icon, ArrowUp01Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons'
import type { AdminCollectionItem } from '@/types/app'

export interface AdminCollectionsTableProps {
  collections: AdminCollectionItem[]
  onEdit: (collection: AdminCollectionItem) => void
  onToggleActive?: (collection: AdminCollectionItem) => void
  onDelete: (collection: AdminCollectionItem) => void
  isPendingActive?: boolean
  isReorderMode?: boolean
  onMoveUp?: (index: number) => void
  onMoveDown?: (index: number) => void
}

export const AdminCollectionsTable: React.FC<AdminCollectionsTableProps> = ({
  collections,
  onEdit,
  onToggleActive,
  onDelete,
  isPendingActive = false,
  isReorderMode = false,
  onMoveUp,
  onMoveDown,
}) => {
  return (
    <div className="space-y-3 font-sans">
      {/* Desktop / Tablet Table View (>= 640px) */}
      <div className="hidden sm:block bg-[#111111] border border-[#242424] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222222] bg-[#141414] text-[11px] font-sans font-medium text-[#8A847A] uppercase tracking-wider">
                {isReorderMode && <th className="py-3 px-4 w-12 text-center">Rank</th>}
                <th className="py-3 px-4">Collection</th>
                <th className="py-3 px-4">Products</th>
                <th className="py-3 px-4">Display Order</th>
                <th className="py-3 px-4">Visibility</th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D1D1D] text-xs">
              {collections.map((col, index) => {
                const thumbUrl = col.cover_image_path
                  ? getMediaUrl('brand-assets', col.cover_image_path, 'thumbnail')
                  : null

                return (
                  <tr
                    key={col.id}
                    className="hover:bg-[#161616]/80 transition-colors group"
                  >
                    {/* Rank / Reorder Buttons */}
                    {isReorderMode && (
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-mono text-[#C9A84C] font-semibold text-xs mr-1">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={() => onMoveUp?.(index)}
                              disabled={index === 0}
                              aria-label={`Move ${col.name} up`}
                              className="p-1 rounded bg-[#1C1C1C] hover:bg-[#282828] text-[#8A847A] hover:text-[#F5F0E8] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <HugeiconsIcon icon={ArrowUp01Icon} className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onMoveDown?.(index)}
                              disabled={index === collections.length - 1}
                              aria-label={`Move ${col.name} down`}
                              className="p-1 rounded bg-[#1C1C1C] hover:bg-[#282828] text-[#8A847A] hover:text-[#F5F0E8] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <HugeiconsIcon icon={ArrowDown01Icon} className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* Collection Identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3.5">
                        {/* 64x64 Thumbnail */}
                        <div className="w-16 h-16 rounded-md bg-[#181818] border border-[#2A2A2A] overflow-hidden shrink-0 flex items-center justify-center">
                          {thumbUrl ? (
                            <img
                              src={thumbUrl}
                              alt={col.cover_image_alt || col.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-[#666158]">
                              <HugeiconsIcon icon={Image01Icon} className="w-5 h-5 mb-0.5" />
                              <span className="text-[9px] font-mono">No cover</span>
                            </div>
                          )}
                        </div>

                        {/* Name & Slug */}
                        <div className="min-w-0">
                          <div className="font-sans font-medium text-sm text-[#F5F0E8] group-hover:text-[#E8B84B] transition-colors truncate">
                            {col.name}
                          </div>
                          <div className="text-[11px] text-[#7A746B] font-mono mt-0.5">
                            /{col.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Products Count */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#161616] border border-[#262626] font-mono text-[11px] text-[#9B958B]">
                        {col.product_count ?? 0} {col.product_count === 1 ? 'product' : 'products'}
                      </span>
                    </td>

                    {/* Display Order */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs text-[#C9A84C] font-semibold">
                        {col.sort_order}
                      </span>
                    </td>

                    {/* Visibility */}
                    <td className="py-3.5 px-4">
                      <CollectionVisibilityBadge
                        isActive={col.is_active}
                        interactive={!isReorderMode}
                        onToggle={() => onToggleActive?.(col)}
                        isPending={isPendingActive}
                      />
                    </td>

                    {/* Updated Date */}
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] text-[#7A746B] font-mono">
                        {formatDate(col.updated_at || col.created_at)}
                      </span>
                    </td>

                    {/* Row Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <CollectionRowActions
                        collection={col}
                        onEdit={onEdit}
                        onToggleActive={onToggleActive}
                        onDelete={onDelete}
                        isPendingActive={isPendingActive}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Compact List View (< 640px) */}
      <div className="sm:hidden space-y-3">
        {collections.map((col, index) => {
          const thumbUrl = col.cover_image_path
            ? getMediaUrl('brand-assets', col.cover_image_path, 'thumbnail')
            : null

          return (
            <div
              key={col.id}
              className="bg-[#111111] border border-[#242424] rounded-lg p-3.5 space-y-3"
            >
              <div className="flex items-center gap-3">
                {/* 56x56 Thumbnail */}
                <div className="w-14 h-14 rounded bg-[#181818] border border-[#2A2A2A] overflow-hidden shrink-0 flex items-center justify-center">
                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt={col.cover_image_alt || col.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <HugeiconsIcon icon={Image01Icon} className="w-5 h-5 text-[#666158]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-sans font-medium text-sm text-[#F5F0E8] truncate">
                      {col.name}
                    </h3>
                    <CollectionVisibilityBadge
                      isActive={col.is_active}
                      interactive={!isReorderMode}
                      onToggle={() => onToggleActive?.(col)}
                      isPending={isPendingActive}
                    />
                  </div>
                  <div className="text-[11px] text-[#7A746B] font-mono mt-0.5">
                    /{col.slug}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-[#8A847A] font-mono">
                    <span>{col.product_count ?? 0} items</span>
                    <span>•</span>
                    <span>Order: {col.sort_order}</span>
                  </div>
                </div>
              </div>

              {/* Mobile Actions / Reorder */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1F1F1F]">
                {isReorderMode ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#C9A84C] font-semibold">
                      Rank #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => onMoveUp?.(index)}
                      disabled={index === 0}
                      className="px-2 py-1 bg-[#1C1C1C] border border-[#2A2A2A] rounded text-xs text-[#F5F0E8] disabled:opacity-30"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveDown?.(index)}
                      disabled={index === collections.length - 1}
                      className="px-2 py-1 bg-[#1C1C1C] border border-[#2A2A2A] rounded text-xs text-[#F5F0E8] disabled:opacity-30"
                    >
                      Down
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-[#7A746B] font-mono">
                    Updated {formatDate(col.updated_at || col.created_at)}
                  </span>
                )}

                <CollectionRowActions
                  collection={col}
                  onEdit={onEdit}
                  onToggleActive={onToggleActive}
                  onDelete={onDelete}
                  isPendingActive={isPendingActive}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminCollectionsTable
