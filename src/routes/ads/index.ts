import { handleErrors } from '@utils'
import { Elysia, t } from 'elysia'
import getAds from './handler'

const ads = new Elysia().get('/ads', getAds, {
  afterHandle: handleErrors,
  detail: {
    tags: ['Student']
  }
})

export default ads
