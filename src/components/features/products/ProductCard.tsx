import React from 'react'
import { ProductPlate, type ProductPlateProps } from './ProductPlate'

/**
 * ProductCard
 * Legacy forwarding wrapper to ProductPlate.
 */
export const ProductCard: React.FC<ProductPlateProps> = (props) => {
  return <ProductPlate {...props} />
}

export default ProductCard
