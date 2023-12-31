import { Elysia } from 'elysia'
import ads from './ads'
import attestation from './attestation'
import hello from './hello'
import lessons from './lessons'
import login from './login'
import organization from './organization'
import performanceCurrent from './performance.current'

const routes = new Elysia()
  .use(hello)
  .use(login)
  .use(lessons)
  .use(performanceCurrent)
  .use(attestation)
  .use(ads)
  .use(organization)

export default routes
