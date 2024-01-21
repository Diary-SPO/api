export class ApiError extends Error {
  code: number
  message: string

  constructor(message: string, code: number) {
    super(message)
    this.code = code
    this.message = message
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export const API_CODES = {
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  UNKNOWN_ERROR: 520
} as const
