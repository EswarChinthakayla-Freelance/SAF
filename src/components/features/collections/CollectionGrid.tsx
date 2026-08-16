import React from 'react'
import { CollectionAtlas, type CollectionAtlasProps } from './CollectionAtlas'

/**
 * CollectionGrid
 * Legacy wrapper forwarding to CollectionAtlas for architectural chapter presentation.
 */
export const CollectionGrid: React.FC<CollectionAtlasProps> = (props) => {
  return <CollectionAtlas {...props} />
}

export default CollectionGrid
