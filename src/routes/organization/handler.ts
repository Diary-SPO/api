import type { Organization } from '@diary-spo/shared'
import type { Context } from 'elysia'
import { HeadersWithCookie } from '@utils'

const getOrganization = async ({
  request,
  set,
}: Context): Promise<Organization | string> => {
  const secret = request.headers.toJSON().secret
  const path = `${Bun.env.SERVER_URL}/services/people/organization`
  const response = await fetch(path, {
    headers: HeadersWithCookie(secret),
  })

  console.log(`${response.status} ${path}`)
  set.status = 200
  return await response.json()
}

export default getOrganization
