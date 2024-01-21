import { ApiError } from '@api'
import { SERVER_URL } from '@config'
import type { UserData } from '@diary-spo/shared'
import type { ResponseLogin } from '@diary-spo/types'
import { fetcher } from '@utils'
import { offlineAuth } from './authService/auth'
import { handleResponse } from './authService/helpers'
import { saveUserData } from './authService/saveUserData'
import Hashes from 'jshashes'

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
  let { login, password, isHash } = body

  if (!isHash ?? true) {
    password = new Hashes.SHA256().b64(body.password)
  }

  const res = await fetcher<UserData>({
    url: `${SERVER_URL}/services/security/login`,
    method: 'POST',
    body: JSON.stringify({ login, password, isRemember: true })
  })

  const parsedRes = handleResponse(res)

  switch (parsedRes) {
    case 'DOWN': {
      try {
        const authData = await offlineAuth(login, password)

        if (!authData) {
          throw new ApiError('Offline auth error', 500)
        }

        return authData
      } catch (e) {
        throw new Error(
          `Authorization error: access to the diary was denied, and authorization through the database failed. Full: ${e}`
        )
      }
    }
    case 'UNKNOWN':
      throw new ApiError('Unknown auth error', 500)
    default:
      if (!parsedRes.data.tenants) {
        throw new ApiError('Unreachable auth error', 500)
      }

      return saveUserData(parsedRes, login, password)
  }
}

export default postAuth
