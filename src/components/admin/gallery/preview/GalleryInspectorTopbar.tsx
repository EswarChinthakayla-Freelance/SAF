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
    <header className="bg-[#111111] border-b border-[#242424] px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
      {/* Left: Back Button & Context */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          to={backHref}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1A1A1A] hover:bg-[#242424] border border-[#2E2E2E] text-xs font-sans text-[#D1CCC2] hover:text-[#F5F0E8] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C]"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5" />
          <span>Back to Gallery</span>
        </Link>

        {/* Index counter */}
        {currentIndex !== undefined && totalImages !== undefined && totalImages > 0 && (
          <span className="hidden sm:inline-flex text-xs font-mono text-[#8A847A]">
            Image {currentIndex + 1} of {totalImages}
          </span>
        )}
      </div>

      {/* Center/Badges: Room & Visibility */}
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-0.5 rounded text-xs font-sans font-medium bg-[#1A1A1A] border border-[#2A2A2A] text-[#C9A84C]">
          {image.room_type || 'Living Room'}
        </span>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-medium border ${
            image.is_active
              ? 'bg-[#0D1510] text-[#4ADE80] border-[#22C55E]/40'
              : 'bg-[#181818] text-[#8A847A] border-[#2E2E2E]'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              image.is_active ? 'bg-[#22C55E]' : 'bg-[#7A746B]'
            }`}
          />
          <span>{image.is_active ? 'Visible' : 'Hidden'}</span>
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Fullscreen Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          className="h-9 w-9 p-0 bg-[#171717] border-[#2E2E2E] text-[#D1CCC2] hover:text-[#F5F0E8] hover:bg-[#242424]"
        >
          <HugeiconsIcon icon={FullScreenIcon} className="w-4 h-4" />
        </Button>

        {/* Edit Metadata Gold Button */}
        <GoldButton
          type="button"
          size="sm"
          onClick={onEditMetadata}
          className="h-9 px-3.5 text-xs uppercase tracking-wider font-semibold"
        >
          <HugeiconsIcon icon={Edit02Icon} className="w-3.5 h-3.5 mr-1.5" />
          <span>Edit Metadata</span>
        </GoldButton>

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="More inspector actions"
            className="h-9 w-9 p-0 inline-flex items-center justify-center bg-[#171717] border border-[#2E2E2E] text-[#D1CCC2] hover:text-[#F5F0E8] hover:bg-[#242424] rounded cursor-pointer transition-colors"
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
