import React, { useState, useEffect } from 'react'
import { GoldButton } from '@/components/brand/GoldButton'
import type { ProductDetail, ProductVariantRow } from '@/types/app'

export interface ProductActionsProps {
  product: ProductDetail
  selectedVariant: ProductVariantRow | null
  onRequestQuote: () => void
  className?: string
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  selectedVariant,
  onRequestQuote,
  className = '',
}) => {
  const [isSaved, setIsSaved] = useState(false)
  const [shareFeedback, setShareFeedback] = useState<string | null>(null)

  // Initialize wishlist status from localStorage safely
  useEffect(() => {
    try {
      const savedList = JSON.parse(localStorage.getItem('saf_saved_pieces') || '[]')
      setIsSaved(Array.isArray(savedList) && savedList.includes(product.id))
    } catch {
      // Ignore storage errors
    }
  }, [product.id])

  // Toggle local save
  const handleToggleSave = () => {
    try {
      const savedList = JSON.parse(localStorage.getItem('saf_saved_pieces') || '[]')
      let updated: string[] = []
      if (Array.isArray(savedList) && savedList.includes(product.id)) {
        updated = savedList.filter((id: string) => id !== product.id)
        setIsSaved(false)
      } else {
        updated = [...(Array.isArray(savedList) ? savedList : []), product.id]
        setIsSaved(true)
      }
      localStorage.setItem('saf_saved_pieces', JSON.stringify(updated))
    } catch {
      // Ignore storage errors
    }
  }

  // Share product link
  const handleShare = async () => {
    const canonicalUrl = `${window.location.origin}/products/${product.slug}`
    const shareTitle = `${product.name} | Sri Anjaneya Furnitures`
    const shareText = product.short_desc || `Explore handcrafted ${product.name} by Sri Anjaneya Furnitures.`

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: canonicalUrl,
        })
      } catch (err: any) {
        // User cancellation is not a failure
        if (err.name !== 'AbortError') {
          copyToClipboard(canonicalUrl)
        }
      }
    } else {
      copyToClipboard(canonicalUrl)
    }
  }

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setShareFeedback('Link copied!')
        setTimeout(() => setShareFeedback(null), 3000)
      })
    } else {
      setShareFeedback('Link copied!')
      setTimeout(() => setShareFeedback(null), 3000)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Primary Quote CTA Button */}
      <GoldButton
        onClick={onRequestQuote}
        size="lg"
        className="w-full text-xs uppercase tracking-widest font-semibold py-4"
      >
        Request a Quote
      </GoldButton>

      {/* Secondary Actions: Share + Save */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleShare}
          aria-label={`Share ${product.name}`}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-none bg-[#111111] border border-[#2A2A2A] text-xs font-mono text-[#9B958B] hover:text-[#F5F0E8] hover:border-[#C9A84C]/50 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>{shareFeedback || 'Share Piece'}</span>
        </button>

        <button
          type="button"
          onClick={handleToggleSave}
          aria-label={isSaved ? `Remove ${product.name} from saved items` : `Save ${product.name}`}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-none border text-xs font-mono transition-colors cursor-pointer ${isSaved
            ? 'bg-[#C9A84C]/15 border-[#C9A84C] text-[#E8B84B]'
            : 'bg-[#111111] border-[#2A2A2A] text-[#9B958B] hover:text-[#F5F0E8] hover:border-[#3A3A3A]'
            }`}
        >
          <svg
            className={`w-4 h-4 ${isSaved ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-[#9B958B]'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {/* Selected Configuration Guidance Note */}
      {selectedVariant && (
        <p className="text-[11px] text-[#7A746B] text-center font-mono">
          Inquiring for: <span className="text-[#C9A84C]">{selectedVariant.label}</span>
        </p>
      )}
    </div>
  )
}

export default ProductActions
