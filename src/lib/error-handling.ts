export class AppError extends Error {
  public readonly code: string
  public readonly details?: unknown
  public readonly timestamp: number

  constructor(code: string, message: string, details?: unknown) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.details = details
    this.timestamp = Date.now()
  }
}

export const ERROR_CODES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTH: 'AUTHENTICATION_ERROR',
  PERMISSION: 'PERMISSION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
} as const

export function createError(code: string, message: string, details?: unknown): AppError {
  return new AppError(code, message, details)
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) return error
  if (error instanceof Error) {
    return new AppError(ERROR_CODES.UNKNOWN, error.message, { originalError: error })
  }
  return new AppError(ERROR_CODES.UNKNOWN, 'An unknown error occurred', { originalError: error })
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof AppError && error.code === ERROR_CODES.NETWORK
}

export function isValidationError(error: unknown): boolean {
  return error instanceof AppError && error.code === ERROR_CODES.VALIDATION
}
