import { supabase } from './supabase'
import type { MediaTransformOptions } from '@/types/app'

export type MediaPreset =
  | 'thumbnail'
  | 'card'
  | 'detail'
  | 'hero'
  | 'lightbox'
  | 'featured-stage'
  | 'featured-preview'
  | 'viewer-main'
  | 'viewer-thumbnail'
  | 'share-image'
  | 'gallery-lead'
  | 'gallery-grid'
  | 'gallery-inspect'
  | 'gallery-thumb'
  | 'gallery-share'
  | 'collection-index-lead'
  | 'collection-index-chapter'
  | 'collection-index-mobile'

export const MEDIA_PRESETS: Record<MediaPreset, MediaTransformOptions> = {
  thumbnail: { width: 200, height: 200, quality: 75, resize: 'cover' },
  card: { width: 600, height: 450, quality: 80, resize: 'cover' },
  detail: { width: 1200, height: 900, quality: 85, resize: 'contain' },
  hero: { width: 1800, height: 1200, quality: 90, resize: 'cover' },
  lightbox: { width: 2048, height: 1536, quality: 85, resize: 'contain' },
  'featured-stage': { width: 1400, height: 1050, quality: 85, resize: 'contain' },
  'featured-preview': { width: 400, height: 500, quality: 75, resize: 'cover' },
  'viewer-main': { width: 2048, height: 1536, quality: 85, resize: 'contain' },
  'viewer-thumbnail': { width: 160, height: 160, quality: 75, resize: 'cover' },
  'share-image': { width: 1600, height: 1200, quality: 85, resize: 'contain' },
  'gallery-lead': { width: 1600, height: 1000, quality: 85, resize: 'cover' },
  'gallery-grid': { width: 900, height: 675, quality: 80, resize: 'cover' },
  'gallery-inspect': { width: 2048, height: 1536, quality: 90, resize: 'contain' },
  'gallery-thumb': { width: 160, height: 160, quality: 75, resize: 'cover' },
  'gallery-share': { width: 1600, height: 1200, quality: 85, resize: 'contain' },
  'collection-index-lead': { width: 1800, height: 1200, quality: 85, resize: 'contain' },
  'collection-index-chapter': { width: 1400, height: 1000, quality: 85, resize: 'contain' },
  'collection-index-mobile': { width: 800, height: 800, quality: 80, resize: 'contain' },
}

/**
 * Pure media URL generator using Supabase Storage public delivery.
 * Delivers direct public object URLs from Supabase storage buckets.
 */
export function getMediaUrl(
  bucket: string,
  storagePath: string | null | undefined,
  options?: MediaTransformOptions | MediaPreset
): string {
  if (!storagePath) {
    return '/assets/logo.svg'
  }

  // If already an absolute HTTP URL, return as-is
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
    return storagePath
  }

  let transform: { width?: number; height?: number; resize?: 'cover' | 'contain' | 'fill'; quality?: number; format?: 'origin' } | undefined
  if (options) {
    const preset = typeof options === 'string' ? MEDIA_PRESETS[options] : options
    if (preset) {
      transform = {
        width: preset.width,
        height: preset.height,
        resize: preset.resize,
        quality: preset.quality,
        format: preset.format === 'origin' ? 'origin' : undefined,
      }
    }
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath, transform ? { transform } : undefined)

  return data.publicUrl
}
