import React, { useState } from 'react'
import { DashboardHeader } from '@/components/admin/dashboard/DashboardHeader'
import { DashboardStats } from '@/components/admin/dashboard/DashboardStats'
import { DashboardAttention } from '@/components/admin/dashboard/DashboardAttention'
import { AdminQuickActions } from '@/components/admin/dashboard/AdminQuickActions'
import { RecentInquiries } from '@/components/admin/dashboard/RecentInquiries'
import { InquiryDetailSheet } from '@/components/admin/InquiryDetailSheet'
import { useDashboardMetrics } from '@/hooks/queries/useDashboard'
import { useRecentInquiries } from '@/hooks/queries/useInquiries'
import { useInquiryMutations } from '@/hooks/mutations/useInquiryMutations'
import type { InquiryRow } from '@/types/app'

/**
 * AdminDashboardPage — "The Operations Desk"
 * Purpose-built professional management interface for Sri Anjaneya Furnitures.
 * Structured into 4 operational regions:
 * 1. Compact Dashboard Header + Action Bar
 * 2. Operational Summary (4 Core KPIs)
 * 3. Attention Panel & Quick Actions List
 * 4. Recent Inquiries (Desktop Table + Mobile Cards)
 */
export const AdminDashboardPage: React.FC = () => {
  const {
    data: metrics,
    isLoading: isMetricsLoading,
    refetch: refetchMetrics,
    isFetching: isFetchingMetrics,
  } = useDashboardMetrics()

  const {
    data: recentInquiries,
    isLoading: isInquiriesLoading,
    isError: isInquiriesError,
    refetch: refetchInquiries,
    isFetching: isFetchingInquiries,
  } = useRecentInquiries(10)

  const { updateInquiry } = useInquiryMutations()

  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRow | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleRefresh = async () => {
    await Promise.all([refetchMetrics(), refetchInquiries()])
  }

  const handleOpenDetail = (inquiry: InquiryRow) => {
    setSelectedInquiry(inquiry)
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setSelectedInquiry(null)
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-[1600px] w-full mx-auto select-none">
      {/* 1. Compact Operations Header */}
      <DashboardHeader
        onRefresh={handleRefresh}
        isRefreshing={isFetchingMetrics || isFetchingInquiries}
      />

      {/* 2. Operational Summary (4 Core Source KPIs) */}
      <section aria-label="Operational Summary">
        <DashboardStats
          metrics={metrics}
          isLoading={isMetricsLoading}
        />
      </section>

      {/* 3. Attention & Quick Actions Grid */}
      <section
        aria-label="Attention and Quick Operations"
        className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch"
      >
        {/* Left: Needs Attention Panel */}
        <DashboardAttention
          newInquiriesCount={metrics?.newInquiries7Days ?? 0}
          totalProducts={metrics?.totalProducts ?? 0}
          className="lg:col-span-6 xl:col-span-5 h-full"
        />

        {/* Right: Quick Actions List */}
        <AdminQuickActions className="lg:col-span-6 xl:col-span-7 h-full" />
      </section>

      {/* 4. Recent Inquiries (Latest 10 Records) */}
      <section aria-label="Recent Inquiries">
        <RecentInquiries
          inquiries={recentInquiries}
          isLoading={isInquiriesLoading}
          isError={isInquiriesError}
          onRetry={refetchInquiries}
          onSelectInquiry={handleOpenDetail}
        />
      </section>

      {/* Inquiry Detail Slide-Over Sheet */}
      <InquiryDetailSheet
        inquiry={selectedInquiry}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onUpdateInquiry={async (id: string, updates) => {
          await updateInquiry.mutateAsync({ id, ...updates })
        }}
      />
    </div>
  )
}

export default AdminDashboardPage
