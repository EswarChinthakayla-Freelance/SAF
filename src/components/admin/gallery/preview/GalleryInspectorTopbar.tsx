import React from 'react'
import { Link } from 'react-router-dom'
import { GoldButton } from '@/components/brand/GoldButton'
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
  ArrowLeft01Icon,
  Edit02Icon,
  FullScreenIcon,
  MoreVerticalIcon,
  ViewIcon,
  ViewOffIcon,
  Delete02Icon,
  LinkSquare02Icon,
} from '@hugeicons/core-free-icons'
import type { AdminGalleryItem } from '@/types/app'

export interface GalleryInspectorTopbarProps {
  image: AdminGalleryItem
  currentIndex?: number
  totalImages?: number
  onEditMetadata: () => void
  onToggleFullscreen: () => void
  isFullscreen: boolean
  onToggleActive: () => void
  onDelete: () => void
  backHref?: string
}

export const GalleryInspectorTopbar: React.FC<GalleryInspectorTopbarProps> = ({
  image,
  currentIndex,
  totalImages,
  onEditMetadata,
  onToggleFullscreen,
  isFullscreen,
  onToggleActive,
  onDelete,
  backHref = '/admin/gallery',
}) => {
  return (
    <header className="bg-[#111111] border border-[#242424] px-4 sm:px-6 py-3 rounded-none flex flex-wrap items-center justify-between gap-3 shadow-md">
      {/* Left: Back Button & Index Counter */}
      <div className="flex items-center gap-2.5 min-w-0">
        <Link
          to={backHref}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded bg-[#161616] hover:bg-[#202020] border border-[#2A2A2A] text-xs font-sans font-medium text-[#D1CCC2] hover:text-[#F5F0E8] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C]"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5" />
          <span>Back to Gallery</span>
        </Link>

        {currentIndex !== undefined && totalImages !== undefined && totalImages > 0 && (
          <span className="hidden sm:inline-flex items-center h-9 px-2.5 rounded text-xs font-mono text-[#8A847A] bg-[#141414] border border-[#242424]">
            Image {currentIndex + 1} of {totalImages}
          </span>
        )}
      </div>

      {/* Center/Badges: Room Taxonomy & Interactive Visibility Status */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center h-8 px-3 rounded text-xs font-sans font-medium bg-[#161616] border border-[#2A2A2A] text-[#C9A84C]">
          {image.room_type || 'Living Room'}
        </span>

        <button
          type="button"
          onClick={onToggleActive}
          title={`Click to ${image.is_active ? 'hide from' : 'show in'} public gallery`}
          aria-label={`Visibility: ${image.is_active ? 'Visible' : 'Hidden'}. Click to toggle`}
          className={`inline-flex items-center gap-1.5 h-8 px-3 rounded text-xs font-sans font-medium border transition-all cursor-pointer ${image.is_active
              ? 'bg-[#0D1510] text-[#4ADE80] border-[#22C55E]/40 hover:bg-[#122018]'
              : 'bg-[#181818] text-[#8A847A] border-[#2E2E2E] hover:text-[#F5F0E8]'
            }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${image.is_active ? 'bg-[#22C55E]' : 'bg-[#7A746B]'
              }`}
          />
          <span>{image.is_active ? 'Visible' : 'Hidden'}</span>
        </button>
      </div>

      {/* Right: Actions (Fullscreen, Edit Metadata, More Menu) */}
      <div className="flex items-center gap-2">
        {/* Fullscreen Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          className="h-9 w-9 p-0 bg-[#161616] border-[#2A2A2A] text-[#D1CCC2] hover:text-[#F5F0E8] hover:bg-[#202020] rounded"
        >
          <HugeiconsIcon icon={FullScreenIcon} className="w-4 h-4" />
        </Button>

        {/* Edit Metadata Gold Button */}
        <GoldButton
          type="button"
          size="sm"
          onClick={onEditMetadata}
          icon={<HugeiconsIcon icon={Edit02Icon} className="w-3.5 h-3.5" />}
          className="h-9 px-3.5 text-xs uppercase tracking-wider font-semibold"
        >
          Edit Metadata
        </GoldButton>

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="More inspector actions"
            className="h-9 w-9 p-0 inline-flex items-center justify-center bg-[#161616] border border-[#2A2A2A] text-[#D1CCC2] hover:text-[#F5F0E8] hover:bg-[#202020] rounded cursor-pointer transition-colors"
          >
            <HugeiconsIcon icon={MoreVerticalIcon} className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 bg-[#141414] border-[#2E2E2E] text-[#F5F0E8] shadow-2xl">
            {image.is_active && (
              <DropdownMenuItem
                className="text-xs cursor-pointer focus:bg-[#1C1C1C] focus:text-[#C9A84C] p-0"
              >
                <Link
                  to={`/gallery/${image.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-full px-2 py-1.5"
                >
                  <HugeiconsIcon icon={LinkSquare02Icon} className="w-3.5 h-3.5 mr-2" />
                  <span>View Public Gallery View</span>
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={onToggleActive}
              className="text-xs cursor-pointer focus:bg-[#1C1C1C]"
            >
              <HugeiconsIcon
                icon={image.is_active ? ViewOffIcon : ViewIcon}
                className="w-3.5 h-3.5 mr-2 text-[#9B958B]"
              />
              <span>{image.is_active ? 'Hide from Public Gallery' : 'Make Publicly Visible'}</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-[#242424]" />

            <DropdownMenuItem
              onClick={onDelete}
              className="text-xs text-red-400 focus:text-red-300 focus:bg-red-950/40 cursor-pointer"
            >
              <HugeiconsIcon icon={Delete02Icon} className="w-3.5 h-3.5 mr-2" />
              <span>Delete Image Permanently</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
