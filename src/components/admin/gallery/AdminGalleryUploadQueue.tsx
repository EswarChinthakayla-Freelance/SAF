import React, { useState, useRef, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { GoldButton } from '@/components/brand/GoldButton'
import { Button } from '@/components/ui/button'
import { GALLERY_ROOM_FILTERS, STORAGE_BUCKETS, UPLOAD_CONSTRAINTS } from '@/lib/constants'
import { supabase } from '@/lib/supabase'
import { useAdminProducts } from '@/hooks/queries/useProducts'
import { useGalleryMutations } from '@/hooks/mutations/useGalleryMutations'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Upload04Icon,
  ImageAdd01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Cancel01Icon,
  ReloadIcon,
  LinkSquare02Icon,
} from '@hugeicons/core-free-icons'

export interface UploadQueueItem {
  id: string
  file: File
  previewUrl: string
  altText: string
  roomType: string
  productId: string | null
  status: 'pending' | 'uploading' | 'uploaded' | 'failed'
  errorMessage?: string
  storagePath?: string
}

export interface AdminGalleryUploadQueueProps {
  isOpen: boolean
  onClose: () => void
  currentCount: number
}

const generateUniquePath = (originalName: string): string => {
  const ext = originalName.split('.').pop() || 'jpg'
  const randomStr = Math.random().toString(36).substring(2, 9)
  return `inspiration/${Date.now()}_${randomStr}.${ext}`
}

