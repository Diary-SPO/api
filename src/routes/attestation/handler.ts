import type { AttestationResponse } from '@diary-spo/shared'
import { type ContextWithID, HeadersWithCookie } from '@utils'
import { getCookieFromToken } from 'src/database/getCookieFromToken'

const getAttestation = async ({
  request,
  set,
  params,
}: ContextWithID): Promise<AttestationResponse | string> => {
  try {
    const { id } = params
    const secret = await getCookieFromToken(request.headers.toJSON().secret)
    const path = `${Bun.env.SERVER_URL}/services/reports/curator/group-attestation-for-student/${id}`
    const response = await fetch(path, {
      headers: HeadersWithCookie(secret),
    })

    console.log(`${response.status} ${path}`)
    set.status = 200
    return await response.json()
  } catch (err) {
    set.status = 401
    return `Error. Detailed info: ` + err
  }
}

export default getAttestation
