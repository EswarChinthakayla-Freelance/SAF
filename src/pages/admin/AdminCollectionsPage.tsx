import React, { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { AdminDataTable, type Column } from '@/components/admin/AdminDataTable'
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog'
import { AdminImageUploader } from '@/components/admin/AdminImageUploader'
import { GoldButton } from '@/components/brand/GoldButton'
import { useCollections } from '@/hooks/queries/useCollections'
import { useCollectionMutations } from '@/hooks/mutations/useCollectionMutations'
import { getMediaUrl } from '@/lib/media'
import { formatDate } from '@/utils/dates'
import { supabase } from '@/lib/supabase'
import type { CollectionRow } from '@/types/app'

export const AdminCollectionsPage: React.FC = () => {
  const { data: collections = [], isLoading, isError, error, refetch } = useCollections({
    activeOnly: false,
  })
  const { createCollection, updateCollection, deleteCollection, toggleActive } =
    useCollectionMutations()

  // Sheet State (Add / Edit)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<CollectionRow | null>(null)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    cover_image_path: '' as string | null,
    cover_image_alt: '',
    is_active: true,
    sort_order: 0,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [sheetError, setSheetError] = useState<string | null>(null)

  // Delete State
  const [collectionToDelete, setCollectionToDelete] = useState<CollectionRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOpenAdd = () => {
    setEditingCollection(null)
    setIsSlugManuallyEdited(false)
    setFormData({
      name: '',
      slug: '',
      description: '',
      cover_image_path: null,
      cover_image_alt: '',
      is_active: true,
      sort_order: (collections.length || 0) + 1,
    })
    setSheetError(null)
    setIsSheetOpen(true)
  }

  const handleOpenEdit = (col: CollectionRow) => {
    setEditingCollection(col)
    setIsSlugManuallyEdited(true)
    setFormData({
      name: col.name,
      slug: col.slug,
      description: col.description || '',
      cover_image_path: col.cover_image_path,
      cover_image_alt: col.cover_image_alt || '',
      is_active: col.is_active,
      sort_order: col.sort_order,
    })
    setSheetError(null)
    setIsSheetOpen(true)
  }

  const handleCloseSheet = () => {
    setIsSheetOpen(false)
    setEditingCollection(null)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isSlugManuallyEdited ? prev.slug : name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
    }))
  }

  const handleRegenerateSlug = () => {
    setFormData((prev) => ({
      ...prev,
      slug: prev.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
    }))
    setIsSlugManuallyEdited(false)
  }

  const handleSaveCollection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setSheetError('Collection name is required')
      return
    }
    if (!formData.slug.trim()) {
      setSheetError('Slug is required')
      return
    }

    setIsSaving(true)
    setSheetError(null)

    try {
      if (editingCollection) {
        await updateCollection.mutateAsync({
          id: editingCollection.id,
          updates: {
            name: formData.name.trim(),
            slug: formData.slug.trim(),
            description: formData.description.trim() || null,
            cover_image_path: formData.cover_image_path || null,
            cover_image_alt: formData.cover_image_alt.trim() || null,
            is_active: formData.is_active,
            sort_order: formData.sort_order,
          },
          oldCoverPath: editingCollection.cover_image_path,
        })
      } else {
        await createCollection.mutateAsync({
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim() || null,
          cover_image_path: formData.cover_image_path || null,
          cover_image_alt: formData.cover_image_alt.trim() || null,
          is_active: formData.is_active,
          sort_order: formData.sort_order,
        })
      }
      handleCloseSheet()
    } catch (err: any) {
      console.error('Failed to save collection:', err)
      const msg = err?.message || 'Failed to save collection record.'
      if (msg.includes('unique') || msg.includes('duplicate') || msg.includes('collections_slug_key')) {
        setSheetError('A collection with this slug already exists.')
      } else {
        setSheetError(msg)
      }
    } finally {
      setIsSaving(false)
    }
  }

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

  const columns: Column<CollectionRow>[] = [
    {
      header: 'Collection',
      accessor: (row) => {
        const thumbUrl = row.cover_image_path
          ? getMediaUrl('brand-assets', row.cover_image_path, 'thumbnail')
          : null

        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-none bg-[#171717] border border-[#2A2A2A] overflow-hidden shrink-0 flex items-center justify-center">
              {thumbUrl ? (
                <img
                  src={thumbUrl}
                  alt={row.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="text-[10px] font-mono text-[#7A746B]">No Cover</span>
              )}
            </div>
            <div>
              <div className="font-medium text-[#F5F0E8]">{row.name}</div>
              <div className="text-[11px] text-[#7A746B] font-mono">slug: {row.slug}</div>
            </div>
          </div>
        )
      },
    },
    {
      header: 'Sort Order',
      accessor: (row) => (
        <span className="font-mono text-xs text-[#D1CCC2]/90">{row.sort_order}</span>
      ),
      className: 'hidden sm:table-cell',
    },
    {
      header: 'Visibility',
      accessor: (row) => (
        <button
          type="button"
          onClick={() => toggleActive.mutate({ id: row.id, is_active: !row.is_active })}
          disabled={toggleActive.isPending}
          className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border transition-all cursor-pointer ${row.is_active
            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/60'
            : 'bg-[#171717] text-[#9B958B] border-[#2A2A2A] hover:text-[#F5F0E8]'
            }`}
        >
          {row.is_active ? 'Active' : 'Hidden'}
        </button>
      ),
    },
    {
      header: 'Updated',
      accessor: (row) => (
        <span className="text-[11px] text-[#7A746B] font-mono">
          {formatDate(row.updated_at || row.created_at)}
        </span>
      ),
      className: 'hidden md:table-cell',
    },
  ]

  const renderActions = (row: CollectionRow) => (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => handleOpenEdit(row)}
        className="px-2.5 py-1.5 text-xs text-[#C9A84C] hover:text-[#E8B84B] font-mono font-semibold rounded hover:bg-[#171717] transition-colors"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => setCollectionToDelete(row)}
        className="px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 font-mono rounded hover:bg-red-950/40 transition-colors"
      >
        Delete
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        variant="admin"
        title="Collections"
        description="Organize furniture into public catalogue collections and curated editorial themes."
        actions={
          <GoldButton onClick={handleOpenAdd} size="sm" className="text-xs uppercase tracking-wider">
            + Add Collection
          </GoldButton>
        }
      />

      {/* Collections DataTable */}
      <AdminDataTable<CollectionRow>
        columns={columns}
        data={collections}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        onRetry={refetch}
        emptyTitle="No collections found"
        emptyDescription="Create your first room collection to organize furniture pieces."
        emptyAction={
          <GoldButton onClick={handleOpenAdd} size="sm">
            + Create Collection
          </GoldButton>
        }
        renderActions={renderActions}
        keyExtractor={(row) => row.id}
      />

      {/* Add / Edit Slide-Over Sheet */}
      {isSheetOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-fade-in"
            onClick={handleCloseSheet}
          />

          <div className="relative z-10 w-full sm:max-w-md md:max-w-lg bg-[#111111] border-l border-[#2A2A2A] h-full shadow-2xl flex flex-col overflow-hidden animate-slide-left">
            <div className="px-6 py-5 border-b border-[#2A2A2A] flex items-center justify-between bg-[#141414]">
              <h2 className="text-base font-serif font-semibold text-[#F5F0E8]">
                {editingCollection ? `Edit Collection: ${editingCollection.name}` : 'Add Collection'}
              </h2>
              <button
                type="button"
                onClick={handleCloseSheet}
                className="p-2 text-[#9B958B] hover:text-[#F5F0E8] rounded-none transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCollection} className="flex-1 p-6 space-y-5 overflow-y-auto font-sans text-xs">
              {sheetError && (
                <div className="p-3.5 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-none font-sans">
                  {sheetError}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-[#F5F0E8] font-semibold">
                  Collection Name <span className="text-[#C9A84C]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Dining & Banquet"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-2.5 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono uppercase text-[#F5F0E8] font-semibold">
                    URL Slug <span className="text-[#C9A84C]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleRegenerateSlug}
                    className="text-[10px] text-[#C9A84C] hover:text-[#E8B84B] font-mono"
                  >
                    Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => {
                    setIsSlugManuallyEdited(true)
                    setFormData({ ...formData, slug: e.target.value })
                  }}
                  placeholder="dining-banquet"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-2.5 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none font-mono"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-[#F5F0E8] font-semibold">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Curated solid wood furniture designed for architectural living spaces..."
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none p-3 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none leading-relaxed resize-none"
                />
              </div>

              {/* Sort Order */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono uppercase text-[#F5F0E8] font-semibold">
                    Sort Order
                  </label>
                  <span className="text-[10px] text-[#7A746B] font-mono">Lower values appear first</span>
                </div>
                <input
                  type="number"
                  min={0}
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({ ...formData, sort_order: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-2.5 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-[#171717] rounded-none border border-[#2A2A2A]">
                <div>
                  <div className="font-medium text-[#F5F0E8] text-xs">Public Visibility</div>
                  <div className="text-[11px] text-[#9B958B]">
                    Active collections are available to public catalogue visitors.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 accent-[#C9A84C] cursor-pointer"
                />
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-3 pt-2 border-t border-[#2A2A2A]">
                <label className="block text-[11px] font-mono uppercase text-[#F5F0E8] font-semibold">
                  Cover Image & Photography
                </label>
                {formData.cover_image_path ? (
                  <div className="space-y-2">
                    <div className="relative aspect-[16/9] rounded-none overflow-hidden bg-[#0A0A0A] border border-[#2A2A2A] group">
                      <img
                        src={getMediaUrl('brand-assets', formData.cover_image_path, 'card')}
                        alt={formData.cover_image_alt || formData.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, cover_image_path: null })}
                        className="absolute top-2 right-2 p-1.5 bg-red-950/80 text-red-300 rounded-none text-xs hover:bg-red-900 transition-colors"
                      >
                        Remove Cover
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formData.cover_image_alt}
                      onChange={(e) => setFormData({ ...formData, cover_image_alt: e.target.value })}
                      placeholder="Cover image accessibility alt text..."
                      className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-3 py-2 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
                    />
                  </div>
                ) : (
                  <AdminImageUploader
                    maxFiles={1}
                    onUploadFiles={async (files) => {
                      if (files.length === 0) return
                      const file = files[0]
                      const fileExt = file.name.split('.').pop()
                      const filePath = `collections/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`
                      const { error: uploadErr } = await supabase.storage
                        .from('brand-assets')
                        .upload(filePath, file, { upsert: false })
                      if (uploadErr) throw uploadErr
                      setFormData((prev) => ({
                        ...prev,
                        cover_image_path: filePath,
                        cover_image_alt: prev.cover_image_alt || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
                      }))
                    }}
                  />
                )}
              </div>

              <div className="pt-4 border-t border-[#2A2A2A] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseSheet}
                  className="px-4 py-2 text-xs text-[#9B958B] hover:text-[#F5F0E8] rounded-none border border-[#2A2A2A]"
                >
                  Cancel
                </button>
                <GoldButton
                  type="submit"
                  size="sm"
                  loading={isSaving}
                  loadingText="Saving..."
                >
                  {editingCollection ? 'Update Collection' : 'Create Collection'}
                </GoldButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
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
