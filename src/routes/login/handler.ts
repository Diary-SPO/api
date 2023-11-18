import type { Context } from 'elysia'
import { registration } from '../../database/dbRegistration'
import { BaseHeaders } from '@utils'
import { ResponseLogin } from '@types'

interface AuthContext extends Context {
  body: {
    login: string
    password: string
  }
}

// FIXME: Набросал, но нужно поправить -_-

const postAuth = async ({
  set,
  body,
}: AuthContext): Promise<ResponseLogin | string> => {
  const {login, password} = body

  if (!login || !password) {
    console.error(`login ${login}\t invalid login or password`)
    set.status = 400
    return 'Invalid login or password'
  }

  const data = await registration(login, password)
    .catch((err) => {
      set.status = 401
      return 'Error authorization: ' + err
    })
  
  return data
  /*
  // Это вынести в middleware
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
    headers: BaseHeaders,
  })

  console.log(`${response.status} ${path}`)

  const data = await registration(login, password, -1) // -1 - это заглушка

  set.status = typeof data === 'number' ? data : 200

  console.log(path, set.status)

  // Вынести в тот же middleware, который также будет ставить статус 401
  if (typeof data === 'number') {
    return 'Error authorization'
  }
  
  return { data, cookie: data.cookie }
  */
}

export default postAuth
