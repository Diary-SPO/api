import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { helmet } from 'elysia-helmet'
import { swagger } from '@elysiajs/swagger'

import routes from '@routes'

const port = process.env.PORT ?? 3003
const app = new Elysia()
  .use(swagger({
    path: '/documentation',
    documentation: {
      info: {
        title: 'Документация к api.spo-diary.ru',
        version: '1.0.0'
      }
    }
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
