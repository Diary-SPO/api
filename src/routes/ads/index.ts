import { handleErrors } from '@utils'
import { Elysia, t } from 'elysia'
import { checkCookie } from 'src/middleware'
import getAds from './handler'

const schema = {
  headers: t.Object({
    secret: t.String()
  })
}

const ads = new Elysia().guard(schema, (app) =>
  app.get('/ads', getAds, {
    afterHandle: handleErrors,
    beforeHandle: checkCookie,
    detail: {
      tags: ['Student']
    }
  })
)

export default ads
