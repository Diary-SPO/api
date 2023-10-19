import type { NotificationsResponse } from 'diary-shared'
import type { Context } from 'elysia'

interface IContext extends Omit<Context, 'params'> {
  params: {
    id: string
  }
}

const getAds = async ({ request, set }: IContext): Promise<NotificationsResponse | string> => {
  const secret = request.headers.toJSON().secret
  const path = `${process.env.SERVER_URL}/services/people/organization/news/last/10`
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

export default getAds
