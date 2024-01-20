import { Elysia } from 'elysia'
import { getServerInfo } from './getServerInfo'

const hello = new Elysia().get('/', getServerInfo, {
  detail: {
    tags: ['Home']
  }
})

export default hello
