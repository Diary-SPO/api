import { client } from '@db'
import createQueryBuilder from '@diary-spo/sql'
import { type Auth } from '@types'
import { formatDate } from '@utils'
import { suid } from 'rand-token'

/**
 * Генерирует токен и вставляет в базу
 * В случае успеха возвращает токен, иначе выбрасывает ошибку
 * @param idDiaryUser
 * @returns {string} token
 */
export const generateToken = async (idDiaryUser: number): Promise<string> => {
  // Генерируем токен
  const token = suid(16)

  const formattedDate = formatDate(new Date().toISOString())

  // Вставляем токен
  const tokenQueryBuilder =
    (
      await createQueryBuilder<Auth>(client).from('auth').insert({
        idDiaryUser,
        token,
        lastUsedDate: formattedDate
      })
    )?.[0] ?? null

  if (!tokenQueryBuilder) {
    throw new Error('Error insert token!')
  }

  return token
}
