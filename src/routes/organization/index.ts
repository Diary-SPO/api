import { handleErrors } from '@utils'
import { Elysia, t } from 'elysia'
import getOrganization from './handler'

const organization = new Elysia().get('/organization', getOrganization, {
  afterHandle: handleErrors,
  detail: {
    tags: ['Student']
  }
})

export default organization
