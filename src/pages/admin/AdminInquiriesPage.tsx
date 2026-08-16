import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { PageMeta } from '@/components/seo/PageMeta'
import { InquiryWorkflowRail } from '@/components/admin/inquiries/InquiryWorkflowRail'
import { InquiryCommandBar } from '@/components/admin/inquiries/InquiryCommandBar'
import { InquiryTable } from '@/components/admin/inquiries/InquiryTable'
import { InquiryMobileList } from '@/components/admin/inquiries/InquiryMobileList'
import { InquiryPagination } from '@/components/admin/inquiries/InquiryPagination'
import { InquiryDetailSheet } from '@/components/admin/InquiryDetailSheet'
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useInquiries, useInquiryStatusCounts } from '@/hooks/queries/useInquiries'
import { useInquiryMutations } from '@/hooks/mutations/useInquiryMutations'
import { INQUIRY_STATUSES, SEARCH_CONSTRAINTS, type InquiryStatus } from '@/lib/constants'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowLeft01Icon,
  Mail01Icon,
  AlertCircleIcon,
  Search01Icon,
} from '@hugeicons/core-free-icons'
import type { AdminInquiryListItem } from '@/types/app'

export const AdminInquiriesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // 1. Parse and Validate Status Filter from URL
  const rawStatus = searchParams.get('status') || 'all'
  const activeStatus: InquiryStatus | 'all' = INQUIRY_STATUSES.includes(
    rawStatus as InquiryStatus
  )
    ? (rawStatus as InquiryStatus)
    : 'all'

  // 2. Parse Search Query & Sort from URL
  const urlQuery = searchParams.get('q') || ''
  const urlPage = parseInt(searchParams.get('page') || '1', 10)
  const [searchQuery, setSearchQuery] = useState(urlQuery)
  const [debouncedSearch, setDebouncedSearch] = useState(urlQuery)
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest')

  // 3. Selection & Detail Sheet State
  const [selectedInquiry, setSelectedInquiry] = useState<AdminInquiryListItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [inquiryToDelete, setInquiryToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Debounce search input and update URL ?q=
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchQuery.trim()
      setDebouncedSearch(trimmed)

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (trimmed) {
            next.set('q', trimmed)
          } else {
            next.delete('q')
          }
          next.delete('page') // Reset page on new search
          return next
        },
        { replace: true }
      )
    }, SEARCH_CONSTRAINTS.DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [searchQuery, setSearchParams])

  // Current page derived from URL (clamped to >= 1)
  const page = useMemo(() => (isNaN(urlPage) || urlPage < 1 ? 1 : urlPage), [urlPage])

  // 4. Fetch Paginated Inquiries
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useInquiries({
    status: activeStatus !== 'all' ? activeStatus : undefined,
    searchQuery: debouncedSearch || undefined,
    page,
    pageSize: 20,
    sort,
  })

  // 5. Fetch Canonical Status Counts for the Workflow Rail
  const { data: counts, isLoading: isLoadingCounts } = useInquiryStatusCounts()

  // 6. Mutations
  const { updateInquiry, deleteInquiry } = useInquiryMutations()

  // Handle Tab Switch
  const handleStatusChange = (statusKey: InquiryStatus | 'all') => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (statusKey === 'all') {
          next.delete('status')
        } else {
          next.set('status', statusKey)
        }
        next.delete('page') // Reset page
        return next
      },
      { replace: true }
    )
  }

  // Handle Page Change
  const handlePageChange = (newPage: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (newPage > 1) {
          next.set('page', String(newPage))
        } else {
          next.delete('page')
        }
        return next
      },
      { replace: true }
    )
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle Open Detail Sheet
  const handleOpenDetail = useCallback(
    (inquiry: AdminInquiryListItem) => {
      setSelectedInquiry(inquiry)
      setIsDetailOpen(true)

      // Automatic transition from 'new' -> 'read' on first inspection
      if (inquiry.status === 'new') {
        updateInquiry.mutate({
          id: inquiry.id,
          status: 'read',
        })
      }
    },
    [updateInquiry]
  )

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setSelectedInquiry(null)
  }

  // Navigation through loaded records inside the Sheet
  const inquiriesList = data?.inquiries || []
  const selectedIndex = selectedInquiry
    ? inquiriesList.findIndex((item) => item.id === selectedInquiry.id)
    : -1
  const hasPrevious = selectedIndex > 0
  const hasNext = selectedIndex >= 0 && selectedIndex < inquiriesList.length - 1

  const handlePreviousInquiry = () => {
    if (hasPrevious) {
      handleOpenDetail(inquiriesList[selectedIndex - 1])
    }
  }

  const handleNextInquiry = () => {
    if (hasNext) {
      handleOpenDetail(inquiriesList[selectedIndex + 1])
    }
  }

  // Handle Status Update from Sheet
  const handleUpdateStatus = async (id: string, newStatus: InquiryStatus) => {
    await updateInquiry.mutateAsync({
      id,
      status: newStatus,
    })
    // Update local selected object
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  // Handle Notes Save from Sheet
  const handleSaveNotes = async (id: string, notes: string) => {
    await updateInquiry.mutateAsync({
      id,
      admin_notes: notes,
    })
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, admin_notes: notes } : null))
    }
  }

  // Handle Delete Inquiry Flow
  const handleDeleteTrigger = (id: string) => {
    setInquiryToDelete(id)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!inquiryToDelete) return
    setIsDeleting(true)
    try {
      await deleteInquiry.mutateAsync(inquiryToDelete)
      setShowDeleteDialog(false)
      setInquiryToDelete(null)
      if (selectedInquiry?.id === inquiryToDelete) {
        handleCloseDetail()
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto pb-16 font-sans">
      <PageMeta
        title="Inquiries | Sri Anjaneya Furnitures Admin"
        description="Review customer quote and contact enquiries, manage status workflows and record consultation notes."
      />

      {/* Admin Topbar + Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-sans text-[#7A746B]">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-[#9B958B] hover:text-[#C9A84C] transition-colors py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C]"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5" />
          <span>Admin</span>
        </Link>
        <span className="text-[#4A4A4A]">/</span>
        <span className="text-[#F5F0E8] font-medium">Inquiries</span>
      </nav>

      {/* Compact Page Header (Inter Semibold, No Giant Serif) */}
      <header className="space-y-1 pt-1">
        <h1 className="text-2xl sm:text-3xl font-sans font-semibold text-[#F5F0E8] tracking-tight">
          Inquiries
        </h1>
        <p className="text-xs sm:text-sm font-sans text-[#9B958B]">
          Review customer quote and contact enquiries, update their status and keep internal notes.
        </p>
      </header>

      {/* The Inquiry Workflow Rail (Status Tabs with Live Counts) */}
      <InquiryWorkflowRail
        activeStatus={activeStatus}
        onStatusChange={handleStatusChange}
        counts={counts}
        isLoadingCounts={isLoadingCounts}
      />

      {/* The Inbox Command Bar (Search, Sort, Grammatical Result Count) */}
      <InquiryCommandBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
        sort={sort}
        onSortChange={setSort}
        totalCount={data?.totalCount || 0}
        activeStatus={activeStatus}
        onRefresh={() => refetch()}
        isRefreshing={isFetching && !isLoading}
      />

      {/* Main Conversation List / Table Section */}
      <main aria-label="Customer inquiries" className="space-y-4">
        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className="h-16 bg-[#111111] border border-[#222222] rounded p-4 flex items-center justify-between animate-pulse"
              >
                <div className="space-y-2 w-1/3">
                  <Skeleton className="h-3.5 bg-[#1E1E1E] w-3/4 rounded" />
                  <Skeleton className="h-2.5 bg-[#1A1A1A] w-1/2 rounded" />
                </div>
                <Skeleton className="h-3.5 bg-[#1E1E1E] w-1/4 rounded hidden sm:block" />
                <Skeleton className="h-6 bg-[#1E1E1E] w-16 rounded" />
              </div>
            ))}
          </div>
        ) : isError ? (
          /* Error State */
          <div className="p-8 text-center bg-[#141010] border border-red-900/30 rounded-none space-y-3">
            <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-800/40 text-red-400 mx-auto flex items-center justify-center">
              <HugeiconsIcon icon={AlertCircleIcon} className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-[#F5F0E8]">
                We couldn't load inquiries
              </h2>
              <p className="text-xs text-[#8A847A]">
                {error?.message || 'A network error occurred while retrieving customer enquiries.'}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="h-8 px-4 text-xs bg-[#1C1C1C] border-[#2E2E2E] text-[#F5F0E8] hover:bg-[#242424]"
            >
              Try Again
            </Button>
          </div>
        ) : inquiriesList.length === 0 ? (
          /* Empty States */
          <div className="p-12 text-center bg-[#0F0F0F] border border-[#222222] rounded-none space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#161616] border border-[#2A2A2A] text-[#C9A84C] mx-auto flex items-center justify-center">
              {debouncedSearch ? (
                <HugeiconsIcon icon={Search01Icon} className="w-6 h-6" />
              ) : (
                <HugeiconsIcon icon={Mail01Icon} className="w-6 h-6" />
              )}
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-semibold text-[#F5F0E8]">
                {debouncedSearch
                  ? `No enquiries match “${debouncedSearch}”`
                  : activeStatus !== 'all'
                    ? `No ${activeStatus} enquiries`
                    : 'No enquiries yet'}
              </h2>
              <p className="text-xs text-[#8A847A] max-w-sm mx-auto">
                {debouncedSearch
                  ? 'Try checking for spelling errors or searching with a different contact name, email, or phone number.'
                  : activeStatus !== 'all'
                    ? `There are currently no enquiries marked with status “${activeStatus}”.`
                    : 'New customer quote and bespoke consultation enquiries will appear here.'}
              </p>
            </div>

            {(debouncedSearch || activeStatus !== 'all') && (
              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    handleStatusChange('all')
                  }}
                  className="h-8 px-4 text-xs bg-[#1A1A1A] border-[#2E2E2E] text-[#D1CCC2] hover:text-[#F5F0E8] hover:bg-[#222222] rounded"
                >
                  View All Enquiries
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Data Displays (Desktop Table + Mobile Cards) */
          <>
            {/* Desktop / Tablet Conversation Table (hidden on mobile <640px) */}
            <div className="hidden sm:block">
              <InquiryTable
                inquiries={inquiriesList}
                selectedId={selectedInquiry?.id}
                onSelectInquiry={handleOpenDetail}
              />
            </div>

            {/* Mobile Touch-Friendly Conversation Rows (<640px) */}
            <InquiryMobileList
              inquiries={inquiriesList}
              selectedId={selectedInquiry?.id}
              onSelectInquiry={handleOpenDetail}
            />

            {/* Pagination Controls */}
            {data && (
              <InquiryPagination
                currentPage={data.currentPage}
                totalPages={data.totalPages}
                totalCount={data.totalCount}
                pageSize={20}
                onPageChange={handlePageChange}
                disabled={isFetching}
              />
            )}
          </>
        )}
      </main>

      {/* Right-Side Inquiry Detail Sheet */}
      <InquiryDetailSheet
        inquiry={selectedInquiry}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onUpdateStatus={handleUpdateStatus}
        onSaveNotes={handleSaveNotes}
        onDeleteInquiry={handleDeleteTrigger}
        onPrevious={handlePreviousInquiry}
        onNext={handleNextInquiry}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        currentIndex={selectedIndex >= 0 ? selectedIndex : undefined}
        totalInquiries={inquiriesList.length}
        isUpdatingStatus={updateInquiry.isPending}
        isSavingNotes={updateInquiry.isPending}
      />

      {/* Secondary Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={showDeleteDialog}
        recordType="Customer Inquiry"
        recordName={selectedInquiry?.name || 'Inquiry'}
        consequenceMessage="This will permanently remove this customer enquiry and all internal consultation notes. Associated catalogue products will not be affected."
        confirmLabel="Delete Enquiry"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteDialog(false)
          setInquiryToDelete(null)
        }}
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default AdminInquiriesPage
