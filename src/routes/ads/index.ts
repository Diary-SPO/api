import { Elysia, t } from 'elysia'
import getAds from './handler'
import { handleErrors } from '@utils'
import { checkCookie } from 'src/middleware'

const schema = {
  headers: t.Object({
    secret: t.String(),
  }),
}

const ads = new Elysia().guard(schema, (app) =>
  app.get('/ads', getAds, {
    afterHandle: handleErrors,
    beforeHandle: checkCookie,
    detail: {
      tags: ['Student'],
    },
  }),
)

export default ads
