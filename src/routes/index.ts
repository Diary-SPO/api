import { headersSchema } from '@utils'
import { Elysia, ErrorHandler, MergeSchema } from 'elysia'

import { ApiError } from '../ApiError'
import ads from './ads'
import attestation from './attestation'
import hello from './hello'
import lessons from './lessons'
import login from './login'
import organization from './organization'
import performanceCurrent from './performance.current'

interface ErrorResponse {
  code: number
  message: string
  errors?: unknown[]
}

const routes = new Elysia()
  /** Роуты с проверкой на наличие secret поля **/
  .guard(headersSchema, (app) =>
    app
      .use(organization)
      .use(lessons)
      .use(performanceCurrent)
      .use(attestation)
      .use(ads)
  )
  /** Роуты без проверки **/
  .use(hello)
  .use(login)
  /** Обработка любых ошибок в кажом роуте **/
  .onError(({ code, error }): ErrorResponse => {
    console.error(code)
    console.error(error.message)
    console.error('bbbb')

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
  })

export default routes
