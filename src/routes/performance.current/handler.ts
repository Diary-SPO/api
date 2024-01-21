import { SERVER_URL } from '@config'
import type { PerformanceCurrent } from '@diary-spo/shared'
import { ContextWithID } from '@types'
import { HeadersWithCookie } from '@utils'
import { getCookieFromToken } from '../../services/getCookieFromToken'

const getPerformanceCurrent = async ({
  request,
  set,
  params
}: ContextWithID): Promise<PerformanceCurrent | string> => {
  const { id } = params
  const secret = await getCookieFromToken(request.headers.toJSON().secret)
  const path = `${SERVER_URL}/services/reports/current/performance/${id}`
  const response = await fetch(path, {
    headers: HeadersWithCookie(secret)
  })

  set.status = 200
  return await response.json()
}

export default getPerformanceCurrent
