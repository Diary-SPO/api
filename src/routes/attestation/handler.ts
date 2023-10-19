import type { AttestationResponse } from 'diary-shared'
import type { Context } from 'elysia'

interface IContext extends Omit<Context, 'params'> {
  params: {
    id: string
  }
}

const getAttestation = async ({ request, set, params }: IContext): Promise<AttestationResponse | string> => {
  const { id } = params
  const secret = request.headers.toJSON().secret
  const path = `${process.env.SERVER_URL}/services/reports/curator/group-attestation-for-student/${id}`
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Cookie: secret
    }
  })

  console.log(`${response.status} ${path}`)
  set.status = 200
  return await response.json()
}

export default getAttestation
