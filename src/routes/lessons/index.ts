import { handleErrors } from '@utils'
import { Elysia, t } from 'elysia'
import { checkCookie } from 'src/middleware'
import getLessons from './handler'

const schema = {
  params: t.Object({
    id: t.String(),
    endDate: t.String(),
    startDate: t.String()
  }),
  headers: t.Object({
    secret: t.String()
  })
}

const lessons = new Elysia().guard(schema, (app) =>
  app.get('/lessons/:id/:startDate/:endDate', getLessons, {
    afterHandle: handleErrors,
    beforeHandle: checkCookie,
    detail: {
      tags: ['Student']
    }
  })
)

export default lessons
