import { ApiResponse } from '@utils'
import { ApiError } from '../../ApiError'

export const handleResponse = <T>(
  res: number | ApiResponse<T>
): ApiResponse<T> | 'DOWN' | 'UNKNOWN' => {
  if (typeof res !== 'number') {
    return res
  }

  /** Неправильные данные для авторизации **/
  if (res === 401) {
    throw new ApiError('Invalid data', 401)
  }

  /** Сетевой город упал. Пробуем найти юзера в нашей базе **/
  if (res > 401) {
    return 'DOWN'
  }

  return 'UNKNOWN'
}
