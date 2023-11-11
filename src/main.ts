import { Elysia } from 'elysia'
import routes from '@src/routes'
import '@database'

const port = process.env.PORT ?? 3003
const app = new Elysia()
  .use(routes)
  .listen(port)

console.log(
  `Backend running at http://${app.server?.hostname}:${app.server?.port}`
)
