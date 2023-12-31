import type { Organization } from '@diary-spo/shared'
import { HeadersWithCookie } from '@utils'
import type { Context } from 'elysia'
import { getCookieFromToken } from 'src/database/getCookieFromToken'

const getOrganization = async ({
  request,
  set
}: Context): Promise<Organization | string> => {
  const secret = await getCookieFromToken(request.headers.toJSON().secret)
  const path = `${Bun.env.SERVER_URL}/services/people/organization`
  const response = await fetch(path, {
    headers: HeadersWithCookie(secret)
  })

  console.log(`${response.status} ${path}`)
  set.status = 200
  return await response.json()
}

export default getOrganization
