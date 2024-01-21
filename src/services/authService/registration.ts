import { SERVER_URL } from '@config'
import { type UserData } from '@diary-spo/shared'
import type { ResponseLogin } from '@diary-spo/types'
import { fetcher } from '@utils'
import { ApiError } from '@api'
import { offlineAuth } from '../auth'
import { handleResponse } from './helpers'
import { saveUserData } from './saveUserData'

/**
 * Регистрирует/авторизирует в оригинальном дневнике с сохранением данных в базе данных.
 * Может сохранять и обновлять данные о пользователе/группе/образовательной организации в случае успешной авторизации
 * @param login
 * @param password
 * @returns {ResponseLogin}
 */
export const registration = async (
  login: string,
  password: string
): Promise<ResponseLogin | null> => {
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
