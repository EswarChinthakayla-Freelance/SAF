import { describe, it, expect } from 'vitest'
import { getMediaUrl, MEDIA_PRESETS } from '@/lib/media'

describe('getMediaUrl utility', () => {
  it('returns fallback logo when storagePath is null or empty', () => {
    expect(getMediaUrl('product-images', null)).toBe('/assets/logo.svg')
    expect(getMediaUrl('product-images', undefined)).toBe('/assets/logo.svg')
    expect(getMediaUrl('product-images', '')).toBe('/assets/logo.svg')
  })

  it('returns absolute external URLs as-is', () => {
    const externalUrl = 'https://images.unsplash.com/photo-12345'
    expect(getMediaUrl('product-images', externalUrl)).toBe(externalUrl)
  })

  it('generates public Supabase storage delivery URL', () => {
    const url = getMediaUrl('product-images', 'products/mandir-01.webp')
    expect(url).toContain('products/mandir-01.webp')
  })

  it('defines correct media preset dimensions and quality', () => {
    expect(MEDIA_PRESETS.thumbnail.width).toBe(200)
    expect(MEDIA_PRESETS.card.width).toBe(600)
    expect(MEDIA_PRESETS.detail.width).toBe(1200)
    expect(MEDIA_PRESETS.hero.width).toBe(1800)
  })
})
