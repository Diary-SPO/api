import { Elysia } from 'elysia'
import getOrganization from './handler'
import handleErrors from '@src/utils/errorHandler'
import { checkCookie } from '@src/middleware'

const organization = new Elysia()
  .get('/organization', getOrganization, {
    afterHandle: handleErrors,
    beforeHandle: checkCookie
  })

export default organization