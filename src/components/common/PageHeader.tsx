import React from 'react'
import type { AppBreadcrumbItem } from '@/types/app'
import { AppBreadcrumb } from './AppBreadcrumb'
import { Separator } from '@/components/ui/separator'

export interface PageHeaderProps {
  title: React.ReactNode
  description?: React.ReactNode
  eyebrow?: string
  breadcrumbs?: AppBreadcrumbItem[]
  actions?: React.ReactNode
  badge?: React.ReactNode
  variant?: 'public' | 'admin' | 'compact'
  className?: string
  withSeparator?: boolean
}

/**
 * Reusable PageHeader component across Public and Admin routes.
 * Distinguishes Navigation Context (Breadcrumb) -> Eyebrow -> Page Title (H1) -> Description -> Actions.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  eyebrow,
  breadcrumbs,
  actions,
  badge,
  variant = 'public',
  className = '',
  withSeparator = false,
}) => {
  const isPublic = variant === 'public'
  const isCompact = variant === 'compact'
  const isAdmin = variant === 'admin'

  return (
    <header
      className={`w-full ${
        isPublic
          ? 'py-8 sm:py-12 lg:py-16'
          : isCompact
          ? 'py-4 sm:py-6'
          : 'py-5 sm:py-7'
      } ${className}`}
    >
      {/* 1. Contextual Breadcrumbs (if provided) */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <AppBreadcrumb items={breadcrumbs} />
        </div>
      )}

      {/* 2. Main Header Content Row (Title/Desc on left, Actions on right) */}
      <div
        className={`flex flex-col ${
          actions ? 'md:flex-row md:items-end md:justify-between gap-6' : 'gap-3'
        }`}
      >
        <div className="space-y-2 max-w-3xl">
          {/* Eyebrow */}
          {eyebrow && (
            <p className="text-[11px] sm:text-xs uppercase font-mono tracking-[0.22em] text-[#C9A84C] font-semibold">
              {eyebrow}
            </p>
          )}

          {/* Title & Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <h1
              className={`${
                isPublic
                  ? 'text-3xl sm:text-4xl lg:text-5xl font-serif text-[#F5F0E8] font-bold tracking-tight leading-[1.15]'
                  : isAdmin
                  ? 'text-xl sm:text-2xl lg:text-3xl font-serif text-[#F5F0E8] font-bold tracking-tight'
                  : 'text-2xl sm:text-3xl font-serif text-[#F5F0E8] font-semibold'
              }`}
            >
              {title}
            </h1>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>

          {/* Description */}
          {description && (
            <p
              className={`${
                isPublic
                  ? 'text-sm sm:text-base text-[#9B958B] leading-relaxed max-w-2xl font-sans'
                  : 'text-xs sm:text-sm text-[#9B958B] leading-relaxed max-w-2xl font-sans'
              }`}
            >
              {description}
            </p>
          )}
        </div>

        {/* Header Actions (Stacked on mobile, right-aligned on desktop) */}
        {actions && (
          <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 md:pt-0">
            {actions}
          </div>
        )}
      </div>

      {/* 3. Optional Bottom Separator */}
      {withSeparator && <Separator className="mt-6 sm:mt-8 bg-[#2A2A2A]" />}
    </header>
  )
}

export default PageHeader
