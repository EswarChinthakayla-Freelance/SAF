import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { AppBreadcrumbItem } from '@/types/app'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'

export interface AppBreadcrumbProps {
  items: AppBreadcrumbItem[]
  className?: string
  /**
   * Maximum items visible on mobile before collapsing into an ellipsis dropdown.
   * Defaults to 3 (e.g. First -> ... -> Current)
   */
  maxMobileItems?: number
}

/**
 * Shared AppBreadcrumb component built on Shadcn UI primitives.
 * Supports responsive ellipsis collapsing on mobile, loading skeletons, and accessible React Router links.
 */
export const AppBreadcrumb: React.FC<AppBreadcrumbProps> = ({
  items,
  className = '',
  maxMobileItems = 3,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLLIElement>(null)

  // Close mobile dropdown on outside click or Escape key
  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileMenuOpen])

  if (!items || items.length === 0) {
    return null
  }

  // Mobile collapsing logic: if items count > maxMobileItems, collapse intermediate items
  const shouldCollapse = items.length > maxMobileItems
  const firstItem = items[0]
  const lastItem = items[items.length - 1]
  const intermediateItems = items.slice(1, items.length - 1)

  return (
    <Breadcrumb className={`select-none ${className}`}>
      {/* Desktop & Default List */}
      <BreadcrumbList className="hidden sm:flex items-center gap-1.5 text-xs text-[#9B958B]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.isCurrent

          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <BreadcrumbItem>
                {item.isLoading ? (
                  <Skeleton className="h-3.5 w-20 bg-stone-800 rounded" />
                ) : isLast ? (
                  <BreadcrumbPage className="font-medium text-[#F5F0E8] flex items-center">
                    <span
                      title={item.label}
                      className="max-w-[200px] md:max-w-[320px] lg:max-w-[420px] truncate inline-block align-bottom"
                    >
                      {item.label}
                    </span>
                  </BreadcrumbPage>
                ) : item.href ? (
                  <BreadcrumbLink
                    render={
                      <Link
                        to={item.href}
                        className="text-[#9B958B] hover:text-[#E8B84B] transition-colors focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded outline-none"
                      >
                        {item.label}
                      </Link>
                    }
                  />
                ) : (
                  <span className="text-[#9B958B]">{item.label}</span>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator className="text-[#555047]" />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>

      {/* Mobile Collapsed List */}
      <BreadcrumbList className="flex sm:hidden items-center gap-1 text-xs text-[#9B958B]">
        {!shouldCollapse ? (
          items.map((item, index) => {
            const isLast = index === items.length - 1 || item.isCurrent

            return (
              <React.Fragment key={`mobile-${item.label}-${index}`}>
                <BreadcrumbItem>
                  {item.isLoading ? (
                    <Skeleton className="h-3.5 w-16 bg-stone-800 rounded" />
                  ) : isLast ? (
                    <BreadcrumbPage className="font-medium text-[#F5F0E8]">
                      <span
                        title={item.label}
                        className="max-w-[150px] truncate inline-block align-bottom"
                      >
                        {item.mobileLabel || item.label}
                      </span>
                    </BreadcrumbPage>
                  ) : item.href ? (
                    <BreadcrumbLink
                      render={
                        <Link
                          to={item.href}
                          className="text-[#9B958B] hover:text-[#E8B84B] transition-colors"
                        >
                          {item.mobileLabel || item.label}
                        </Link>
                      }
                    />
                  ) : (
                    <span>{item.mobileLabel || item.label}</span>
                  )}
                </BreadcrumbItem>

                {!isLast && <BreadcrumbSeparator className="text-[#555047] text-[10px]" />}
              </React.Fragment>
            )
          })
        ) : (
          <>
            {/* First Item (e.g. Home / Admin) */}
            <BreadcrumbItem>
              {firstItem.href ? (
                <BreadcrumbLink
                  render={
                    <Link
                      to={firstItem.href}
                      className="text-[#9B958B] hover:text-[#E8B84B] transition-colors"
                    >
                      {firstItem.mobileLabel || firstItem.label}
                    </Link>
                  }
                />
              ) : (
                <span>{firstItem.mobileLabel || firstItem.label}</span>
              )}
            </BreadcrumbItem>

            <BreadcrumbSeparator className="text-[#555047] text-[10px]" />

            {/* Collapsed Dropdown for Intermediate Items */}
            <BreadcrumbItem className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-expanded={isMobileMenuOpen}
                aria-haspopup="true"
                aria-label="Toggle full breadcrumb path"
                className="flex items-center justify-center p-0.5 text-[#9B958B] hover:text-[#F5F0E8] focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded outline-none cursor-pointer"
              >
                <BreadcrumbEllipsis className="size-4" />
              </button>

              {isMobileMenuOpen && (
                <div className="absolute left-0 top-full mt-1.5 min-w-40 bg-[#171717] border border-[#2A2A2A] rounded-none shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95">
                  {intermediateItems.map((item, idx) => (
                    <div key={`dropdown-${item.label}-${idx}`}>
                      {item.href ? (
                        <Link
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-3 py-1.5 text-xs text-[#9B958B] hover:text-[#E8B84B] hover:bg-[#C9A84C]/10 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span className="block px-3 py-1.5 text-xs text-[#555047]">
                          {item.label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </BreadcrumbItem>

            <BreadcrumbSeparator className="text-[#555047] text-[10px]" />

            {/* Last / Current Item */}
            <BreadcrumbItem>
              {lastItem.isLoading ? (
                <Skeleton className="h-3.5 w-20 bg-stone-800 rounded" />
              ) : (
                <BreadcrumbPage className="font-medium text-[#F5F0E8]">
                  <span
                    title={lastItem.label}
                    className="max-w-[140px] truncate inline-block align-bottom"
                  >
                    {lastItem.mobileLabel || lastItem.label}
                  </span>
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default AppBreadcrumb
