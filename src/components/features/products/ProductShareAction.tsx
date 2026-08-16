import React, { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Share08Icon, Loading03Icon } from '@hugeicons/core-free-icons'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { slugify } from '@/utils/slugify'

export interface ProductShareActionProps {
  productName: string
  productSlug: string
  imageUrl?: string | null
  className?: string
  variant?: 'outline' | 'ghost' | 'default'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  customLabel?: string
  showText?: boolean
}

/**
 * ProductShareAction — 3-Tier Progressive Enhancement Web Share
 *
 * 1. Preferred: Native Web Share with image File + title + URL (when navigator.canShare({ files }) is supported).
 * 2. Fallback 1: Native Web Share with URL (when file sharing is unsupported).
 * 3. Fallback 2: Clipboard copy of canonical Product URL with accessible feedback toast.
 */
export const ProductShareAction: React.FC<ProductShareActionProps> = ({
  productName,
  productSlug,
  imageUrl,
  className = '',
  variant = 'outline',
  size = 'sm',
  customLabel,
  showText = true,
}) => {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    if (isSharing) return
    setIsSharing(true)

    const canonicalUrl = `${window.location.origin}/products/${productSlug}`
    const shareTitle = `${productName} | Sri Anjaneya Furnitures`
    const shareText = `Discover ${productName} handcrafted by Sri Anjaneya Furnitures.`
    const safeFilename = `sri-anjaneya-${slugify(productName) || productSlug}.jpg`

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
          // Fetch image as transient Blob
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
          // If user cancelled native share, do not trigger fallback or error
          if (fileErr instanceof Error && fileErr.name === 'AbortError') {
            return
          }
          // If Blob fetch / CORS failed, continue smoothly to Tier 2 URL share
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
          // If native URL share failed, fall through to Tier 3 clipboard copy
        }
      }

      // Tier 3: Fallback to Clipboard Copy
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(canonicalUrl)
        toast.success('Product link copied to clipboard.')
      } else {
        // Fallback for older browsers
        const tempInput = document.createElement('input')
        tempInput.value = canonicalUrl
        document.body.appendChild(tempInput)
        tempInput.select()
        document.execCommand('copy')
        document.body.removeChild(tempInput)
        toast.success('Product link copied to clipboard.')
      }
    } catch {
      toast.error('Unable to share product at this time.')
    } finally {
      setIsSharing(false)
    }
  }

  const label = customLabel || `Share ${productName}`

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

export default ProductShareAction
