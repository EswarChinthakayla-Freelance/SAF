import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { AdminStatCard } from '@/components/admin/AdminStatCard'
import { InquiryDetailSheet } from '@/components/admin/InquiryDetailSheet'
import { useDashboardMetrics } from '@/hooks/queries/useDashboard'
import { useRecentInquiries } from '@/hooks/queries/useInquiries'
import { useInquiryMutations } from '@/hooks/mutations/useInquiryMutations'
import { formatDate, formatRelativeTime } from '@/utils/dates'
import { GoldButton } from '@/components/brand/GoldButton'
import type { InquiryRow } from '@/types/app'

export const AdminDashboardPage: React.FC = () => {
  const { data: metrics, isLoading: isMetricsLoading } = useDashboardMetrics()

  const {
    data: recentInquiries,
    isLoading: isInquiriesLoading,
    isError: isInquiriesError,
    refetch: refetchInquiries,
  } = useRecentInquiries(10)

  const { updateInquiry } = useInquiryMutations()

  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRow | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleOpenDetail = (inquiry: InquiryRow) => {
    setSelectedInquiry(inquiry)
    setIsDetailOpen(true)
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        variant="admin"
        title="Dashboard Overview"
        description="Real-time catalogue overview, quote inquiry inbox, and brand management shortcuts."
        actions={
          <Link to="/admin/products/new">
            <GoldButton size="sm" className="text-xs uppercase tracking-wider">
              + Add Product
            </GoldButton>
          </Link>
        }
      />

      {/* 4 Required KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AdminStatCard
          label="Total Products"
          value={isMetricsLoading ? '—' : metrics?.totalProducts ?? 0}
          context="Published & Draft pieces"
          icon={
            <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />

        <AdminStatCard
          label="Active Collections"
          value={isMetricsLoading ? '—' : metrics?.activeCollections ?? 0}
          context="Visible room categories"
          icon={
            <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />

        <AdminStatCard
          label="Active Gallery Images"
          value={isMetricsLoading ? '—' : metrics?.activeGalleryImages ?? 0}
          context="Inspiration catalogue"
          icon={
            <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />

        <AdminStatCard
          label="New Inquiries"
          value={isMetricsLoading ? '—' : metrics?.newInquiries7Days ?? 0}
          context="Last 7 days volume"
          icon={
            <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Link
          to="/admin/products/new"
          className="p-5 rounded-none bg-[#111111] border border-[#2A2A2A] hover:border-[#C9A84C]/40 transition-all space-y-1.5 block group"
        >
          <div className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest font-semibold flex items-center justify-between">
            <span>Catalogue</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
          <h3 className="text-sm font-serif font-bold text-[#F5F0E8]">Add Catalogue Piece</h3>
          <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
            Configure dimensions, materials, variants, and high-res media.
          </p>
        </Link>

        <Link
          to="/admin/inquiries"
          className="p-5 rounded-none bg-[#111111] border border-[#2A2A2A] hover:border-[#C9A84C]/40 transition-all space-y-1.5 block group"
        >
          <div className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest font-semibold flex items-center justify-between">
            <span>Inbox</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
          <h3 className="text-sm font-serif font-bold text-[#F5F0E8]">Review Quote Inquiries</h3>
          <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
            Track workflow statuses, update admin notes, and log client quotes.
          </p>
        </Link>

        <Link
          to="/admin/gallery"
          className="p-5 rounded-none bg-[#111111] border border-[#2A2A2A] hover:border-[#C9A84C]/40 transition-all space-y-1.5 block group"
        >
          <div className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest font-semibold flex items-center justify-between">
            <span>Media</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
          <h3 className="text-sm font-serif font-bold text-[#F5F0E8]">Inspiration Gallery</h3>
          <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
            Organize room types, upload bulk imagery, and connect pieces.
          </p>
        </Link>
      </div>

      {/* Recent Inquiries (Latest 10 Inquiries) */}
      <div className="bg-[#111111] rounded-none border border-[#2A2A2A] overflow-hidden shadow-sm space-y-0">
        <div className="px-6 py-4 border-b border-[#2A2A2A] flex items-center justify-between">
          <div>
            <h2 className="text-base font-serif font-bold text-[#F5F0E8]">Recent Inquiries</h2>
            <p className="text-xs text-[#9B958B]">Latest customer inquiries and quote requests</p>
          </div>
          <Link
            to="/admin/inquiries"
            className="text-xs text-[#C9A84C] hover:text-[#E8B84B] font-mono uppercase tracking-wider flex items-center gap-1 font-semibold"
          >
            <span>View All</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {isInquiriesLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="h-10 bg-[#171717] rounded-none animate-pulse" />
            ))}
          </div>
        ) : isInquiriesError ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-xs text-red-400">Failed to load recent inquiries.</p>
            <GoldButton onClick={() => refetchInquiries()} size="sm">
              Try Again
            </GoldButton>
          </div>
        ) : !recentInquiries || recentInquiries.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#9B958B] font-light">
            No quote inquiries received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#F5F0E8]">
              <thead className="bg-[#171717] text-[#9B958B] uppercase tracking-wider font-mono border-b border-[#2A2A2A]">
                <tr>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Subject / Context</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Received</th>
                  <th className="px-6 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {recentInquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    onClick={() => handleOpenDetail(inquiry)}
                    className="hover:bg-[#171717]/60 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <div className="font-medium text-[#F5F0E8]">{inquiry.name}</div>
                      <div className="text-[11px] text-[#7A746B] font-mono">{inquiry.email}</div>
                    </td>
                    <td className="px-6 py-3.5 max-w-xs truncate text-[#D1CCC2]/90">
                      {inquiry.subject || 'Bespoke Furniture Quote Request'}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      {getStatusBadge(inquiry.status)}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-[#9B958B] font-mono text-[11px]">
                      {formatDate(inquiry.created_at)} ({formatRelativeTime(inquiry.created_at)})
                    </td>
                    <td className="px-6 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenDetail(inquiry)
                        }}
                        className="text-xs text-[#C9A84C] hover:text-[#E8B84B] font-mono font-semibold"
                      >
                        Inspect &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail Slide-Over Sheet */}
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

export default AdminDashboardPage
