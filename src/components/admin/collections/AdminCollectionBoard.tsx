import React from 'react'
import { AdminCollectionCard } from './AdminCollectionCard'
import type { AdminCollectionItem } from '@/types/app'

export interface AdminCollectionBoardProps {
  collections: AdminCollectionItem[]
  onEdit: (collection: AdminCollectionItem) => void
  onToggleActive?: (collection: AdminCollectionItem) => void
  onDelete: (collection: AdminCollectionItem) => void
  isPendingActive?: boolean
  isReorderMode?: boolean
  onMoveUp?: (index: number) => void
  onMoveDown?: (index: number) => void
}

export const AdminCollectionBoard: React.FC<AdminCollectionBoardProps> = ({
  collections,
  onEdit,
  onToggleActive,
  onDelete,
  isPendingActive = false,
  isReorderMode = false,
  onMoveUp,
  onMoveDown,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1400px]">
      {collections.map((col, index) => (
        <AdminCollectionCard
          key={col.id}
          collection={col}
          index={index}
          totalCount={collections.length}
          onEdit={onEdit}
          onToggleActive={onToggleActive}
          onDelete={onDelete}
          isPendingActive={isPendingActive}
          isReorderMode={isReorderMode}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      ))}
    </div>
  )
}

export default AdminCollectionBoard
