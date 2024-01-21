import { error as errorLog } from '@utils'
import { ErrorHandler } from 'elysia'
import { API_CODES } from '@api'

interface ErrorResponse {
  code: number
  message: string
  path: string
  errors?: unknown[]
}

export const errorHandler: ErrorHandler = ({
  set,
  code,
  error,

  path
}): ErrorResponse => {
  errorLog(error.message)

  /** Обработка ошибки от ApiError **/
  if (Number(code) === 401) {
    set.status = API_CODES.UNAUTHORIZED
    return {
      message: 'INVALID_DATA',
      code: API_CODES.UNAUTHORIZED,
      path
    }
  }

  if (code === 'NOT_FOUND') {
    return {
      message: 'NOT_FOUND',
      code: API_CODES.NOT_FOUND,
      path
    }
  }

  const formattedError = JSON.parse(error.message)

  if (code === 'VALIDATION') {
    return {
      message: code,
      code: API_CODES.BAD_REQUEST,
      errors: formattedError.errors,
      path
    }
  }

  if (code === 'INTERNAL_SERVER_ERROR') {
    return {
      message: code,
      code: API_CODES.INTERNAL_SERVER_ERROR,
      path
    }
  }

  set.status = API_CODES.UNKNOWN_ERROR
  return {
    message: 'Unknown error',
    code: API_CODES.UNKNOWN_ERROR,
    path
  }
}
