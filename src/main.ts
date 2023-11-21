import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { helmet } from 'elysia-helmet'
import { swagger } from '@elysiajs/swagger'

import routes from '@routes'

const workerURL = new URL("worker.ts", import.meta.url).href
const port = Bun.env.PORT ?? 3003
const app = new Elysia()
  .use(
    // @ts-ignore
    swagger({
      path: '/documentation',
      documentation: {
        info: {
          title: 'Документация к api.spo-diary.ru',
          version: '1.0.0',
        },
      },
    }),
  )
  .use(
    // @ts-ignore
    cors({
      origin: true,
    }),
  )
  // @ts-ignore
  .use(helmet())
  .use(routes)
  .listen(port)

console.log(
  `Backend running at http://${app.server?.hostname}:${app.server?.port}`,
)

const worker = new Worker(workerURL)

console.log(
  `Worker running!`
)