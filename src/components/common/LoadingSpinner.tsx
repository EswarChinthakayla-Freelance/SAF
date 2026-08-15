import React from 'react'

interface LoadingSpinnerProps {
  label?: string
  fullScreen?: boolean
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading...',
  fullScreen = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <div className="w-8 h-8 rounded-full border-2 border-stone-800 border-t-amber-500 animate-spin" />
      <span className="text-xs uppercase tracking-widest text-stone-400 font-sans">{label}</span>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-stone-950">
        {content}
      </div>
    )
  }

  return content
}
