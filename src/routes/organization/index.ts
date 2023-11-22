import { Elysia, t } from 'elysia'
import getOrganization from './handler'
import { handleErrors } from '@utils'
import { checkCookie } from 'src/middleware'

const organization = new Elysia().get('/organization', getOrganization, {
  afterHandle: handleErrors,
  beforeHandle: checkCookie,
  headers: t.Object({
    'secret': t.String()
  }),
  detail: {
    tags: ['Student']
  }
})

export default organization
