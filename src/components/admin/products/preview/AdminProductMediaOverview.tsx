import React from 'react'
import { getMediaUrl } from '@/lib/media'
import { HugeiconsIcon } from '@hugeicons/react'
import { Image01Icon, StarIcon } from '@hugeicons/core-free-icons'
import type { ProductImageRow } from '@/types/app'

export interface AdminProductMediaOverviewProps {
  images?: ProductImageRow[]
  fallbackCoverPath?: string | null
  productName: string
}

export const AdminProductMediaOverview: React.FC<AdminProductMediaOverviewProps> = ({
  images = [],
  fallbackCoverPath,
  productName,
}) => {
  const displayImages =
    images.length > 0
      ? [...images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      : fallbackCoverPath
        ? [
            {
              id: 'cover-fallback',
              product_id: '',
              storage_path: fallbackCoverPath,
              alt_text: productName,
              sort_order: 0,
              is_cover: true,
              created_at: '',
            },
          ]
        : []

  const coverCount = displayImages.filter((img) => img.is_cover).length

  return (
    <section className="bg-[#141414] border border-[#242424] rounded-lg p-5 sm:p-6 space-y-4 shadow-lg">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-sans font-semibold uppercase tracking-wider text-[#C9A84C] flex items-center gap-2">
          <HugeiconsIcon icon={Image01Icon} className="w-4 h-4" />
          <span>Catalogue Media Assets ({displayImages.length})</span>
        </h2>
        <span className="text-xs font-mono text-[#8A847A]">
          {displayImages.length} {displayImages.length === 1 ? 'asset' : 'assets'} · {coverCount} cover
        </span>
      </div>

      {displayImages.length === 0 ? (
        <div className="py-6 text-center text-xs text-[#7A746B] italic bg-[#181818]/40 rounded border border-[#222222]">
          No media uploaded for this product record.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {displayImages.map((img, idx) => (
            <div
              key={img.id || idx}
              className="bg-[#181818] border border-[#282828] rounded-md overflow-hidden space-y-1.5 p-2"
            >
              <div className="relative aspect-square w-full rounded bg-[#121212] overflow-hidden flex items-center justify-center">
                <img
                  src={getMediaUrl('product-images', img.storage_path, 'thumbnail')}
                  alt={img.alt_text || `${productName} photo ${idx + 1}`}
                  className="w-full h-full object-contain p-1"
                  loading="lazy"
                />
                {img.is_cover && (
                  <span className="absolute top-1 left-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#C9A84C] text-[#0A0A0A] text-[9px] font-mono font-bold shadow">
                    <HugeiconsIcon icon={StarIcon} className="w-2 h-2" />
                    Cover
                  </span>
                )}
                <span className="absolute bottom-1 right-1 px-1 rounded bg-[#0A0A0A]/70 text-[9px] font-mono text-[#A8A29E]">
                  #{idx + 1}
                </span>
              </div>
              <div className="text-[10px] font-sans truncate text-[#9B958B]" title={img.alt_text || 'No alt text'}>
                {img.alt_text || <span className="italic text-[#555]">No description</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default AdminProductMediaOverview
