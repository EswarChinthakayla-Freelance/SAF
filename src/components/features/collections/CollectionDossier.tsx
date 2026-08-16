import React from 'react'
import type { CollectionRow } from '@/types/app'

export interface CollectionDossierProps {
  collection: CollectionRow
  productCount: number
  className?: string
}

/**
 * CollectionDossier
 * Compact editorial dossier transition between the Cover Stage and Product Exhibition.
 */
export const CollectionDossier: React.FC<CollectionDossierProps> = ({
  collection,
  productCount,
  className = '',
}) => {
  return (
    <section
      aria-label="Collection Dossier"
      className={`relative py-8 sm:py-12 border-y border-[#1F1F1F] bg-[#0C0C0C] select-none ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center justify-between">
          {/* 1. Left: Architectural Dossier Label */}
          <div className="md:col-span-4 space-y-1">
            <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
              COLLECTION DOSSIER // {collection.name}
            </div>
            <div className="font-serif text-lg sm:text-xl text-[#F5F0E8] font-bold">
              Craft & Spatial Synergy
            </div>
          </div>

          {/* 2. Middle: Editorial Synthesis */}
          <div className="md:col-span-5 text-xs sm:text-sm text-[#8A847A] font-sans font-light leading-relaxed">
            Engineered exclusively with seasoned native hardwoods, traditional mortise-and-tenon joinery, and tailored architectural proportions.
          </div>

          {/* 3. Right: Archive Index Status */}
          <div className="md:col-span-3 md:justify-self-end text-left md:text-right font-mono text-xs text-[#7A746B]">
            <span className="text-[#C9A84C] font-bold">
              {String(productCount).padStart(2, '0')}
            </span>{' '}
            <span>{productCount === 1 ? 'PIECE DOCUMENTED' : 'PIECES DOCUMENTED'}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CollectionDossier
