import { SERVER_URL } from '@config'
import type { Day } from '@diary-spo/shared'
import { IContext } from '@types'
import { HeadersWithCookie, formatDate } from '@utils'
import { getCookieFromToken } from '../../services/getCookieFromToken'

const getLessons = async ({
  request,
  set,
  params
}: IContext): Promise<Day[] | string> => {
  const { id, startDate, endDate } = params
  console.log(params)
  const formattedStartDate = formatDate(startDate)
  const formattedEndDate = formatDate(endDate)

  const secret = await getCookieFromToken(request.headers.toJSON().secret)

  const path = `${SERVER_URL}/services/students/${id}/lessons/${formattedStartDate}/${formattedEndDate}`

  const response = await fetch(path, {
    headers: HeadersWithCookie(secret)
  })

  set.status = 200
  return await response.json()
}

export default getLessons
