import type { Context } from 'elysia/dist/bun'
import type { Day } from 'diary-shared'

interface GetPerformanceCurrentParams {
  id: string
}

interface GetPerformanceCurrent {
  request: Request
  set: Context['set']
  params: GetPerformanceCurrentParams
}

const getPerformanceCurrent = async ({ request, set, params }: GetPerformanceCurrent): Promise<Day[] | string> => {
  const { id } = params

  try {
    const secret = request.headers.toJSON().secret
    const path = `${process.env.SERVER_URL}/services/reports/current/performance/${id}`
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
    console.error(`/performance.current/:id\t failed\n${e as string}`)
    set.status = 500
    return `Internal server error: ${e as string}`
  }
}

export default getPerformanceCurrent
