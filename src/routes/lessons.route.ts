import { Elysia } from 'elysia'
import { type Day } from 'diary-shared'
import type { Context } from 'elysia/dist/context'

interface GetLessonsParams {
  id: string
  startDate: string
  endDate: string
}

interface GetLessons {
  request: Request
  set: Context['set']
  params: GetLessonsParams
}

const getLessons = async ({ request, set, params }: GetLessons): Promise<Day[] | string> => {
  const { id, startDate, endDate } = params

  try {
    const secret = request.headers.toJSON().secret
    let formattedStartDate: string
    let formattedEndDate: string

    if (startDate && endDate) {
      formattedStartDate = startDate.toString()
      formattedEndDate = endDate.toString()

      const startTimestamp = new Date(startDate).getTime()
      const endTimestamp = new Date(endDate).getTime()
      const differenceInDays = (endTimestamp - startTimestamp) / (1000 * 3600 * 24)

      if (differenceInDays > 14) {
        const newEndDate = new Date(startTimestamp + 14 * 24 * 60 * 60 * 1000)
        formattedEndDate = newEndDate.toISOString().substring(0, 10)
      }
    } else {
      const currentDate = new Date()
      formattedStartDate = currentDate.toISOString().substring(0, 10)

      const endDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000)
      formattedEndDate = endDate.toISOString().substring(0, 10)
    }

    const path = `${process.env.SERVER_URL}/services/students/${id}/lessons/${formattedStartDate}/${formattedEndDate}`
    const response = await fetch(path, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Cookie: secret
      }
    })

    console.log(`${path}\t ${response.status}`)
    const data = await response.json()
    set.status = 200
    return data
  } catch (e) {
    console.error(`/lessons/:id/:startDate/:endDate\t failed\n${e as string}`)
    set.status = 500
    return `Internal server error: ${e as string}`
  }
}

const router = new Elysia()
  .get('/lessons/:id/:startDate/:endDate', getLessons)

export default router
