import type { Day } from '@diary-spo/shared'
import { IContext } from '@types'
import { adjustEndDate, formatDate } from '@utils'
import { getCookieFromToken } from 'src/database/getCookieFromToken'
import {getLessons as getLessonsFromDB} from "../../database/lessons";

const getLessons = async ({
  request,
  set,
  params
}: IContext): Promise<Day[] | string> => {
  const { id, startDate, endDate } = params

  const formattedStartDate = formatDate(startDate)
  const formattedEndDate = adjustEndDate(startDate, endDate)

  const secret = await getCookieFromToken(request.headers.toJSON().secret)
  /*const path = `${Bun.env.SERVER_URL}/services/students/${id}/lessons/${formattedStartDate}/${formattedEndDate}`

  const response = await fetch(path, {
    headers: HeadersWithCookie(secret)
  })

  console.log(`${response.status} ${path}`)*/

  const response = getLessonsFromDB(formattedStartDate, formattedEndDate, id, secret)

  set.status = 200
  return response
}

export default getLessons
