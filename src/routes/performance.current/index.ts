import { handleErrors } from '@utils'
import { Elysia, t } from 'elysia'
import { checkCookie } from 'src/middleware'
import getPerformanceCurrent from './handler'

const schema = {
  params: t.Object({
    id: t.String()
  }),
  headers: t.Object({
    secret: t.String()
  })
}

const performanceCurrent = new Elysia().guard(schema, (app) =>
  app.get('/performance.current/:id', getPerformanceCurrent, {
    afterHandle: handleErrors,
    beforeHandle: checkCookie,
    detail: {
      tags: ['Student']
    }
  })
)

export default performanceCurrent
