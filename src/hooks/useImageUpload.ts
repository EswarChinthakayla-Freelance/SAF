import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { UPLOAD_CONSTRAINTS, STORAGE_BUCKETS } from '@/lib/constants'
import { StorageError, ValidationError } from '@/lib/errors'

export interface UploadFileItem {
  id: string
  file: File
  previewUrl: string
  status: 'pending' | 'uploading' | 'uploaded' | 'failed'
  storagePath?: string
  errorMessage?: string
}

export interface UseImageUploadOptions {
  bucket?: string
  folder?: string
  maxSizeMB?: number
  concurrency?: number
}

/**
 * Concurrency-controlled image uploader hook for Supabase Storage.
 * Avoids browser memory spikes and network saturation by processing in a bounded worker pool.
 */
export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    bucket = STORAGE_BUCKETS.PRODUCT_IMAGES,
    folder = 'products',
    maxSizeMB = UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB,
    concurrency = UPLOAD_CONSTRAINTS.UPLOAD_CONCURRENCY,
  } = options

  const [queue, setQueue] = useState<UploadFileItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const activeCountRef = useRef(0)
  const queueRef = useRef<UploadFileItem[]>([])

  useEffect(() => {
    queueRef.current = queue
  }, [queue])

  // Revoke object URLs on unmount to prevent browser memory leaks
  useEffect(() => {
    return () => {
      queueRef.current.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl)
        }
      })
    }
  }, [])

  const validateFile = useCallback(
    (file: File) => {
      const allowed = UPLOAD_CONSTRAINTS.ALLOWED_IMAGE_TYPES as readonly string[]
      if (!allowed.includes(file.type)) {
        throw new ValidationError(
          `Invalid file format: "${file.name}". Only JPEG, PNG, and WebP are allowed.`
        )
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new ValidationError(
          `File "${file.name}" exceeds maximum allowed size of ${maxSizeMB}MB.`
        )
      }
    },
    [maxSizeMB]
  )

  const generateStoragePath = useCallback((file: File, prefix: string) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'webp'
    const uuid = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    return `${prefix}/${uuid}.${ext}`
  }, [])

  const uploadSingleFile = useCallback(
    async (item: UploadFileItem): Promise<string> => {
      validateFile(item.file)
      const storagePath = generateStoragePath(item.file, folder)

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, item.file, {
          cacheControl: '31536000', // 1 year immutable CDN cache for UUID paths
          upsert: false,
        })

      if (error || !data) {
        throw new StorageError(`Upload failed for ${item.file.name}: ${error?.message}`, error)
      }

      return data.path
    },
    [bucket, folder, generateStoragePath, validateFile]
  )

  const processQueue = useCallback(async () => {
    if (activeCountRef.current >= concurrency) return

    const pendingItem = queueRef.current.find((it) => it.status === 'pending')
    if (!pendingItem) {
      const anyUploading = queueRef.current.some((it) => it.status === 'uploading')
      if (!anyUploading) {
        setIsUploading(false)
      }
      return
    }

    activeCountRef.current += 1
    setIsUploading(true)

    setQueue((prev) =>
      prev.map((it) => (it.id === pendingItem.id ? { ...it, status: 'uploading' } : it))
    )

    try {
      const storagePath = await uploadSingleFile(pendingItem)
      setQueue((prev) =>
        prev.map((it) =>
          it.id === pendingItem.id
            ? { ...it, status: 'uploaded', storagePath }
            : it
        )
      )
    } catch (err: unknown) {
      const errorMsg =
        (err as { userMessage?: string })?.userMessage ||
        (err instanceof Error ? err.message : null) ||
        'Upload failed'
      setQueue((prev) =>
        prev.map((it) =>
          it.id === pendingItem.id
            ? { ...it, status: 'failed', errorMessage: errorMsg }
            : it
        )
      )
    } finally {
      activeCountRef.current -= 1
      processQueue()
    }
  }, [concurrency, uploadSingleFile])

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const newItems: UploadFileItem[] = []
      Array.from(files).forEach((file) => {
        try {
          validateFile(file)
          newItems.push({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            file,
            previewUrl: URL.createObjectURL(file),
            status: 'pending',
          })
        } catch (err: unknown) {
          const validationMsg =
            (err as { userMessage?: string })?.userMessage ||
            (err instanceof Error ? err.message : null) ||
            'File validation failed'
          alert(validationMsg)
        }
      })

      if (newItems.length > 0) {
        setQueue((prev) => [...prev, ...newItems])
        // Trigger queue worker
        setTimeout(processQueue, 0)
      }
    },
    [processQueue, validateFile]
  )

  const retryItem = useCallback(
    (id: string) => {
      setQueue((prev) =>
        prev.map((it) => (it.id === id ? { ...it, status: 'pending', errorMessage: undefined } : it))
      )
      setTimeout(processQueue, 0)
    },
    [processQueue]
  )

  const removeItem = useCallback((id: string) => {
    setQueue((prev) => {
      const item = prev.find((it) => it.id === id)
      if (item?.previewUrl) {
        URL.revokeObjectURL(item.previewUrl)
      }
      return prev.filter((it) => it.id !== id)
    })
  }, [])

  const clearQueue = useCallback(() => {
    queueRef.current.forEach((item) => {
      if (item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl)
      }
    })
    setQueue([])
  }, [])

  return {
    queue,
    isUploading,
    addFiles,
    retryItem,
    removeItem,
    clearQueue,
    uploadSingleFile,
  }
}
