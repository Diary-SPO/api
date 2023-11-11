import type { Context } from 'elysia'
import { registration } from './dbRegistration'
import { AuthData } from '@src/types'

interface AuthContext extends Omit<Context, 'params'> {
  body: {
    login: string
    password: string
  }
}

// Набросал, но нужно поправить -_-

const postAuth = async ({ set, body }: AuthContext): Promise<AuthData| string> => {
  const { login, password } = body

  if (!login || !password) {
    console.error(`login ${login}\t invalid login or password`)
    set.status = 400
    return 'Invalid login or password'
  }

  const path = `${process.env.SERVER_URL}/services/security/login`

  const data = await registration(login, password, -1) // -1 - это заглушка

  set.status = typeof data === 'number' ? data : 200

  console.log(path, set.status)

  if (typeof data !== 'number'){
    return { data, cookie: data.cookie }
  }
  return 'Error authorization'
}

export default postAuth
