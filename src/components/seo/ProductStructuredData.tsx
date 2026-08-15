import React from 'react'
import { BRAND_NAME } from '@/lib/constants'
import { getMediaUrl } from '@/lib/media'
import type { ProductWithRelations, ProductDetail } from '@/types/app'

interface ProductStructuredDataProps {
  product: ProductWithRelations | ProductDetail | (Record<string, unknown> & {
    name: string
    slug: string
    price: number
    compare_price?: number | null
    currency?: string
    short_desc?: string | null
    description?: string | null
    product_code?: string | null
    cover_image_path?: string | null
    product_images?: Array<{ storage_path: string }>
  })
}

/**
 * Standardized Schema.org Product Structured Data JSON-LD generator.
 * Emits truthful INR pricing, product SKU, and image URL without fabricating reviews or ratings.
 */
export const ProductStructuredData: React.FC<ProductStructuredDataProps> = ({ product }) => {
  const baseAppUrl = (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_URL) ||
    'https://srianjaneyafurnitures.com'
  ).replace(/\/$/, '')

  const productUrl = `${baseAppUrl}/products/${product.slug}`
  
  const imageUrls: string[] = []
  if (product.cover_image_path) {
    imageUrls.push(getMediaUrl('product-images', product.cover_image_path, 'detail'))
  }
  if (Array.isArray(product.product_images)) {
    product.product_images.forEach((img) => {
      if (img.storage_path && img.storage_path !== product.cover_image_path) {
        imageUrls.push(getMediaUrl('product-images', img.storage_path, 'detail'))
      }
    })
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_desc || product.description?.slice(0, 500) || `${product.name} handcrafted by ${BRAND_NAME}`,
    image: imageUrls.length > 0 ? imageUrls : [`${baseAppUrl}/og-image.jpg`],
    sku: product.product_code || product.slug,
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: BRAND_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: Number(product.price),
      priceCurrency: product.currency || 'INR',
      url: productUrl,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default ProductStructuredData
