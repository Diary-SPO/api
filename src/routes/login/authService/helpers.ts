import { API_CODES, ApiError } from '@api'
import { ApiResponse } from '@utils'

export const handleResponse = <T>(
  res: number | ApiResponse<T>
): ApiResponse<T> | 'DOWN' | 'UNKNOWN' => {
  if (typeof res !== 'number') {
    return res
  }

  /** Неправильные данные для авторизации **/
  if (res === 401) {
    throw new ApiError('Invalid data', API_CODES.UNAUTHORIZED)
  }

  /** Сетевой город упал. Пробуем найти юзера в нашей базе **/
  if (res > 401) {
    return 'DOWN'
  }

  return 'UNKNOWN'
}
