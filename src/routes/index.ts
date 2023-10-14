import { Elysia } from 'elysia'
import hello from './hello.route'
import lessons from './lessons.route'
import performanceCurrent from './performance.current.route'

const routes = new Elysia()
  .use(hello)
  .use(lessons)
  .use(performanceCurrent)

export default routes
