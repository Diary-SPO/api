import type { ResponseLogin } from '@diary-spo/types'
import { registration } from '../../database/authService'

interface AuthContext {
  body: {
    login: string
    password: string
    isHash: boolean
  }
}

const postAuth = async ({
  body
}: AuthContext): Promise<ResponseLogin | null | string> => {
  const { login, password } = body

  return await registration(login, password)
}

export default postAuth
