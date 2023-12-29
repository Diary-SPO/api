import createQueryBuilder from '@diary-spo/sql'
import { type DiaryUser } from '@diary-spo/types'
import { client } from '@db'
import { formatDate } from '@utils'
import { maxDateInactive } from './maxDateInactive'
import { maxNotUpdateTokenInDays } from '../config'

export const getUsersToUpdate = async (): Promise<DiaryUser[] | null> => {
  // 1. Получаем конечную дату
  const maxDate = maxDateInactive(maxNotUpdateTokenInDays)

  // 2. Получаем список пользователей для обновления
  const usersQueryBuilder = await createQueryBuilder<DiaryUser>(client)
    .select('*')
    .from('diaryUser')
    .where(`"cookieLastDateUpdate" > '${formatDate(maxDate.toISOString())}'`)
    .all()

  return usersQueryBuilder
}
