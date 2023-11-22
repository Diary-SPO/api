import { Elysia, t } from 'elysia'
import getAds from './handler'
import { handleErrors } from '@utils'
import { checkCookie } from 'src/middleware'

const ads = new Elysia().get('/ads', getAds, {
  afterHandle: handleErrors,
  beforeHandle: checkCookie,
  headers: t.Object({
    'secret': t.String()
  }),
  detail: {
    tags: ['Student']
  }
})

export default ads
