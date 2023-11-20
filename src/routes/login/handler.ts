import type { Context } from 'elysia'
import { registration } from '../../database/registration'
import { ResponseLogin } from '@types'
import Hashes from 'jshashes'
import { offlineAuth } from 'src/database/auth'

interface AuthContext extends Context {
  body: {
    login: string
    password: string
    isHash: boolean
  }
}

const postAuth = async ({
  set,
  body,
}: AuthContext): Promise<ResponseLogin | string> => {
  // Захешировать пароль ? (Для отладки, потом можно вырезать)
  if (!body?.isHash ?? true) {
    body.password = new Hashes.SHA256().b64(body.password)
  }

  const { login, password } = body

  if (!login || !password) {
    const messageResponse = `login ${login}\t invalid login or password`
    console.error(messageResponse)
    set.status = 400
    return messageResponse
  }

  const data = await registration(login, password).catch(
    async (err): Promise<ResponseLogin | string> => {
      set.status = 401
      return `Error working authorization. Detailed info: "${err}"`
    },
  )

  console.log(`/login ${set.status}`)

  return data
}

export default postAuth
