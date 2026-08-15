import React from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '@/components/brand/SectionHeading'
import { useCollections } from '@/hooks/queries/useCollections'
import { getMediaUrl } from '@/lib/media'

export const CategoryGateway: React.FC = () => {
  const { data: collections, isLoading } = useCollections({ activeOnly: true })

  // Room fallbacks if database collection images are being initialized
  const defaultImages: Record<string, string> = {
    'living-room': '/images/hero/hero_1.jpg',
    bedroom: '/images/hero/hero_2.jpg',
    dining: '/images/hero/hero_3.jpg',
    'study-office': '/images/hero/hero_4.jpg',
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <SectionHeading
        eyebrow="Explore by Space"
        title="Made for Every Room"
        description="Every room in your home deserves furniture crafted with architectural intent, noble hardwood, and exquisite comfort."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-[420px] bg-[#141414] rounded-none animate-pulse" />
          <div className="space-y-6">
            <div className="h-[200px] bg-[#141414] rounded-none animate-pulse" />
            <div className="h-[200px] bg-[#141414] rounded-none animate-pulse" />
          </div>
        </div>
      ) : collections && collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lead Hero Category Tile (Spans 2 columns) */}
          {collections[0] && (
            <CategoryTile
              collection={collections[0]}
              defaultImage={defaultImages[collections[0].slug] || '/images/hero/hero_1.jpg'}
              className="md:col-span-2 min-h-[380px] sm:min-h-[460px]"
            />
          )}

          {/* Secondary Stacked Category Tiles */}
          <div className="flex flex-col gap-6">
            {collections.slice(1, 3).map((col) => (
              <CategoryTile
                key={col.id}
                collection={col}
                defaultImage={defaultImages[col.slug] || '/images/hero/hero_2.jpg'}
                className="flex-1 min-h-[200px] sm:min-h-[218px]"
              />
            ))}
          </div>

          {/* Additional Grid Tiles if more than 3 collections exist */}
          {collections.length > 3 && (
            <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
              {collections.slice(3, 6).map((col) => (
                <CategoryTile
                  key={col.id}
                  collection={col}
                  defaultImage={defaultImages[col.slug] || '/images/hero/hero_3.jpg'}
                  className="min-h-[260px]"
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-xs text-[#9B958B]">
          Explore our complete catalogue for curated room collections.
        </div>
      )}
    </section>
  )
}

interface CategoryTileProps {
  collection: {
    id: string
    name: string
    slug: string
    cover_image_path?: string | null
    description?: string | null
  }
  defaultImage: string
  className?: string
}

const CategoryTile: React.FC<CategoryTileProps> = ({ collection, defaultImage, className = '' }) => {
  const imageUrl = getMediaUrl('product-images', collection.cover_image_path, 'card') || defaultImage

  return (
    <Link
      to={`/collections/${collection.slug}`}
      className={`group relative overflow-hidden rounded-none border border-[#2A2A2A] bg-[#111111] transition-all duration-500 block ${className}`}
    >
      <img
        src={imageUrl}
        alt={collection.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent transition-opacity duration-300 group-hover:opacity-80" />

      {/* Content */}
      <div className="relative z-10 h-full p-6 sm:p-8 flex flex-col justify-end">
        <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#C9A84C] font-semibold">
          Curated Space
        </span>
        <h3 className="text-xl sm:text-2xl font-serif text-[#F5F0E8] font-bold group-hover:text-[#E8B84B] transition-colors">
          {collection.name}
        </h3>
        {collection.description && (
          <p className="text-xs text-[#9B958B] line-clamp-2 mt-1 max-w-md font-sans">
            {collection.description}
          </p>
        )}

        <div className="pt-3 flex items-center gap-2 text-xs font-semibold text-[#E8B84B] opacity-90 group-hover:translate-x-1.5 transition-transform duration-300">
          <span>Explore Room</span>
          <span>&rarr;</span>
        </div>
      </div>
    </Link>
  )
}

export default CategoryGateway
