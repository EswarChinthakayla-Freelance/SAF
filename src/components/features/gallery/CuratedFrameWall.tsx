import React from 'react'
import { GalleryFrame } from './GalleryFrame'
import type { GalleryItemWithProduct } from '@/types/app'

export interface CuratedFrameWallProps {
  images: GalleryItemWithProduct[]
  roomSlug?: string
  startIndex?: number
  className?: string
}

/**
 * CuratedFrameWall
 * Editorial asymmetric frame wall system for "Spaces, Styled."
 * Implements a designed repeating visual rhythm (Row A: 1 large + 2 stacked,
 * Row B: 3 balanced vertical plates, Row C: 1 wide cinematic frame) to eliminate
 * monotonous uniform grids while ensuring rock-solid stability and responsiveness.
 */
export const CuratedFrameWall: React.FC<CuratedFrameWallProps> = ({
  images,
  roomSlug,
  startIndex = 0,
  className = '',
}) => {
  if (images.length === 0) return null

  // Partition images into rhythm chunks of 6 items
  const chunks: GalleryItemWithProduct[][] = []
  for (let i = 0; i < images.length; i += 6) {
    chunks.push(images.slice(i, i + 6))
  }

  let runningIndex = startIndex

  return (
    <section
      aria-label="Curated Inspiration Frame Wall"
      className={`space-y-8 select-none ${className}`}
    >
      {chunks.map((chunk, chunkIdx) => {
        const item0 = chunk[0]
        const item1 = chunk[1]
        const item2 = chunk[2]
        const item3 = chunk[3]
        const item4 = chunk[4]
        const item5 = chunk[5]

        const baseIdx = runningIndex
        runningIndex += chunk.length

        return (
          <div key={`chunk-${chunkIdx}`} className="space-y-8">
            {/* 1. Rhythm Pattern A: 1 Dominant (Cols 1-7) + 2 Stacked (Cols 8-12) */}
            {item0 && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                <div className="md:col-span-7 xl:col-span-8">
                  <GalleryFrame
                    image={item0}
                    index={baseIdx}
                    roomSlug={roomSlug}
                    aspectRatioClass="aspect-[16/10]"
                  />
                </div>

                {(item1 || item2) && (
                  <div className="md:col-span-5 xl:col-span-4 flex flex-col gap-6 justify-between">
                    {item1 && (
                      <GalleryFrame
                        image={item1}
                        index={baseIdx + 1}
                        roomSlug={roomSlug}
                        aspectRatioClass="aspect-[4/3]"
                      />
                    )}
                    {item2 && (
                      <GalleryFrame
                        image={item2}
                        index={baseIdx + 2}
                        roomSlug={roomSlug}
                        aspectRatioClass="aspect-[4/3]"
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 2. Rhythm Pattern B: 3 Balanced Architectural Plates */}
            {(item3 || item4) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {item3 && (
                  <GalleryFrame
                    image={item3}
                    index={baseIdx + 3}
                    roomSlug={roomSlug}
                    aspectRatioClass="aspect-[4/3]"
                  />
                )}
                {item4 && (
                  <GalleryFrame
                    image={item4}
                    index={baseIdx + 4}
                    roomSlug={roomSlug}
                    aspectRatioClass="aspect-[4/3]"
                  />
                )}
                {item5 && (
                  <GalleryFrame
                    image={item5}
                    index={baseIdx + 5}
                    roomSlug={roomSlug}
                    aspectRatioClass="aspect-[4/3]"
                  />
                )}
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}

export default CuratedFrameWall
