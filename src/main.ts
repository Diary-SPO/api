import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { helmet } from 'elysia-helmet'
import { swagger } from '@elysiajs/swagger'

import routes from '@routes'
import { compression } from 'elysia-compression'

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
  .use(
    compression({
      type: 'gzip',
      options: {
        level: 4,
      },
      encoding: 'utf-8',
    }),
  )
  // @ts-ignore
  .use(helmet())
  .use(routes)
  .listen(port)

console.log(
  `Backend running at http://${app.server?.hostname}:${app.server?.port}`,
)

new Worker('./src/worker.ts')

console.log(`Worker running!`)
