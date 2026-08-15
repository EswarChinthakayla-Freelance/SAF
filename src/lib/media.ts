import { supabase } from './supabase'
import type { MediaTransformOptions } from '@/types/app'

export type MediaPreset = 'thumbnail' | 'card' | 'detail' | 'hero' | 'lightbox'

export const MEDIA_PRESETS: Record<MediaPreset, MediaTransformOptions> = {
  thumbnail: { width: 200, height: 200, quality: 75, resize: 'cover' },
  card: { width: 600, height: 450, quality: 80, resize: 'cover' },
  detail: { width: 1200, height: 900, quality: 85, resize: 'contain' },
  hero: { width: 1800, height: 1200, quality: 90, resize: 'cover' },
  lightbox: { width: 2048, height: 1536, quality: 85, resize: 'contain' },
}

/**
 * Pure media URL generator using Supabase Storage public delivery.
 * Delivers direct public object URLs from Supabase storage buckets.
 */
export function getMediaUrl(
  bucket: string,
  storagePath: string | null | undefined,
  _options?: MediaTransformOptions | MediaPreset
): string {
  if (!storagePath) {
    return '/assets/logo.svg'
  }

  // If already an absolute HTTP URL, return as-is
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
    return storagePath
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath)

  return data.publicUrl
}
