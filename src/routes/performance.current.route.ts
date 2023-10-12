import { Elysia } from 'elysia'
// import { type PerformanceCurrent } from 'diary-shared'
// import { checkCookie, checkId } from '@src/middleware'

const router = new Elysia()
  .get('performance.current/:id', async ({ request, set, params: { id } }) => {
    try {
      const path = `${process.env.SERVER_URL}/services/reports/current/performance/${id}`
      const secret = request.headers.toJSON().secret
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
      console.error(`performance.current/:id\t failed:\n${e as string}`)
      set.status = 500
      return `Internal server error: ${e as string}`
    }
  })

export default router
