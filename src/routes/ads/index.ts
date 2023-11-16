import { Elysia } from 'elysia'
import getAds from './handler'
import handleErrors from '@src/utils/errorHandler'
import { checkCookie } from '@src/middleware'

const ads = new Elysia()
  .get('/ads', getAds, {
    afterHandle: handleErrors,
    beforeHandle: checkCookie
  })

export default ads
