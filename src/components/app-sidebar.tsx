import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LogoBrand } from '@/components/brand/LogoBrand'
import { useAuth } from '@/hooks/useAuth'
import { useNewInquiryCount } from '@/hooks/queries/useInquiries'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  DashboardSquare01Icon,
  PackageIcon,
  Folder01Icon,
  Image01Icon,
  Mail01Icon,
  Settings02Icon,
  LogoutIcon,
  Globe02Icon,
  PlusSignIcon,
} from '@hugeicons/core-free-icons'

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onNavigate?: () => void
}

/**
 * AppSidebar for Sri Anjaneya Furnitures Admin Control Panel.
 * Perfectly centered in collapsed icon mode and aligned h-16 header border with AdminTopbar.
 */
export function AppSidebar({ onNavigate, ...props }: AppSidebarProps) {
  const location = useLocation()
  const { user, adminProfile, signOut } = useAuth()
  const { data: newInquiryCount } = useNewInquiryCount()

  const navItems = [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: DashboardSquare01Icon,
      exact: true,
    },
    {
      title: 'Products',
      url: '/admin/products',
      icon: PackageIcon,
      exact: false,
    },
    {
      title: 'Collections',
      url: '/admin/collections',
      icon: Folder01Icon,
      exact: false,
    },
    {
      title: 'Inspiration Gallery',
      url: '/admin/gallery',
      icon: Image01Icon,
      exact: false,
    },
    {
      title: 'Quote Inquiries',
      url: '/admin/inquiries',
      icon: Mail01Icon,
      exact: false,
      badge: (newInquiryCount || 0) > 0 ? (newInquiryCount || 0) : undefined,
    },
    {
      title: 'Brand Settings',
      url: '/admin/settings',
      icon: Settings02Icon,
      exact: false,
    },
  ]

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      {...props}
      className="border-r border-[#2A2A2A] bg-[#111111] text-[#F5F0E8]"
    >
      {/* 1. Header (h-16 matches AdminTopbar height exactly, centered in icon mode) */}
      <SidebarHeader className="h-16 px-4 group-data-[collapsible=icon]:px-0 border-b border-[#2A2A2A] bg-[#111111] flex items-center justify-between group-data-[collapsible=icon]:justify-center shrink-0">
        <SidebarMenu className="w-full group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <Link
              to="/admin"
              onClick={onNavigate}
              className="flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded-none overflow-hidden group-data-[collapsible=icon]:justify-center w-full"
            >
              <div className="flex items-center justify-center shrink-0">
                <LogoBrand size={32} variant="admin" showText={false} to="" />
              </div>
              <div className="flex items-center justify-between flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <div className="flex flex-col leading-none">
                  <span className="font-serif font-semibold text-sm text-[#F5F0E8] tracking-wide truncate">
                    Sri Anjaneya
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#9B958B] font-sans font-medium mt-0.5">
                    Furnitures
                  </span>
                </div>
                <span className="text-[9px] bg-[#C9A84C]/10 text-[#E8B84B] font-mono px-1.5 py-0.5 rounded border border-[#C9A84C]/30 font-semibold tracking-wider ml-2 shrink-0">
                  ACP
                </span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* 2. Navigation Content */}
      <SidebarContent className="px-3 group-data-[collapsible=icon]:px-0 py-4 space-y-5 group-data-[collapsible=icon]:space-y-3 bg-[#111111]">
        <SidebarGroup className="p-0 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:items-center">
          <SidebarGroupLabel className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#7A746B] px-2.5 mb-1.5 font-medium group-data-[collapsible=icon]:hidden">
            Management
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:w-full">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.url
                : location.pathname.startsWith(item.url)

              return (
                <SidebarMenuItem key={item.url} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.title}
                    render={
                      <Link
                        to={item.url}
                        onClick={onNavigate}
                        className={`flex items-center gap-3 px-3 py-2 rounded-none text-xs font-medium transition-all group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-none ${isActive
                          ? 'bg-[#C9A84C]/15 text-[#E8B84B] border border-[#C9A84C]/35 font-semibold shadow-[0_0_12px_rgba(201,168,76,0.12)]'
                          : 'text-[#9B958B] hover:text-[#F5F0E8] hover:bg-[#1A1816]'
                          }`}
                      />
                    }
                  >
                    <HugeiconsIcon
                      icon={item.icon}
                      strokeWidth={2}
                      className={`size-4 shrink-0 transition-colors ${isActive ? 'text-[#E8B84B]' : 'text-[#7A746B]'
                        }`}
                    />
                    <span className="flex-1 truncate group-data-[collapsible=icon]:hidden font-sans">
                      {item.title}
                    </span>
                    {item.badge !== undefined && (
                      <SidebarMenuBadge className="bg-[#C9A84C] text-[#0A0A0A] font-bold text-[10px] px-1.5 py-0.5 rounded-full group-data-[collapsible=icon]:hidden shadow-xs">
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup className="p-0 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:items-center">
          <SidebarGroupLabel className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#7A746B] px-2.5 mb-1.5 font-medium group-data-[collapsible=icon]:hidden">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:w-full">
            <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
              <SidebarMenuButton
                tooltip="Add Product"
                render={
                  <Link
                    to="/admin/products/new"
                    onClick={onNavigate}
                    className="flex items-center gap-3 px-3 py-2 rounded-none text-xs font-semibold text-[#E8B84B] bg-[#C9A84C]/10 hover:bg-[#C9A84C]/20 border border-[#C9A84C]/30 transition-all group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-none"
                  />
                }
              >
                <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-4 text-[#E8B84B] shrink-0" />
                <span className="truncate group-data-[collapsible=icon]:hidden font-sans">+ Add Product</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
              <SidebarMenuButton
                tooltip="Public Storefront"
                render={
                  <Link
                    to="/"
                    target="_blank"
                    className="flex items-center gap-3 px-3 py-2 rounded-none text-xs font-medium text-[#9B958B] hover:text-[#F5F0E8] hover:bg-[#1A1816] transition-all group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-none"
                  />
                }
              >
                <HugeiconsIcon icon={Globe02Icon} strokeWidth={2} className="size-4 text-[#7A746B] shrink-0" />
                <span className="truncate group-data-[collapsible=icon]:hidden font-sans">Public Storefront ↗</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* 3. Session & User Footer */}
      <SidebarFooter className="h-16 px-3 group-data-[collapsible=icon]:px-0 border-t border-[#2A2A2A] bg-[#0A0A0A]/80 flex items-center justify-between group-data-[collapsible=icon]:justify-center shrink-0">
        <div className="flex items-center gap-2.5 px-1 py-1 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div
            title={adminProfile?.display_name || user?.email || 'Administrator'}
            className="w-8 h-8 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center text-[#E8B84B] font-serif text-xs font-bold shrink-0 shadow-xs"
          >
            {(adminProfile?.display_name || user?.email || 'A').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <div className="text-xs text-[#F5F0E8] font-medium truncate font-sans">
              {adminProfile?.display_name || user?.email || 'Administrator'}
            </div>
            <div className="text-[10px] text-[#7A746B] truncate font-mono">
              {user?.email || 'Authorized'}
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            title="Sign Out"
            aria-label="Sign Out"
            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-none transition-colors cursor-pointer group-data-[collapsible=icon]:hidden"
          >
            <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} className="size-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
