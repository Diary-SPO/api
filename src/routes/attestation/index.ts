import { Elysia, t } from 'elysia'
import { handleErrors } from '@utils'
import getAttestation from './handler'
import { checkCookie } from 'src/middleware'

const schema = {
  params: t.Object({
    id: t.String(),
  }),
}

const attestation = new Elysia().guard(schema, (app) =>
  app.get('/attestation/:id', getAttestation, {
    afterHandle: handleErrors,
    beforeHandle: checkCookie,
    headers: t.Object({
      secret: t.String(),
    }),
    detail: {
      tags: ['Student'],
    },
  }),
)

export default attestation
