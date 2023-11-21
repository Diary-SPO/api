import type { Organization } from '@diary-spo/shared'
import type { Context } from 'elysia'
import { HeadersWithCookie } from '@utils'
import { getCookieFromToken } from 'src/database/getCookieFromToken'

const getOrganization = async ({
  request,
  set,
}: Context): Promise<Organization | string> => {
  try {
    const secret = await getCookieFromToken(request.headers.toJSON().secret)
    const path = `${Bun.env.SERVER_URL}/services/people/organization`
    const response = await fetch(path, {
      headers: HeadersWithCookie(secret),
    })

    console.log(`${response.status} ${path}`)
    set.status = 200
    return await response.json()
  }
  catch (err) {
    set.status = 401
    return `Error. Detailed info: ` + err
  }
}

export default getOrganization
