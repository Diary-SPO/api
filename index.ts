import { Elysia } from 'elysia'
import {
  helloRoute, performanceCurrent, lessonsRoute
} from '@src/routes'

const port = process.env.PORT ?? 3003
const app = new Elysia()
  .use(helloRoute)
  .use(performanceCurrent)
  .use(lessonsRoute)
  .listen(port)

console.log(
  `Backend running at http://${app.server?.hostname}:${app.server?.port}`
)
