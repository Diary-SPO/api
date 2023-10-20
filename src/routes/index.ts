import { Elysia } from 'elysia'
import hello from './hello.route'
import login from './login'
import lessons from './lessons'
import performanceCurrent from './performance.current'
import ads from './ads'
import organization from './organization'
import attestation from './attestation'

const routes = new Elysia()
  .use(hello)
  .use(login)
  .use(lessons)
  .use(performanceCurrent)
  .use(attestation)
  .use(ads)
  .use(organization)

export default routes
