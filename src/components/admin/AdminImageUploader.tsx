import React, { useState, useRef } from 'react'

export interface UploadQueueItem {
  id: string
  file: File
  previewUrl: string
  status: 'pending' | 'uploading' | 'uploaded' | 'failed'
  progress?: number
  errorMessage?: string
  storagePath?: string
}

export interface AdminImageUploaderProps {
  onUploadFiles: (files: File[]) => Promise<void>
  maxSizeMB?: number
  acceptedFormats?: string[]
  maxFiles?: number
  className?: string
}

export const AdminImageUploader: React.FC<AdminImageUploaderProps> = ({
  onUploadFiles,
  maxSizeMB = 10,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  maxFiles = 10,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [queue, setQueue] = useState<UploadQueueItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewUrlsRef = useRef<Set<string>>(new Set())

  // Clean up object URLs on component unmount to prevent browser memory leaks
  React.useEffect(() => {
    const urls = previewUrlsRef.current
    return () => {
      urls.forEach((url) => {
        try {
          URL.revokeObjectURL(url)
        } catch {
          // ignore
        }
      })
      urls.clear()
    }
  }, [])

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    const newItems: UploadQueueItem[] = []
    const filesToUpload: File[] = []

    Array.from(fileList).slice(0, maxFiles).forEach((file) => {
      if (!acceptedFormats.includes(file.type)) {
        alert(`Unsupported format: ${file.name}. Only JPEG, PNG, and WebP are allowed.`)
        return
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the allowed size of ${maxSizeMB}MB.`)
        return
      }

      const previewUrl = URL.createObjectURL(file)
      previewUrlsRef.current.add(previewUrl)

      const item: UploadQueueItem = {
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        previewUrl,
        status: 'pending',
      }
      newItems.push(item)
      filesToUpload.push(file)
    })

    setQueue((prev) => [...prev, ...newItems])

    if (filesToUpload.length > 0) {
      processUpload(filesToUpload, newItems)
    }
  }

  const processUpload = async (files: File[], items: UploadQueueItem[]) => {
    setIsUploading(true)
    setQueue((prev) =>
      prev.map((q) =>
        items.some((it) => it.id === q.id) ? { ...q, status: 'uploading' } : q
      )
    )

    try {
      await onUploadFiles(files)
      setQueue((prev) =>
        prev.map((q) =>
          items.some((it) => it.id === q.id) ? { ...q, status: 'uploaded' } : q
        )
      )
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed'
      console.error('[AdminImageUploader] Upload failed:', err)
      setQueue((prev) =>
        prev.map((q) =>
          items.some((it) => it.id === q.id)
            ? { ...q, status: 'failed', errorMessage: errorMsg }
            : q
        )
      )
    } finally {
      setIsUploading(false)
    }
  }

  const removeQueueItem = (id: string) => {
    setQueue((prev) => {
      const item = prev.find((it) => it.id === id)
      if (item) {
        try {
          URL.revokeObjectURL(item.previewUrl)
          previewUrlsRef.current.delete(item.previewUrl)
        } catch {
          // ignore
        }
      }
      return prev.filter((it) => it.id !== id)
    })
  }

  const retryItem = (item: UploadQueueItem) => {
    processUpload([item.file], [item])
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Dropzone Container */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-none p-8 sm:p-10 text-center transition-all cursor-pointer select-none ${isDragging
          ? 'border-[#C9A84C] bg-[#C9A84C]/5'
          : 'border-[#2A2A2A] bg-[#111111] hover:border-[#3A3A3A] hover:bg-[#141414]'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          disabled={isUploading}
          multiple
          accept={acceptedFormats.join(',')}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#171717] border border-[#2A2A2A] flex items-center justify-center text-[#C9A84C]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          </div>

          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-medium text-[#F5F0E8]">
              {isUploading
                ? 'Uploading images to storage...'
                : 'Drag and drop furniture images, or '}
              {!isUploading && (
                <span className="text-[#C9A84C] underline font-semibold">browse files</span>
              )}
            </p>
            <p className="text-[11px] text-[#7A746B]">
              Supports WebP, JPEG, PNG up to {maxSizeMB}MB each
            </p>
          </div>
        </div>
      </div>

      {/* Upload Queue Details */}
      {queue.length > 0 && (
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-none p-4 divide-y divide-[#2A2A2A]">
          <div className="text-xs uppercase tracking-wider font-mono text-[#9B958B] pb-3 font-semibold">
            Upload Queue ({queue.length})
          </div>
          <div className="space-y-3 pt-3">
            {queue.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="w-10 h-10 rounded-none object-cover bg-stone-950 border border-[#2A2A2A] shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-[#F5F0E8] font-medium truncate">{item.file.name}</p>
                    <p className="text-[10px] text-[#7A746B]">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {item.status === 'uploading' && (
                    <span className="text-xs text-[#C9A84C] font-mono flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-ping" />
                      Uploading...
                    </span>
                  )}
                  {item.status === 'uploaded' && (
                    <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                      ✓ Uploaded
                    </span>
                  )}
                  {item.status === 'failed' && (
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-400 font-mono">Failed</span>
                        <button
                          type="button"
                          onClick={() => retryItem(item)}
                          className="text-[11px] text-[#C9A84C] hover:underline cursor-pointer"
                          aria-label={`Retry upload for ${item.file.name}`}
                        >
                          Retry
                        </button>
                      </div>
                      {item.errorMessage && (
                        <span className="text-[10px] text-red-400/80 max-w-[200px] truncate text-right">
                          {item.errorMessage}
                        </span>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => removeQueueItem(item.id)}
                    className="p-1 text-[#7A746B] hover:text-red-400 transition-colors cursor-pointer"
                    aria-label={`Remove ${item.file.name} from upload queue`}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
