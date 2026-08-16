import React from 'react'
import { GalleryFilterRail } from './GalleryFilterRail'
import type { GalleryRoomSlug } from '@/lib/constants'

export interface RoomFilterProps {
  activeRoom: GalleryRoomSlug
  onSelectRoom: (slug: GalleryRoomSlug) => void
  className?: string
}

/**
 * RoomFilter
 * Legacy alias forwarding directly to GalleryFilterRail.
 */
export const RoomFilter: React.FC<RoomFilterProps> = (props) => {
  return <GalleryFilterRail {...props} />
}

export default RoomFilter
