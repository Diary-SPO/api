import type { PerformanceCurrent } from 'diary-shared'
import type { Context } from 'elysia'

interface IContext extends Omit<Context, 'params'> {
  params: {
    id: string
  }
}

const getPerformanceCurrent = async ({ request, set, params }: IContext): Promise<PerformanceCurrent | string> => {
  const { id } = params
  const secret = request.headers.toJSON().secret
  const path = `${process.env.SERVER_URL}/services/reports/current/performance/${id}`
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Cookie: secret
    }
  })

  console.log(`${response.status} ${path}`)
  set.status = 200
  return await response.json()
}

export default getPerformanceCurrent