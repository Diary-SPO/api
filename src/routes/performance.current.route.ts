import { Elysia } from 'elysia';
import { PerformanceCurrent } from 'diary-shared';
//import { checkCookie, checkId } from '@src/middleware';

const router = new Elysia()
    .get('/:id', ({ params: { id } }) => {
        // TODO: Сделать получение данных об недавных оценках
    });

export default router;