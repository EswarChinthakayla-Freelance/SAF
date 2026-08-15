import React from 'react'
import { Outlet } from 'react-router-dom'
import { AppSidebar } from '@/components/app-sidebar'
import { AdminTopbar } from './AdminTopbar'
import { ScrollToTop } from '@/components/common/ScrollToTop'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AdminBreadcrumbProvider } from '@/contexts/AdminBreadcrumbContext'
import { RouteTransition } from '@/components/common/RouteTransition'

export const AdminLayout: React.FC = () => {
  return (
    <AdminBreadcrumbProvider>
      <SidebarProvider defaultOpen={true}>
        <ScrollToTop />
        <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] flex w-full font-sans relative">
          {/* Accessible Skip Link for Admin */}
          <a
            href="#admin-main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#171717] text-[#C9A84C] border border-[#C9A84C] font-mono text-xs font-semibold shadow-2xl focus-ring-gold"
          >
            Skip to admin content
          </a>

          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#0A0A0A]">
            <AdminTopbar />
            <main
              id="admin-main-content"
              tabIndex={-1}
              className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto focus:outline-none flex flex-col"
            >
              <RouteTransition variant="admin">
                <Outlet />
              </RouteTransition>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AdminBreadcrumbProvider>
  )
}

export default AdminLayout
