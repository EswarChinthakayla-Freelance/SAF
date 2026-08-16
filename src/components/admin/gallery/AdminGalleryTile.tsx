import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMediaUrl } from '@/lib/media'
import { formatDate } from '@/utils/dates'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  MoreVerticalIcon,
  ViewIcon,
  Edit02Icon,
  LinkSquare02Icon,
  ViewOffIcon,
  Delete02Icon,
  AlertCircleIcon,
  PackageIcon,
} from '@hugeicons/core-free-icons'
import type { AdminGalleryItem } from '@/types/app'

export interface AdminGalleryTileProps {
  image: AdminGalleryItem
  onEditMetadata: (image: AdminGalleryItem) => void
  onToggleActive: (image: AdminGalleryItem) => void
  onDelete: (image: AdminGalleryItem) => void
}

export const AdminGalleryTile: React.FC<AdminGalleryTileProps> = ({
  image,
  onEditMetadata,
  onToggleActive,
  onDelete,
}) => {
  const navigate = useNavigate()
  const thumbUrl = getMediaUrl('gallery-images', image.storage_path, 'gallery-grid')
  const hasAlt = Boolean(image.alt_text && image.alt_text.trim().length > 0)
  const linkedProduct = image.products

  const formattedOrder = String(image.sort_order ?? 0).padStart(2, '0')

  return (
    <article className="bg-[#141414] border border-[#242424] hover:border-[#383838] rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-200 group shadow-md hover:shadow-xl">
      {/* Visual Image Stage */}
      <div className="relative aspect-[4/3] bg-[#0A0A0A] overflow-hidden">
        <Link
          to={`/admin/gallery/${image.id}/preview`}
          className="block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
          aria-label={`View ${image.room_type || 'Gallery'} image: ${image.alt_text || 'Untitled'}`}
        >
          <img
            src={thumbUrl}
            alt={image.alt_text || 'Gallery inspiration image'}
            className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Room Badge (Top-Left) */}
        <div className="absolute top-2.5 left-2.5 pointer-events-none">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#0A0A0A]/85 backdrop-blur-md border border-[#2E2E2E] text-[10px] font-sans font-medium text-[#D1CCC2] shadow-sm">
            {image.room_type || 'Living Room'}
          </span>
        </div>

        {/* Visibility Pill + More Menu (Top-Right) */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium backdrop-blur-md shadow-sm border ${
              image.is_active
                ? 'bg-[#0D1510]/85 text-[#4ADE80] border-[#22C55E]/40'
                : 'bg-[#141414]/85 text-[#8A847A] border-[#2E2E2E]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                image.is_active ? 'bg-[#22C55E]' : 'bg-[#7A746B]'
              }`}
            />
            <span>{image.is_active ? 'Visible' : 'Hidden'}</span>
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`More actions for ${image.room_type || 'gallery'} image`}
              className="w-7 h-7 p-0 inline-flex items-center justify-center bg-[#0A0A0A]/80 hover:bg-[#1A1A1A] text-[#D1CCC2] hover:text-[#F5F0E8] rounded-md backdrop-blur-md border border-[#2E2E2E] cursor-pointer transition-colors"
            >
              <HugeiconsIcon icon={MoreVerticalIcon} className="w-3.5 h-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#141414] border-[#2E2E2E] text-[#F5F0E8] shadow-xl">
              <DropdownMenuItem
                onClick={() => navigate(`/admin/gallery/${image.id}/preview`)}
                className="text-xs cursor-pointer focus:bg-[#1C1C1C] focus:text-[#C9A84C]"
              >
                <HugeiconsIcon icon={ViewIcon} className="w-3.5 h-3.5 mr-2" />
                <span>View in Inspector</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onEditMetadata(image)}
                className="text-xs cursor-pointer focus:bg-[#1C1C1C] focus:text-[#C9A84C]"
              >
                <HugeiconsIcon icon={Edit02Icon} className="w-3.5 h-3.5 mr-2" />
                <span>Edit Metadata</span>
              </DropdownMenuItem>

              {linkedProduct && (
                <DropdownMenuItem
                  onClick={() => navigate(`/admin/products/${linkedProduct.id}/preview`)}
                  className="text-xs cursor-pointer focus:bg-[#1C1C1C] focus:text-[#C9A84C]"
                >
                  <HugeiconsIcon icon={PackageIcon} className="w-3.5 h-3.5 mr-2" />
                  <span>View Product</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() => onToggleActive(image)}
                className="text-xs cursor-pointer focus:bg-[#1C1C1C]"
              >
                <HugeiconsIcon
                  icon={image.is_active ? ViewOffIcon : ViewIcon}
                  className="w-3.5 h-3.5 mr-2 text-[#9B958B]"
                />
                <span>{image.is_active ? 'Hide from Gallery' : 'Show in Gallery'}</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-[#242424]" />

              <DropdownMenuItem
                onClick={() => onDelete(image)}
                className="text-xs text-red-400 focus:text-red-300 focus:bg-red-950/40 cursor-pointer"
              >
                <HugeiconsIcon icon={Delete02Icon} className="w-3.5 h-3.5 mr-2" />
                <span>Delete Image</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Metadata Body */}
      <div className="p-3.5 sm:p-4 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Alt / Caption Summary */}
          {hasAlt ? (
            <p className="text-xs font-sans text-[#F5F0E8] line-clamp-2 leading-relaxed">
              {image.alt_text}
            </p>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-[11px] font-sans text-[#F59E0B] bg-[#1C1708] border border-[#B45309]/30 px-2 py-0.5 rounded">
              <HugeiconsIcon icon={AlertCircleIcon} className="w-3 h-3 text-[#F59E0B]" />
              <span>Missing image description</span>
            </div>
          )}

          {/* Linked Product Context */}
          <div className="pt-0.5">
            {linkedProduct ? (
              <div className="inline-flex items-center gap-1.5 text-[11px] font-sans text-[#9B958B] truncate max-w-full">
                <HugeiconsIcon icon={LinkSquare02Icon} className="w-3 h-3 text-[#C9A84C] shrink-0" />
                <span className="truncate text-[#D1CCC2]">
                  Linked: <strong className="font-medium text-[#F5F0E8]">{linkedProduct.name}</strong>
                </span>
              </div>
            ) : (
              <span className="text-[11px] font-sans text-[#666158]">
                No linked product
              </span>
            )}
          </div>
        </div>

        {/* Footer: Order, Date & Primary Action */}
        <div className="pt-2.5 border-t border-[#222222] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#8A847A]">
            <span>Order {formattedOrder}</span>
            <span>·</span>
            <span>{formatDate(image.updated_at || image.created_at || '')}</span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/admin/gallery/${image.id}/preview`)}
            className="h-7 px-2.5 text-xs font-sans font-medium text-[#C9A84C] hover:text-[#E8B84B] hover:bg-[#1A1A1A] rounded-md transition-colors"
          >
            <HugeiconsIcon icon={ViewIcon} className="w-3 h-3 mr-1" />
            <span>View</span>
          </Button>
        </div>
      </div>
    </article>
  )
}
