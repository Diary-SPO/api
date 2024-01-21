import { SERVER_URL } from '@config'
import type { Organization } from '@diary-spo/shared'
import { HeadersWithCookie } from '@utils'
import type { Context } from 'elysia'
import { getCookieFromToken } from '@db'

const getOrganization = async ({
  request,
}: Context): Promise<Organization | string> => {
  const secret = await getCookieFromToken(request.headers.toJSON().secret)
  const path = `${SERVER_URL}/services/people/organization`
  const response = await fetch(path, {
    headers: HeadersWithCookie(secret)
  })

  return await response.json()
}

export default getOrganization
