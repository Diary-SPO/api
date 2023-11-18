import type { AuthData } from '@diary-spo/shared'
import type { Context } from 'elysia'
import { registration } from './dbRegistration'
import { BaseHeaders } from '@utils'

interface AuthContext extends Omit<Context, 'params'> {
  body: {
    login: string
    password: string
    isRemember: boolean
  }
}

// FIXME: Набросал, но нужно поправить -_-

const postAuth = async ({ set, body }: AuthContext): Promise<AuthData | string> => {
  const { login, password, isRemember } = body

  if (!login || !password) {
    console.error(`login ${login}\t invalid login or password`)
    set.status = 400
    return 'Invalid login or password'
  }

  const path = `${process.env.SERVER_URL}/services/security/login`
  const response = await fetch(path, {
    method: 'POST',
    body: JSON.stringify({ login, password, isRemember }),
    headers: BaseHeaders
  })

  console.log(`${response.status} ${path}`)

  const data = await registration(login, password, -1) // -1 - это заглушка

  set.status = typeof data === 'number' ? data : 200

  console.log(path, set.status)

  if (typeof data !== 'number'){
    return { data, cookie: data.cookie }
  }
  return 'Error authorization'
}

export default postAuth
