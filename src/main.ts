import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { helmet } from 'elysia-helmet'
import { swagger } from '@elysiajs/swagger'

import routes from '@routes'

const port = process.env.PORT ?? 3003
const app = new Elysia()
  .use(swagger({
    path: '/documentation'
  }))
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
