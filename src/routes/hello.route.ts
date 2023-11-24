import { Elysia } from 'elysia'

const hello = new Elysia().get(
  '/',
  () => ({
    hi: 'Elysia',
  }),
  {
    detail: {
      tags: ['Home'],
    },
  },
)

export default hello
