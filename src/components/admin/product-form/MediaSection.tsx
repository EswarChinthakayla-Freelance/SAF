import React from 'react'
import { AdminImageUploader } from '@/components/admin/AdminImageUploader'
import { useMediaUrl } from '@/hooks/useMediaUrl'
import type { ProductImageRow } from '@/types/app'

export interface MediaSectionProps {
  images: ProductImageRow[]
  onUploadImages: (files: File[]) => Promise<void>
  onSetCover: (imageId: string) => void
  onUpdateAltText: (imageId: string, altText: string) => void
  onDeleteImage: (imageId: string) => void
  onReorderImage?: (fromIndex: number, toIndex: number) => void
}

export const MediaSection: React.FC<MediaSectionProps> = ({
  images,
  onUploadImages,
  onSetCover,
  onUpdateAltText,
  onDeleteImage,
  onReorderImage,
}) => {
  const { getUrl } = useMediaUrl()

  const handleMoveUp = (index: number) => {
    if (index > 0 && onReorderImage) {
      onReorderImage(index, index - 1)
    }
  }

  const handleMoveDown = (index: number) => {
    if (index < images.length - 1 && onReorderImage) {
      onReorderImage(index, index + 1)
    }
  }

  return (
    <div className="bg-[#111111] border border-[#2A2A2A] rounded-none p-6 space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-serif font-semibold text-[#F5F0E8]">Media & Photography</h3>
        <p className="text-xs text-[#9B958B]">
          Upload high-resolution photography. Exactly one image is marked as primary Cover for catalogue cards and preview grids.
        </p>
      </div>

      {/* Upload Zone */}
      <AdminImageUploader onUploadFiles={onUploadImages} />

      {/* Image Gallery Management Grid */}
      {images.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-wider font-mono text-[#9B958B] font-semibold">
              Product Images ({images.length})
            </div>
            <span className="text-[11px] text-[#7A746B] font-mono hidden sm:inline">
              Sorted by display priority
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, idx) => {
              const preview = getUrl('product-images', img.storage_path, { width: 400, quality: 80 })
              return (
                <div
                  key={img.id}
                  className={`relative bg-[#0A0A0A] border rounded-none overflow-hidden flex flex-col justify-between transition-all ${img.is_cover
                    ? 'border-[#C9A84C] ring-1 ring-[#C9A84C]/40 shadow-md shadow-[#C9A84C]/5'
                    : 'border-[#2A2A2A] hover:border-[#3A3A3A]'
                    }`}
                >
                  {/* Image Box with Cover & Order Badges */}
                  <div className="aspect-[4/3] bg-[#171717] relative overflow-hidden">
                    <img
                      src={preview}
                      alt={img.alt_text || 'Product image'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-none bg-[#0A0A0A]/80 backdrop-blur-xs text-[#F5F0E8] font-mono text-[10px] font-bold border border-[#2A2A2A]">
                        #{idx + 1}
                      </span>
                      {img.is_cover && (
                        <span className="px-2 py-0.5 rounded bg-[#C9A84C] text-[#0A0A0A] font-bold text-[10px] uppercase tracking-wider shadow">
                          Cover Image
                        </span>
                      )}
                    </div>

                    {/* Quick Move Up/Down Controls */}
                    {onReorderImage && images.length > 1 && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#0A0A0A]/80 backdrop-blur-xs p-1 border border-[#2A2A2A]">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(idx)}
                          disabled={idx === 0}
                          aria-label={`Move image ${idx + 1} up`}
                          className="px-1.5 py-0.5 text-[10px] text-[#9B958B] hover:text-[#F5F0E8] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(idx)}
                          disabled={idx === images.length - 1}
                          aria-label={`Move image ${idx + 1} down`}
                          className="px-1.5 py-0.5 text-[10px] text-[#9B958B] hover:text-[#F5F0E8] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          ▼
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions & Alt Text */}
                  <div className="p-3 space-y-2.5 bg-[#111111] border-t border-[#2A2A2A]">
                    <input
                      type="text"
                      value={img.alt_text || ''}
                      onChange={(e) => onUpdateAltText(img.id, e.target.value)}
                      placeholder="Descriptive alt text for SEO..."
                      aria-label={`Alt text for image ${idx + 1}`}
                      className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
                    />

                    <div className="flex items-center justify-between pt-1">
                      {!img.is_cover ? (
                        <button
                          type="button"
                          onClick={() => onSetCover(img.id)}
                          aria-label={`Set image ${idx + 1} as cover`}
                          className="text-[11px] text-[#C9A84C] hover:underline font-mono cursor-pointer"
                        >
                          Set as Cover
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#7A746B] font-mono">Primary Cover</span>
                      )}

                      <button
                        type="button"
                        onClick={() => onDeleteImage(img.id)}
                        aria-label={`Delete image ${idx + 1}`}
                        className="text-[11px] text-red-400 hover:underline font-mono cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
