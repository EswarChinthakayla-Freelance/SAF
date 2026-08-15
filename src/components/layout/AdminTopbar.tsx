import React, { useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { GoldButton } from '@/components/brand/GoldButton'
import { useNewInquiryCount } from '@/hooks/queries/useInquiries'
import { useAuth } from '@/hooks/useAuth'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { AppBreadcrumb } from '@/components/common/AppBreadcrumb'
import { useAdminBreadcrumbContext } from '@/contexts/AdminBreadcrumbContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { AppBreadcrumbItem } from '@/types/app'

export const AdminTopbar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, adminProfile, signOut } = useAuth()
  const { data: newCount } = useNewInquiryCount()
  const { breadcrumbs: customBreadcrumbs } = useAdminBreadcrumbContext()
  const unreadCount = newCount || 0

  const displayName = adminProfile?.display_name || user?.email?.split('@')[0] || 'Administrator'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/admin/login')
    } catch (err) {
      console.error('Failed to sign out:', err)
    }
  }

  const defaultBreadcrumbs = useMemo<AppBreadcrumbItem[]>(() => {
    const p = location.pathname
    if (p === '/admin') {
      return [
        { label: 'Admin', href: '/admin' },
        { label: 'Dashboard', isCurrent: true },
      ]
    }
    if (p === '/admin/products/new') {
      return [
        { label: 'Admin', href: '/admin' },
        { label: 'Products', href: '/admin/products' },
        { label: 'Add Product', isCurrent: true },
      ]
    }
    if (p.startsWith('/admin/products/')) {
      return [
        { label: 'Admin', href: '/admin' },
        { label: 'Products', href: '/admin/products' },
        { label: 'Edit Product', isCurrent: true },
      ]
    }
    if (p.startsWith('/admin/products')) {
      return [
        { label: 'Admin', href: '/admin' },
        { label: 'Products', isCurrent: true },
      ]
    }
    if (p.startsWith('/admin/collections')) {
      return [
        { label: 'Admin', href: '/admin' },
        { label: 'Collections', isCurrent: true },
      ]
    }
    if (p.startsWith('/admin/gallery')) {
      return [
        { label: 'Admin', href: '/admin' },
        { label: 'Inspiration Gallery', isCurrent: true },
      ]
    }
    if (p.startsWith('/admin/inquiries')) {
      return [
        { label: 'Admin', href: '/admin' },
        { label: 'Quote Inquiries', isCurrent: true },
      ]
    }
    if (p.startsWith('/admin/settings')) {
      return [
        { label: 'Admin', href: '/admin' },
        { label: 'Brand Settings', isCurrent: true },
      ]
    }
    return [
      { label: 'Admin', href: '/admin' },
      { label: 'ACP', isCurrent: true },
    ]
  }, [location.pathname])

  const activeBreadcrumbs = customBreadcrumbs || defaultBreadcrumbs

  return (
    <header className="h-16 border-b border-[#2A2A2A] px-4 sm:px-8 flex items-center justify-between bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-30">
      {/* Skip to Main Content for Accessibility */}
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] px-4 py-2 bg-[#C9A84C] text-[#0A0A0A] font-semibold text-xs rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-300 transition-transform"
      >
        Skip to main content
      </a>

      {/* Left: Sidebar Trigger + Contextual Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="text-[#9B958B] hover:text-[#F5F0E8] hover:bg-[#1A1816] rounded-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] outline-none shrink-0" />
        <div className="min-w-0 flex-1">
          <AppBreadcrumb items={activeBreadcrumbs} />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Inquiries Notification Bell with numeric badge & accessible label */}
        <Link
          to="/admin/inquiries?status=new"
          aria-label={`${unreadCount} new quote inquiries`}
          className="relative p-2 text-[#9B958B] hover:text-[#F5F0E8] rounded-none transition-colors focus-visible:ring-2 focus-visible:ring-[#C9A84C] outline-none"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full bg-[#C9A84C] text-[#0A0A0A] font-bold text-[9px] leading-none">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>

        {/* Quick Add Product CTA */}
        <Link to="/admin/products/new" className="hidden sm:inline-flex">
          <GoldButton size="sm">+ New Product</GoldButton>
        </Link>

        {/* Account Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Open account menu"
            className="flex items-center gap-2 p-1.5 text-[#9B958B] hover:text-[#F5F0E8] bg-[#141414] hover:bg-[#1C1C1C] border border-[#2A2A2A] rounded-none transition-colors focus-visible:ring-2 focus-visible:ring-[#C9A84C] outline-none cursor-pointer"
          >
            <div className="w-6 h-6 rounded-none bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#E8B84B] font-mono text-[10px] font-bold flex items-center justify-center">
              {initials}
            </div>
            <span className="text-xs font-medium text-[#F5F0E8] hidden md:inline-block max-w-[120px] truncate">
              {displayName}
            </span>
            <svg className="w-3.5 h-3.5 text-[#7A746B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 bg-[#111111] border border-[#2A2A2A] text-[#F5F0E8] p-1.5">
            <div className="px-2 py-1.5">
              <div className="text-xs font-semibold text-[#F5F0E8] truncate">{displayName}</div>
              {user?.email && (
                <div className="text-[11px] font-mono text-[#7A746B] truncate">{user.email}</div>
              )}
            </div>

            <DropdownMenuSeparator className="bg-[#2A2A2A] my-1" />

            <DropdownMenuItem
              onClick={() => navigate('/admin/settings')}
              className="px-2 py-1.5 text-xs text-[#D1CCC2] hover:text-[#F5F0E8] hover:bg-[#1C1C1C] cursor-pointer flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Brand Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-[#2A2A2A] my-1" />

            <DropdownMenuItem
              onClick={handleSignOut}
              className="px-2 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 cursor-pointer flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default AdminTopbar
