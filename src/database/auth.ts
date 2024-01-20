import { ENCRYPT_KEY } from '@config'
import createQueryBuilder, { encrypt } from '@diary-spo/sql'
import {
  type DiaryUser,
  type Group,
  type ResponseLogin,
  type SPO
} from '@diary-spo/types'
import { ResponseLoginFromDiaryUser } from '@types'
import { protectInjection } from 'src/utils/protectInjection'
import { generateToken } from './generateToken'
import { DiaryUserModel } from './models'
import { SPOModel } from './models'
import { GroupsModel } from './models'

/**
 * Оффлайн авторизация через базу данных.
 * Срабатывает в случае если оригинальный дневник упал и пользователь есть в базе данных.
 * @param login
 * @param password
 * @returns {ResponseLogin}
 */
export const offlineAuth = async (
  login: string,
  password: string
): Promise<ResponseLogin | null> => {
  // пробуем войти "оффлайн", если пользователь есть в базе (в случае, если упал основной дневник)
  const diaryUserRecord = await DiaryUserModel().findOne({
    where: {
      login,
      //password
    },
    include: {
      model: GroupsModel(),
      required: true,
      include: [{
        model: SPOModel(),
        required: true
      }]
    }
  })

  if (!diaryUserRecord) {
    throw new Error('User not found or incorrect password!')
  }

  console.log(diaryUserRecord.dataValues.group.dataValues.SPO.dataValues.abbreviation)
  return null

  // Если пользователь найден, генерируем токен и отдаём
  //diaryUserQueryBuilder.token = await generateToken(diaryUserQueryBuilder.id)

  /*return ResponseLoginFromDiaryUser(
    diaryUserQueryBuilder,
    spoGetQueryBuilder,
    groupGetQueryBuilder
  )*/
}
