import type { ResponseLogin } from '@diary-spo/types'
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
}: AuthContext): Promise<ResponseLogin | null | string> => {
  const { login, password } = body

  const data = await registration(login, password).catch(
    (err): ResponseLogin | string => {
      set.status = 401
      return `Error working authorization. Detailed info: "${err}"`
    }
  )

  if (!data) {
    set.status = 500
    return null
  }

  return data
}

export default postAuth
