import { handleErrors } from '@utils'
import { Elysia, t } from 'elysia'
import getLessons from './handler'

const schema = {
  params: t.Object({
    id: t.String(),
    endDate: t.String(),
    startDate: t.String()
  })
}

const lessons = new Elysia().guard(schema, (app) =>
  app.get('/lessons/:id/:startDate/:endDate', getLessons, {
    afterHandle: handleErrors,
    detail: {
      tags: ['Student']
    }
  })
)

export default lessons
