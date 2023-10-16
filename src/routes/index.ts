import { Elysia } from 'elysia'
import hello from './hello.route'
import login from './login'
import lessons from './lessons'
import performanceCurrent from './performance.current'

const routes = new Elysia()
  .use(hello)
  .use(login)
  .use(lessons)
  .use(performanceCurrent)

export default routes
