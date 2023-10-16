import { Elysia, t } from 'elysia'
import postAuth from './handler'
import handleErrors from '@src/utils/errorHandler'

const schema = {
  body: t.Object({
    login: t.String(),
    password: t.String()
  })
}

const performanceCurrent = new Elysia()
  .guard(schema, app => app
    .post('/login', postAuth, {
      afterHandle: handleErrors
    })
  )

export default performanceCurrent
