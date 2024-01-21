import { error as errorLog } from '@utils'
import { ErrorHandler } from 'elysia'

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
    set.status = 401
    return {
      message: 'INVALID_DATA',
      code: 401,
      path
    }
  }

  if (code === 'NOT_FOUND') {
    return {
      message: 'NOT_FOUND',
      code: 404,
      path
    }
  }

  const formattedError = JSON.parse(error.message)

  if (code === 'VALIDATION') {
    return {
      message: code,
      code: 400,
      errors: formattedError.errors,
      path
    }
  }

  if (code === 'INTERNAL_SERVER_ERROR') {
    return {
      message: code,
      code: 500,
      path
    }
  }

  return {
    message: 'Unknown error',
    code: 520,
    path
  }
}
