import { getMediaUrl, MEDIA_PRESETS, type MediaPreset } from '@/lib/media'
import type { MediaTransformOptions } from '@/types/app'

export { getMediaUrl, MEDIA_PRESETS, type MediaPreset }

export function useMediaUrl() {
  const getUrl = (
    bucket: string,
    storagePath: string | null | undefined,
    options?: MediaTransformOptions | MediaPreset
  ) => {
    return getMediaUrl(bucket, storagePath, options)
  }

  return { getUrl, getMediaUrl }
}
