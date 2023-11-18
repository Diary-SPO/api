import type { Day } from '@diary-spo/shared'
import { adjustEndDate, type ContextWithID, formatDate, HeadersWithCookie } from '@utils'

interface IContext extends ContextWithID {
  params: ContextWithID['params'] & {
    startDate: string
    endDate: string
  }
}

const getLessons = async ({ request, set, params }: IContext): Promise<Day[] | string> => {
  const { id, startDate, endDate } = params

  const formattedStartDate = formatDate(startDate)
  const formattedEndDate = adjustEndDate(startDate, endDate)

  const secret = request.headers.toJSON().secret
  const path = `${process.env.SERVER_URL}/services/students/${id}/lessons/${formattedStartDate}/${formattedEndDate}`

  const response = await fetch(path, {
    headers: HeadersWithCookie(secret)
  })

  console.log(`${response.status} ${path}`)
  set.status = 200
  return await response.json()
}

export default getLessons
