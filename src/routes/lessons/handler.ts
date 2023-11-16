import type { Day } from 'diary-shared'
import type { Context } from 'elysia'
import { HeadersWithCookie } from '@utils'

interface IContext extends Omit<Context, 'params'> {
  params: {
    id: string
    startDate: string
    endDate: string
  }
}

const getLessons = async ({ request, set, params }: IContext): Promise<Day[] | string> => {
  const { id, startDate, endDate } = params

  const formattedStartDate = startDate.toString()
  let formattedEndDate: string

  formattedEndDate = endDate.toString()

  const startTimestamp = new Date(startDate).getTime()
  const endTimestamp = new Date(endDate).getTime()
  const differenceInDays = (endTimestamp - startTimestamp) / (1000 * 3600 * 24)

  if (differenceInDays > 14) {
    const newEndDate = new Date(startTimestamp + 14 * 24 * 60 * 60 * 1000)
    formattedEndDate = newEndDate.toISOString().substring(0, 10)
  }

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
