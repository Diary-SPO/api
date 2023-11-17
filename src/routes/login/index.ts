import { Elysia, t } from 'elysia'
import postAuth from './handler'
import { handleErrors } from '@utils'

const schema = {
  body: t.Object({
    login: t.String(),
    password: t.String(),
    isRemember: t.Undefined() || t.Boolean(),
  })
}

const performanceCurrent = new Elysia()
  .guard(schema, app => app
    .post('/login', postAuth, {
      afterHandle: handleErrors
    })
  )

export default performanceCurrent
