import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { helmet } from 'elysia-helmet'

import routes from '@routes'

const port = process.env.PORT ?? 3003
const app = new Elysia()
  .use(
    cors({
      origin: true,
    }),
  )
  .use(helmet())
  .use(routes)
  .listen(port)

console.log(
  `Backend running at http://${app.server?.hostname}:${app.server?.port}`,
)
