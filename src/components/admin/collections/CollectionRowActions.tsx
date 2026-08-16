import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Edit01Icon,
  MoreHorizontalIcon,
  GlobeIcon,
  PackageIcon,
  Delete02Icon,
  ViewOffSlashIcon,
  ViewIcon,
} from '@hugeicons/core-free-icons'
import type { AdminCollectionItem } from '@/types/app'

export interface CollectionRowActionsProps {
  collection: AdminCollectionItem
  onEdit: (collection: AdminCollectionItem) => void
  onToggleActive?: (collection: AdminCollectionItem) => void
  onDelete: (collection: AdminCollectionItem) => void
  isPendingActive?: boolean
}

export const CollectionRowActions: React.FC<CollectionRowActionsProps> = ({
  collection,
  onEdit,
  onToggleActive,
  onDelete,
  isPendingActive = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
      {/* Primary Action Button: Edit */}
      <button
        type="button"
        onClick={() => onEdit(collection)}
        aria-label={`Edit ${collection.name}`}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#1A1A1A] hover:bg-[#242424] border border-[#2E2E2E] hover:border-[#3E3E3E] text-xs font-sans font-medium text-[#F5F0E8] transition-colors cursor-pointer"
      >
        <HugeiconsIcon icon={Edit01Icon} className="w-3.5 h-3.5 text-[#C9A84C]" />
        <span>Edit</span>
      </button>

      {/* Secondary Actions: Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
          aria-label={`More actions for ${collection.name}`}
          className="p-1.5 rounded bg-[#161616] hover:bg-[#202020] border border-[#2A2A2A] hover:border-[#383838] text-[#9B958B] hover:text-[#F5F0E8] transition-colors cursor-pointer"
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} className="w-4 h-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-52 bg-[#141414] border border-[#2A2A2A] text-[#F5F0E8] shadow-2xl p-1 font-sans rounded-none"
        >
          {/* Edit Details */}
          <DropdownMenuItem
            onClick={() => {
              setIsOpen(false)
              onEdit(collection)
            }}
            className="flex items-center gap-2 px-2.5 py-2 text-xs text-[#F5F0E8] hover:bg-[#1F1F1F] rounded cursor-pointer"
          >
            <HugeiconsIcon icon={Edit01Icon} className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Edit Collection</span>
          </DropdownMenuItem>

          {/* View Products in this Collection */}
          <DropdownMenuItem
            onClick={() => {
              setIsOpen(false)
              navigate(`/admin/products?collection=${collection.id}`)
            }}
            className="flex items-center gap-2 px-2.5 py-2 text-xs text-[#F5F0E8] hover:bg-[#1F1F1F] rounded cursor-pointer"
          >
            <HugeiconsIcon icon={PackageIcon} className="w-3.5 h-3.5 text-[#9B958B]" />
            <span>View Products ({collection.product_count ?? 0})</span>
          </DropdownMenuItem>

          {/* View Public Collection (only if active) */}
          {collection.is_active && (
            <DropdownMenuItem
              onClick={() => {
                setIsOpen(false)
                window.open(`/collections/${collection.slug}`, '_blank', 'noopener,noreferrer')
              }}
              className="flex items-center gap-2 px-2.5 py-2 text-xs text-[#9B958B] hover:text-[#F5F0E8] hover:bg-[#1F1F1F] rounded cursor-pointer"
            >
              <HugeiconsIcon icon={GlobeIcon} className="w-3.5 h-3.5" />
              <span>View on Website</span>
            </DropdownMenuItem>
          )}

          {/* Toggle Active / Hide */}
          {onToggleActive && (
            <DropdownMenuItem
              disabled={isPendingActive}
              onClick={() => {
                setIsOpen(false)
                onToggleActive(collection)
              }}
              className="flex items-center gap-2 px-2.5 py-2 text-xs text-[#9B958B] hover:text-[#F5F0E8] hover:bg-[#1F1F1F] rounded cursor-pointer"
            >
              <HugeiconsIcon
                icon={collection.is_active ? ViewOffSlashIcon : ViewIcon}
                className="w-3.5 h-3.5"
              />
              <span>{collection.is_active ? 'Hide Collection' : 'Activate Collection'}</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="bg-[#242424] my-1" />

          {/* Delete Action */}
          <DropdownMenuItem
            onClick={() => {
              setIsOpen(false)
              onDelete(collection)
            }}
            className="flex items-center gap-2 px-2.5 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded cursor-pointer"
          >
            <HugeiconsIcon icon={Delete02Icon} className="w-3.5 h-3.5" />
            <span>Delete Collection</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default CollectionRowActions
