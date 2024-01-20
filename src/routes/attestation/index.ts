import { handleErrors } from '@utils'
import { Elysia, t } from 'elysia'
import getAttestation from './handler'

const schema = {
  params: t.Object({
    id: t.String()
  })
}

const attestation = new Elysia().guard(schema, (app) =>
  app.get('/attestation/:id', getAttestation, {
    afterHandle: handleErrors,
    detail: {
      tags: ['Student']
    }
  })
)

export default attestation
