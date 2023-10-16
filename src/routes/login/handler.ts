import type { AuthData } from 'diary-shared'
import type { Context } from 'elysia'

interface AuthContext extends Omit<Context, 'params'> {
  body: {
    login: string
    password: string
  }
}

const postAuth = async ({ set, body }: AuthContext): Promise<AuthData | string> => {
  const { login, password } = body

  if (!login || !password || typeof login !== 'string' || typeof password !== 'string') {
    console.error(`login ${login}\t invalid login or password`)
    set.status = 400
    return 'Invalid login or password'
  }

  const path = `${process.env.SERVER_URL}/services/security/login`
  const response = await fetch(path, {
    method: 'POST',
    body: JSON.stringify({ login, password, isRemember: true }),
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  })
  console.log(`${response.status} ${path}`)

  const data = await response.json()

  const setCookieHeader = response.headers.getAll('Set-Cookie')
  const cookieString = Array.isArray(setCookieHeader) ? setCookieHeader.join('; ') : setCookieHeader

  set.status = response.status
  return { data, cookie: cookieString }
}

export default postAuth
