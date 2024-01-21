import { DiaryUserModel} from '@db'
import createQueryBuilder from '@diary-spo/sql'
import { type DiaryUser } from '@diary-spo/types'
import { formatDate } from '@utils'
import { MAX_NOT_UPDATE_TOKEN_IN_DAYS } from '../config'
import { maxDateInactive } from './maxDateInactive'
import { Model, Op } from 'sequelize'

export const getUsersToUpdate = async (): Promise<DiaryUser[] | null> => {
  // 1. Получаем конечную дату
  const maxDate = maxDateInactive(MAX_NOT_UPDATE_TOKEN_IN_DAYS)

  // 2. Получаем список пользователей для обновления
  const users = await DiaryUserModel.findAll({
    where: {
      cookieLastDateUpdate: {
        [Op.lt]: formatDate(maxDate.toISOString())
      }
    }
  }) as unknown as DiaryUser[] | null

  return users
}
