import { client } from '@db'
import createQueryBuilder from '@diary-spo/sql'
import { type DiaryUser } from '@diary-spo/types'
import { formatDate } from '@utils'
import { MAX_NOT_UPDATE_TOKEN_IN_DAYS } from '../config'
import { maxDateInactive } from './maxDateInactive'

export const getUsersToUpdate = async (): Promise<DiaryUser[] | null> => {
  // 1. Получаем конечную дату
  const maxDate = maxDateInactive(MAX_NOT_UPDATE_TOKEN_IN_DAYS)

  // 2. Получаем список пользователей для обновления
  const usersQueryBuilder = await createQueryBuilder<DiaryUser>(client)
    .select('*')
    .from('diaryUser')
    .where(`"cookieLastDateUpdate" > '${formatDate(maxDate.toISOString())}'`)
    .all()

  return usersQueryBuilder
}
