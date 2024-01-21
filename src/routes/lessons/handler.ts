import { SERVER_URL } from '@config'
import type { Day } from '@diary-spo/shared'
import { IContext } from '@types'
import { HeadersWithCookie, formatDate } from '@utils'
import { getCookieFromToken } from 'src/database/getCookieFromToken'
import { logger } from '../../utils/logger'

const getLessons = async ({
  request,
  set,
  params
}: IContext): Promise<Day[] | string> => {
  const { id, startDate, endDate } = params
  console.log(params)
  const formattedStartDate = formatDate(startDate)
  const formattedEndDate = formatDate(endDate)

  const secret =await getCookieFromToken(request.headers.toJSON().secret).catch(e => {
    console.log(e)
    if (e) {
      set.status = e.code
      return
    }
  })

  const path = `${SERVER_URL}/services/students/${id}/lessons/${formattedStartDate}/${formattedEndDate}`

  const response = await fetch(path, {
    headers: HeadersWithCookie(secret)
  })
  
  // FIXME
  set.status = 200
  return await response.json()
}

export default getLessons
