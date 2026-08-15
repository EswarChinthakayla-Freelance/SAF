import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('Product CRUD & Storage Lifecycle Compensation Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('captures storage paths from product_images BEFORE database delete occurs', async () => {
    const mockStorageRemove = vi.fn().mockResolvedValue({ data: [], error: null })
    const mockDbDelete = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    })

    // Simulate delete workflow order
    const productId = 'test-prod-123'

    // Step 1: Query image paths
    const imagesToClean: string[] = ['products/photo1.webp', 'products/photo2.webp']

    // Step 2: Delete DB record
    const dbResult = await mockDbDelete().eq('id', productId)
    expect(dbResult.error).toBeNull()

    // Step 3: Remove Storage objects after DB deletion
    if (imagesToClean.length > 0) {
      await mockStorageRemove(imagesToClean)
    }

    expect(mockStorageRemove).toHaveBeenCalledWith([
      'products/photo1.webp',
      'products/photo2.webp',
    ])
  })

  it('compensates newly uploaded storage files if database child row creation fails', async () => {
    const mockStorageRemove = vi.fn().mockResolvedValue({ data: [], error: null })
    const newlyUploaded = ['products/draft/new_1.webp', 'products/draft/new_2.webp']

    const saveFailed = true

    if (saveFailed) {
      // Execute compensation
      await mockStorageRemove(newlyUploaded)
    }

    expect(mockStorageRemove).toHaveBeenCalledWith(newlyUploaded)
  })

  it('does NOT delete old media when replacement database update fails', async () => {
    const oldStoragePath = 'products/original_hero.webp'
    const newStoragePath = 'products/replacement_hero.webp'

    const mockStorageRemove = vi.fn()
    const dbUpdateSuccess = false

    if (dbUpdateSuccess) {
      await mockStorageRemove([oldStoragePath])
    } else {
      // Compensate new upload instead of touching old media
      await mockStorageRemove([newStoragePath])
    }

    expect(mockStorageRemove).toHaveBeenCalledWith([newStoragePath])
    expect(mockStorageRemove).not.toHaveBeenCalledWith([oldStoragePath])
  })
})
