import { Elysia, t } from 'elysia'
import postAuth from './handler'
import { handleErrors } from '@utils'

const schema = {
  body: t.Object({
    login: t.String(),
    password: t.String(),
    isHash: t.Boolean(),
  }),
}

const performanceCurrent = new Elysia().guard(schema, (app) =>
  app.post('/login', postAuth, {
    afterHandle: handleErrors,
    detail: {
      tags: ['Auth'],
    },
  }),
)

export default performanceCurrent
