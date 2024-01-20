import { handleErrors, headersSchema } from '@utils'
import { Elysia, t } from 'elysia'
import getPerformanceCurrent from './handler'

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
