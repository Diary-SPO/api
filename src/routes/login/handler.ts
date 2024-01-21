import type { ResponseLogin } from '@diary-spo/types'
import { fetcher } from '@utils'
import type { UserData } from '@diary-spo/shared'
import { SERVER_URL } from '@config'
import { ApiError } from '@api'
import { handleResponse } from './authService/helpers'
import { offlineAuth } from './authService/auth'
import { saveUserData } from './authService/saveUserData'

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
