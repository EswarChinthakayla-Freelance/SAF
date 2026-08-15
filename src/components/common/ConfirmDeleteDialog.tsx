import React from 'react'

export interface ConfirmDeleteDialogProps {
  isOpen: boolean
  recordType?: string
  recordName?: string
  consequenceMessage?: string
  confirmLabel?: string
  cancelLabel?: string
  isDeleting?: boolean
  onConfirm: () => Promise<void> | void
  onCancel: () => void
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  isOpen,
  recordType = 'Record',
  recordName,
  consequenceMessage = 'This will permanently remove the record and its associated data from the database. Associated uploaded media will also be scheduled for removal.',
  confirmLabel,
  cancelLabel = 'Cancel',
  isDeleting = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null

  const title = recordName ? `Delete “${recordName}”?` : `Confirm Deleting ${recordType}`
  const buttonText = confirmLabel || `Delete ${recordType}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#111111] border border-[#2A2A2A] rounded-none p-6 sm:p-7 shadow-2xl space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-serif text-[#F5F0E8] font-semibold">{title}</h3>
          <p className="text-xs text-[#9B958B] leading-relaxed font-sans">{consequenceMessage}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#9B958B] hover:text-[#F5F0E8] border border-[#2A2A2A] rounded-none hover:border-[#3A3A3A] transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-red-700 hover:bg-red-600 text-white font-semibold rounded-none transition-colors cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}
