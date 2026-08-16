import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  AdminCollectionsToolbar,
  type ViewMode,
} from '@/components/admin/collections/AdminCollectionsToolbar'
import { AdminCollectionsTable } from '@/components/admin/collections/AdminCollectionsTable'
import { AdminCollectionBoard } from '@/components/admin/collections/AdminCollectionBoard'
import { AdminCollectionSheet } from '@/components/admin/collections/AdminCollectionSheet'
import { AdminCollectionReorderBar } from '@/components/admin/collections/AdminCollectionReorderBar'
import { CollectionDeactivateDialog } from '@/components/admin/collections/CollectionDeactivateDialog'
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog'
import { GoldButton } from '@/components/brand/GoldButton'
import { useAdminCollections } from '@/hooks/queries/useCollections'
import { useCollectionMutations } from '@/hooks/mutations/useCollectionMutations'
import { SEARCH_CONSTRAINTS } from '@/lib/constants'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  PlusSignIcon,
  Layers01Icon,
  Search01Icon,
  RefreshIcon,
} from '@hugeicons/core-free-icons'
import type {
  AdminCollectionItem,
  CollectionInsert,
  CollectionUpdate,
} from '@/types/app'

const STORAGE_VIEW_KEY = 'admin-collections-view'

/**
 * AdminCollectionsPage — "The Collection Studio"
 * Visual collection management with List/Board switcher, cover previews,
 * curated display ordering, safe publication control, and responsive slide-over editing.
 */
