import { Elysia, t } from 'elysia'
import getPerformanceCurrent from './handler'
import { checkCookie } from '@src/middleware'

const schema = {
  params: t.Object({
    id: t.String()
  })
}

const performanceCurrent = new Elysia()
  .guard(schema, app => app
    .get('/performance.current/:id', getPerformanceCurrent, {
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

export default performanceCurrent
