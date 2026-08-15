import React, { useEffect } from 'react'
import { BRAND_NAME } from '@/lib/constants'

export interface PageMetaProps {
  title: string
  description?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'product'
  canonicalUrl?: string
  noIndex?: boolean
}

/**
 * Standardized PageMeta component for Sri Anjaneya Furnitures.
 * Manages document title, canonical link, Open Graph metadata, and robots directives.
 */
export const PageMeta: React.FC<PageMetaProps> = ({
  title,
  description = 'Sri Anjaneya Furnitures — Handcrafted bespoke solid wood furniture, architectural collections, and tailored quotes.',
  ogImage = '/og-image.png',
  ogType = 'website',
  canonicalUrl,
  noIndex = false,
}) => {
  useEffect(() => {
    const baseAppUrl = (
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_URL) ||
      'https://srianjaneyafurnitures.com'
    ).replace(/\/$/, '')

    // 1. Document Title
    const fullTitle = title.includes(BRAND_NAME) ? title : `${title} | ${BRAND_NAME}`
    document.title = fullTitle

    // Helper to update or create a meta tag
    const setMetaTag = (attrName: string, attrVal: string, contentVal: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attrName, attrVal)
        document.head.appendChild(element)
      }
      element.setAttribute('content', contentVal)
    }

    // 2. Meta Description
    setMetaTag('name', 'description', description)

    // 3. Open Graph & Twitter Card Tags
    setMetaTag('property', 'og:title', fullTitle)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:type', ogType)

    // Absolute OG image URL
    const fullOgImage = ogImage.startsWith('http')
      ? ogImage
      : `${baseAppUrl}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`
    setMetaTag('property', 'og:image', fullOgImage)

    // Twitter Card metadata
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', fullTitle)
    setMetaTag('name', 'twitter:description', description)
    setMetaTag('name', 'twitter:image', fullOgImage)

    // 4. Canonical URL & og:url
    if (canonicalUrl) {
      const normalizedPath = canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`
      const fullCanonicalUrl = canonicalUrl.startsWith('http')
        ? canonicalUrl
        : `${baseAppUrl}${normalizedPath}`

      setMetaTag('property', 'og:url', fullCanonicalUrl)

      let link = document.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', fullCanonicalUrl)
    }

    // 5. Robots / Indexing
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow')
  }, [title, description, ogImage, ogType, canonicalUrl, noIndex])

  return null
}

export default PageMeta
