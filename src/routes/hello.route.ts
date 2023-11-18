import { Elysia } from 'elysia'

const hello = new Elysia().get('/', () => ({
  hi: 'Elysia',
}))

export default hello
