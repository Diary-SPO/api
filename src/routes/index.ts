import { headersSchema } from '@utils'
import { Elysia } from 'elysia'

import { ApiError } from '../ApiError'
import ads from './ads'
import attestation from './attestation'
import hello from './hello'
import lessons from './lessons'
import login from './login'
import organization from './organization'
import performanceCurrent from './performance.current'

const routes = new Elysia()
  .guard(headersSchema, (app) =>
    app
      .use(organization)
      .use(lessons)
      .use(performanceCurrent)
      .use(attestation)
      .use(ads)
  )
  .onError(({ code, error }) => {
    console.error('bbbb')
    console.error(error)
    if (error.code === 'NOT_FOUND') {
      return {
        message: 'NOT_FOUND',
        code: 404
      }
    }

    const formattedError = JSON.parse(error.message)
    // TODO: refactor this
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
  .use(hello)
  .use(login)

export default routes
