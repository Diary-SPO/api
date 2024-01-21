import { Elysia, t } from 'elysia'
import getLessons from './handler'

const schema = {
  params: t.Object({
    id: t.String(),
    endDate: t.Date(),
    startDate: t.Date()
  })
}

const lessons = new Elysia().guard(schema, (app) =>
  app.get('/lessons/:id/:startDate/:endDate', getLessons, {
    detail: {
      tags: ['Student']
    }
  })
)

export default lessons
