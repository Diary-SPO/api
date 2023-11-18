import type { NotificationsResponse } from '@diary-spo/shared'
import { type ContextWithID, HeadersWithCookie } from '@utils'

const getAds = async ({
  request,
  set,
}: ContextWithID): Promise<NotificationsResponse | string> => {
  const secret = request.headers.toJSON().secret
  const path = `${process.env.SERVER_URL}/services/people/organization/news/last/10`
  const response = await fetch(path, {
    headers: HeadersWithCookie(secret),
  })

  console.log(`${response.status} ${path}`)
  set.status = 200
  return await response.json()
}

export default getAds
