import React from 'react'
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'
import { GoldButton } from '@/components/brand/GoldButton'
import { AppLogo } from '@/components/common/AppLogo'
import { reportError } from '@/lib/observability'

export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError()

  React.useEffect(() => {
    if (error) {
      reportError(error, { category: 'route' })
    }
  }, [error])

  let title = 'Something went wrong'
  let message = 'An unexpected error occurred while loading this view. Please try again.'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "This page couldn't be found."
      message = 'The requested route or catalogue resource does not exist.'
    } else {
      title = `Error ${error.status}: ${error.statusText}`
      message = error.data?.message || message
    }
  } else if (error instanceof Error) {
    if (error.message.includes('dynamically imported module') || error.message.includes('chunk')) {
      title = 'Application Update Available'
      message = 'A new version of Sri Anjaneya Furnitures is available. Please reload the page.'
    }
  }

  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="space-y-4 max-w-md mx-auto">
        <div className="flex justify-center">
          <AppLogo size={60} />
        </div>
        <span className="text-[11px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
          Sri Anjaneya Furnitures
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#F5F0E8] font-bold">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-[#9B958B] leading-relaxed font-sans">
          {message}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <GoldButton size="default" onClick={handleRetry}>
          Try Again
        </GoldButton>
        <Link to="/">
          <GoldButton variant="outline" size="default">
            Return Home
          </GoldButton>
        </Link>
      </div>
    </div>
  )
}

export default RouteErrorBoundary
