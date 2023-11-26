import { Elysia, t } from 'elysia'
import getOrganization from './handler'
import { handleErrors } from '@utils'
import { checkCookie } from 'src/middleware'

const schema = {
  headers: t.Object({
    secret: t.String(),
  }),
}

const organization = new Elysia().guard(schema, (app) =>
  app.get('/organization', getOrganization, {
    afterHandle: handleErrors,
    beforeHandle: checkCookie,
    detail: {
      tags: ['Student'],
    },
  }),
)

export default organization
