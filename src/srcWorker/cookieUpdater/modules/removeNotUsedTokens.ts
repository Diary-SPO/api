import createQueryBuilder from '@diary-spo/sql'
import { client } from '@db'
import { maxDateInactive } from '../submodules/maxDateInactive'
import { MAX_LIFE_TIME_INACTIVE_TOKEN_DAYS } from '../config'
import { formatDate } from '@utils'

export const removeNotUsedTokens = async (): Promise<void> => {
  const tokensQueryBuilder = await createQueryBuilder<{
    id: number
    idDiaryUser: number
    token: string
    lastUsedDate: string
  }>(client)
    .from('auth')
    .where(`"lastUsedDate" > '${
      formatDate(
        maxDateInactive(MAX_LIFE_TIME_INACTIVE_TOKEN_DAYS).toISOString()
      )
    }'`)
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