const generateQueueId = (filename: string): string => {
  return `${filename}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
}

export const AdminGalleryUploadQueue: React.FC<AdminGalleryUploadQueueProps> = ({
  isOpen,
  onClose,
  currentCount,
}) => {
  const { createGalleryImage } = useGalleryMutations()
  const { data: productsData } = useAdminProducts({ pageSize: 100 })

  const [items, setItems] = useState<UploadQueueItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const objectUrlsRef = useRef<Set<string>>(new Set())

  // Revoke object URLs on component unmount
  useEffect(() => {
    const urls = objectUrlsRef.current
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

  if (!isOpen) return null

  const handleFilesAdded = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    const newItems: UploadQueueItem[] = []

    Array.from(fileList).forEach((file) => {
      if (!UPLOAD_CONSTRAINTS.ALLOWED_IMAGE_TYPES.includes(file.type as 'image/jpeg' | 'image/png' | 'image/webp')) {
        alert(`Unsupported file format for "${file.name}". Please use JPEG, PNG, or WebP.`)
        return
      }

      if (file.size > UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB * 1024 * 1024) {
        alert(`"${file.name}" exceeds the ${UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB}MB size limit.`)
        return
      }

      const previewUrl = URL.createObjectURL(file)
      objectUrlsRef.current.add(previewUrl)

      // Friendly default alt text derived from filename
      const defaultAlt = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .trim()

      newItems.push({
        id: generateQueueId(file.name),
        file,
        previewUrl,
        altText: defaultAlt,
        roomType: 'Living Room',
        productId: null,
        status: 'pending',
      })
    })

    setItems((prev) => [...prev, ...newItems])
  }

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((it) => it.id === id)
      if (item) {
        try {
          URL.revokeObjectURL(item.previewUrl)
          objectUrlsRef.current.delete(item.previewUrl)
        } catch {
          // ignore
        }
      }
      return prev.filter((it) => it.id !== id)
    })
  }

  const updateItemField = (id: string, updates: Partial<UploadQueueItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
  }

  const uploadSingleItem = async (item: UploadQueueItem, orderIndex: number): Promise<boolean> => {
    updateItemField(item.id, { status: 'uploading', errorMessage: undefined })

    const filePath = generateUniquePath(item.file.name)

    try {
      // 1. Upload to Supabase storage bucket
      const { error: storageErr } = await supabase.storage
        .from(STORAGE_BUCKETS.GALLERY_IMAGES)
        .upload(filePath, item.file, { upsert: false })

      if (storageErr) throw storageErr

      // 2. Insert metadata record in DB
      try {
        await createGalleryImage.mutateAsync({
          storage_path: filePath,
          alt_text: item.altText.trim() || null,
          room_type: item.roomType,
          product_id: item.productId || null,
          sort_order: currentCount + orderIndex + 1,
          is_active: true,
        })

        updateItemField(item.id, { status: 'uploaded', storagePath: filePath })
        return true
      } catch (dbErr) {
        // Storage-to-DB compensation: remove uploaded storage file if DB creation fails
        console.error('[UploadQueue] Metadata insert failed. Compensating file:', filePath)
        await supabase.storage.from(STORAGE_BUCKETS.GALLERY_IMAGES).remove([filePath])
        throw dbErr
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed'
      updateItemField(item.id, { status: 'failed', errorMessage: errorMsg })
      return false
    }
  }

  const handleStartUpload = async () => {
    const pendingItems = items.filter((it) => it.status === 'pending' || it.status === 'failed')
    if (pendingItems.length === 0) return

    setIsProcessing(true)

    // Bounded concurrency upload queue (2 concurrent workers)
    const BATCH_SIZE = 2
    for (let i = 0; i < pendingItems.length; i += BATCH_SIZE) {
      const chunk = pendingItems.slice(i, i + BATCH_SIZE)
      await Promise.all(
        chunk.map((item, chunkIdx) => uploadSingleItem(item, i + chunkIdx))
      )
    }

    setIsProcessing(false)
  }

  const uploadedCount = items.filter((it) => it.status === 'uploaded').length
  const failedCount = items.filter((it) => it.status === 'failed').length
  const pendingCount = items.filter((it) => it.status === 'pending').length

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={() => {
          if (!isProcessing) onClose()
        }}
      />

      {/* Slide-over Workspace Sheet */}
      <div className="relative z-10 w-full sm:max-w-2xl bg-[#111111] border-l border-[#262626] h-full shadow-2xl flex flex-col overflow-hidden animate-slide-left font-sans">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#242424] flex items-center justify-between bg-[#141414]">
          <div className="space-y-0.5">
            <h2 className="text-base font-sans font-semibold text-[#F5F0E8] flex items-center gap-2">
              <HugeiconsIcon icon={ImageAdd01Icon} className="w-4 h-4 text-[#C9A84C]" />
              <span>Bulk Media Upload Workspace</span>
            </h2>
            <p className="text-xs text-[#9B958B]">
              Add inspiration imagery, configure metadata per file, and upload to gallery storage.
            </p>
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            aria-label="Close upload workspace"
            className="p-1.5 rounded text-[#9B958B] hover:text-[#F5F0E8] hover:bg-[#1F1F1F] transition-colors disabled:opacity-40 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              handleFilesAdded(e.dataTransfer.files)
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                : 'border-[#2E2E2E] hover:border-[#444444] bg-[#0E0E0E]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleFilesAdded(e.target.files)}
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="p-3 rounded-full bg-[#171717] border border-[#2A2A2A] text-[#C9A84C]">
                <HugeiconsIcon icon={Upload04Icon} className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-[#F5F0E8]">
                  Click to choose files or drag & drop photographs here
                </p>
                <p className="text-[11px] text-[#7A746B]">
                  Supports high-res JPEG, PNG, and WebP (up to 10MB per image)
                </p>
              </div>
            </div>
          </div>

          {/* Queue Items List */}
          {items.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase text-[#C9A84C] tracking-wider">
                  Upload Queue ({items.length})
                </span>
                <span className="text-xs font-mono text-[#8A847A]">
                  {uploadedCount} uploaded · {failedCount} failed · {pendingCount} pending
                </span>
              </div>

              <div className="space-y-3">
                {items.map((item, idx) => {
                  const fileSizeMB = (item.file.size / (1024 * 1024)).toFixed(1)

                  return (
                    <div
                      key={item.id}
                      className="bg-[#141414] border border-[#242424] rounded-lg p-3.5 space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        {/* Thumbnail Preview */}
                        <div className="relative w-16 h-16 rounded bg-[#0A0A0A] overflow-hidden shrink-0 border border-[#2A2A2A]">
                          <img
                            src={item.previewUrl}
                            alt={item.altText || item.file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* File Info & Status */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-medium text-[#F5F0E8] truncate">
                              {item.file.name}
                            </p>
                            <span className="text-[10px] font-mono text-[#7A746B] shrink-0">
                              {fileSizeMB} MB
                            </span>
                          </div>

                          {/* Status Pill */}
                          <div className="flex items-center gap-2">
                            {item.status === 'pending' && (
                              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#1A1A1A] text-[#A8A29E] border border-[#2A2A2A]">
                                Pending
                              </span>
                            )}
                            {item.status === 'uploading' && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#1C1708] text-[#F59E0B] border border-[#B45309]/40 animate-pulse">
                                Uploading & saving...
                              </span>
                            )}
                            {item.status === 'uploaded' && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#0D1510] text-[#4ADE80] border border-[#22C55E]/40">
                                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3 h-3 text-[#22C55E]" />
                                Uploaded
                              </span>
                            )}
                            {item.status === 'failed' && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#240E0E] text-red-400 border border-red-800/40">
                                <HugeiconsIcon icon={AlertCircleIcon} className="w-3 h-3 text-red-400" />
                                {item.errorMessage || 'Failed'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action: Remove / Retry */}
                        <div className="shrink-0 flex items-center gap-1">
                          {item.status === 'failed' && (
                            <button
                              type="button"
                              onClick={() => uploadSingleItem(item, idx)}
                              className="p-1 text-xs text-[#C9A84C] hover:text-[#E8B84B] rounded hover:bg-[#1F1F1F]"
                              title="Retry file upload"
                            >
                              <HugeiconsIcon icon={ReloadIcon} className="w-4 h-4" />
                            </button>
                          )}
                          {item.status !== 'uploading' && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1 text-xs text-[#7A746B] hover:text-red-400 rounded hover:bg-[#1F1F1F]"
                              title="Remove item"
                            >
                              <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Configurable Metadata (Only if not already uploaded) */}
                      {item.status !== 'uploaded' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#202020] text-xs">
                          {/* Alt Text */}
                          <div className="space-y-1 sm:col-span-2">
                            <label className="block text-[10px] font-mono uppercase text-[#A8A29E]">
                              Image Description / Alt
                            </label>
                            <input
                              type="text"
                              value={item.altText}
                              onChange={(e) => updateItemField(item.id, { altText: e.target.value })}
                              placeholder="e.g. Teak king bed in luxury bedroom with natural sunlight"
                              className="w-full h-8 px-2.5 bg-[#0A0A0A] border border-[#262626] rounded text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
                            />
                          </div>

                          {/* Room Type */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-mono uppercase text-[#A8A29E]">
                              Room Space
                            </label>
                            <Select
                              value={item.roomType}
                              onValueChange={(val) => updateItemField(item.id, { roomType: val || 'Living Room' })}
                            >
                              <SelectTrigger className="w-full h-8 bg-[#0A0A0A] border-[#262626] text-xs text-[#F5F0E8]">
                                <SelectValue placeholder="Room Space" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#141414] border-[#262626] text-[#F5F0E8]">
                                <SelectGroup>
                                  {GALLERY_ROOM_FILTERS.filter((r) => r.slug !== 'all').map((room) => (
                                    <SelectItem key={room.slug} value={room.label} className="text-xs">
                                      {room.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Linked Product */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-mono uppercase text-[#A8A29E] flex items-center gap-1">
                              <HugeiconsIcon icon={LinkSquare02Icon} className="w-3 h-3 text-[#C9A84C]" />
                              <span>Linked Catalogue Piece</span>
                            </label>
                            <Select
                              value={item.productId || 'none'}
                              onValueChange={(val) =>
                                updateItemField(item.id, { productId: val === 'none' || !val ? null : val })
                              }
                            >
                              <SelectTrigger className="w-full h-8 bg-[#0A0A0A] border-[#262626] text-xs text-[#F5F0E8]">
                                <SelectValue placeholder="None (Optional)" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#141414] border-[#262626] text-[#F5F0E8] max-h-56">
                                <SelectGroup>
                                  <SelectItem value="none" className="text-xs">No linked product</SelectItem>
                                  {productsData?.products?.map((prod) => (
                                    <SelectItem key={prod.id} value={prod.id} className="text-xs">
                                      {prod.name} ({prod.product_code || prod.slug})
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#242424] bg-[#141414] flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isProcessing}
            className="text-xs text-[#9B958B] hover:text-[#F5F0E8]"
          >
            {uploadedCount > 0 && pendingCount === 0 ? 'Close Workspace' : 'Cancel'}
          </Button>

          {pendingCount > 0 && (
            <GoldButton
              type="button"
              size="sm"
              onClick={handleStartUpload}
              loading={isProcessing}
              loadingText="Uploading batch..."
              className="px-5 text-xs font-semibold uppercase tracking-wider"
            >
              <HugeiconsIcon icon={Upload04Icon} className="w-3.5 h-3.5 mr-1.5" />
              <span>Upload {pendingCount} {pendingCount === 1 ? 'Image' : 'Images'}</span>
            </GoldButton>
          )}
        </div>
      </div>
    </div>
  )
}
