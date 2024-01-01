import { client } from '@db'
import createQueryBuilder from '@diary-spo/sql'
import { formatDate } from '@utils'
import { MAX_LIFE_TIME_INACTIVE_TOKEN_DAYS } from '../config'
import { maxDateInactive } from '../submodules/maxDateInactive'

export const removeNotUsedTokens = async (): Promise<void> => {
  const tokensQueryBuilder = await createQueryBuilder<{
    id: number
    idDiaryUser: number
    token: string
    lastUsedDate: string
  }>(client)
    .from('auth')
    .where(
      `"lastUsedDate" > '${formatDate(
        maxDateInactive(MAX_LIFE_TIME_INACTIVE_TOKEN_DAYS).toISOString()
      )}'`
    )
    .all()

  // Удаляем старые неактивные токены
  if (tokensQueryBuilder) {
    for (let i = 0; i < tokensQueryBuilder?.length; i++) {
      await createQueryBuilder(client)
        .from('auth')
        .where(`id = ${tokensQueryBuilder[i].id}`)
        .delete()
    }
  }
}
