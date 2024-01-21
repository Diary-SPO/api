import { error as errorLog } from '@utils'
import { ErrorHandler } from 'elysia'

interface ErrorResponse {
  code: number
  message: string
  errors?: unknown[]
}

export const errorHandler: ErrorHandler = ({
  set,
  code,
  error
}): ErrorResponse => {
  errorLog(error.message)

  if (code === 'NOT_FOUND') {
    return {
      message: 'NOT_FOUND',
      code: 404
    }
  }

  /** Обработка ошибки от ApiError **/
  if (Number(code) === 401) {
    return {
      message: 'INVALID_DATA',
      code: 401
    }
  }

  const formattedError = JSON.parse(error.message)

  if (code === 'VALIDATION') {
    return {
      message: code,
      code: 400,
      errors: formattedError.errors
    }
  }

  if (code === 'INTERNAL_SERVER_ERROR') {
    return {
      message: code,
      code: 500
    }
  }

  return {
    message: 'Unknown error',
    code: 500
  }
}
