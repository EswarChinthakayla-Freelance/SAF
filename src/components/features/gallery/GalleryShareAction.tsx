import React, { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Share08Icon, Loading03Icon } from '@hugeicons/core-free-icons'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { slugify } from '@/utils/slugify'

export interface GalleryShareActionProps {
  imageTitle: string
  imageId: string
  roomSlug?: string
  imageUrl?: string | null
  className?: string
  variant?: 'outline' | 'ghost' | 'default'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  customLabel?: string
  showText?: boolean
}

/**
 * GalleryShareAction — 3-Tier Progressive Enhancement Web Share for Gallery Frames
 *
 * 1. Preferred: Native Web Share with image File + title + URL (when navigator.canShare({ files }) is supported).
 * 2. Fallback 1: Native Web Share with URL (when file sharing is unsupported).
 * 3. Fallback 2: Clipboard copy of canonical Frame URL with accessible toast confirmation.
 */
export const GalleryShareAction: React.FC<GalleryShareActionProps> = ({
  imageTitle,
  imageId,
  roomSlug,
  imageUrl,
  className = '',
  variant = 'outline',
  size = 'sm',
  customLabel,
  showText = false,
}) => {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    if (isSharing) return
    setIsSharing(true)

    const frameQuery = roomSlug && roomSlug !== 'all' ? `?room=${roomSlug}` : ''
    const canonicalUrl = `${window.location.origin}/gallery/frame/${imageId}${frameQuery}`
    const shareTitle = `${imageTitle} | Spaces, Styled — Sri Anjaneya Furnitures`
    const shareText = `Discover ${imageTitle} curated by Sri Anjaneya Furnitures.`
    const safeFilename = `sri-anjaneya-space-${slugify(imageTitle) || imageId}.jpg`

    try {
      let fileShareSuccess = false

      // Tier 1: Try Native Web Share with File Payload
      if (
        imageUrl &&
        typeof navigator !== 'undefined' &&
        'share' in navigator &&
        'canShare' in navigator
      ) {
        try {
          const response = await fetch(imageUrl, { mode: 'cors' })
          if (response.ok) {
            const blob = await response.blob()
            const mimeType = blob.type || 'image/jpeg'
            const file = new File([blob], safeFilename, { type: mimeType })

            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: shareTitle,
                text: shareText,
                url: canonicalUrl,
              })
              fileShareSuccess = true
            }
          }
        } catch (fileErr: unknown) {
          if (fileErr instanceof Error && fileErr.name === 'AbortError') {
            return
          }
          fileShareSuccess = false
        }
      }

      if (fileShareSuccess) return

      // Tier 2: Try Native Web Share with URL Payload
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: canonicalUrl,
          })
          return
        } catch (shareErr: unknown) {
          if (shareErr instanceof Error && shareErr.name === 'AbortError') {
            return
          }
        }
      }

      // Tier 3: Fallback to Clipboard Copy
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(canonicalUrl)
        toast.success('Inspiration frame link copied to clipboard.')
      } else {
        const tempInput = document.createElement('input')
        tempInput.value = canonicalUrl
        document.body.appendChild(tempInput)
        tempInput.select()
        document.execCommand('copy')
        document.body.removeChild(tempInput)
        toast.success('Inspiration frame link copied to clipboard.')
      }
    } catch {
      toast.error('Unable to share gallery frame at this time.')
    } finally {
      setIsSharing(false)
    }
  }

  const label = customLabel || `Share ${imageTitle}`

  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant={variant}
              size={size}
              onClick={handleShare}
              disabled={isSharing}
              aria-label={label}
              aria-busy={isSharing}
              className={`cursor-pointer transition-all ${className}`}
            >
              {isSharing ? (
                <HugeiconsIcon icon={Loading03Icon} className="w-4 h-4 animate-spin text-[#C9A84C]" />
              ) : (
                <HugeiconsIcon icon={Share08Icon} className="w-4 h-4 text-current" />
              )}
              {showText && (
                <span className="ml-2 font-mono text-xs uppercase tracking-wider">
                  {isSharing ? 'Preparing...' : 'Share'}
                </span>
              )}
            </Button>
          }
        />
        <TooltipContent side="top" className="bg-[#141414] text-[#F5F0E8] border border-[#2A2A2A] text-xs font-mono">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default GalleryShareAction
