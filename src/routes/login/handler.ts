import type {DatabaseResponseLogin, DiaryUser, ResponseLogin} from '@diary-spo/types'
import type { Context } from 'elysia'
import Hashes from 'jshashes'
import { registration } from '../../database/registration'

interface AuthContext extends Context {
  body: {
    login: string
    password: string
    isHash: boolean
  }
}

const postAuth = async ({
  set,
  body
}: AuthContext): Promise<DiaryUser | ResponseLogin | null | string> => {
  // Захешировать пароль ? (Для отладки, потом можно вырезать)
  if (!body?.isHash ?? true) {
    body.password = new Hashes.SHA256().b64(body.password)
  }

  const { login, password } = body

  const data = await registration(login, password).catch(
    (err): ResponseLogin | string => {
      set.status = 401
      throw new Error(`Error working authorization. Detailed info: "${err}"`)
    }
  )

  console.log(`/login ${set.status}`)

  return data
}

export default postAuth
