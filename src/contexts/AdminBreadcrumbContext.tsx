import React, { createContext, useContext, useState, useEffect } from 'react'
import type { AppBreadcrumbItem } from '@/types/app'

interface AdminBreadcrumbContextType {
  breadcrumbs: AppBreadcrumbItem[] | null
  setBreadcrumbs: (items: AppBreadcrumbItem[] | null) => void
}

const AdminBreadcrumbContext = createContext<AdminBreadcrumbContextType>({
  breadcrumbs: null,
  setBreadcrumbs: () => {},
})

export const AdminBreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<AppBreadcrumbItem[] | null>(null)

  return (
    <AdminBreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </AdminBreadcrumbContext.Provider>
  )
}

/**
 * Hook to set custom topbar breadcrumbs from within an Admin page.
 * Automatically clears breadcrumbs when the component unmounts.
 */
export function useSetAdminBreadcrumbs(items?: AppBreadcrumbItem[] | null) {
  const { setBreadcrumbs } = useContext(AdminBreadcrumbContext)

  useEffect(() => {
    if (items) {
      setBreadcrumbs(items)
    }
    return () => {
      setBreadcrumbs(null)
    }
  }, [items, setBreadcrumbs])
}

export function useAdminBreadcrumbContext() {
  return useContext(AdminBreadcrumbContext)
}
