import { Elysia } from 'elysia'

const router = new Elysia()
  .get('/', () => 'Backend on Bun+ElysiaJS is running.')

export default router
