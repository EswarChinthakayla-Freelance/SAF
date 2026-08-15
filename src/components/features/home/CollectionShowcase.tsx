import React from 'react'
import { SectionHeading } from '@/components/brand/SectionHeading'
import { CollectionCard } from '@/components/features/collections/CollectionCard'
import { useCollections } from '@/hooks/queries/useCollections'

export const CollectionShowcase: React.FC = () => {
  const { data: collections, isLoading } = useCollections({ activeOnly: true })

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <SectionHeading
        eyebrow="Architectural Spaces"
        title="Curated Rooms & Collections"
        description="Thoughtfully tailored furniture suites designed to bring timeless grandeur, warmth, and proportion to every room."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="h-80 bg-[#111111] rounded-none animate-pulse" />
          ))}
        </div>
      ) : collections && collections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-xs text-[#9B958B]">
          Browse our collections in the main navigation.
        </div>
      )}
    </section>
  )
}
