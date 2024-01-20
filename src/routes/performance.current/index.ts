import { handleErrors, headersSchema } from '@utils'
import { Elysia, t } from 'elysia'
import getPerformanceCurrent from './handler'

const schema = {
  ...headersSchema,
  params: t.Object({
    id: t.String()
  })
}

const performanceCurrent = new Elysia().get(
  '/performance.current/:id',
  getPerformanceCurrent,
  {
    afterHandle: handleErrors,
    detail: {
      tags: ['Student']
    }
  }
)

export default performanceCurrent
