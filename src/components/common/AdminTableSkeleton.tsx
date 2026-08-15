import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface AdminTableSkeletonProps {
  columnsCount?: number
  rowsCount?: number
  className?: string
}

/**
 * Standard table skeleton preserving the dimensions of the admin data table
 * to prevent layout shift during initial load or route transition.
 */
export const AdminTableSkeleton: React.FC<AdminTableSkeletonProps> = ({
  columnsCount = 5,
  rowsCount = 5,
  className = '',
}) => {
  return (
    <div
      className={`bg-[#111111] rounded-none border border-[#2A2A2A] overflow-hidden ${className}`}
      aria-label="Loading table data"
      role="status"
    >
      <span className="sr-only">Loading table records...</span>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#F5F0E8]">
          <thead className="bg-[#171717] border-b border-[#2A2A2A]">
            <tr>
              {Array.from({ length: columnsCount }).map((_, cIdx) => (
                <th key={`th-skel-${cIdx}`} className="px-5 py-3.5">
                  <Skeleton className="h-3 w-16 bg-[#262626] rounded-none" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {Array.from({ length: rowsCount }).map((_, rIdx) => (
              <tr key={`tr-skel-${rIdx}`} className="animate-pulse">
                {Array.from({ length: columnsCount }).map((_, cIdx) => (
                  <td key={`td-skel-${rIdx}-${cIdx}`} className="px-5 py-4">
                    <Skeleton className="h-4 w-3/4 bg-[#1C1C1C] rounded-none" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminTableSkeleton
