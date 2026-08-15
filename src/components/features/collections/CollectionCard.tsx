import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getMediaUrl } from '@/lib/media'
import type { CollectionRow } from '@/types/app'

export interface CollectionCardProps {
  collection: CollectionRow
  className?: string
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection, className = '' }) => {
  const [imageError, setImageError] = useState(false)
  const imageUrl = getMediaUrl('brand-assets', collection.cover_image_path, 'card')

  return (
    <Link
      to={`/collections/${collection.slug}`}
      className={`group block relative rounded-none overflow-hidden bg-[#111111] border border-[#2A2A2A] transition-all duration-500 hover:border-[#C9A84C]/50 hover:shadow-2xl hover:shadow-[#C9A84C]/5 focus-visible:ring-2 focus-visible:ring-[#C9A84C] outline-none ${className}`}
      aria-label={`Explore ${collection.name} collection`}
    >
      {/* Cover Image Presentation */}
      <div className="aspect-[16/10] sm:aspect-[16/11] bg-[#0E0D0B] overflow-hidden relative">
        {!imageError && collection.cover_image_path ? (
          <img
            src={imageUrl}
            alt={collection.cover_image_alt || `${collection.name} Collection`}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#151412] via-[#0E0D0B] to-[#151412]">
            <span className="font-serif text-lg sm:text-xl text-[#9B958B] tracking-wide">
              {collection.name}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#555047] mt-1">
              Curated Series
            </span>
          </div>
        )}

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
      </div>

      {/* Content Summary */}
      <div className="p-6 sm:p-7 space-y-3 relative -mt-12 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/95 to-transparent">
        <span className="text-[10px] uppercase font-mono tracking-[0.22em] text-[#C9A84C] font-semibold block">
          Curated Series
        </span>

        <h3 className="font-serif text-xl sm:text-2xl text-[#F5F0E8] font-bold group-hover:text-[#E8B84B] transition-colors leading-snug">
          {collection.name}
        </h3>

        {collection.description && (
          <p className="text-xs sm:text-sm text-[#9B958B] line-clamp-2 leading-relaxed font-sans font-light">
            {collection.description}
          </p>
        )}

        {/* Directional Action Indicator */}
        <div className="pt-2 text-xs uppercase tracking-widest font-mono text-[#C9A84C] flex items-center gap-1.5 transition-all">
          <span>Discover Collection</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true">
            &rarr;
          </span>
        </div>
      </div>
    </Link>
  )
}

export default CollectionCard
