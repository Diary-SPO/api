import { Elysia } from 'elysia'
import { SERVER_URL } from '@config'

const hello = new Elysia().get(
  '/',
  () => ({
    status: "ok",
    arch: process.arch,
    commit: Bun.revision ?? 'noVersion',
    targetDiary: SERVER_URL,
    backend: "bun+elysia"
  }),
  {
    detail: {
      tags: ['Home'],
    },
  },
)

export default hello
