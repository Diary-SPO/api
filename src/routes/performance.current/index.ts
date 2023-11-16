import { Elysia, t } from 'elysia'
import { handleErrors } from '@utils'
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
      afterHandle: handleErrors,
      beforeHandle: checkCookie
    })
  )

export default performanceCurrent
