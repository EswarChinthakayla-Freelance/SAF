import React from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import type { AdminCollectionItem } from '@/types/app'

export interface CollectionDeactivateDialogProps {
  isOpen: boolean
  collection: AdminCollectionItem | null
  onConfirm: () => void
  onCancel: () => void
  isPending?: boolean
}

export const CollectionDeactivateDialog: React.FC<CollectionDeactivateDialogProps> = ({
  isOpen,
  collection,
  onConfirm,
  onCancel,
  isPending = false,
}) => {
  if (!collection) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="bg-[#141414] border border-[#2A2A2A] text-[#F5F0E8] max-w-md p-6 font-sans">
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle className="text-base font-sans font-semibold text-[#F5F0E8]">
            Hide “{collection.name}” from public website?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-[#9B958B] leading-relaxed">
            This collection will stop appearing on public collection pages and filters. All{' '}
            <span className="text-[#F5F0E8] font-medium">
              {collection.product_count ?? 0} products
            </span>{' '}
            will remain safely in the catalogue database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center justify-end gap-3 pt-4 border-t border-[#222222]">
          <AlertDialogCancel
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 rounded text-xs bg-[#1C1C1C] hover:bg-[#252525] border border-[#2E2E2E] text-[#9B958B] hover:text-[#F5F0E8] transition-colors cursor-pointer"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 rounded text-xs bg-[#B8860B] hover:bg-[#C9A84C] text-[#0A0A0A] font-semibold transition-colors cursor-pointer"
          >
            {isPending ? 'Hiding...' : 'Hide Collection'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CollectionDeactivateDialog
