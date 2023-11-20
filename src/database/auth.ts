import { ENCRYPT_KEY } from '@config'
import { client } from '@db'
import createQueryBuilder, { encrypt } from '@diary-spo/sql'
import { DiaryUser, ResponseLogin, ResponseLoginFromDiaryUser } from '@types'
import { protectInjection } from 'src/utils/protectInjection'
import { generateToken } from './generateToken'

/**
 * Оффлайн авторизация через базу данных
 * Срабатывает в случае если оригинальный дневник упал и пользователь есть в базе данных
 * @param login 
 * @param password 
 * @returns {ResponseLogin}
 */
export const offlineAuth = async (
  login: string,
  password: string,
): Promise<ResponseLogin> => {
  // пробуем войти "оффдайн", если пользователь есть в базе (в случае, если упал основной дневник)
  const diaryUserQueryBuilder = await createQueryBuilder<DiaryUser>(client)
    .from('diaryUser')
    .select('*')
    .where(
      `login = '${protectInjection(login)}' and password = '${encrypt(
        password,
        ENCRYPT_KEY,
      )}'`,
    )
    .first()

  if (!diaryUserQueryBuilder) {
    throw new Error('User not found or incorrect password!')
  }

  // Если пользователь найден, генерируем токен и отдаём
  const token = await generateToken(diaryUserQueryBuilder.id)
  diaryUserQueryBuilder.token = token

  return ResponseLoginFromDiaryUser(diaryUserQueryBuilder)
}
