import React from 'react'
import { Link } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon, Folder01Icon, Layers01Icon, Image01Icon } from '@hugeicons/core-free-icons'
import type { CollectionRow } from '@/types/app'

export interface DiscoveryIndexProps {
  collections?: CollectionRow[]
  className?: string
}

/**
 * DiscoveryIndex — "The Discovery Index"
 * Editorial navigation corridors displayed during empty search state,
 * eliminating the empty black screen and giving the visitor immediate discovery value.
 */
export const DiscoveryIndex: React.FC<DiscoveryIndexProps> = ({
  collections = [],
  className = '',
}) => {
  const discoveryCorridors = [
    {
      index: '01',
      tag: 'COLLECTIONS',
      title: 'The Collection Atlas',
      description: 'Explore furniture suites grouped by spatial purpose and living harmony.',
      href: '/collections',
      icon: Folder01Icon,
    },
    {
      index: '02',
      tag: 'CATALOGUE',
      title: 'The Furniture Index',
      description: 'Browse every handcrafted creation, filterable by timber species and price.',
      href: '/products',
      icon: Layers01Icon,
    },
    {
      index: '03',
      tag: 'INSPIRATION',
      title: 'The Spaces Gallery',
      description: 'Inspect real-world architectural installations and styled residential sanctuaries.',
      href: '/gallery',
      icon: Image01Icon,
    },
  ]

  return (
    <section
      aria-label="Explore Furniture Archive"
      className={`space-y-10 sm:space-y-12 select-none ${className}`}
    >
      {/* Editorial Corridor Heading */}
      <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
        <div className="flex items-center gap-3">
          <span className="w-6 sm:w-8 h-[1.5px] bg-[#C9A84C]" aria-hidden="true" />
          <h2 className="text-[11px] sm:text-xs uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
            EXPLORE THE ARCHIVE
          </h2>
        </div>
        <span className="text-[10px] font-mono text-[#7A746B] uppercase tracking-wider hidden sm:inline">
          3 DESTINATION CORRIDORS
        </span>
      </div>

      {/* 3 Architectural Editorial Corridors */}
      <div className="divide-y divide-[#1A1A1A] border-y border-[#1A1A1A]">
        {discoveryCorridors.map((corridor) => {
          const Icon = corridor.icon
          return (
            <Link
              key={corridor.index}
              to={corridor.href}
              className="group block py-6 sm:py-8 transition-colors hover:bg-[#0E0E0E] px-3 sm:px-6 -mx-3 sm:-mx-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center">
                {/* Left (Index & Tag) */}
                <div className="md:col-span-3 flex items-center gap-3 font-mono text-xs">
                  <span className="text-[#C9A84C] font-bold text-sm sm:text-base">
                    {corridor.index}
                  </span>
                  <span className="text-[#333333]">//</span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#7A746B] group-hover:text-[#D1CCC2] transition-colors">
                    {corridor.tag}
                  </span>
                </div>

                {/* Middle (Title & Description) */}
                <div className="md:col-span-7 space-y-1">
                  <h3 className="text-xl sm:text-2xl font-serif text-[#F5F0E8] font-semibold group-hover:text-[#E8B84B] transition-colors flex items-center gap-2.5">
                    <HugeiconsIcon icon={Icon} className="w-5 h-5 text-[#C9A84C] shrink-0" />
                    <span>{corridor.title}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8A847A] font-sans font-light leading-relaxed">
                    {corridor.description}
                  </p>
                </div>

                {/* Right (Action Arrow) */}
                <div className="md:col-span-2 flex justify-start md:justify-end items-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#141414] group-hover:bg-[#C9A84C] group-hover:text-[#0A0A0A] border border-[#242424] group-hover:border-[#C9A84C] text-[#C9A84C] text-xs font-mono tracking-wider transition-colors">
                    <span className="hidden sm:inline uppercase">ENTER</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Collection Index Links (If active collections exist) */}
      {collections.length > 0 && (
        <div className="pt-4 space-y-4">
          <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-[0.2em] text-[#7A746B]">
            <span className="text-[#C9A84C] font-semibold">DIRECT COLLECTION ACCESS</span>
            <span>//</span>
            <span>FILTERED SUITES</span>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {collections.map((col) => (
              <Link
                key={col.id}
                to={`/collections/${col.slug}`}
                className="px-3.5 py-2 bg-[#0F0F0F] hover:bg-[#181818] border border-[#222222] hover:border-[#C9A84C]/50 text-xs text-[#D1CCC2] hover:text-[#F5F0E8] font-mono uppercase tracking-wider transition-colors"
              >
                <span>{col.name}</span>
                <span className="text-[#C9A84C] ml-1.5">&rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default DiscoveryIndex
