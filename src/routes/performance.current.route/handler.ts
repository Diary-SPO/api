import type { Day } from 'diary-shared'
import { type BaseRequest } from '@src/types'

interface GetPerformanceCurrentParams {
  id: string
}

const getPerformanceCurrent = async ({ request, set, params }: BaseRequest<GetPerformanceCurrentParams>): Promise<Day[] | string> => {
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
    set.status = 200
    return await response.json()
  } catch (e) {
    console.error(`/performance.current/:id\t failed\n${e as string}`)
    set.status = 500
    return `Internal server error: ${e as string}`
  }
}

export default getPerformanceCurrent
