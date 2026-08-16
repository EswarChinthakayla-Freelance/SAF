import React from 'react'
import { AdminStatCard } from '@/components/admin/AdminStatCard'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  PackageIcon,
  Layers01Icon,
  Image01Icon,
  Mail01Icon,
} from '@hugeicons/core-free-icons'
import type { DashboardMetrics } from '@/hooks/queries/useDashboard'

export interface DashboardStatsProps {
  metrics?: DashboardMetrics
  isLoading?: boolean
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  metrics,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="h-[142px] bg-[#111111] border border-[#242424] rounded-none p-5 flex flex-col justify-between animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="w-24 h-3 bg-[#1F1F1F] rounded" />
              <div className="w-8 h-8 bg-[#1F1F1F] rounded" />
            </div>
            <div className="w-16 h-8 bg-[#1F1F1F] rounded" />
            <div className="w-32 h-3 bg-[#1F1F1F] rounded" />
          </div>
        ))}
      </div>
    )
  }

  const totalProducts = metrics?.totalProducts ?? 0
  const activeCollections = metrics?.activeCollections ?? 0
  const activeGalleryImages = metrics?.activeGalleryImages ?? 0
  const newInquiries = metrics?.newInquiries7Days ?? 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. Total Products */}
      <AdminStatCard
        label="Total Products"
        value={totalProducts}
        context={totalProducts === 0 ? 'No products yet' : 'Published and draft products'}
        href="/admin/products"
        icon={<HugeiconsIcon icon={PackageIcon} className="w-4 h-4" />}
      />

      {/* 2. Active Collections */}
      <AdminStatCard
        label="Active Collections"
        value={activeCollections}
        context={activeCollections === 0 ? 'No active collections' : 'Collections currently visible'}
        href="/admin/collections"
        icon={<HugeiconsIcon icon={Layers01Icon} className="w-4 h-4" />}
      />

      {/* 3. Active Gallery Images */}
      <AdminStatCard
        label="Active Gallery Images"
        value={activeGalleryImages}
        context={activeGalleryImages === 0 ? 'No active gallery images' : 'Images currently visible'}
        href="/admin/gallery"
        icon={<HugeiconsIcon icon={Image01Icon} className="w-4 h-4" />}
      />

      {/* 4. New Inquiries */}
      <AdminStatCard
        label="New Inquiries"
        value={newInquiries}
        context={newInquiries > 0 ? 'New in the last 7 days' : 'No new enquiries'}
        needsAttention={newInquiries > 0}
        attentionLabel="Needs attention"
        href={newInquiries > 0 ? '/admin/inquiries?status=new' : '/admin/inquiries'}
        icon={<HugeiconsIcon icon={Mail01Icon} className="w-4 h-4" />}
      />
    </div>
  )
}

export default DashboardStats
