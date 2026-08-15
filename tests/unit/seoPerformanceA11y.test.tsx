import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { PageMeta } from '@/components/seo/PageMeta'
import { ProductStructuredData } from '@/components/seo/ProductStructuredData'
import { getMediaUrl, MEDIA_PRESETS } from '@/lib/media'
import { NotFoundPage } from '@/pages/public/NotFoundPage'

describe('Section 6.9: SEO, Performance & Accessibility Implementation', () => {
  beforeEach(() => {
    document.title = ''
    document.head.innerHTML = ''
  })

  describe('PageMeta Component', () => {
    it('sets document title and meta description with brand name', () => {
      render(
        <PageMeta
          title="Living Sanctum"
          description="Handcrafted teakwood living room suite."
        />
      )

      expect(document.title).toBe('Living Sanctum | Sri Anjaneya Furnitures')
      const metaDesc = document.querySelector('meta[name="description"]')
      expect(metaDesc?.getAttribute('content')).toBe('Handcrafted teakwood living room suite.')
    })

    it('creates canonical link and og:url pointing to normalized URL', () => {
      render(
        <PageMeta
          title="Teak Console"
          canonicalUrl="/products/teak-console"
        />
      )

      const canonicalLink = document.querySelector('link[rel="canonical"]')
      expect(canonicalLink?.getAttribute('href')).toContain('/products/teak-console')

      const ogUrl = document.querySelector('meta[property="og:url"]')
      expect(ogUrl?.getAttribute('content')).toContain('/products/teak-console')
    })

    it('sets robots noindex directive when noIndex is true', () => {
      render(
        <PageMeta
          title="Search"
          noIndex={true}
        />
      )

      const robotsMeta = document.querySelector('meta[name="robots"]')
      expect(robotsMeta?.getAttribute('content')).toBe('noindex, nofollow')
    })

    it('sets Open Graph metadata tags', () => {
      render(
        <PageMeta
          title="Royal Dining Table"
          description="Solid teakwood dining table."
          ogImage="/images/royal-dining.jpg"
          ogType="product"
        />
      )

      expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(
        'Royal Dining Table | Sri Anjaneya Furnitures'
      )
      expect(document.querySelector('meta[property="og:description"]')?.getAttribute('content')).toBe(
        'Solid teakwood dining table.'
      )
      expect(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe(
        'product'
      )
      expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toContain(
        '/images/royal-dining.jpg'
      )
    })
  })

  describe('ProductStructuredData Component', () => {
    it('generates valid Schema.org Product JSON-LD with numeric INR pricing and no fake reviews', () => {
      const product = {
        id: 'prod-001',
        name: 'Grand Teakwood Mandir',
        slug: 'grand-teakwood-mandir',
        price: 85000,
        compare_price: 95000,
        currency: 'INR',
        short_desc: 'Bespoke hand-carved mandir temple.',
        description: 'Exquisite craftsmanship crafted with noble seasoned teak.',
        product_code: 'SAF-MDR-01',
        cover_image_path: 'mandir-cover.webp',
      }

      const { container } = render(<ProductStructuredData product={product} />)
      const scriptTag = container.querySelector('script[type="application/ld+json"]')
      expect(scriptTag).not.toBeNull()

      const jsonLd = JSON.parse(scriptTag!.textContent || '{}')
      expect(jsonLd['@context']).toBe('https://schema.org')
      expect(jsonLd['@type']).toBe('Product')
      expect(jsonLd.name).toBe('Grand Teakwood Mandir')
      expect(jsonLd.brand.name).toBe('Sri Anjaneya Furnitures')
      expect(jsonLd.offers.price).toBe(85000)
      expect(jsonLd.offers.priceCurrency).toBe('INR')
      expect(jsonLd.sku).toBe('SAF-MDR-01')

      // Assert absence of fabricated fields
      expect(jsonLd.aggregateRating).toBeUndefined()
      expect(jsonLd.review).toBeUndefined()
    })
  })

  describe('Responsive Media Delivery Presets', () => {
    it('provides standardized transformation presets for all sizes', () => {
      expect(MEDIA_PRESETS.thumbnail).toBeDefined()
      expect(MEDIA_PRESETS.card).toBeDefined()
      expect(MEDIA_PRESETS.detail).toBeDefined()
      expect(MEDIA_PRESETS.hero).toBeDefined()
      expect(MEDIA_PRESETS.lightbox).toBeDefined()

      expect(MEDIA_PRESETS.thumbnail.width).toBeLessThanOrEqual(200)
      expect(MEDIA_PRESETS.hero.width).toBeGreaterThanOrEqual(1800)
      expect(MEDIA_PRESETS.lightbox.width).toBeGreaterThanOrEqual(2000)
    })

    it('returns absolute URLs as-is and provides fallback for null paths', () => {
      expect(getMediaUrl('product-images', 'https://cdn.example.com/chair.jpg')).toBe(
        'https://cdn.example.com/chair.jpg'
      )
      expect(getMediaUrl('product-images', null)).toBe('/assets/logo.svg')
    })
  })

  describe('NotFoundPage Custom Route Resilience', () => {
    it('renders branded 404 presentation with recovery links', () => {
      render(
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      )

      expect(screen.getByText("This page couldn't be found.")).toBeDefined()
      const homeLink = screen.getByRole('link', { name: /Return Home/i })
      expect(homeLink.getAttribute('href')).toBe('/')
      const catalogueLink = screen.getByRole('link', { name: /Browse Catalogue/i })
      expect(catalogueLink.getAttribute('href')).toBe('/products')
    })
  })
})
