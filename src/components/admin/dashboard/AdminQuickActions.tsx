import React from 'react'
import { Link } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  PlusSignIcon,
  Mail01Icon,
  Image01Icon,
  Layers01Icon,
  Settings02Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons'

export interface QuickActionItem {
  label: string
  description: string
  href: string
  icon: React.ReactNode
}

export const AdminQuickActions: React.FC<{ className?: string }> = ({ className = '' }) => {
  const actions: QuickActionItem[] = [
    {
      label: 'Add Product',
      description: 'Create catalogue details, pricing and media.',
      href: '/admin/products/new',
      icon: <HugeiconsIcon icon={PlusSignIcon} className="w-4 h-4 text-[#C9A84C]" />,
    },
    {
      label: 'Review Inquiries',
      description: 'Track customer enquiries and update status.',
      href: '/admin/inquiries',
      icon: <HugeiconsIcon icon={Mail01Icon} className="w-4 h-4 text-[#9B958B]" />,
    },
    {
      label: 'Upload Gallery Images',
      description: 'Add room photography and inspiration media.',
      href: '/admin/gallery',
      icon: <HugeiconsIcon icon={Image01Icon} className="w-4 h-4 text-[#9B958B]" />,
    },
    {
      label: 'Manage Collections',
      description: 'Organize suites, cover images and visibility.',
      href: '/admin/collections',
      icon: <HugeiconsIcon icon={Layers01Icon} className="w-4 h-4 text-[#9B958B]" />,
    },
    {
      label: 'Brand Settings',
      description: 'Update showroom hours, contacts and addresses.',
      href: '/admin/settings',
      icon: <HugeiconsIcon icon={Settings02Icon} className="w-4 h-4 text-[#9B958B]" />,
    },
  ]

  return (
    <div
      className={`bg-[#111111] border border-[#242424] rounded-lg p-5 flex flex-col justify-between shadow-sm ${className}`}
    >
      <div className="space-y-3">
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
          <h2 className="text-xs font-semibold font-sans uppercase tracking-wider text-[#F5F0E8]">
            Quick Actions
          </h2>
          <span className="text-[11px] font-sans text-[#7A746B]">
            Frequent Operations
          </span>
        </div>

        {/* Action Rows */}
        <div className="divide-y divide-[#1C1C1C]">
          {actions.map((action) => (
            <Link
              key={action.href}
              to={action.href}
              className="flex items-center justify-between py-2.5 px-2.5 rounded hover:bg-[#181818] transition-colors group min-h-[48px]"
            >
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <div className="w-7 h-7 rounded bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center shrink-0 group-hover:border-[#C9A84C]/40 transition-colors">
                  {action.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium font-sans text-[#F5F0E8] group-hover:text-[#E8B84B] transition-colors">
                    {action.label}
                  </div>
                  <div className="text-[11px] text-[#7A746B] font-sans truncate hidden sm:block">
                    {action.description}
                  </div>
                </div>
              </div>

              <span className="text-[#666158] group-hover:text-[#C9A84C] group-hover:translate-x-0.5 transition-all shrink-0">
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminQuickActions
