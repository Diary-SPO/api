import { handleErrors, headersSchema } from '@utils'
import { Elysia } from 'elysia'
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
      .use(login)
      .use(organization)
      .use(lessons)
      .use(performanceCurrent)
      .use(attestation)
      .use(ads)
  )
  .onAfterHandle(handleErrors)
  .use(hello)

export default routes
