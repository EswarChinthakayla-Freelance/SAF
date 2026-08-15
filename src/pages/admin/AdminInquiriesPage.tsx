import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { AdminDataTable, type Column } from '@/components/admin/AdminDataTable'
import { InquiryDetailSheet } from '@/components/admin/InquiryDetailSheet'
import { useInquiries } from '@/hooks/queries/useInquiries'
import { useInquiryMutations } from '@/hooks/mutations/useInquiryMutations'
import { formatDate, formatRelativeTime } from '@/utils/dates'
import { INQUIRY_STATUSES, SEARCH_CONSTRAINTS, type InquiryStatus } from '@/lib/constants'
import type { InquiryRow } from '@/types/app'

export const AdminInquiriesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawStatus = searchParams.get('status') || 'all'
  const activeStatus: InquiryStatus | undefined = INQUIRY_STATUSES.includes(
    rawStatus as InquiryStatus
  )
    ? (rawStatus as InquiryStatus)
    : undefined

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)

  // Sheet State
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRow | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
      setPage(1)
    }, SEARCH_CONSTRAINTS.DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data, isLoading, isError, error, refetch } = useInquiries({
    status: activeStatus,
    searchQuery: debouncedSearch || undefined,
    page,
    pageSize: 15,
  })

  const { updateInquiry } = useInquiryMutations()

  const handleTabChange = (statusKey: string) => {
    const nextParams = new URLSearchParams(searchParams)
    if (statusKey === 'all') {
      nextParams.delete('status')
    } else {
      nextParams.set('status', statusKey)
    }
    setSearchParams(nextParams, { replace: true })
    setPage(1)
  }

  const handleOpenDetail = (inquiry: InquiryRow) => {
    setSelectedInquiry(inquiry)
    setIsDetailOpen(true)

    // Automatic transition from 'new' -> 'read' on first admin inspection
    if (inquiry.status === 'new') {
      updateInquiry.mutate({
        id: inquiry.id,
        status: 'read',
      })
    }
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setSelectedInquiry(null)
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      new: {
        label: 'New',
        className: 'bg-[#C9A84C]/20 text-[#E8B84B] border-[#C9A84C]/40',
      },
      read: {
        label: 'Read',
        className: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
      },
      replied: {
        label: 'Replied',
        className: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
      },
      closed: {
        label: 'Closed',
        className: 'bg-stone-900 text-stone-400 border-stone-800',
      },
    }
    const badge = badges[status] || badges.new
    return (
      <span
        className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border font-semibold ${badge.className}`}
      >
        {badge.label}
      </span>
    )
  }

  const columns: Column<InquiryRow>[] = [
    {
      header: 'Customer',
      accessor: (row) => (
        <div className="min-w-[180px]">
          <div className="font-medium text-[#F5F0E8]">{row.name}</div>
          <div className="text-[11px] text-[#7A746B] font-mono">{row.email}</div>
          {row.phone && <div className="text-[10px] text-[#9B958B] font-mono">{row.phone}</div>}
        </div>
      ),
    },
    {
      header: 'Context / Subject',
      accessor: (row) => (
        <span className="text-xs text-[#D1CCC2]/90 max-w-xs truncate block">
          {row.subject || 'Bespoke Furniture Quote Request'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Received',
      accessor: (row) => (
        <span className="text-[11px] text-[#7A746B] font-mono whitespace-nowrap">
          {formatDate(row.created_at)} ({formatRelativeTime(row.created_at)})
        </span>
      ),
      className: 'hidden md:table-cell',
    },
  ]

  const renderActions = (row: InquiryRow) => (
    <button
      type="button"
      onClick={() => handleOpenDetail(row)}
      className="text-xs text-[#C9A84C] hover:text-[#E8B84B] font-mono font-semibold px-2.5 py-1.5 rounded hover:bg-[#171717] transition-colors"
    >
      Inspect &rarr;
    </button>
  )

  const tabs = [
    { key: 'all', label: 'All Inquiries' },
    { key: 'new', label: 'New' },
    { key: 'read', label: 'Read' },
    { key: 'replied', label: 'Replied' },
    { key: 'closed', label: 'Closed' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        variant="admin"
        title="Quote Inquiries"
        description="Review and manage customer enquiries, track consultation workflows, and record internal notes."
        badge={
          data?.totalCount !== undefined && data.totalCount > 0 ? (
            <span className="bg-[#C9A84C]/20 text-[#E8B84B] border border-[#C9A84C]/40 text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full">
              {data.totalCount} {data.totalCount === 1 ? 'Record' : 'Records'}
            </span>
          ) : undefined
        }
      />

      {/* Canonical Status Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-3 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = (activeStatus || 'all') === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={`px-3.5 py-1.5 rounded-none text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${isActive
                ? 'bg-[#171717] text-[#C9A84C] border border-[#C9A84C]/40 font-semibold shadow-sm'
                : 'text-[#9B958B] hover:text-[#F5F0E8] hover:bg-[#171717]/40'
                }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Inquiries DataTable */}
      <AdminDataTable<InquiryRow>
        columns={columns}
        data={data?.inquiries || []}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        onRetry={refetch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search inquiries by customer name, email, or phone..."
        emptyTitle="No inquiries in this view"
        emptyDescription="There are no quote requests matching your current status filter."
        renderActions={renderActions}
        keyExtractor={(row) => row.id}
      />

      {/* Detail Slide-Over Sheet */}
      <InquiryDetailSheet
        inquiry={selectedInquiry}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onUpdateInquiry={async (id, updates) => {
          await updateInquiry.mutateAsync({ id, ...updates })
        }}
      />
    </div>
  )
}

export default AdminInquiriesPage
