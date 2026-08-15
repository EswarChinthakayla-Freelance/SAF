import React from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import { ErrorState } from './ErrorState'
import { EmptyState } from './EmptyState'

interface LoadingBoundaryProps {
  isLoading: boolean
  isError: boolean
  error?: Error | null
  isEmpty?: boolean
  emptyMessage?: string
  onRetry?: () => void
  children: React.ReactNode
  loadingLabel?: string
  className?: string
}

export const LoadingBoundary: React.FC<LoadingBoundaryProps> = ({
  isLoading,
  isError,
  error,
  isEmpty = false,
  emptyMessage = 'No records found.',
  onRetry,
  children,
  loadingLabel = 'Loading catalogue...',
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`py-16 flex items-center justify-center ${className}`}>
        <LoadingSpinner label={loadingLabel} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className={`py-16 ${className}`}>
        <ErrorState
          message={error?.message || 'Failed to load data from server.'}
          onRetry={onRetry}
        />
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className={`py-16 ${className}`}>
        <EmptyState description={emptyMessage} />
      </div>
    )
  }

  return <>{children}</>
}
