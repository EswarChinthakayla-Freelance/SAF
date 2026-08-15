/**
 * Normalized Error Handling Architecture for Sri Anjaneya Furnitures
 * Converts raw database, network, and storage errors into safe, actionable application errors.
 */

export type ErrorCategory =
  | 'network'
  | 'timeout'
  | 'auth'
  | 'authorization'
  | 'validation'
  | 'conflict'
  | 'not_found'
  | 'storage'
  | 'rate_limited'
  | 'server'
  | 'aborted'
  | 'unknown'

export interface AppErrorOptions {
  category?: ErrorCategory
  status?: number
  code?: string
  userMessage?: string
  retryable?: boolean
  originalError?: unknown
}

export class AppError extends Error {
  public readonly category: ErrorCategory
  public readonly code: string
  public readonly status: number
  public readonly userMessage: string
  public readonly retryable: boolean
  public readonly originalError?: unknown

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message)
    this.name = 'AppError'
    this.category = options.category || 'unknown'
    this.code = options.code || 'APP_ERROR'
    this.status = options.status || 500
    this.userMessage =
      options.userMessage ||
      'We encountered an issue processing your request. Please try again.'
    this.retryable = options.retryable ?? (this.status >= 500 || this.category === 'network')
    this.originalError = options.originalError
  }
}

export class ValidationError extends AppError {
  public readonly fieldErrors?: Record<string, string[]>
  constructor(message = 'Invalid data provided', fieldErrors?: Record<string, string[]>) {
    super(message, {
      category: 'validation',
      code: 'VALIDATION_ERROR',
      status: 400,
      userMessage: message,
      retryable: false,
    })
    this.name = 'ValidationError'
    this.fieldErrors = fieldErrors
  }
}

export class AuthError extends AppError {
  constructor(message = 'Authentication required. Please sign in to continue.') {
    super(message, {
      category: 'auth',
      code: 'AUTHENTICATION_ERROR',
      status: 401,
      userMessage: 'Your session has expired or requires authentication. Please sign in.',
      retryable: false,
    })
    this.name = 'AuthError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action.') {
    super(message, {
      category: 'authorization',
      code: 'FORBIDDEN',
      status: 403,
      userMessage: 'Access denied. You do not have sufficient permissions.',
      retryable: false,
    })
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'The requested resource was not found.') {
    super(message, {
      category: 'not_found',
      code: 'NOT_FOUND',
      status: 404,
      userMessage: 'The requested piece or record could not be found.',
      retryable: false,
    })
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message = 'A resource with this identifier already exists.') {
    super(message, {
      category: 'conflict',
      code: 'CONFLICT',
      status: 409,
      userMessage: message,
      retryable: false,
    })
    this.name = 'ConflictError'
  }
}

export class StorageError extends AppError {
  constructor(message = 'Media storage operation failed.', originalError?: unknown) {
    super(message, {
      category: 'storage',
      code: 'STORAGE_ERROR',
      status: 500,
      userMessage: 'Failed to upload or manage media asset. Please retry with a supported image.',
      retryable: true,
      originalError,
    })
    this.name = 'StorageError'
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network connection interrupted. Please check your connection and retry.') {
    super(message, {
      category: 'network',
      code: 'NETWORK_ERROR',
      status: 0,
      userMessage: 'We couldn’t load this information. Please check your internet connection and retry.',
      retryable: true,
    })
    this.name = 'NetworkError'
  }
}

export class AbortedError extends AppError {
  constructor(message = 'The operation was cancelled.') {
    super(message, {
      category: 'aborted',
      code: 'ABORTED',
      status: 0,
      userMessage: '',
      retryable: false,
    })
    this.name = 'AbortedError'
  }
}

/**
 * Normalizes any unknown thrown error or Supabase PostgrestError into a typed AppError.
 * Prevents raw database errors, token leakages, or scary HTTP2 messages from reaching UI components.
 */
export function normalizeError(err: unknown): AppError {
  if (err instanceof AppError) {
    return err
  }

  if (typeof err === 'object' && err !== null) {
    const errObj = err as Record<string, unknown>
    const name = typeof errObj.name === 'string' ? errObj.name : ''
    const msg = typeof errObj.message === 'string' ? errObj.message.toLowerCase() : ''
    const code = typeof errObj.code === 'string' ? errObj.code : ''

    // Handle AbortError / DOMException
    if (name === 'AbortError' || msg.includes('aborted') || msg.includes('cancelled')) {
      return new AbortedError()
    }

    // PostgREST / Supabase specific codes
    if (code === '23505') {
      return new ConflictError('A record with this identifier, slug, or SKU already exists.')
    }
    if (code === '42501' || msg.includes('row-level security') || msg.includes('permission denied')) {
      return new ForbiddenError('Access denied by security policy.')
    }
    if (code === 'PGRST116') {
      return new NotFoundError('Requested record was not found.')
    }

    if (
      msg.includes('fetch') ||
      msg.includes('network') ||
      msg.includes('failed to fetch') ||
      msg.includes('http2')
    ) {
      return new NetworkError()
    }

    if (
      msg.includes('jwt') ||
      msg.includes('invalid login') ||
      msg.includes('invalid claim') ||
      msg.includes('session')
    ) {
      return new AuthError()
    }

    const rawMessage = typeof errObj.message === 'string' ? errObj.message : 'A server error occurred.'
    return new AppError(rawMessage, {
      category: 'server',
      code: code || 'SERVER_ERROR',
      status: 500,
      userMessage: 'A server error occurred while processing your request. Please try again.',
      originalError: err,
    })
  }

  return new AppError('An unexpected error occurred.', {
    category: 'unknown',
    code: 'UNKNOWN_ERROR',
    status: 500,
    userMessage: 'An unexpected error occurred. Please try again.',
    originalError: err,
  })
}
