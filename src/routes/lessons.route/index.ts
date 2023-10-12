import { Elysia, t } from 'elysia'
import getLessons from './handler'
import { checkCookie } from '@src/middleware'

const schema = {
  params: t.Object({
    id: t.String(),
    endDate: t.String(),
    startDate: t.String()
  })
}

const lessons = new Elysia()
  .guard(schema, app => app
    .get('/lessons/:id/:startDate/:endDate', getLessons, {
      afterHandle (context) {
        // @ts-expect-error Тут unknown
        if (context.response.errors) {
          context.set.status = 400

          context.response = {
            // @ts-expect-error Тут unknown
            errors: context.response.errors,
            // @ts-expect-error Тут unknown
            title: context.response.title
          }
        }
      },
      beforeHandle: checkCookie
    })
  )

export default lessons
