import { Elysia, t } from 'elysia'
import getLessons from './handler'
import { handleErrors } from '@utils'
import { checkCookie } from 'src/middleware'

const schema = {
  params: t.Object({
    id: t.String(),
    endDate: t.String(),
    startDate: t.String(),
  }),
  Headers: t.Object({
    secret: t.String(),
  }),
}

const lessons = new Elysia().guard(schema, (app) =>
  app.get('/lessons/:id/:startDate/:endDate', getLessons, {
    afterHandle: handleErrors,
    beforeHandle: checkCookie,
    detail: {
      tags: ['Student'],
    },
  }),
)

export default lessons
