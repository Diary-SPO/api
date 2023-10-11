import { Elysia } from 'elysia'
import { type IMark } from 'diary-shared'
// import { checkCookie } from '@src/middleware';

const router = new Elysia()
  .get('/lessons/:id/:startDate/:endDate', ({ params: { id, startDate, endDate } }) => {
    // TODO: Сделать получение данных расписания
  })

export default router
