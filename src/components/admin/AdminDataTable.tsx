import React from 'react'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'

export interface Column<T> {
  header: string
  accessor?: keyof T | ((row: T) => React.ReactNode)
  className?: string
}

export interface AdminDataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  onRetry?: () => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
  searchPlaceholder?: string
  filterControls?: React.ReactNode
  onResetFilters?: () => void
  hasActiveFilters?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: React.ReactNode
  renderActions?: (row: T) => React.ReactNode
  keyExtractor: (row: T) => string
  className?: string
}

export function AdminDataTable<T>({
  columns,
  data,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filterControls,
  onResetFilters,
  hasActiveFilters = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no records matching your current filter criteria.',
  emptyAction,
  renderActions,
  keyExtractor,
  className = '',
}: AdminDataTableProps<T>) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Table Toolbar */}
      {(onSearchChange || filterControls) && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#111111] p-3 sm:p-4 rounded-none border border-[#2A2A2A]">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            {onSearchChange && (
              <div className="relative flex-1 min-w-[220px]">
                <svg
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A746B]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery || ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none pl-9 pr-4 py-2 text-xs text-[#F5F0E8] placeholder-[#7A746B] focus:border-[#C9A84C] outline-none transition-colors"
                />
              </div>
            )}

            {filterControls}

            {hasActiveFilters && onResetFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="text-xs text-[#C9A84C] hover:underline font-mono px-2 py-1 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table Body / States */}
      <div className="bg-[#111111] rounded-none border border-[#2A2A2A] overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="overflow-x-auto" aria-label="Loading table records" role="status">
            <span className="sr-only">Loading table records...</span>
            <table className="w-full text-left text-xs text-[#F5F0E8]">
              <thead className="bg-[#171717] text-[#9B958B] uppercase tracking-wider font-mono border-b border-[#2A2A2A]">
                <tr>
                  {columns.map((col, idx) => (
                    <th key={idx} className={`px-5 py-3.5 font-medium ${col.className || ''}`}>
                      {col.header}
                    </th>
                  ))}
                  {renderActions && (
                    <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {[1, 2, 3, 4, 5].map((rowIdx) => (
                  <tr key={`skel-row-${rowIdx}`} className="animate-pulse">
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} className={`px-5 py-4 ${col.className || ''}`}>
                        <div className="h-4 w-3/4 bg-[#1C1C1C] rounded-none" />
                      </td>
                    ))}
                    {renderActions && (
                      <td className="px-5 py-4 text-right">
                        <div className="h-4 w-12 bg-[#1C1C1C] rounded-none ml-auto" />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : isError ? (
          <div className="p-8">
            <ErrorState
              message={errorMessage || 'Failed to load table data.'}
              onRetry={onRetry}
            />
          </div>
        ) : data.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title={emptyTitle}
              description={emptyDescription}
              action={emptyAction}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#F5F0E8]">
              <thead className="bg-[#171717] text-[#9B958B] uppercase tracking-wider font-mono border-b border-[#2A2A2A]">
                <tr>
                  {columns.map((col, idx) => (
                    <th key={idx} className={`px-5 py-3.5 font-medium ${col.className || ''}`}>
                      {col.header}
                    </th>
                  ))}
                  {renderActions && (
                    <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {data.map((row) => {
                  const rowKey = keyExtractor(row)
                  return (
                    <tr
                      key={rowKey}
                      className="hover:bg-[#171717]/60 transition-colors"
                    >
                      {columns.map((col, cIdx) => {
                        let content: React.ReactNode = null
                        if (typeof col.accessor === 'function') {
                          content = col.accessor(row)
                        } else if (col.accessor) {
                          content = String(row[col.accessor] ?? '')
                        }
                        return (
                          <td key={cIdx} className={`px-5 py-4 ${col.className || ''}`}>
                            {content}
                          </td>
                        )
                      })}
                      {renderActions && (
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          {renderActions(row)}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
