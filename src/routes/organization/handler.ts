import { SERVER_URL } from '@config'
import type { Organization } from '@diary-spo/shared'
import { HeadersWithCookie } from '@utils'
import type { Context } from 'elysia'
import { getCookieFromToken } from '../../services/getCookieFromToken'

const getOrganization = async ({
  request,
  set
}: Context): Promise<Organization | string> => {
  const secret = await getCookieFromToken(request.headers.toJSON().secret)
  const path = `${SERVER_URL}/services/people/organization`
  const response = await fetch(path, {
    headers: HeadersWithCookie(secret)
  })

  set.status = 200
  return await response.json()
}

export default getOrganization
