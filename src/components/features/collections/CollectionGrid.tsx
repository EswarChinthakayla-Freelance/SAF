import React from 'react'
import { Link } from 'react-router-dom'
import { CollectionCard } from './CollectionCard'
import { GoldButton } from '@/components/brand/GoldButton'
import type { CollectionRow } from '@/types/app'

export interface CollectionGridProps {
  collections?: CollectionRow[]
  isLoading?: boolean
  className?: string
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  collections = [],
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 ${className}`}>
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="rounded-none overflow-hidden bg-[#111111] border border-[#2A2A2A] aspect-[16/11] flex flex-col justify-end p-6 space-y-3 animate-pulse"
          >
            <div className="h-4 w-24 bg-[#1A1816] rounded" />
            <div className="h-6 w-3/4 bg-[#1A1816] rounded" />
            <div className="h-4 w-full bg-[#1A1816] rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (!collections || collections.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
          Curated Spaces
        </span>
        <h3 className="font-serif text-2xl text-[#F5F0E8] font-bold">
          Our collections are being prepared.
        </h3>
        <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
          We are currently curating new architectural furniture collections for our online showroom.
        </p>
        <div className="pt-3">
          <Link to="/products">
            <GoldButton size="sm">Browse Furniture</GoldButton>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 ${className}`}>
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  )
}

export default CollectionGrid
