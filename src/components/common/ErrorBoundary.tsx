import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-stone-900/50 rounded-none border border-stone-800 m-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 font-serif text-xl">
            !
          </div>
          <h3 className="text-xl font-serif text-stone-100 mb-2">Something went wrong</h3>
          <p className="text-stone-400 text-sm max-w-md mb-6">
            We encountered an unexpected issue while loading this section. Please try refreshing or return to the main catalogue.
          </p>
          <button
            onClick={this.handleReset}
            className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs tracking-widest uppercase rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
