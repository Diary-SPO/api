import { Elysia, t } from 'elysia'
import handleErrors from '@src/utils/errorHandler'
import getAttestation from './handler'
import { checkCookie } from '@src/middleware'

const schema = {
  params: t.Object({
    id: t.String()
  })
}

const attestation = new Elysia()
  .guard(schema, app => app
    .get('/attestation/:id', getAttestation, {
      afterHandle: handleErrors,
      beforeHandle: checkCookie
    })
  )

export default attestation