export const AdminCollectionsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // 1. View Mode Persistence (Local storage only, excluded from server query)
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_VIEW_KEY)
      if (saved === 'board' || saved === 'list') return saved
    } catch {
      // Fallback
    }
    return 'list'
  })

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode)
    try {
      localStorage.setItem(STORAGE_VIEW_KEY, mode)
    } catch {
      // Ignore
    }
  }, [])

  // 2. Search & Visibility Filters
  const initialQuery = searchParams.get('q') || ''
  const initialVisibility = (searchParams.get('visibility') || 'all') as
    | 'all'
    | 'active'
    | 'inactive'

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [debouncedSearch, setDebouncedSearch] = useState(initialQuery)
  const [selectedVisibility, setSelectedVisibility] =
    useState<'all' | 'active' | 'inactive'>(initialVisibility)

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
    }, SEARCH_CONSTRAINTS.DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Sync state to URL params cleanly
  useEffect(() => {
    const nextParams = new URLSearchParams()
    if (debouncedSearch) nextParams.set('q', debouncedSearch)
    if (selectedVisibility !== 'all') nextParams.set('visibility', selectedVisibility)
    setSearchParams(nextParams, { replace: true })
  }, [debouncedSearch, selectedVisibility, setSearchParams])

  // 3. Server Query & Mutations
  const {
    data: rawCollections = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdminCollections({
    searchQuery: debouncedSearch || undefined,
    visibility: selectedVisibility,
  })

  const {
    createCollection,
    updateCollection,
    deleteCollection,
    toggleActive,
    reorderCollections,
  } = useCollectionMutations()

  // 4. Reorder Mode State
  const [isReorderMode, setIsReorderMode] = useState(false)
  const [reorderedList, setReorderedList] = useState<AdminCollectionItem[]>([])
  const [isSavingOrder, setIsSavingOrder] = useState(false)

  // Keep reordered list synced when collections arrive or reorder mode opens
  useEffect(() => {
    setReorderedList(rawCollections)
  }, [rawCollections])

  const handleToggleReorderMode = () => {
    if (isReorderMode) {
      // Cancel & restore
      setReorderedList(rawCollections)
      setIsReorderMode(false)
    } else {
      setReorderedList(rawCollections)
      setIsReorderMode(true)
    }
  }

  const handleMoveUp = (index: number) => {
    if (index <= 0) return
    setReorderedList((prev) => {
      const next = [...prev]
      const temp = next[index]
      next[index] = next[index - 1]
      next[index - 1] = temp
      return next
    })
  }

  const handleMoveDown = (index: number) => {
    if (index >= reorderedList.length - 1) return
    setReorderedList((prev) => {
      const next = [...prev]
      const temp = next[index]
      next[index] = next[index + 1]
      next[index + 1] = temp
      return next
    })
  }

  const handleSaveOrder = async () => {
    setIsSavingOrder(true)
    try {
      const updates = reorderedList.map((col, idx) => ({
        id: col.id,
        sort_order: (idx + 1) * 10,
      }))
      await reorderCollections.mutateAsync(updates)
      setIsReorderMode(false)
    } catch (err) {
      console.error('Failed to save collection order:', err)
    } finally {
      setIsSavingOrder(false)
    }
  }

  // 5. Sheet State (Add / Edit)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<AdminCollectionItem | null>(null)

  const handleOpenAdd = () => {
    setEditingCollection(null)
    setIsSheetOpen(true)
  }

  const handleOpenEdit = (col: AdminCollectionItem) => {
    setEditingCollection(col)
    setIsSheetOpen(true)
  }

  const handleCloseSheet = () => {
    setIsSheetOpen(false)
    setEditingCollection(null)
  }

  const handleSaveSheet = async ({
    data,
    oldCoverPath,
  }: {
    data: CollectionInsert | CollectionUpdate
    oldCoverPath?: string | null
  }) => {
    if (editingCollection) {
      await updateCollection.mutateAsync({
        id: editingCollection.id,
        updates: data as CollectionUpdate,
        oldCoverPath,
      })
    } else {
      await createCollection.mutateAsync(data as CollectionInsert)
    }
  }

  // 6. Visibility Deactivation Dialog State
  const [collectionToDeactivate, setCollectionToDeactivate] =
    useState<AdminCollectionItem | null>(null)

  const handleToggleActive = (col: AdminCollectionItem) => {
    if (col.is_active) {
      // Prompt confirmation before hiding an active collection
      setCollectionToDeactivate(col)
    } else {
      // Activating is safe, trigger directly
      toggleActive.mutate({ id: col.id, is_active: true })
    }
  }

  const handleConfirmDeactivate = async () => {
    if (!collectionToDeactivate) return
    try {
      await toggleActive.mutateAsync({
        id: collectionToDeactivate.id,
        is_active: false,
      })
      setCollectionToDeactivate(null)
    } catch (err) {
      console.error('Failed to hide collection:', err)
    }
  }

  // 7. Delete Dialog State
  const [collectionToDelete, setCollectionToDelete] =
    useState<AdminCollectionItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteConfirm = async () => {
    if (!collectionToDelete) return
    setIsDeleting(true)
    try {
      await deleteCollection.mutateAsync({
        id: collectionToDelete.id,
        coverPath: collectionToDelete.cover_image_path,
      })
      setCollectionToDelete(null)
    } catch (err) {
      console.error('Failed to delete collection:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  // 8. Filters Reset
  const handleResetFilters = () => {
    setSearchQuery('')
    setDebouncedSearch('')
    setSelectedVisibility('all')
  }

  const displayedCollections = isReorderMode ? reorderedList : rawCollections
  const totalCount = rawCollections.length
  const activeCount = useMemo(
    () => rawCollections.filter((c) => c.is_active).length,
    [rawCollections]
  )

  const isDatabaseEmpty =
    !isLoading &&
    totalCount === 0 &&
    !debouncedSearch &&
    selectedVisibility === 'all'

  const isNoFilterMatches =
    !isLoading &&
    totalCount === 0 &&
    (Boolean(debouncedSearch) || selectedVisibility !== 'all')

  return (
    <div className="space-y-6 max-w-[1600px] w-full mx-auto select-none font-sans">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222222]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#F5F0E8] tracking-tight">
              Collections
            </h1>
            {!isLoading && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#181818] border border-[#2A2A2A] text-xs font-mono text-[#9B958B]">
                {totalCount} {totalCount === 1 ? 'collection' : 'collections'} · {activeCount} active
              </span>
            )}
            {isFetching && !isLoading && (
              <HugeiconsIcon
                icon={RefreshIcon}
                className="w-3.5 h-3.5 text-[#C9A84C] animate-spin"
              />
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#8A847A] font-normal leading-relaxed">
            Organize public catalogue collections, covers, visibility and display order.
          </p>
        </div>

        <GoldButton
          onClick={handleOpenAdd}
          size="sm"
          icon={<HugeiconsIcon icon={PlusSignIcon} className="w-3.5 h-3.5" />}
          className="text-xs uppercase font-mono tracking-wider font-semibold w-full sm:w-auto shrink-0"
        >
          Add Collection
        </GoldButton>
      </div>

      {/* 2. Collection Command Bar */}
      <AdminCollectionsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedVisibility={selectedVisibility}
        onVisibilityChange={setSelectedVisibility}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        isReorderMode={isReorderMode}
        onToggleReorderMode={handleToggleReorderMode}
        onResetFilters={handleResetFilters}
      />

      {/* 3. Reorder Mode Actions Bar */}
      {isReorderMode && (
        <AdminCollectionReorderBar
          isSaving={isSavingOrder}
          hasChanges={JSON.stringify(reorderedList) !== JSON.stringify(rawCollections)}
          onSave={handleSaveOrder}
          onCancel={handleToggleReorderMode}
        />
      )}

      {/* 4. Collection Studio Workspace */}
      {isLoading ? (
        /* Loading Skeletons */
        viewMode === 'list' ? (
          <div className="bg-[#111111] border border-[#242424] rounded-lg p-4 space-y-3">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="h-16 bg-[#161616] rounded border border-[#222222] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="h-64 bg-[#111111] border border-[#242424] rounded-lg animate-pulse"
              />
            ))}
          </div>
        )
      ) : isError ? (
        /* Localized Error State */
        <div className="p-12 text-center bg-[#111111] border border-[#242424] rounded-lg space-y-3">
          <p className="text-xs sm:text-sm text-red-400">
            {error?.message || 'We could not load collections at this time.'}
          </p>
          <GoldButton onClick={() => refetch()} size="sm">
            Try Again
          </GoldButton>
        </div>
      ) : isDatabaseEmpty ? (
        /* Empty Database State */
        <div className="py-16 px-6 text-center bg-[#111111] border border-[#242424] rounded-lg space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#7A746B] flex items-center justify-center mx-auto">
            <HugeiconsIcon icon={Layers01Icon} className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-[#F5F0E8]">
              No collections yet
            </h2>
            <p className="text-xs text-[#8A847A] max-w-sm mx-auto">
              Create a collection to organize products on the public catalogue.
            </p>
          </div>
          <div className="pt-2">
            <GoldButton
              onClick={handleOpenAdd}
              size="sm"
              icon={<HugeiconsIcon icon={PlusSignIcon} className="w-3.5 h-3.5" />}
            >
              Add Collection
            </GoldButton>
          </div>
        </div>
      ) : isNoFilterMatches ? (
        /* No Filter Matches State */
        <div className="py-16 px-6 text-center bg-[#111111] border border-[#242424] rounded-lg space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#7A746B] flex items-center justify-center mx-auto">
            <HugeiconsIcon icon={Search01Icon} className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-[#F5F0E8]">
              No collections match these filters
            </h2>
            <p className="text-xs text-[#8A847A] max-w-sm mx-auto">
              Try adjusting your search query or visibility filter.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-medium text-[#C9A84C] hover:text-[#E8B84B] underline transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
            <GoldButton onClick={handleOpenAdd} size="sm">
              Add Collection
            </GoldButton>
          </div>
        </div>
      ) : (
        /* Active Collection List or Board View */
        <div className="space-y-6">
          {viewMode === 'list' ? (
            <AdminCollectionsTable
              collections={displayedCollections}
              onEdit={handleOpenEdit}
              onToggleActive={handleToggleActive}
              onDelete={(col) => setCollectionToDelete(col)}
              isPendingActive={toggleActive.isPending}
              isReorderMode={isReorderMode}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
            />
          ) : (
            <AdminCollectionBoard
              collections={displayedCollections}
              onEdit={handleOpenEdit}
              onToggleActive={handleToggleActive}
              onDelete={(col) => setCollectionToDelete(col)}
              isPendingActive={toggleActive.isPending}
              isReorderMode={isReorderMode}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
            />
          )}
        </div>
      )}

      {/* 5. Add / Edit Slide-Over Sheet */}
      <AdminCollectionSheet
        isOpen={isSheetOpen}
        collection={editingCollection}
        totalCollectionsCount={totalCount}
        onClose={handleCloseSheet}
        onSave={handleSaveSheet}
      />

      {/* 6. Visibility Deactivation Confirmation Dialog */}
      <CollectionDeactivateDialog
        isOpen={Boolean(collectionToDeactivate)}
        collection={collectionToDeactivate}
        onConfirm={handleConfirmDeactivate}
        onCancel={() => setCollectionToDeactivate(null)}
        isPending={toggleActive.isPending}
      />

      {/* 7. Safe Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={Boolean(collectionToDelete)}
        recordType="Collection"
        recordName={collectionToDelete?.name}
        consequenceMessage="Deleting this collection will not delete its products. Products currently assigned to it will become unassigned."
        confirmLabel="Delete Collection"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCollectionToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default AdminCollectionsPage
