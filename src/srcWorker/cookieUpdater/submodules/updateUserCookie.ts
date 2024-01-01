import createQueryBuilder, { decrypt, encrypt, fetcher } from '@diary-spo/sql'
import { type UserData } from '@diary-spo/shared'
import { ENCRYPT_KEY, SERVER_URL } from '@config'
import { cookieExtractor } from '../../../utils/cookieExtractor'
import { client } from '@db'
import { type DiaryUser } from '@diary-spo/types'
import { formatDate } from '@utils'
import { logger } from '../../../utils/logger'

const log = logger('cookie updater')
export const updateUserCookie = async (user: DiaryUser): Promise<void> => {
  // 1. Авторизируемся
  const res = await fetcher<UserData>({
    url: `${SERVER_URL}/services/security/login`,
    method: 'POST',
    body: JSON.stringify({
      login: user.login,
      password: decrypt(user.password, ENCRYPT_KEY),
      isRemember: true
    })
  })

  // Если дневник вернул что-то другое...
  if (typeof res === 'number') {
    log(
      'WORKER: Что-то не так... Дневник ответил чем-то другим ?'
    )
    return
  }

  // 2. Подготавливаем куку
  const setCookieHeader = res.headers.get('Set-Cookie')
  const cookie = cookieExtractor(setCookieHeader ?? '')
  const encryptCookie = encrypt(String(cookie), ENCRYPT_KEY)

  // 3. Обновляем куку и дату обновления
  await createQueryBuilder(client)
    .from('diaryUser')
    .where(`id = ${user.id}`)
    .update({
      cookie: encryptCookie,
      cookieLastDateUpdate: formatDate(new Date().toISOString())
    })
}
