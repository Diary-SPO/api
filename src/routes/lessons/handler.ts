import { SERVER_URL } from '@config'
import type { Day } from '@diary-spo/shared'
import { IContext } from '@types'
import { formatDate } from '@utils'
import { getCookieFromToken } from 'src/database/getCookieFromToken'
import { getLessons as getLessonsFromDB } from '../../database/lessons'
import { HeadersWithCookie, formatDate } from '@utils'
import { getCookieFromToken } from '../../services/getCookieFromToken'

const getLessons = async ({
  request,
  set,
  params
}: IContext): Promise<Day[] | string> => {
  const { id, startDate, endDate } = params

  const formattedStartDate = formatDate(startDate)
  const formattedEndDate = formatDate(endDate)

  const secret = await getCookieFromToken(request.headers.toJSON().secret)

  const path = `${SERVER_URL}/services/students/${id}/lessons/${formattedStartDate}/${formattedEndDate}`

  const response = getLessonsFromDB(
    formattedStartDate,
    formattedEndDate,
    id,
    secret
  )

  set.status = 200
  return response
}

export default getLessons
