import { Elysia } from 'elysia'
import hello from './hello.route'
import lessons from './lessons.route'

const routes = new Elysia()
  .use(hello)
  .use(lessons)

export default routes
