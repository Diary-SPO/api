import { SERVER_URL } from '@config'
import type { NotificationsResponse } from '@diary-spo/shared'
import { ContextWithID } from '@types'
import { HeadersWithCookie } from '@utils'
import { getCookieFromToken } from 'src/database/getCookieFromToken'

const getAds = async ({
  request,
  set
}: ContextWithID): Promise<NotificationsResponse | string> => {
  const secret = await getCookieFromToken(request.headers.toJSON().secret)
  const path = `${SERVER_URL}/services/people/organization/news/last/10`
  const response = await fetch(path, {
    headers: HeadersWithCookie(secret)
  })

  set.status = 200
  return await response.json()
}

export default getAds
