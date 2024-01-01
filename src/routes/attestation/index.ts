import { handleErrors } from '@utils'
import { Elysia, t } from 'elysia'
import { checkCookie } from 'src/middleware'
import getAttestation from './handler'

const schema = {
  params: t.Object({
    id: t.String()
  }),
  headers: t.Object({
    secret: t.String()
  })
}

const attestation = new Elysia().guard(schema, (app) =>
  app.get('/attestation/:id', getAttestation, {
    afterHandle: handleErrors,
    beforeHandle: checkCookie,
    detail: {
      tags: ['Student']
    }
  })
)

export default attestation
